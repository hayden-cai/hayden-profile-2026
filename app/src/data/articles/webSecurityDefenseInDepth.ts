export const webSecurityDefenseInDepth = `
![Defense in depth — every layer assumes the one before it has already failed](/blog/web-security/cover.svg)

Most security incidents don't happen because a team forgot one control. They happen because the team relied on one control. A WAF that misses a payload, a JWT check that trusts the wrong algorithm, an S3 bucket someone flipped to public for a demo — any single layer will eventually fail.

> 💡 **Core principle — Defense in Depth.** Build overlapping layers across the network, transport, application, business logic and data tiers, so that when one layer is breached the next one still holds. Pair it with **Zero Trust**: never assume a request is safe because of where it came from — verify identity and permission on every access.

These are my working notes, organised by where the attack lands and what actually stops it.

## 🌊 Part 1 — Traffic & Frequency Attacks

### DDoS (Distributed Denial of Service)

A botnet floods you with requests until bandwidth, connection pools or CPU run out. At L3/L4 that looks like SYN floods and UDP amplification; at L7 it's HTTP floods and slow attacks like Slowloris.

- **Edge scrubbing**: Cloudflare, AWS Shield Advanced or similar absorb terabit-scale traffic before it reaches you
- **SYN cookies & packet filtering**: enable \`net.ipv4.tcp_syncookies\` and drop malformed protocol traffic
- **CDN + gateway rate limits**: static assets on the CDN, API gateway limits per IP and per token
- **L7 specifics**: sensible header and body timeouts beat Slowloris; expensive endpoints (search, exports, reports) get their own stricter limits
- **Elastic, hidden origin**: auto scaling, and only allow the CDN's IP ranges to reach the origin

### Brute Force & Endpoint Abuse

Scripts hammer login and OTP endpoints with credential stuffing, password spraying or SMS bombing.

- **Tiered rate limiting** across IP, account and device together
- **Challenges after N failures**: Cloudflare Turnstile or reCAPTCHA
- **Lockout or tarpitting**: lock the account or add growing delays after repeated failures
- **MFA and Passkeys (WebAuthn)**: make stolen passwords worthless — passkeys are phishing-resistant too
- **Breached password checks**: compare against Have I Been Pwned's k-anonymity API on sign-up and password change
- **One generic error**: never distinguish "user not found" from "wrong password", or you've built a username enumeration API

### Scrapers & Scalping Bots

Bots crawl your core data or grab limited stock in milliseconds.

- **Bot management & fingerprinting**: TLS fingerprints (JA3/JA4), header order, browser environment checks
- **WAF + behaviour analysis**: flag sequential walks like \`/item/1\`, \`/item/2\` and inhuman request rhythms
- **Risk scoring**: combine device fingerprint, phone number reputation and proxy IP data
- **Business controls**: queues or ballots, per-account purchase limits, signed requests with timestamps

## 💉 Part 2 — Injection & Hijacking

### SQL Injection

User input gets concatenated into SQL and the database runs a query the attacker wrote.

- **Parameterised queries** are the fix. Use the ORM or placeholders — \`?\` or \`$1\`
- **Watch the ORM escape hatches**: \`raw()\`, \`$queryRawUnsafe\`, dynamic \`ORDER BY\`. Column and table names can't be parameterised, so whitelist them
- **Least privilege**: the app's DB user shouldn't be able to run DDL or read system files
- **Validate input** shape, type and length with Zod or Joi
- **NoSQL isn't immune**: in MongoDB, reject operator payloads like \`{"$gt": ""}\`

### Cross-Site Scripting (XSS)

Attacker JavaScript runs in another user's browser — stored, reflected or DOM-based — and steals sessions or acts as the victim.

- **Context-aware output encoding**: HTML, attributes, JS and URLs each escape differently
- **Trust the framework, audit the escape hatches**: React and Vue escape by default; review every \`dangerouslySetInnerHTML\` and \`v-html\`, and run rich text through DOMPurify
- **HttpOnly cookies** so scripts can't read the session
- **Strict CSP**: nonce-based, no \`unsafe-inline\`
- **Trusted Types** to shut down dangerous DOM sinks at the browser level

### Cross-Site Request Forgery (CSRF)

A logged-in user visits a malicious page, and the browser helpfully attaches their cookies to a forged request.

- **SameSite cookies**: \`Lax\` (the modern default) or \`Strict\`
- **CSRF tokens**: synchroniser token or double-submit cookie
- **Check \`Origin\` and \`Sec-Fetch-Site\`** on state-changing requests
- **Re-authenticate** for transfers and password changes
- GET requests must never have side effects

### File Uploads & Path Traversal

Someone uploads a webshell, or asks for \`../../etc/passwd\`.

- **Server-side allowlist** on extension, MIME type and magic bytes — all three
- **Rename and isolate**: random names, store in S3, serve through presigned URLs
- **Separate domain** for user content, so an uploaded SVG or HTML file can't run script on your origin
- **Normalise paths**: \`path.resolve\`, then confirm the result is still inside the allowed root
- **Scan and re-encode** images to strip EXIF and hidden payloads

### Command Injection & RCE

User input reaches a shell or \`eval\`.

- Never build commands like \`exec("convert " + filename)\` — pass an argument array to \`execFile\` or \`spawn\` with no shell
- No \`eval\`, no \`new Function\`, no unsafe template rendering (SSTI)
- Run containers as non-root on a read-only filesystem

### Server-Side Request Forgery (SSRF)

Your server is tricked into requesting an attacker-chosen URL — an internal service, or the cloud metadata endpoint at \`169.254.169.254\` that hands out IAM credentials. URL previews, webhooks and "fetch image from URL" features are the usual entry points.

- Allowlist destinations; resolve DNS first and reject private or reserved IPs (this also defeats DNS rebinding)
- Don't follow redirects, or re-validate after every hop
- On AWS, enforce **IMDSv2**; route outbound traffic through a controlled egress proxy

### Insecure Deserialization & XXE

Deserialising untrusted data triggers code execution (Java, PHP, Python pickle). XML parsers resolve external entities and read local files.

- Exchange plain data formats like JSON; never deserialise untrusted objects
- Disable DTDs and external entities in XML parsers
- In JavaScript, watch for **prototype pollution** — strip \`__proto__\` and \`constructor\` in deep merges

## 🔐 Part 3 — Auth, Logic & Transport

### Man-in-the-Middle

- TLS 1.3 / 1.2 everywhere, weak cipher suites off
- **HSTS**, and submit to the preload list
- **Certificate pinning** in mobile apps — always pin a backup key, or a cert rotation bricks the app
- **mTLS** between internal services

### Broken Access Control & IDOR

Horizontal escalation (change \`user_id\`, read someone else's data) and vertical escalation (a normal user calls an admin API). It's number one on the OWASP Top 10 for a reason.

- **Identity comes from the server session or JWT only** — never from a \`user_id\` or \`role\` the client sends
- **Check ownership on every object access**: \`WHERE id = ? AND owner_id = ?\`
- **Centralise authorisation** with RBAC/ABAC in middleware or a policy engine (OPA, Casbin), deny by default
- UUIDs make IDs harder to guess; they are **not** access control
- **Mass assignment**: DTOs declare writable fields explicitly, so nobody slips \`isAdmin: true\` into a request body

### Authentication & Session Flaws

- **JWT pitfalls**: reject \`alg: none\`, pin the algorithm (prevents RS256 to HS256 confusion), short-lived access tokens with rotating refresh tokens, nothing sensitive in the payload
- **Session fixation**: issue a new session ID after login
- **Logout that works**: the server must be able to revoke tokens
- **Password storage**: Argon2id or bcrypt — never MD5 or SHA-1
- **OAuth / OIDC**: use PKCE, strictly validate \`redirect_uri\` and \`state\`

### Business Logic Flaws

The code has no "bug", but the flow can be abused. Financial systems are where this bites hardest.

- **Race conditions**: parallel requests claim the same coupon or withdraw twice. Use row locks, unique constraints and atomic decrements
- **Replay attacks**: idempotency keys, plus nonce and timestamp signatures
- **Tampered amounts**: negative prices, overflowing quantities. Recalculate on the server; never trust a client-side total
- **Skipped steps**: calling "complete order" without paying. Enforce a server-side state machine

### Misconfiguration & Data Exposure

- **CORS**: never reflect any \`Origin\` while also allowing credentials
- **Verbose errors**: no stack traces or SQL errors in production responses
- **Leaked secrets**: exposed \`.env\` or \`.git\`, hardcoded keys. Use Secrets Manager or Vault, and run gitleaks or trufflehog in CI
- **Public buckets**: turn on S3 Block Public Access
- **Subdomain takeover**: clean up CNAMEs that point to deleted resources
- **Clickjacking**: \`X-Frame-Options: DENY\` or CSP \`frame-ancestors 'none'\`
- **Open redirects**: allowlist redirect targets

### API-Specific Risks

- **GraphQL**: cap query depth and complexity, disable introspection in production, stop batching from bypassing rate limits, authorise at the field level
- **Over-exposure**: return the fields the client needs, not the whole database row
- **Resource limits**: pagination caps, body size limits, timeouts
- **Inventory**: retire old versions before they become shadow or zombie APIs

## 📦 Part 4 — Supply Chain & Infrastructure

### Software Supply Chain

Known CVEs in dependencies (Log4Shell), poisoned packages, dependency confusion, typosquatting, hijacked maintainer accounts.

- **SCA scanning**: Snyk, Trivy, Dependabot or Renovate
- **Lock versions** with lockfiles and install with \`npm ci\` in CI
- **Block install scripts**: \`--ignore-scripts\`, or pnpm's \`onlyBuiltDependencies\` allowlist
- **Scoped private registry** for internal packages to prevent dependency confusion
- **SBOM + signing**: CycloneDX SBOMs, cosign-signed images, the SLSA framework as a guide
- **Harden CI/CD**: pin GitHub Actions to commit SHAs, minimise \`GITHUB_TOKEN\` permissions, use OIDC instead of long-lived cloud keys

### Cloud & Container Security

- Least-privilege IAM — no \`*:*\` policies
- Non-root containers, scanned images, minimal (distroless) bases
- Databases in private subnets, security groups opened only as far as needed
- CloudTrail and GuardDuty for audit and threat detection

## 🤖 Part 5 — AI & LLM Application Security

> 🤖 Building AI agents opens a brand-new attack surface. The **OWASP Top 10 for LLM Applications (2025)** is the reference here.

### Prompt Injection

**Direct** injection is the user typing "ignore your previous instructions". **Indirect** injection is nastier: the instruction hides in a web page, email, document or tool result the agent reads, and hijacks what it does next.

- Treat all external content as **data, not instructions**, and keep it structurally separate from the system prompt
- **Limit agency**: tools get only the permissions they need; writes and anything involving money need a human in the loop
- Run tool calls **as the current user**, never as a super-account
- Input and output guardrails: injection classifiers and sensitive-data filters

### Other LLM Risks

- **Improper output handling**: model output rendered as HTML is XSS; spliced into SQL or a shell it's injection. Treat it as untrusted input
- **Sensitive data leakage**: no secrets in system prompts, and RAG retrieval must filter by the user's permissions — vector stores need access control too
- **Exfiltration channels**: a model emitting a Markdown image pointing at an attacker's URL with your data in the query string. Restrict which external domains can render
- **Unbounded consumption**: per-user token and request limits to stop denial-of-wallet
- **MCP and tool supply chain**: only connect trusted MCP servers, and review tool descriptions for hidden instructions

## 🧾 Part 6 — Security Headers Checklist

A baseline worth shipping on every app:

\`\`\`http
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self';
  script-src 'nonce-{random}' 'strict-dynamic';
  frame-ancestors 'none'; object-src 'none'; base-uri 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cross-Origin-Opener-Policy: same-origin
Set-Cookie: session=...; HttpOnly; Secure; SameSite=Lax; Path=/
\`\`\`

## 🚨 Part 7 — Detection & Response

> ⚠️ Every defence gets breached eventually. What matters is **how fast you notice and how fast you contain it**.

- **Centralised, audited logs**: logins, permission changes, sensitive data access and admin actions — with passwords and tokens redacted
- **SIEM alerts**: unusual login locations, bursts of 401/403s, sudden spikes in data exports
- **Incident response runbook**: severity levels, contacts, key rotation steps, disclosure. In Australia that includes the Notifiable Data Breaches scheme
- **Backups**: the 3-2-1 rule, regular restore drills, and offline or immutable copies against ransomware

## 🔄 Part 8 — Secure SDLC (DevSecOps)

- **Design**: threat modelling with STRIDE
- **Code**: secure coding standards and security items in code review
- **CI**: SAST (Semgrep, CodeQL), SCA, secret scanning, IaC scanning (Checkov)
- **Test**: DAST (OWASP ZAP), penetration testing, bug bounties
- **Run**: RASP, WAF, runtime monitoring

> 🎯 The earlier you catch it, the cheaper it is to fix — that's the whole case for **shifting left**.

## 🧱 Putting It Together — The Defense Matrix

Walk a request from the user to the database and every layer has a job:

![Five layers from client to data — each one stops a different class of attack](/blog/web-security/defense-layers.svg)

- **Client**: MFA or passkeys, certificate pinning
- **Edge**: DDoS scrubbing, HTTPS + HSTS, CDN, hidden origin
- **Gateway / WAF**: rate limiting, bot detection, SQLi/XSS rules, security headers, CORS policy
- **Application**: parameterised queries, output encoding, CSRF protection, centralised authorisation with ownership checks, idempotency and concurrency control, SSRF egress checks, LLM guardrails and least-privilege agents
- **Data & infrastructure**: least-privilege DB and IAM, encryption at rest and in transit, secrets manager, IMDSv2, SCA and SBOM, isolated object storage
- **Across every layer**: monitoring, audit, incident response, backups

## 📋 OWASP Top 10 (2025) Quick Map

- **A01 Broken Access Control** — access control, SSRF
- **A02 Security Misconfiguration** — misconfiguration, CSRF
- **A03 Software Supply Chain Failures** — supply chain
- **A04 Cryptographic Failures** — transport, auth and sessions
- **A05 Injection** — SQLi, XSS, command injection
- **A06 Insecure Design** — business logic, secure SDLC
- **A07 Authentication Failures** — brute force, auth and sessions
- **A08 Software or Data Integrity Failures** — deserialization, supply chain
- **A09 Logging & Alerting Failures** — detection and response
- **A10 Mishandling of Exceptional Conditions** — misconfiguration

## 📚 Further Reading

- [OWASP Top 10](https://owasp.org/Top10/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP API Security Top 10](https://owasp.org/API-Security/)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security) — free hands-on labs
`;
