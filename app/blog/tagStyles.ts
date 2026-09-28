// Per-topic colours for blog cards: `pill` is the bright label background
// (white text), `thumb` is the gradient used when a post has no cover image.
export type TagStyle = {
  pill: string;
  thumb: string;
};

const gradient = (from: string, to: string) => `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;

const TAG_STYLES: Readonly<Record<string, TagStyle>> = {
  AI: { pill: "#a855f7", thumb: gradient("#7c3aed", "#2e1065") },
  Architecture: { pill: "#0ea5e9", thumb: gradient("#0284c7", "#0c2a4a") },
  React: { pill: "#06b6d4", thumb: gradient("#0891b2", "#083344") },
  TypeScript: { pill: "#3b82f6", thumb: gradient("#2563eb", "#172554") },
  TailwindCSS: { pill: "#14b8a6", thumb: gradient("#0d9488", "#042f2e") },
  CSS: { pill: "#f59e0b", thumb: gradient("#d97706", "#451a03") },
  "Next.js": { pill: "#64748b", thumb: gradient("#4b5563", "#030712") },
  "Design Systems": { pill: "#ec4899", thumb: gradient("#db2777", "#500724") },
  Performance: { pill: "#f97316", thumb: gradient("#ea580c", "#431407") },
  Serverless: { pill: "#10b981", thumb: gradient("#059669", "#022c22") },
  "Full-Stack": { pill: "#84cc16", thumb: gradient("#65a30d", "#1a2e05") },
  Security: { pill: "#ef4444", thumb: gradient("#b91c1c", "#1c0505") },
  Redis: { pill: "#f43f5e", thumb: gradient("#dc2626", "#450a0a") },
};

const DEFAULT_STYLE: TagStyle = { pill: "#64748b", thumb: gradient("#4b5563", "#111827") };

export function getTagStyle(tag: string): TagStyle {
  return TAG_STYLES[tag] ?? DEFAULT_STYLE;
}
