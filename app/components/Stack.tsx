"use client";

import { useState } from "react";
import styles from "./Stack.module.scss";

const SKILL_DATA: Record<string, string[]> = {
  Languages: ["JavaScript", "TypeScript", "C#"],
  "Front End": [
    "React", "Next.js", "ReactJS (hooks, reducer)", "Apollo Client",
    "TypeGraphQL", "Material-UI", "Tailwind CSS", "Bootstrap",
    "SASS", "HTML5", "CSS3", "ES6", "jQuery", "Responsive Design",
    "React Testing Library", "Cypress",
  ],
  "Back End": ["Node.js", "ASP.NET Core", "GraphQL", "RESTful API"],
  Database: ["SQL", "MongoDB", "DynamoDB"],
  Tools: ["AWS Lambda", "S3", "GitHub", "Git", "Postman", "Jira", "Prismic"],
  Other: ["Agile", "Figma", "Shopify API", "Shopify Partner", "SEO"],
};

const CORE_SKILLS = new Set([
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
  "GraphQL", "TypeGraphQL", "ReactJS (hooks, reducer)",
]);

export default function SkillsSection() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const allSkills: { skill: string; cat: string }[] = [];
  const seen = new Set<string>();
  for (const [cat, items] of Object.entries(SKILL_DATA)) {
    for (const s of items) {
      if (!seen.has(s)) { seen.add(s); allSkills.push({ skill: s, cat }); }
    }
  }

  const categories = Object.keys(SKILL_DATA);

  return (
    <section id="stack" className={styles.section}>
      <p className={styles.sectionLabel}>
        <span className={styles.sectionLabelNum}>02</span>Stack
      </p>

      {/* Filter Tabs */}
      <div
        className={styles.filters}
        onMouseLeave={() => setActiveFilter("All")}
      >
        {categories.map((cat) => {
          const isActive = cat === activeFilter;
          return (
            <button
              key={cat}
              onMouseEnter={() => setActiveFilter(cat)}
              className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ""}`}
            >
              {cat}
              <span className={`${styles.filterCount} ${isActive ? styles.filterCountActive : ""}`}>
                {SKILL_DATA[cat].length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Skill Pills */}
      <div className={styles.pills}>
        {allSkills.map(({ skill, cat }) => {
          const isCore = CORE_SKILLS.has(skill);
          const dimmed = activeFilter !== "All" && cat !== activeFilter;
          return (
            <span
              key={skill}
              className={`${styles.pill} ${isCore ? styles.pillCore : ""} ${dimmed ? styles.pillDimmed : ""}`}
            >
              {isCore && <span className={styles.coreDot} />}
              {skill}
            </span>
          );
        })}
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendDot} />
        <span className={styles.legendText}>Core competencies</span>
      </div>
    </section>
  );
}
