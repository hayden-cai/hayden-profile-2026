"use client";

import { useEffect, useState } from "react";
import styles from './BottomNav.module.scss';

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
      className={`hidden md:block ${styles.wrapper}`}
      style={{
        transform: `translateX(-50%) translateY(${visible ? "0" : "16px"})`,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      <div className={`flex items-center gap-1 px-2 sm:px-3 py-2 rounded-full overflow-x-auto ${styles.pill}`}>
        {sections.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all duration-200 cursor-pointer border-none shrink-0 focus:outline-none focus-visible:outline-none ${styles.navButton}`}
              style={{
                color: isActive ? "#fff" : "#555",
                background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
              }}
            >
              <span
                className={styles.dot}
                style={{
                  background: isActive ? "#fff" : "#333",
                }}
              />
              <span className={isActive ? "inline" : "hidden sm:inline"}>{label}</span>
            </button>
          );
        })}

      </div>
    </div>
  );
}
