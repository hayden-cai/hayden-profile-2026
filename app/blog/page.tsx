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
import { BlogCard, BLOG_GRID_CLASS, type BlogCardPost } from "./BlogCard";

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;

// Without Algolia keys (e.g. a misconfigured deploy) the page falls back to the
// local post list instead of crashing the build.
const searchClient =
  ALGOLIA_APP_ID && ALGOLIA_SEARCH_KEY ? algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY) : null;

type SearchClient = NonNullable<typeof searchClient>;

type BlogHit = BaseHit & BlogCardPost & { objectID: string };

function BlogHitCard({ hit }: { hit: Hit<BlogHit> }) {
  return <BlogCard post={hit} />;
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

function BlogTitle() {
  return (
    <>
      <p className="text-xs tracking-widest uppercase mb-3" style={{ fontFamily: "monospace", color: "#555" }}>
        Writing
      </p>
      <h1
        className="font-bold mb-10"
        style={{ fontSize: "clamp(3rem, 8vw, 7rem)", letterSpacing: "-3px", lineHeight: 0.95, color: "#fff" }}
      >
        Blog
      </h1>
    </>
  );
}

function StaticBlog() {
  return (
    <div className="px-5 sm:px-8 md:px-12 py-16 md:py-20">
      <div className="mb-10">
        <BlogTitle />
      </div>
      <div className={BLOG_GRID_CLASS}>
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
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

      {searchClient ? <SearchableBlog client={searchClient} /> : <StaticBlog />}
    </main>
  );
}

function SearchableBlog({ client }: { client: SearchClient }) {
  return (
      <InstantSearch searchClient={client} indexName="blog_posts">
        <div className="px-5 sm:px-8 md:px-12 py-16 md:py-20">
          {/* Header */}
          <div className="mb-10">
            <BlogTitle />

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
          <EmptyState />
          <Hits<BlogHit> hitComponent={BlogHitCard} classNames={{ list: BLOG_GRID_CLASS, item: "h-full" }} />
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
  );
}
