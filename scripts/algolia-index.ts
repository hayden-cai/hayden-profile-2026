import { algoliasearch } from "algoliasearch";
import { posts } from "../app/src/data/posts";

const INDEX_NAME = "blog_posts";

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const adminKey = process.env.ALGOLIA_ADMIN_KEY;

if (!appId || !adminKey) {
  console.error("❌ NEXT_PUBLIC_ALGOLIA_APP_ID and ALGOLIA_ADMIN_KEY must both be set");
  process.exit(1);
}

const client = algoliasearch(appId, adminKey);

const records = posts.map((post) => ({
  objectID: post.slug,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  tag: post.tag,
  date: post.date,
  readTime: post.readTime,
  cover: post.cover ?? null,
}));

async function main(): Promise<void> {
  // `tag` must be a facet for the "Filter by topic" chips on /blog to work.
  await client.setSettings({
    indexName: INDEX_NAME,
    indexSettings: { attributesForFaceting: ["tag"] },
  });
  await client.saveObjects({ indexName: INDEX_NAME, objects: records });
  console.log("✅ Indexed", records.length, "posts to Algolia");
}

main().catch((error: unknown) => {
  console.error("❌ Algolia indexing failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
