"use client";

export default function Spotify() {
  return (
    <section
      id="spotify"
      className="px-12 py-28"
      style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
    >
      {/* Section label */}
      <div className="mb-12">
        <p
          className="text-xs tracking-widest uppercase mb-3"
          style={{ fontFamily: "monospace", color: "#555" }}
        >
          <span className="mr-4">07</span>Vibes
        </p>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h2
            className="font-bold"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-2px", color: "#fff" }}
          >
            My Soundtrack
          </h2>
          <p style={{ fontFamily: "monospace", fontSize: 12, color: "#444" }}>
            Updated as I discover new music
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left — Spotify embed */}
        <div>
          <iframe
            style={{ borderRadius: 4 }}
            src="https://open.spotify.com/embed/playlist/1EcpeNN9oi9DmHVh5JGNKk?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>

        {/* Right — text */}
        <div>
          <p className="leading-relaxed mb-8" style={{ fontSize: 15, color: "#666" }}>
            Music is always on — whether I'm deep in a problem, commuting, or just unwinding. These are the tracks that define my headspace right now.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { label: "Current mood", value: "Indie / Alternative" },
              { label: "Go-to for focus", value: "Post-rock & ambient" },
              { label: "Late night coding", value: "Lo-fi & jazz" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between items-center py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span style={{ fontFamily: "monospace", fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: 1 }}>
                  {label}
                </span>
                <span style={{ fontSize: 13, color: "#888" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}