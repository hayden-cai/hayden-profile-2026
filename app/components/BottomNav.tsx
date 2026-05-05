"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Work" },
  { id: "contact", label: "Contact" },
];

export default function BottomNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const navEl = document.getElementById("top-nav");
      const navHeight = navEl?.offsetHeight ?? 80;
      setVisible(window.scrollY > navHeight);

      // Scroll spy
      const scrollY = window.scrollY + window.innerHeight / 2;
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { offsetTop, offsetHeight } = el;
        if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
          setActive(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? "0" : "16px"})`,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        zIndex: 50,
        whiteSpace: "nowrap",
      }}
    >
      <div
        className="flex items-center gap-1 px-3 py-2 rounded-full"
        style={{
          background: "rgba(20,20,20,0.85)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {sections.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer border-none"
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: isActive ? "#fff" : "#555",
                background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: isActive ? "#fff" : "#333",
                  flexShrink: 0,
                  display: "inline-block",
                  transition: "background 0.2s",
                }}
              />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}