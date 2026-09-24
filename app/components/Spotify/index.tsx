"use client";

import styles from './Spotify.module.scss';

type MoodRow = {
  label: string;
  value: string;
};

const moodRows: MoodRow[] = [
  { label: "Current mood", value: "Indie / Alternative" },
  { label: "Go-to for focus", value: "Post-rock & ambient" },
  { label: "Late night coding", value: "Lo-fi & jazz" },
];

const PLAYLIST_URL =
  "https://open.spotify.com/embed/playlist/1EcpeNN9oi9DmHVh5JGNKk?utm_source=generator&theme=0";

export default function Spotify() {
  return (
    <section
      id="spotify"
      className={styles.section}
    >
      {/* Section label */}
      <div className="mb-12">
        <p
          data-fade-up
          className={`text-xs tracking-widest uppercase mb-3 ${styles.sectionLabel}`}
        >
          <span className="mr-4">07</span>Vibes
        </p>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h2 className={`font-bold ${styles.heading}`}>
            <span data-reveal-words>My Soundtrack</span>
          </h2>
          <p className={styles.updatedNote}>
            Updated as I discover new music
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left — Spotify embed */}
        <div className={styles.embedWrapper}>
          <iframe
            className={styles.embedFrame}
            src={PLAYLIST_URL}
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        </div>

        {/* Right — text */}
        <div>
          <p className={`leading-relaxed mb-8 ${styles.bodyText}`}>
            Music is always on — whether I&apos;m deep in a problem, commuting, or just unwinding.
            These are the tracks that define my headspace right now.
          </p>
          <div className="flex flex-col gap-3">
            {moodRows.map(({ label, value }) => (
              <div
                key={label}
                className={`flex justify-between items-center py-3 ${styles.moodRow}`}
              >
                <span className={styles.moodLabel}>{label}</span>
                <span className={styles.moodValue}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
