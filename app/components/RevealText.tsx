"use client";

import { useEffect, useRef, useState } from "react";

interface RevealTextProps {
  /** The text to reveal, split per-character. */
  text: string;
  /** Extra classes applied to the wrapper (e.g. for font styles). */
  className?: string;
  /** Base delay before the stagger begins, in seconds. */
  delay?: number;
  /** Per-character stagger step, in seconds. */
  stagger?: number;
}

/**
 * Splits text into characters and reveals them with a staggered
 * fade + rise the first time the element scrolls into view.
 * Uses IntersectionObserver + CSS transitions — no animation library.
 * Respects prefers-reduced-motion.
 */
export default function RevealText({
  text,
  className,
  delay = 0,
  stagger = 0.025,
}: RevealTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      const id = setTimeout(() => setInView(true), 0);
      return () => clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");
  let charIndex = 0;

  return (
    <span
      ref={ref}
      className={className}
      aria-label={text}
      style={{ display: "inline-block" }}
    >
      {words.map((word, wi) => (
        <span
          key={wi}
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {[...word].map((ch, ci) => {
            const i = charIndex++;
            return (
              <span
                key={ci}
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(0.7em)",
                  transition: `transform 0.6s cubic-bezier(0.22,1,0.36,1) ${
                    delay + i * stagger
                  }s, opacity 0.5s ease ${delay + i * stagger}s`,
                }}
              >
                {ch}
              </span>
            );
          })}
          {wi < words.length - 1 && (
            <span style={{ display: "inline-block" }}>&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
}
