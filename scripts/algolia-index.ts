import { algoliasearch } from "algoliasearch";
import { posts } from "../app/src/data/posts";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!
);

const records = posts.map((post) => ({
  objectID: post.slug,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  tag: post.tag,
  date: post.date,
  readTime: post.readTime,
}));

client.saveObjects({ indexName: "blog_posts", objects: records }).then(() => {
  console.log("✅ Indexed", records.length, "posts to Algolia");
}).catch(console.error);