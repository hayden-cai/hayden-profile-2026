"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import styles from './Projects.module.scss';

const projects = [
  {
    num: "01",
    year: "2024",
    type: "Full Stack",
    title: "Findex Platform",
    desc: "Customer-facing financial dashboards with React, Redux and TypeScript. Node.js APIs on AWS.",
    tags: ["React", "TypeScript", "Node.js", "AWS"],
    bg: "#3B2A7E",
    img: null,
    href: "#",
  },
  {
    num: "02",
    year: "2023",
    type: "Full Stack",
    title: "Banking Portal",
    desc: "Customer-facing banking features with GraphQL and Apollo Client. BFF with TypeGraphQL.",
    tags: ["React", "GraphQL", "TypeGraphQL", "BFF pattern", "Nodejs"],
    bg: "#E05A1A",
    img: "/projects/bendigo-bank.jpg",
    href: "https://www.itnews.com.au/news/bendigo-bank-uplifts-the-customer-broker-experience-606659",
  },
  {
    num: "03",
    year: "2021",
    type: "Shopify Plus",
    title: "SHEET SOCIETY",
    desc: "High-performance Shopify Plus storefront with Next.js, Prismic CMS and Algolia search.",
    tags: ["Next.js", "Shopify Plus", "Algolia", "Prismic", "GraphQL"],
    bg: "#2563EB",
    img: "/projects/sheet-society.jpg",
    href: "https://sheetsociety.com/en-au",
  },
  {
    num: "04",
    year: "2020",
    type: "Shopify Plus",
    title: "MAAP",
    desc: "Premium cycling apparel storefront with Next.js + Shopify Plus, Prismic CMS and Algolia.",
    tags: ["Next.js", "Shopify Plus", "Algolia", "Prismic", "GraphQL"],
    bg: "#D91E8C",
    img: "/projects/maap.jpg",
    href: "https://maap.cc/",
  },
  {
    num: "05",
    year: "2021",
    type: "Shopify Plus",
    title: "AFTERSHOCK PC",
    desc: "Custom gaming PC configurator storefront with Next.js + Shopify Plus.",
    tags: ["Next.js", "Shopify Plus", "Algolia", "Prismic", "GraphQL"],
    bg: "#111111",
    img: "/projects/aftershock.jpg",
    href: "https://aftershockpc.com.au/",
  },
];

export default function Projects() {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(4);
  const trackRef = useRef<HTMLDivElement>(null);
  const maxPage = projects.length - perPage;

  useEffect(() => {
    const update = () => setPerPage(window.innerWidth < 768 ? 1 : 4);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const updateTrack = useCallback((newPage: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>(".proj-card");
    if (!cards.length) return;
    const gap = 16;
    const cardW = cards[0].getBoundingClientRect().width;
    const offset = -(newPage * (cardW + gap));
    gsap.to(track, { x: offset, duration: 0.7, ease: "power3.out" });
  }, []);

  const goNext = useCallback(() => {
    setPage((p) => {
      const next = Math.min(p + 1, maxPage);
      updateTrack(next);
      return next;
    });
  }, [maxPage, updateTrack]);

  const goPrev = useCallback(() => {
    setPage((p) => {
      const prev = Math.max(p - 1, 0);
      updateTrack(prev);
      return prev;
    });
  }, [updateTrack]);

  useEffect(() => {
    updateTrack(page);
  }, [perPage, page, updateTrack]);

  return (
    <section id="projects" className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <p className={styles.sectionLabel}>
          <span className={styles.sectionLabelNum}>04</span>Selected Work
        </p>
        <h2 className={styles.heading}>Shipped</h2>
      </div>

      {/* Carousel */}
      <div className={`md:-ml-[52px] ${styles.carouselWrapper}`}>
        {/* Left arrow */}
        <button
          onClick={goPrev}
          className={styles.arrowButton}
          style={{ opacity: page <= 0 ? 0.3 : 1 }}
        >
          ‹
        </button>

        {/* Track */}
        <div className={styles.trackWrapper}>
          <div ref={trackRef} className={styles.track}>
            {projects.map((p) => (
              <a
                key={p.num}
                href={p.href}
                target={p.href !== "#" ? "_blank" : undefined}
                rel={p.href !== "#" ? "noopener noreferrer" : undefined}
                className={`proj-card ${styles.card}`}
                style={{
                  flex: perPage === 1 ? "0 0 100%" : `0 0 calc(25% - 12px)`,
                }}
              >
                {/* Background image or color */}
                {p.img ? (
                  <div
                    className={styles.cardBgImg}
                    style={{ backgroundImage: `url(${p.img})` }}
                  />
                ) : (
                  <div className={styles.cardBgColor} style={{ background: p.bg }} />
                )}

                {/* Dark overlay on hover */}
                <div className={styles.cardOverlay} />

                {/* Number (always visible) */}
                <span className={styles.cardNum}>{p.num}</span>

                {/* Title always visible at bottom */}
                <div className={styles.cardStatic}>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                </div>

                {/* Hover content */}
                <div className={styles.cardHover}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardType}>{p.type}</span>
                    <span className={styles.cardYear}>{p.year}</span>
                  </div>
                  <div className={styles.cardBottom}>
                    <h3 className={styles.cardTitle}>{p.title}</h3>
                    <p className={styles.cardDesc}>{p.desc}</p>
                    <div className={styles.cardTags}>
                      {p.tags.map((tag) => (
                        <span key={tag} className={styles.cardTag}>{tag}</span>
                      ))}
                    </div>
                    <div className={styles.viewProjectBtn}>
                      View Project
                      <span className={styles.viewProjectIcon}>↗</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right arrow */}
        <button
          onClick={goNext}
          className={styles.arrowButton}
          style={{ opacity: page >= projects.length - perPage ? 0.3 : 1 }}
        >
          ›
        </button>
      </div>

      {/* Counter */}
      <div className={styles.counter}>
        <span className={styles.counterText}>
          {page + 1} — {Math.min(page + perPage, projects.length)} / {projects.length}
        </span>
      </div>
    </section>
  );
}
