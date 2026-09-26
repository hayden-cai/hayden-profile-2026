export const redisTopUseCases = `
![Five jobs, one in-memory data store](/blog/redis/cover.svg)

Redis shows up in almost every production stack I've worked near, but usually for one job — "it's the cache". That undersells it. The same in-memory store can hold your sessions, coordinate your workers, protect your API and rank your users, often in a handful of commands.

> 📺 These notes started from ByteByteGo's **Top 5 Redis Use Cases** video. I've expanded each one with how it actually works, TypeScript code using ioredis, and the production gotchas that don't fit in a short video.

## ⚡ First: Why Is Redis Fast?

- **In-memory storage**: reads and writes never touch disk on the hot path, so latency is typically sub-millisecond
- **Single-threaded command execution + I/O multiplexing (epoll)**: no lock contention, no context switching. Since Redis 6.0 network I/O can be multi-threaded, but commands still execute on one thread — so **every command is atomic by nature**
- **Purpose-built data structures**: String, Hash, List, Set, Sorted Set (a skip list), Stream and more, each tuned for memory and complexity

**Persistence** comes in two flavours:

- **RDB snapshots**: periodically dump the whole dataset to disk. Fast to restore, but you can lose everything since the last snapshot
- **AOF log**: append every write command. With \`appendfsync everysec\` you lose at most one second of data
- In production, **RDB + AOF together** is the common choice

**High availability** comes from replication plus Sentinel for automatic failover, or Redis Cluster for sharding.

> ℹ️ **Ecosystem note:** Redis changed its open-source licence in 7.4, and the Linux Foundation forked it as **Valkey** (already supported on AWS ElastiCache). Redis 8 then added an AGPL option. The commands are essentially compatible — just check which one your cloud provider is actually running.

Every example below uses this shared connection:

\`\`\`typescript
import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL!);
\`\`\`

## 🗄️ 1. Caching

Put hot data — product details, user profiles, config, expensive query results — in Redis to take load off the database and cut latency.

### Cache-Aside, the Pattern You'll Use Most

![Cache-aside: read through the cache, write to the database and invalidate](/blog/redis/cache-aside.svg)

1. **Read**: check the cache first — on a hit, return immediately
2. **Miss**: query the database, write the result back to the cache with a TTL, return it
3. **Write**: **update the database first, then delete the cache entry** — don't update it

\`\`\`typescript
async function getUser(id: string) {
  const key = \`user:\${id}\`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const user = await db.user.findUnique({ where: { id } });
  // Add random jitter to the TTL so keys don't all expire together
  const ttl = 3600 + Math.floor(Math.random() * 300);
  // Cache misses too (briefly) so missing IDs can't hammer the DB
  await redis.set(key, JSON.stringify(user ?? null), "EX", user ? ttl : 60);
  return user;
}

async function updateUser(id: string, data: Partial<User>) {
  await db.user.update({ where: { id }, data });
  await redis.del(\`user:\${id}\`); // invalidate; the next read rebuilds it
}
\`\`\`

**Why delete instead of update?** With concurrent writes, two requests can update the cache in a different order than they updated the database, leaving stale data behind. Deleting and letting the next read rebuild is safer. If you need stronger consistency, look at delayed double-delete, or invalidating from the binlog via CDC.

### Other Write Strategies

- **Write-through**: every write goes to the cache and the database together, with the cache layer responsible for syncing the DB
- **Write-behind**: write only to the cache and flush to the database asynchronously in batches — very fast, but you can lose data

### The Three Classic Cache Failures

| Problem | What happens | Fix |
| --- | --- | --- |
| **Penetration** | Requests for data that doesn't exist skip the cache and hit the DB every time | Cache empty results with a short TTL, Bloom filter, validate input |
| **Breakdown** | A single hot key expires and a burst of requests hits the DB at once | Mutex so only one request rebuilds, logical expiry, no TTL on hot keys |
| **Avalanche** | Many keys expire together, or Redis goes down | TTL jitter, multi-level cache (local + Redis), HA Redis, rate-limit and degrade the DB |

### Eviction Policy

- Set a \`maxmemory\` limit. For a pure cache, use \`allkeys-lru\` or \`allkeys-lfu\`
- If the instance also holds data that must not be evicted, use \`volatile-lru\` so only keys with a TTL are candidates
- The default, \`noeviction\`, starts rejecting writes once memory is full

> ⚠️ **Gotcha — big keys.** A multi-megabyte value or a million-element collection blocks the single thread. Never run \`KEYS *\` in production — use \`SCAN\`. Delete big keys with \`UNLINK\`, which frees memory asynchronously.

## 🔑 2. Session Store

Keep your application servers **stateless** and store sessions centrally in Redis. Any instance can then serve any request, which makes horizontal scaling and rolling deploys painless.

### The Flow

1. User logs in → generate a random session ID (\`crypto.randomUUID()\` or 32 random bytes)
2. Store \`session:{id}\` → user data in Redis, with an expiry
3. Put the session ID in a cookie: \`HttpOnly; Secure; SameSite=Lax\`
4. On each request: read the ID from the cookie → look it up in Redis → you have the identity
5. Extend the expiry on every visit (sliding expiration)
6. Log out with \`DEL session:{id}\` — the session dies on the server immediately, which is much easier to control than a pure JWT setup

\`\`\`typescript
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

async function createSession(userId: string, role: string) {
  const sid = crypto.randomUUID();
  await redis.hset(\`session:\${sid}\`, { userId, role, createdAt: Date.now() });
  await redis.expire(\`session:\${sid}\`, SESSION_TTL);
  // Index sessions per user so you can "log out all devices"
  await redis.sadd(\`user_sessions:\${userId}\`, sid);
  return sid;
}

async function getSession(sid: string) {
  const data = await redis.hgetall(\`session:\${sid}\`);
  if (!data.userId) return null;
  await redis.expire(\`session:\${sid}\`, SESSION_TTL); // sliding expiry
  return data;
}
\`\`\`

### Production Notes

- **Persistence + replication**: turn on AOF and replicas so a Redis restart doesn't log everyone out
- **Hash beats a JSON string**: you can read or write a single field, like bumping \`lastSeen\`
- **Regenerate the session ID after login** to prevent session fixation
- **Express**: \`express-session\` + \`connect-redis\` works out of the box

## 🔒 3. Distributed Lock

When several service instances must take turns on the same resource — a cron job that should run on exactly one instance, stock that mustn't be decremented twice, an order that mustn't be processed concurrently.

### Acquire: SET NX PX

\`\`\`bash
SET lock:order:123 <unique_token> NX PX 30000
\`\`\`

- \`NX\`: only set if the key doesn't exist → only one client gets the lock
- \`PX 30000\`: auto-expire after 30 seconds → a crashed holder can't deadlock everyone
- \`unique_token\`: a random value per client → on release you can prove it is your lock
- It must be **one command**. Splitting it into \`SETNX\` + \`EXPIRE\` deadlocks if you crash in between

### Release: Atomically, With Lua

A plain \`DEL\` is a bug waiting to happen: A's lock expires, B acquires it, then A finishes and deletes B's lock. Compare the token and delete in one atomic Lua script instead.

\`\`\`typescript
const RELEASE_SCRIPT = \`
  if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
  else
    return 0
  end\`;

async function withLock<T>(resource: string, ttlMs: number, fn: () => Promise<T>) {
  const key = \`lock:\${resource}\`;
  const token = crypto.randomUUID();
  const ok = await redis.set(key, token, "PX", ttlMs, "NX");
  if (!ok) throw new Error("Resource is locked");
  try {
    return await fn();
  } finally {
    await redis.eval(RELEASE_SCRIPT, 1, key, token);
  }
}
\`\`\`

### The Hard Parts

- **Work takes longer than the TTL?** Use a watchdog that keeps extending the expiry while the token is still yours (Java's Redisson has this built in)
- **Re-entrant locks**: store the holder and a re-entry count in a Hash
- **Failover can lose locks**: the primary accepts the lock, crashes before replicating it, and the new primary has no lock — two clients now hold it
- **Redlock**: acquire on N independent instances (usually 5) and succeed on a majority. Martin Kleppmann argued it still relies on timing assumptions that break under GC pauses and clock drift, and it remains contested
- **Fencing tokens**: the lock service hands out an increasing number, and storage rejects writes with an older one. This is what actually guarantees correctness

> 💡 **Rule of thumb.** For an **efficiency lock** — where running twice is merely wasteful, like sending a duplicate email — a single Redis instance is fine. For a **correctness lock** — where running twice loses money — use ZooKeeper or etcd, or back it with database guarantees: unique constraints or optimistic locking with a version column.

In Node, the \`redlock\` package implements the algorithm. For anything financial, let a database transaction be the final word.

## 🚦 4. Rate Limiter

Protect APIs from abuse, slow down brute-force logins and SMS bombing, and enforce per-plan quotas. Keeping the counters in Redis means **every instance shares the same count** — this is what makes the tiered rate limiting from my web security notes actually work across a fleet.

### Fixed Window

One counter per time window: \`rate:{userId}:{window}\`. \`INCR\` it and set an expiry the first time.

\`\`\`typescript
const FIXED_WINDOW = \`
  local count = redis.call("INCR", KEYS[1])
  if count == 1 then
    redis.call("EXPIRE", KEYS[1], ARGV[1])
  end
  return count\`;

async function fixedWindow(userId: string, limit = 100, windowSec = 60) {
  const window = Math.floor(Date.now() / 1000 / windowSec);
  const key = \`rate:\${userId}:\${window}\`;
  const count = (await redis.eval(FIXED_WINDOW, 1, key, windowSec)) as number;
  return count <= limit;
}
\`\`\`

- **Pro**: dead simple, tiny memory footprint
- **Con**: **bursts at the window edge** — 100 requests at second 59 and another 100 at second 61 means 200 get through in two seconds
- The Lua wrapper makes \`INCR\` and \`EXPIRE\` atomic, so a key can never be left without an expiry

### Sliding Window Log, With a Sorted Set

Use the timestamp as the score. On each request: drop entries outside the window → count what's left → record this request if you're under the limit.

\`\`\`typescript
const SLIDING_WINDOW = \`
  local key, now, window, limit = KEYS[1], tonumber(ARGV[1]), tonumber(ARGV[2]), tonumber(ARGV[3])
  redis.call("ZREMRANGEBYSCORE", key, 0, now - window)
  if redis.call("ZCARD", key) < limit then
    redis.call("ZADD", key, now, ARGV[4])
    redis.call("PEXPIRE", key, window)
    return 1
  end
  return 0\`;

async function slidingWindow(userId: string, limit = 100, windowMs = 60_000) {
  const allowed = await redis.eval(
    SLIDING_WINDOW, 1, \`rate:sw:\${userId}\`,
    Date.now(), windowMs, limit, crypto.randomUUID()
  );
  return allowed === 1;
}
\`\`\`

- **Pro**: exact, with no edge bursts
- **Con**: one entry per request, so memory grows with QPS

### Other Algorithms

- **Sliding window counter**: current window count + previous window count × overlap ratio — a good middle ground between accuracy and memory
- **Token bucket**: tokens refill at a fixed rate and each request spends one, which **allows controlled bursts**. Store \`tokens\` and \`lastRefill\` in a Hash and compute the refill inside Lua
- **Leaky bucket**: process requests at a constant rate to smooth traffic out

### Production Notes

- Return **HTTP 429** with \`Retry-After\` and \`X-RateLimit-Remaining\` headers
- Limit on several dimensions at once — IP, user and endpoint — and be strictest on login
- Decide up front what happens when Redis is down: **fail-open** (allow, favour availability) or **fail-closed** (deny, favour safety)
- Ready-made libraries: \`rate-limiter-flexible\` for Node, \`@upstash/ratelimit\` for serverless and edge

## 🏆 5. Leaderboard

Game scores, trending lists, best-sellers, most-liked. \`ORDER BY score LIMIT 10\` in a relational database gets slow once the table is big and hot. A Redis **Sorted Set** combines a skip list with a hash table, so both updates and rank lookups are O(log N).

### The Commands You Need

| Operation | Command | Complexity |
| --- | --- | --- |
| Set a score | \`ZADD lb 1500 user:42\` | O(log N) |
| Add points | \`ZINCRBY lb 50 user:42\` | O(log N) |
| Top 10 | \`ZRANGE lb 0 9 REV WITHSCORES\` | O(log N + M) |
| My rank | \`ZREVRANK lb user:42\` | O(log N) |
| My score | \`ZSCORE lb user:42\` | O(1) |
| Score range | \`ZRANGE lb 1000 2000 BYSCORE\` | O(log N + M) |
| Total players | \`ZCARD lb\` | O(1) |

\`\`\`typescript
const LB = "leaderboard:season:2026-09";

await redis.zincrby(LB, 50, "user:42");

// Top 10 (ranks are zero-based)
const top = await redis.zrevrange(LB, 0, 9, "WITHSCORES");

// My rank, plus the two players either side of me
const rank = await redis.zrevrank(LB, "user:42");
if (rank !== null) {
  const around = await redis.zrevrange(LB, Math.max(0, rank - 2), rank + 2, "WITHSCORES");
}
\`\`\`

### Going Further

- **Tie-breaking**: to rank whoever got there first higher, encode time into the score — e.g. \`points * 1e10 + (MAX_TS - timestampSec)\`. Scores are doubles, so integers are only exact up to about 2^53; don't overflow
- **Periodic boards**: put the period in the key (daily, weekly, season) and let \`EXPIRE\` clean up; combine days with \`ZUNIONSTORE\`
- **Store IDs only**: keep just \`userId\` in the Sorted Set; fetch names and avatars from a Hash or cache in one pipeline
- **Huge boards**: if you only need the top N, trim periodically with \`ZREMRANGEBYRANK\`; at tens of millions of users, shard and merge
- **Persistence**: Redis shouldn't be the only source of truth — write score changes to the database too (directly or via a queue) for recovery and auditing

## 🧰 Beyond the Top Five

- **Queues and event streams**: Redis Streams with consumer groups and ACKs; BullMQ for lightweight job queues in Node
- **Pub/Sub**: fan out WebSocket messages across instances — but messages aren't persisted
- **Counters and analytics**: \`INCR\` for counts, \`HyperLogLog\` for unique visitors (about 12 KB to estimate hundreds of millions of uniques), \`Bitmap\` for daily check-ins
- **Geospatial**: \`GEO\` commands for "stores near me"
- **Idempotency**: \`SET idem:{key} 1 NX EX 86400\` to reject duplicate submissions
- **Vector search**: Redis Stack and Redis 8 support vector indexes — handy as a **semantic cache** for RAG, returning a stored LLM answer for near-identical questions and saving tokens

## 📋 Cheat Sheet

| Use case | Data structure | Key commands | Watch out for |
| --- | --- | --- | --- |
| Cache | String / Hash | \`GET\` / \`SET EX\` / \`DEL\` | Penetration, breakdown, avalanche, consistency |
| Sessions | Hash | \`HSET\` / \`HGETALL\` / \`EXPIRE\` | Persistence, session fixation |
| Distributed lock | String | \`SET NX PX\` + Lua release | TTL renewal, locks lost on failover |
| Rate limiter | String / Sorted Set | \`INCR\` / \`ZADD\` + Lua | Window bursts, atomicity, fail-open |
| Leaderboard | Sorted Set | \`ZINCRBY\` / \`ZRANGE REV\` / \`ZREVRANK\` | Tie-breaking, big keys |

## 📚 Further Reading

- [ByteByteGo — Top 5 Redis Use Cases](https://www.youtube.com/watch?v=a4yX7RUgTxI)
- [Redis documentation](https://redis.io/docs/)
- [Martin Kleppmann — How to do distributed locking](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)
`;
