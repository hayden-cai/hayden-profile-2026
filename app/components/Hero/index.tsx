"use client";

import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <section id="hero" data-screen-label="Hero" className={styles.section}>
      {/* Status */}
      <div data-hero-fade className={styles.status}>
        <span className={styles.statusDot} />
        <span className={styles.statusText}>
          Available for opportunities — Melbourne, AU
        </span>
      </div>

      {/* Name */}
      <h1 className={styles.name}>
        <span className={styles.nameMask}>
          <span className="hero-line">Hayden</span>
        </span>
        <span className={styles.nameMaskDim}>
          <span className="hero-line">Cai.</span>
        </span>
      </h1>

      {/* Bottom */}
      <div data-hero-fade className={styles.bottom}>
        <p className={styles.tagline}>
          Full Stack &amp; AI Engineer building performant web applications and intelligent systems.
        </p>
      </div>
    </section>
  );
}
