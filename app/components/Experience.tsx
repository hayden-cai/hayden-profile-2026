"use client";

import { useState } from "react";

type Exp = {
  period: string;
  role: string;
  company: string;
  location: string;
  current: boolean;
  description: string;
  tags: string[];
};

function ExperienceCard({ exp }: { exp: Exp }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="grid gap-8 py-8 px-4 -mx-4 transition-all duration-300"
      style={{
        gridTemplateColumns: "200px 1fr",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background: hovered ? "rgba(255,255,255,0.03)" : "transparent",
      }}
    >
      {/* Left — time */}
      <div className="pt-1 flex flex-col gap-2">
        <p
          className="text-xs tracking-widest uppercase"
          style={{ fontFamily: "monospace", color: "#555" }}
        >
          {exp.period}
        </p>
        {exp.current && (
          <span
            className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full w-fit"
            style={{
              fontFamily: "monospace",
              color: "#4ade80",
              border: "1px solid rgba(74,222,128,0.3)",
              background: "rgba(74,222,128,0.08)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Current
          </span>
        )}
      </div>

      {/* Right — content */}
      <div>
        {/* Role + company */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3
              className="font-semibold text-lg leading-tight mb-1 transition-colors duration-300"
              style={{ color: hovered ? "#fff" : "#ccc" }}
            >
              {exp.role}
            </h3>
            <p className="text-sm" style={{ color: "#555" }}>
              {exp.company} · {exp.location}
            </p>
          </div>
          <span
            className="text-lg transition-all duration-300 mt-1"
            style={{
              color: "#666",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translate(0,0)" : "translate(-4px,4px)",
            }}
          >
            ↗
          </span>
        </div>

        {/* Description + tags — fade in on hover */}
        <div
          style={{
            maxHeight: hovered ? "400px" : "0px",
            opacity: hovered ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.4s ease, opacity 0.35s ease",
          }}
        >
          <p className="text-sm leading-relaxed mb-4 mt-1" style={{ color: "#888" }}>
            {exp.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {exp.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  fontFamily: "monospace",
                  color: "#60a5fa",
                  border: "1px solid rgba(96,165,250,0.2)",
                  background: "rgba(96,165,250,0.05)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const experiences = [
  {
    period: "Nov 2024 — Present",
    role: "Full Stack Software Developer",
    company: "Findex",
    location: "Melbourne, VIC",
    current: true,
    description:
      "Developed and delivered customer-facing web features using React (Redux) and TypeScript, focusing on performance, usability, and maintainable component architecture. Designed and implemented backend APIs with Node.js and TypeScript. Integrated frontend applications with AWS-based services, leveraging cloud infrastructure for scalable deployments.",
    tags: ["React", "TypeScript", "Node.js", "REST APIs", "AWS", "Material UI", "Docker"],
  },
  {
    period: "Apr 2022 — Oct 2024",
    role: "Front End Engineer",
    company: "Bendigo And Adelaide Bank",
    location: "Melbourne, VIC",
    current: false,
    description:
      "Designed and delivered customer-facing banking features using React and TypeScript. Managed frontend data flow through GraphQL and Apollo Client. Contributed to a BFF architecture (Node.js + TypeGraphQL) and implemented complex financial forms with Formik and Yup. Strengthened code quality through Storybook documentation and Cypress testing.",
    tags: ["React", "TypeScript", "GraphQL", "Apollo Client", "TypeGraphQL", "Material UI", "Formik", "Storybook", "Cypress"],
  },
  {
    period: "Aug 2020 — Mar 2022",
    role: "Front End Developer",
    company: "Arkade",
    location: "Melbourne, VIC",
    current: false,
    description:
      "Built reusable code and component libraries. Collaborated with design, product, and back-end teams to ensure implementations met design requirements and business specifications.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GraphQL", "Shopify Plus", "Prismic", "Algolia"],
  },
  {
    period: "Jun 2020 — Aug 2020",
    role: "Full Stack Developer",
    company: "SettleEasy",
    location: "Melbourne, VIC",
    current: false,
    description:
      "Created API endpoints for testing and managing listings from MySQL database. Performed bug fixes, data fixes, and system maintenance.",
    tags: ["React", "Node.js", "MySQL", "Storybook", "MongoDB", "AWS"],
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="px-12 py-28"
      style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
    >
      {/* Section label */}
      <div className="mb-16">
        <p
          className="text-xs tracking-widest uppercase mb-3"
          style={{ fontFamily: "monospace", color: "#555" }}
        >
          <span className="mr-4">03</span>Work History
        </p>
        <h2
          className="font-bold"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-2px", color: "#fff" }}
        >
          Experience
        </h2>
      </div>

      <div className="flex flex-col">
        {experiences.map((exp, i) => (
          <ExperienceCard key={i} exp={exp} />
        ))}
      </div>
    </section>
  );
}