"use client";

import Link from "next/link";
import { algoliasearch } from "algoliasearch";
import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  useInstantSearch,
} from "react-instantsearch";
import type { BaseHit, Hit } from "instantsearch.js";
import { posts } from "@/app/src/data/posts";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

// Tag → gradient color map
const tagColors: Record<string, string> = {
  "AI": "linear-gradient(135deg, #1a0533, #2d0a4e)",
  "Architecture": "linear-gradient(135deg, #0f2027, #203a43)",
  "React": "linear-gradient(135deg, #0a1628, #0d2137)",
  "TypeScript": "linear-gradient(135deg, #0a1a2e, #1a3a5e)",
  "TailwindCSS": "linear-gradient(135deg, #0a1e1a, #0d3328)",
  "CSS": "linear-gradient(135deg, #1a1a0a, #2e2e0d)",
  "Next.js": "linear-gradient(135deg, #1a1a1a, #2a2a2a)",
  "Design Systems": "linear-gradient(135deg, #1a0a1a, #2e0d2e)",
  "Performance": "linear-gradient(135deg, #1a0a00, #2e1a00)",
  "Serverless": "linear-gradient(135deg, #001a1a, #002e2e)",
  "Full-Stack": "linear-gradient(135deg, #0a1a00, #1a2e00)",
};

type BlogHit = BaseHit & {
  objectID: string;
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  readTime: string;
};

function BlogHitCard({ hit }: { hit: Hit<BlogHit> }) {
  const bg = tagColors[hit.tag] ?? "linear-gradient(135deg, #1a1a1a, #2a2a2a)";

  return (
    <Link href={`/blog/${hit.slug}`} style={{ textDecoration: "none" }}>
      <div
        className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 py-8 transition-all duration-200"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.paddingLeft = "0.75rem";
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.paddingLeft = "0";
          e.currentTarget.style.background = "transparent";
        }}
      >
        {/* Thumbnail */}
        <div
          className="shrink-0 flex items-center justify-center overflow-hidden w-full h-[140px] sm:w-[180px] sm:h-[120px]"
          style={{
            background: bg,
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            className="font-bold text-center px-3"
            style={{
              fontSize: "clamp(0.7rem, 1.5vw, 0.9rem)",
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              lineHeight: 1.3,
            }}
          >
            {hit.tag}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Tags + meta */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span
              className="text-xs px-3 py-1 tracking-widest uppercase rounded-full"
              style={{
                fontFamily: "monospace",
                color: "#60a5fa",
                border: "1px solid rgba(96,165,250,0.25)",
                background: "rgba(96,165,250,0.05)",
              }}
            >
              {hit.tag}
            </span>
            <span style={{ fontFamily: "monospace", fontSize: 11, color: "#444" }}>
              {hit.date}
            </span>
            <span style={{ color: "#333", fontSize: 11 }}>·</span>
            <span style={{ fontFamily: "monospace", fontSize: 11, color: "#333" }}>
              {hit.readTime}
            </span>
          </div>

          {/* Title */}
          <h2
            className="font-semibold mb-2 transition-colors duration-200"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.4rem)",
              letterSpacing: "-0.5px",
              color: "#ccc",
              lineHeight: 1.3,
            }}
          >
            {hit.title}
          </h2>

          {/* Excerpt */}
          <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>
            {hit.excerpt}
          </p>
        </div>

        {/* Arrow */}
        <span className="hidden sm:inline" style={{ color: "#333", fontSize: "1rem", flexShrink: 0, marginTop: 4 }}>↗</span>
      </div>
    </Link>
  );
}

function EmptyState() {
  const { results } = useInstantSearch();
  if (!results.query || results.nbHits > 0) return null;
  return (
    <div className="py-16 text-center">
      <p style={{ fontFamily: "monospace", fontSize: 12, color: "#333", letterSpacing: 2 }}>
        NO RESULTS FOR &ldquo;{results.query}&rdquo;
      </p>
    </div>
  );
}

export default function BlogPage() {
  return (
    <main style={{ background: "#111", color: "#fff", minHeight: "100vh" }}>
      {/* Nav */}
      <nav
        className="flex justify-between items-center px-5 sm:px-8 md:px-12 py-5 md:py-6"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Link href="/" style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: 2, color: "#666", textDecoration: "none" }}>
          ← HC_PORTFOLIO
        </Link>
        <span style={{ fontFamily: "monospace", fontSize: 12, color: "#333" }}>
          {posts.length} posts
        </span>
      </nav>

      <InstantSearch searchClient={searchClient} indexName="blog_posts">
        <div className="px-5 sm:px-8 md:px-12 py-16 md:py-20">
          {/* Header */}
          <div className="mb-10">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ fontFamily: "monospace", color: "#555" }}>
              Writing
            </p>
            <h1
              className="font-bold mb-10"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)", letterSpacing: "-3px", lineHeight: 0.95, color: "#fff" }}
            >
              Blog
            </h1>

            {/* Search bar */}
            <div className="relative mb-6">
              <span className="absolute" style={{ left: 16, top: "50%", transform: "translateY(-50%)", color: "#444" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </span>
              <SearchBox placeholder="Search articles..." classNames={{ root: "", form: "", input: "", submit: "hidden", reset: "hidden", submitIcon: "hidden", resetIcon: "hidden" }} />
            </div>

            {/* Tag chips */}
            <div className="mb-10">
              <p className="text-xs tracking-widest uppercase mb-4" style={{ fontFamily: "monospace", color: "#444" }}>
                Filter by topic
              </p>
              <RefinementList attribute="tag" limit={20} sortBy={["name:asc"]} />
            </div>
          </div>

          {/* Results */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <EmptyState />
            <Hits<BlogHit> hitComponent={BlogHitCard} />
          </div>
        </div>

        <style>{`
          .ais-SearchBox-form { position: relative; }
          .ais-SearchBox-input {
            width: 100%; padding: 14px 20px 14px 44px;
            font-size: 14px; font-family: monospace;
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 999px; color: #fff; outline: none;
            transition: border-color 0.2s;
          }
          .ais-SearchBox-input:focus { border-color: rgba(255,255,255,0.25); }
          .ais-SearchBox-input::placeholder { color: #444; }
          .ais-SearchBox-submit, .ais-SearchBox-reset { display: none; }

          .ais-RefinementList-list { display: flex; flex-wrap: wrap; gap: 8px; list-style: none; padding: 0; margin: 0; }
          .ais-RefinementList-label {
            display: flex; align-items: center; gap: 6px; cursor: pointer;
            padding: 6px 16px; border: 1px solid rgba(255,255,255,0.1);
            border-radius: 999px; font-family: monospace; font-size: 11px;
            letter-spacing: 1.5px; text-transform: uppercase;
            color: #555; transition: all 0.2s;
          }
          .ais-RefinementList-label:hover { color: #fff; border-color: rgba(255,255,255,0.3); }
          .ais-RefinementList-item--selected .ais-RefinementList-label {
            color: #fff; border-color: rgba(255,255,255,0.6);
            background: rgba(255,255,255,0.08);
          }
          .ais-RefinementList-checkbox { display: none; }
          .ais-RefinementList-count { font-size: 10px; color: #444; }
          .ais-Hits-list { list-style: none; padding: 0; margin: 0; }
          .ais-Hits-item { padding: 0; }
        `}</style>
      </InstantSearch>
    </main>
  );
}
