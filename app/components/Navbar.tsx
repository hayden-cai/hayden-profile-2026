"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Work", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-12 py-6 transition-all duration-300"
      style={{
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
        background: scrolled ? "rgba(17,17,17,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
      }}
    >
      <span style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: 2, color: "#666" }}>
        HC_PORTFOLIO
      </span>
      <div className="flex gap-10">
        {links.map(({ label, href }) => (
          <button
            key={label}
            onClick={() => handleClick(href)}
            className="text-xs uppercase tracking-widest transition-colors duration-200 cursor-pointer bg-transparent border-none"
            style={{ fontFamily: "monospace", color: "#666" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}