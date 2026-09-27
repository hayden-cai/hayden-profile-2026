"use client";

import styles from './Contact.module.scss';

type ContactLink = {
  label: string;
  href: string;
  text: string;
  external?: boolean;
};

const contactLinks: ContactLink[] = [
  { label: "Email", href: "mailto:ianyaheng822@gmail.com", text: "ianyaheng822@gmail.com" },
  { label: "GitHub", href: "https://github.com/haydencai", text: "github.com/haydencai", external: true },
  { label: "LinkedIn", href: "https://linkedin.com/in/hengcai", text: "linkedin.com/in/hengcai", external: true },
];

export default function Contact() {
  return (
    <section
      id="contact"
      data-screen-label="Contact"
      className={styles.section}
    >
      <p
        data-fade-up
        className={styles.sectionLabel}
      >
        <span className={styles.sectionLabelNum}>05</span>Get In Touch
      </p>
      <h2
        data-reveal-words
        className={styles.heading}
      >
        Let&apos;s build something great.
      </h2>
      <div className={styles.linksGrid}>
        <p
          data-fade-up
          className={styles.tagline}
        >
          Open to new opportunities and interesting projects — from full-stack product work to AI engineering.
        </p>
        <div className={styles.linksList}>
          {contactLinks.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              target={contact.external ? '_blank' : undefined}
              rel={contact.external ? 'noopener noreferrer' : undefined}
              data-hover
              className={styles.contactLink}
            >
              <span className={styles.contactLinkLabel}>
                {contact.label}
              </span>
              <span className={styles.contactLinkText}>
                {contact.text} ↗
              </span>
            </a>
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <p className={styles.footerText}>
          © 2026 Hayden Cai
        </p>
        <p className={styles.footerText}>
          Full Stack &amp; AI Engineer — Melbourne, AU
        </p>
      </div>
    </section>
  );
}
