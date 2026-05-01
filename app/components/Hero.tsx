"use client";

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-end px-12 pb-20 relative overflow-hidden"
    >
      {/* Status */}
      <div className="flex items-center gap-3 mb-10">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: "#666", fontFamily: "monospace" }}
        >
          Available for opportunities — Melbourne, AU
        </span>
      </div>

      {/* Name */}
      <h1
        className="font-bold leading-none mb-8"
        style={{
          fontSize: "clamp(3.5rem, 10vw, 9rem)",
          letterSpacing: "-3px",
        }}
      >
        <span className="block text-white">Hayden</span>
        <span className="block" style={{ color: "#666" }}>
          Cai.
        </span>
      </h1>

      {/* Bottom row */}
      <div
        className="flex justify-between items-end flex-wrap gap-6 pt-8"
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
      >
        <p className="text-sm leading-relaxed max-w-sm" style={{ color: "#666" }}>
          Full Stack & AI Engineer building performant web applications and
          intelligent systems.
        </p>
        <div className="text-right">
          {["Full Stack Dev", "AI Engineer", "Based in Melbourne"].map((t) => (
            <p
              key={t}
              className="text-xs mb-1"
              style={{ color: "#666", fontFamily: "monospace" }}
            >
              {t}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}