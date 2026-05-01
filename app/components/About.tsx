"use client";

const stats = [
  { num: "5+", label: "Years of experience" },
  { num: "20+", label: "Projects shipped" },
  { num: "AI", label: "Current focus area" },
  { num: "∞", label: "Tabs always open" },
];

export default function About() {
  return (
    <section
      id="about"
      className="px-12 py-28"
      style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
    >
      {/* Section label */}
      <p
        className="text-xs tracking-widest uppercase mb-16"
        style={{ fontFamily: "monospace", color: "#666" }}
      >
        <span className="mr-4">01</span>About
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left — text */}
        <div>
          <h2
            className="font-bold leading-tight mb-8"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-1px" }}
          >
            Building things that matter on both ends of the stack.
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "#999" }}>
            I&apos;m a Full Stack Engineer with a growing specialisation in AI
            engineering. I build robust web applications and intelligent
            systems — from React frontends to Node.js backends to AI agents
            powered by modern LLM frameworks.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#999" }}>
            Currently deep in the world of AI engineering, exploring Mastra,
            RAG systems, and agentic workflows. I believe the best AI products
            are built by engineers who understand the full stack.
          </p>
        </div>

        {/* Right — stats */}
        <div className="grid grid-cols-2 gap-6">
          {stats.map(({ num, label }) => (
            <div
              key={label}
              className="p-6 transition-all duration-200"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.25)";
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
              }}
            >
              <div
                className="font-bold leading-none mb-2"
                style={{ fontFamily: "monospace", fontSize: "2.5rem" }}
              >
                {num}
              </div>
              <div
                className="text-xs uppercase tracking-wider"
                style={{ color: "#666" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}