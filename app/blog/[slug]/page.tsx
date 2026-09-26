import Link from "next/link";
import { posts } from "../../src/data/posts";
import { notFound } from "next/navigation";
import { renderContent } from "./renderContent";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <main style={{ background: "#111", color: "#fff", minHeight: "100vh" }}>
      {/* Nav */}
      <nav className="flex justify-between items-center px-12 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Link href="/blog" style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: 2, color: "#666", textDecoration: "none" }}>
          ← BLOG
        </Link>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: "#333" }}>
          {post.readTime}
        </span>
      </nav>

      <article className="px-12 py-20" style={{ maxWidth: 760 }}>
        {/* Meta */}
        <div className="flex items-center gap-3 mb-8">
          <span
            className="text-xs px-2 py-0.5 tracking-widest uppercase"
            style={{
              fontFamily: "monospace",
              color: "#60a5fa",
              border: "1px solid rgba(96,165,250,0.2)",
              background: "rgba(96,165,250,0.05)",
            }}
          >
            {post.tag}
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#444" }}>{post.date}</span>
        </div>

        {/* Title */}
        <h1
          className="font-bold mb-10"
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-2px", lineHeight: 1.05, color: "#fff" }}
        >
          {post.title}
        </h1>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginBottom: "3rem" }} />

        {/* Content */}
        <div
          style={{ color: "#999", fontSize: 16, lineHeight: 1.9 }}
          dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
        />
      </article>
    </main>
  );
}