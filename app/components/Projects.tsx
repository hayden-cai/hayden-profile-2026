"use client";

const projects = [
  {
    num: "01",
    year: "2024",
    title: "Findex Platform",
    subtitle: "Financial Dashboard",
    type: "FULL STACK",
    description: "Customer-facing financial dashboard with React, Redux and TypeScript. Backend APIs with Node.js, integrated with AWS services for scalable deployments.",
    tags: ["React", "TypeScript", "Node.js", "AWS", "Material UI", "Docker"],
    gradient: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    href: "#",
  },
  {
    num: "02",
    year: "2023",
    title: "Banking Portal",
    subtitle: "Component Design System",
    type: "FRONTEND",
    description: "Customer-facing banking features with GraphQL and Apollo Client. BFF architecture with TypeGraphQL and complex financial forms with Formik and Yup.",
    tags: ["React", "GraphQL", "TypeGraphQL", "Apollo Client", "Storybook", "Cypress"],
    gradient: "linear-gradient(135deg, #0a0a0a, #1a1a2e, #16213e)",
    href: "#",
  },
  {
    num: "03",
    year: "2022",
    title: "Arkade Store",
    subtitle: "E-Commerce Experience",
    type: "SHOPIFY PLUS",
    description: "High-performance Shopify Plus storefront with Next.js, Prismic CMS and Algolia search. Custom component libraries and Vercel deployments.",
    tags: ["Next.js", "Shopify Plus", "Prismic", "Algolia", "Tailwind CSS"],
    gradient: "linear-gradient(135deg, #1a0a00, #2d1b00, #3d2400)",
    href: "#",
  },
  {
    num: "04",
    year: "2024",
    title: "AI Research Agent",
    subtitle: "Agentic RAG System",
    type: "AI ENGINEERING",
    description: "Multi-source RAG pipeline with conversational memory built with Mastra and LLM APIs for intelligent document retrieval and agentic workflows.",
    tags: ["Mastra", "RAG", "TypeScript", "LLM APIs", "AI Agents"],
    gradient: "linear-gradient(135deg, #0d0221, #1a0533, #2d0a4e)",
    href: "#",
  },
];

export default function Projects() {
  return (
    <section
      id="projects"
      className="px-12 py-28"
      style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
    >
      {/* Section label */}
      <div className="mb-16">
        <p
          className="text-xs tracking-widest uppercase mb-3"
          style={{ fontFamily: "monospace", color: "#555" }}
        >
          <span className="mr-4">04</span>Portfolio
        </p>
        <h2
          className="font-bold"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-2px", color: "#fff" }}
        >
          Selected Works
        </h2>
      </div>

      {/* Cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {projects.map((p) => (
          <div
            key={p.num}
            className="relative overflow-hidden group"
            style={{
              height: 520,
              background: p.gradient,
            }}
          >
            {/* Big background number */}
            <span
              className="absolute right-8 top-6 font-bold select-none pointer-events-none"
              style={{
                fontSize: "clamp(8rem, 20vw, 16rem)",
                color: "rgba(255,255,255,0.04)",
                lineHeight: 1,
                letterSpacing: "-4px",
                fontFamily: "monospace",
              }}
            >
              {p.num}
            </span>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-10">
              {/* Top row */}
              <div className="flex justify-between items-start">
                <span
                  className="text-xs tracking-widest uppercase px-3 py-1"
                  style={{
                    fontFamily: "monospace",
                    color: "rgba(255,255,255,0.4)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {p.type}
                </span>
                <span
                  style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.3)" }}
                >
                  {p.year}
                </span>
              </div>

              {/* Bottom content */}
              <div>
                <h3
                  className="font-bold mb-4"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    letterSpacing: "-2px",
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  {p.title}
                </h3>
                <p
                  className="mb-6 max-w-xl leading-relaxed"
                  style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}
                >
                  {p.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1"
                      style={{
                        fontFamily: "monospace",
                        color: "rgba(255,255,255,0.4)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href={p.href}
                  className="inline-flex items-center gap-3 transition-all duration-300 group-hover:gap-5"
                  style={{
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: "#fff",
                    textDecoration: "none",
                    border: "1px solid rgba(255,255,255,0.2)",
                    padding: "14px 24px",
                    borderRadius: 999,
                  }}
                >
                  View Project
                  <span
                    className="flex items-center justify-center rounded-full transition-all duration-300"
                    style={{
                      width: 28,
                      height: 28,
                      background: "rgba(255,255,255,0.15)",
                    }}
                  >
                    ↗
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}