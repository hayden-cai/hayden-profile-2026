"use client";

import { Mail, ArrowUpRight } from "lucide-react";

const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const links = [
  { label: "Email", href: "mailto:ianyaheng822@gmail.com", display: "ianyaheng822@gmail.com", icon: Mail },
  { label: "GitHub", href: "https://github.com/haydencai", display: "github.com/haydencai", icon: GithubIcon },
  { label: "LinkedIn", href: "https://linkedin.com/in/hengcai", display: "linkedin.com/in/hengcai", icon: LinkedinIcon },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="px-12 py-28"
      style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
    >
      {/* Section label */}
      <div className="mb-16">
        <p
          className="text-xs tracking-widest uppercase mb-3"
          style={{ fontFamily: "monospace", color: "#555" }}
        >
          <span className="mr-4">05</span>Get In Touch
        </p>
        <h2
          className="font-bold"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-2px", color: "#fff" }}
        >
          Contact
        </h2>
      </div>

      {/* CTA + Links — left/right layout */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Left — CTA text */}
        <p
          className="leading-relaxed"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 600, letterSpacing: "-0.5px", color: "#fff" }}
        >
          Open to new opportunities and interesting projects. Let&apos;s build something great together.
        </p>

        {/* Right — links */}
        <div className="flex flex-col justify-center gap-0">
          {links.map(({ label, href, display, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex justify-between items-center py-5 transition-all duration-200"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "0.75rem"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "0"; }}
            >
              <div className="flex items-center gap-3">
                <Icon size={14} style={{ color: "#555" }} />
                <span
                  className="text-xs tracking-widest uppercase"
                  style={{ fontFamily: "monospace", color: "#555" }}
                >
                  {label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: "#888" }}>{display}</span>
                <ArrowUpRight size={14} style={{ color: "#555" }} />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex justify-between items-center pt-12 mt-12 flex-wrap gap-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p style={{ fontFamily: "monospace", fontSize: 11, color: "#333" }}>
          © 2026 Hayden Cai
        </p>
        <p style={{ fontFamily: "monospace", fontSize: 11, color: "#333" }}>
          Full Stack & AI Engineer — Melbourne, AU
        </p>
      </div>
    </section>
  );
}