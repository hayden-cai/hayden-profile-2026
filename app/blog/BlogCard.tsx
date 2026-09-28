import Image from "next/image";
import Link from "next/link";
import { getTagStyle } from "./tagStyles";

export type BlogCardPost = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  readTime: string;
  cover?: string | null;
};

const AUTHOR = { name: "Hayden Cai", initials: "HC" } as const;

export const BLOG_GRID_CLASS = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8";

function CardThumbnail({ post }: { post: BlogCardPost }) {
  const { thumb } = getTagStyle(post.tag);

  return (
    <div className="relative aspect-[40/21] overflow-hidden" style={{ background: thumb }}>
      {post.cover ? (
        <Image
          src={post.cover}
          alt=""
          fill
          unoptimized
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-bold uppercase text-center px-6 transition-transform duration-500 group-hover:scale-[1.04]"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "-0.5px", color: "rgba(255,255,255,0.85)" }}
          >
            {post.tag}
          </span>
        </div>
      )}
    </div>
  );
}

function CardAuthor({ post }: { post: BlogCardPost }) {
  return (
    <div className="flex items-center gap-3 mt-auto pt-6">
      <span
        aria-hidden="true"
        className="flex items-center justify-center shrink-0 rounded-full font-semibold"
        style={{ width: 40, height: 40, background: "#111", color: "#fff", fontSize: 13, letterSpacing: "0.5px" }}
      >
        {AUTHOR.initials}
      </span>
      <div className="leading-tight">
        <p className="font-semibold" style={{ color: "#1f1f2e", fontSize: 15 }}>
          {AUTHOR.name}
        </p>
        <p style={{ color: "#8a8a99", fontSize: 13, marginTop: 2 }}>
          {post.date} · {post.readTime}
        </p>
      </div>
    </div>
  );
}

export function BlogCard({ post }: { post: BlogCardPost }) {
  const { pill } = getTagStyle(post.tag);

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full" style={{ textDecoration: "none" }}>
      <article
        className="flex flex-col h-full overflow-hidden rounded-xl bg-white transition-all duration-300 group-hover:-translate-y-1"
        style={{ boxShadow: "0 10px 30px -12px rgba(0,0,0,0.6)" }}
      >
        <CardThumbnail post={post} />

        <div className="flex flex-col flex-1 p-6 sm:p-7">
          <span
            className="self-start rounded-full uppercase font-semibold mb-4"
            style={{ background: pill, color: "#fff", fontSize: 11, letterSpacing: "0.8px", padding: "4px 12px" }}
          >
            {post.tag}
          </span>

          <h2
            className="font-bold mb-3 text-[#1f1f2e] transition-colors duration-200 group-hover:text-[#2563eb]"
            style={{ fontSize: "1.2rem", lineHeight: 1.35, letterSpacing: "-0.2px" }}
          >
            {post.title}
          </h2>

          <p className="line-clamp-3" style={{ color: "#5b5b6b", fontSize: 15, lineHeight: 1.6 }}>
            {post.excerpt}
          </p>

          <CardAuthor post={post} />
        </div>
      </article>
    </Link>
  );
}
