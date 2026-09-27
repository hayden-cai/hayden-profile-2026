"use client";

import { useState, useCallback } from "react";
import styles from './Experience.module.scss';

type Experience = {
  index: string;
  period: string;
  role: string;
  company: string;
  location: string;
  current: boolean;
  description: string;
  tags: string[];
};

const experiences: Experience[] = [
  {
    index: "01",
    period: "Nov 2024 — Present",
    role: "Full Stack Software Developer",
    company: "Findex",
    location: "Melbourne, VIC",
    current: true,
    description:
      "Building customer-facing features with React/Redux and TypeScript, plus backend APIs with Node.js. Working across the full stack including AWS infrastructure and cross-functional architecture decisions.",
    tags: ["React", "TypeScript", "Node.js", "AWS", "Redux", "Docker"],
  },
  {
    index: "02",
    period: "Apr 2022 — Oct 2024",
    role: "Front End Engineer",
    company: "Bendigo And Adelaide Bank",
    location: "Melbourne, VIC",
    current: false,
    description:
      "Built banking features with React, GraphQL, and a custom BFF architecture (Node.js + TypeGraphQL). Focused on component-driven UI, complex form validation, and strengthening code quality through testing and documentation.",
    tags: ["React", "GraphQL", "Apollo Client", "TypeGraphQL", "Storybook", "Cypress"],
  },
  {
    index: "03",
    period: "Aug 2020 — Mar 2022",
    role: "Front End Developer",
    company: "Arkade",
    location: "Melbourne, VIC",
    current: false,
    description:
      "Built reusable components and Shopify Plus storefronts with Next.js, collaborating closely with design and backend teams to ship pixel-perfect, business-aligned features.",
    tags: ["Next.js", "Shopify Plus", "Prismic", "Algolia", "Tailwind CSS"],
  },
  {
    index: "04",
    period: "Jun 2020 — Aug 2020",
    role: "Full Stack Developer (Internship)",
    company: "SettleEasy",
    location: "Melbourne, VIC",
    current: false,
    description:
      "Built and maintained API endpoints with Node.js and MySQL, handling data fixes and system maintenance.",
    tags: ["React", "Node.js", "PostgreSQL", "REST APIs"],
  },
];

export default function Experience() {
  const [openIndex, setOpenIndex] = useState<number>(0); // first one open by default

  const toggleRow = useCallback((i: number) => {
    setOpenIndex((prev) => (prev === i ? -1 : i));
  }, []);

  return (
    <section
      id="experience"
      className={styles.section}
    >
      {/* Section label */}
      <p className={styles.sectionLabel}>
        <span className={styles.sectionLabelNum}>03</span>Experience
      </p>

      {/* Accordion rows */}
      <div className={styles.list}>
        {experiences.map((exp, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={exp.index}
              onClick={() => toggleRow(i)}
              className={styles.row}
              style={{
                background: isOpen ? "rgba(124,92,255,0.04)" : "transparent",
              }}
            >
              {/* Main row — always visible */}
              <div className={styles.rowHeader}>
                {/* Index */}
                <span
                  className={styles.rowIndex}
                  style={{
                    color: isOpen ? "#7c5cff" : "#3a3a44",
                  }}
                >
                  {exp.index}
                </span>

                {/* Role + period + company */}
                <div className={styles.roleInfo}>
                  <div className={styles.roleTitleRow}>
                    <h3
                      className={styles.roleTitle}
                      style={{
                        color: isOpen ? "#fff" : "#c8c8d0",
                      }}
                    >
                      {exp.role}
                    </h3>
                    {exp.current && (
                      <span className={styles.currentBadge}>
                        <span className={styles.currentDot} />
                        Current
                      </span>
                    )}
                  </div>
                  <div className={styles.roleMeta}>
                    <span className={styles.rolePeriod}>{exp.period}</span>
                    <span className={styles.roleSeparator}>·</span>
                    <span className={styles.roleCompany}>
                      {exp.company} · {exp.location}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className={styles.arrowWrapper}>
                  <span
                    className={styles.arrowButton}
                    style={{
                      color: isOpen ? "#7c5cff" : "#5a5a63",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      borderColor: isOpen ? "rgba(124,92,255,0.4)" : "rgba(255,255,255,0.12)",
                    }}
                  >
                    +
                  </span>
                </div>
              </div>

              {/* Expanded content */}
              <div
                className={styles.expandedOuter}
                style={{
                  display: "grid",
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                }}
              >
                <div className={styles.expandedInner}>
                  <div className={styles.expandedContent}>
                    <div />
                    <div>
                      <p className={styles.description}>{exp.description}</p>
                      <div className={styles.tags}>
                        {exp.tags.map((tag) => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Last border */}
        <div className={styles.lastBorder} />
      </div>
    </section>
  );
}
