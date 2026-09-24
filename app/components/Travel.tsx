"use client";

import { useRef, useState, useCallback } from "react";
import gsap from "gsap";

const SLIDES = [
  {
    region: "— Japan Alps",
    title: "Nagano\nPrefecture",
    desc: "Ancient cedar forests, volcanic onsen and snow-capped ridgelines. A trail above the clouds with no one else for miles.",
    bg: "linear-gradient(135deg,#1a2a1a,#2d4a20,#3d6b2a)",
    thumbBg: "linear-gradient(135deg,#1a2a1a,#3d6b2a)",
    thumbRegion: "Japan Alps",
    thumbName: "NAGANO",
  },
  {
    region: "— Argentina",
    title: "Patagonia\nTorres Del Paine",
    desc: "Wind-scoured granite towers and turquoise glacial lakes. The end of the earth — and the beginning of everything.",
    bg: "linear-gradient(135deg,#0a1828,#103050,#1a4878)",
    thumbBg: "linear-gradient(135deg,#0a1828,#1a4878)",
    thumbRegion: "Argentina",
    thumbName: "PATAGONIA",
  },
  {
    region: "— Italy",
    title: "Dolomites\nAlta Via 1",
    desc: "Rose-tinted limestone spires and alpine meadows. One of the world's most dramatic long-distance routes.",
    bg: "linear-gradient(135deg,#28100a,#502010,#7a3018)",
    thumbBg: "linear-gradient(135deg,#28100a,#7a3018)",
    thumbRegion: "Italy",
    thumbName: "DOLOMITES",
  },
  {
    region: "— Norway",
    title: "Hardanger\nFjord Trail",
    desc: "Waterfalls cascade from glacier plateaus into mirror-still fjords. Norway's wildest coast on foot.",
    bg: "linear-gradient(135deg,#0a1a28,#102840,#1a3858)",
    thumbBg: "linear-gradient(135deg,#0a1a28,#1a3858)",
    thumbRegion: "Norway",
    thumbName: "FJORDS",
  },
  {
    region: "— Nepal",
    title: "Himalaya\nBase Camp",
    desc: "Prayer flags, yak trains and 8000m giants. The classic trek to the foot of the world's highest peak.",
    bg: "linear-gradient(135deg,#1a1428,#2d2050,#3d2c78)",
    thumbBg: "linear-gradient(135deg,#1a1428,#3d2c78)",
    thumbRegion: "Nepal",
    thumbName: "HIMALAYAS",
  },
];

export default function Travel() {
  const [current, setCurrent] = useState(0);
  const animatingRef = useRef(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const regionRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((next: number) => {
    if (animatingRef.current || next === current) return;
    animatingRef.current = true;

    const from = slideRefs.current[current];
    const to = slideRefs.current[next];
    if (!from || !to) return;

    // Animate text out
    gsap.to([titleRef.current, regionRef.current, descRef.current], {
      opacity: 0, y: -20, duration: 0.3, ease: "power2.in",
    });

    gsap.set(to, { scale: 0.78, opacity: 0, zIndex: 5 });
    gsap.set(from, { zIndex: 4 });

    gsap.timeline({
      onComplete() {
        gsap.set(from, { scale: 0.82, opacity: 0, zIndex: 2 });
        gsap.set(to, { zIndex: 3 });
        setCurrent(next);
        animatingRef.current = false;

        // Update counter
        if (counterRef.current) {
          counterRef.current.textContent = String(next + 1).padStart(2, "0");
        }

        // Animate text in
        gsap.set([titleRef.current, regionRef.current, descRef.current], { y: 30, opacity: 0 });
        gsap.to(regionRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.1 });
        gsap.to(titleRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.2 });
        gsap.to(descRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.35 });
      },
    })
      .to(to, { scale: 1, opacity: 1, duration: 0.85, ease: "power3.out" }, 0)
      .to(from, { scale: 1.06, opacity: 0, duration: 0.6, ease: "power2.in" }, 0.1);
  }, [current]);

  const slide = SLIDES[current];

  return (
    <section
      id="travel"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#0a0a0c",
      }}
    >
      <style>{`
        @keyframes pulse2 { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>

      {/* BG slides */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          ref={(el) => { slideRefs.current[i] = el; }}
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "center center",
            transform: i === 0 ? "scale(1)" : "scale(0.82)",
            opacity: i === 0 ? 1 : 0,
            zIndex: i === 0 ? 3 : 2,
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: s.bg }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,rgba(0,0,0,0.72) 40%,rgba(0,0,0,0.18))" }} />
        </div>
      ))}

      {/* LEFT content */}
      <div
        style={{
          position: "absolute",
          left: "clamp(32px,6vw,96px)",
          bottom: "clamp(80px,12vh,140px)",
          zIndex: 10,
          maxWidth: "560px",
        }}
      >
        <p
          ref={regionRef}
          style={{
            fontFamily: "'Geist Mono',monospace",
            fontSize: "12px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            margin: "0 0 16px",
          }}
        >
          {slide.region}
        </p>
        <h2
          ref={titleRef}
          style={{
            fontWeight: 900,
            fontSize: "clamp(3rem,8vw,7rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.92,
            margin: "0 0 20px",
            textTransform: "uppercase",
            whiteSpace: "pre-line",
          }}
        >
          {slide.title}
        </h2>
        <p
          ref={descRef}
          style={{
            fontSize: "14px",
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.6)",
            maxWidth: "38ch",
            margin: "0 0 32px",
          }}
        >
          {slide.desc}
        </p>
        <button
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "#fff",
            fontFamily: "'Geist Mono',monospace",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "14px 28px",
            cursor: "pointer",
            backdropFilter: "blur(6px)",
          }}
        >
          Discover Trail
          <span style={{ width: "20px", height: "1px", background: "#fff", display: "inline-block" }} />
          →
        </button>
      </div>

      {/* BOTTOM RIGHT: thumbnails + arrows */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(32px,5vh,64px)",
          right: "clamp(24px,4vw,64px)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "16px",
        }}
      >
        {/* Thumbnail row */}
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
          {SLIDES.map((s, i) => (
            <div
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: "clamp(110px,11vw,150px)",
                height: "clamp(70px,8vw,100px)",
                borderRadius: "10px",
                overflow: "hidden",
                cursor: "pointer",
                border: `2px solid ${i === current ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.15)"}`,
                position: "relative",
                flexShrink: 0,
                transition: "border-color .3s",
              }}
            >
              <div style={{ position: "absolute", inset: 0, background: s.thumbBg }} />
              <div style={{ position: "absolute", bottom: "7px", left: "9px" }}>
                <p style={{ fontFamily: "'Geist Mono',monospace", fontSize: "7px", color: "rgba(255,255,255,0.6)", letterSpacing: ".12em", textTransform: "uppercase", margin: 0 }}>
                  {s.thumbRegion}
                </p>
                <p style={{ fontSize: "10px", fontWeight: 700, margin: "2px 0 0" }}>{s.thumbName}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Arrows + counter */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
            style={{
              width: "44px", height: "44px", borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.08)",
              color: "#fff", fontSize: "18px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(6px)",
            }}
          >
            ‹
          </button>
          <button
            onClick={() => goTo((current + 1) % SLIDES.length)}
            style={{
              width: "44px", height: "44px", borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.08)",
              color: "#fff", fontSize: "18px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(6px)",
            }}
          >
            ›
          </button>
          <div
            ref={counterRef}
            style={{
              fontFamily: "'Geist Mono',monospace",
              fontSize: "22px",
              fontWeight: 800,
              letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            01
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "rgba(255,255,255,0.08)", zIndex: 10 }}>
        <div
          style={{
            height: "100%",
            width: `${((current + 1) / SLIDES.length) * 100}%`,
            background: "rgba(255,255,255,0.6)",
            transition: "width .4s ease",
          }}
        />
      </div>
    </section>
  );
}
