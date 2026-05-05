"use client";

const HIGHLIGHTS = new Set([
  // Languages
  "JavaScript", "TypeScript",
  // Frontend
  "React", "React Hooks & Reducer",
  // Backend
  "Node.js", "GraphQL", "TypeGraphQL",
  // Database
  "MongoDB",
  // AWS & Cloud
  "AWS",
  // AI & Emerging
  "Mastra", "RAG Systems",
  // Tools
  "Figma",
]);

const categories = [
  {
    label: "Languages",
    color: "#a78bfa",
    items: ["JavaScript", "TypeScript", "C#"],
  },
  {
    label: "Frontend",
    color: "#60a5fa",
    items: ["React", "Next.js", "React Hooks & Reducer", "HTML5", "CSS3", "SASS", "Tailwind CSS", "Material-UI", "Apollo Client"],
  },
  {
    label: "Backend",
    color: "#34d399",
    items: ["Node.js", "GraphQL", "TypeGraphQL", "RESTful API", "ASP.NET Core", "BFF Pattern"],
  },
  {
    label: "Database",
    color: "#f59e0b",
    items: ["SQL", "MongoDB", "DynamoDB"],
  },
  {
    label: "AWS & Cloud",
    color: "#f97316",
    items: ["Lambda", "S3", "DynamoDB", "AWS"],
  },
  {
    label: "AI & Emerging",
    color: "#e879f9",
    items: ["Mastra", "LLM APIs", "RAG Systems", "AI Agents"],
  },
  {
    label: "Tools & Other",
    color: "#94a3b8",
    items: ["Git", "GitHub", "Jira", "Figma", "Postman", "Shopify API", "Prismic", "Agile", "SEO"],
  },
];

export default function Stack() {
  return (
    <section
      id="stack"
      className="px-12 py-28"
      style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
    >
      {/* Section label */}
      <p
        className="text-xs tracking-widest uppercase mb-16"
        style={{ fontFamily: "monospace", color: "#666" }}
      >
        <span className="mr-4">02</span>Tech Stack
      </p>

      <div className="flex flex-col gap-0" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {categories.map(({ label, color, items }) => (
          <div
            key={label}
            className="flex items-start gap-8 py-6 transition-all duration-200 group"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Category label */}
            <div className="flex items-center gap-3 shrink-0" style={{ width: 160 }}>
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: color }}
              />
              <span
                className="text-xs uppercase tracking-widest"
                style={{ fontFamily: "monospace", color: "#555" }}
              >
                {label}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {items.map((item) => {
                const isHighlight = HIGHLIGHTS.has(item);
                return (
                  <span
                    key={item}
                    className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 cursor-default"
                    style={{
                      fontFamily: "monospace",
                      fontWeight: isHighlight ? 700 : 400,
                      border: isHighlight
                        ? `1px solid ${color}`
                        : "1px solid rgba(255,255,255,0.1)",
                      color: isHighlight ? color : "#999",
                      background: isHighlight ? `${color}15` : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = color;
                      e.currentTarget.style.color = color;
                      e.currentTarget.style.background = `${color}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isHighlight ? color : "rgba(255,255,255,0.1)";
                      e.currentTarget.style.color = isHighlight ? color : "#999";
                      e.currentTarget.style.background = isHighlight ? `${color}15` : "transparent";
                    }}
                  >
                    {isHighlight && <span className="mr-1.5">★</span>}
                    {item}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}