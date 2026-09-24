"use client";

import styles from './About.module.scss';
import heroStyles from '../Hero/Hero.module.scss';

const stats = [
  { num: "6+", label: "Years of experience" },
  { num: "⇒", label: "End To end delivery" },
  { num: "⚙ ", label: "Performance · Arch · Mastra" },
  { num: "∞", label: "Tabs always open" },
];

const handleStatMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
};

const handleStatMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
  e.currentTarget.style.background = "transparent";
};

export default function About() {
  return (
    <section
      id="about"
      className={styles.section}
    >
      {/* Section label */}
      <p
        data-fade-up
        className={`text-xs tracking-widest uppercase mb-16 ${styles.sectionLabel}`}
      >
        <span className="mr-4">01</span>About
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-stretch">
        {/* Left — text */}
        <div>
          <h2
            data-reveal-words
            className={`font-bold leading-tight mb-8 ${styles.heading}`}
          >
            Building things that matter on both ends of the stack.
          </h2>
          <p data-fade-up className={`text-sm leading-relaxed mb-4 ${styles.bodyText}`}>
            I&apos;m a Full Stack Engineer with a growing specialisation in AI
            engineering. I build robust web applications and intelligent
            systems — from React frontends to Node.js backends to AI agents
            powered by modern LLM frameworks.
          </p>
          <p data-fade-up className={`text-sm leading-relaxed ${styles.bodyText}`}>
            I go deep wherever it matters — whether that&apos;s optimising render performance,
            designing resilient system architecture, writing maintainable code that scales with
            a team, or building intelligent pipelines with LLMs. I believe great software is the
            result of engineers who care about every layer of the stack.
          </p>
        </div>

        {/* Right — stats + button */}
        <div className="flex flex-col gap-6">
          <div data-stagger className="grid grid-cols-2 gap-6">
            {stats.map(({ num, label }) => (
              <div
                key={label}
                data-stagger-item
                className={`p-6 transition-all duration-200 ${styles.statCard}`}
                onMouseEnter={handleStatMouseEnter}
                onMouseLeave={handleStatMouseLeave}
              >
                <div className={`font-bold leading-none mb-2 ${styles.statNum}`}>
                  {num}
                </div>
                <div className={`text-xs uppercase tracking-wider ${styles.statLabel}`}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Download CV button — bottom aligned */}
          <div className="mt-auto">
            <a
              href="/Hayden_Cai_Resume.pdf"
              download
              className={heroStyles.cvButton}
            >
              Download CV
              <span className={heroStyles.cvIcon}>↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
