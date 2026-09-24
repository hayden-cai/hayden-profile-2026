"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Menu } from "lucide-react";
import MobileMenu from "../MobileMenu";
import styles from './Navbar.module.scss';

const SCROLL_THRESHOLD = 50;

const handleBlogLinkMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
};

const handleBlogLinkMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.background = "transparent";
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
    <nav
      id="top-nav"
      className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-5 md:py-6 transition-all duration-300 ${styles.nav}`}
      style={{
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
        background: scrolled ? "rgba(17,17,17,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
      }}
    >
      <span className={styles.logo}>
        HC_PORTFOLIO
      </span>
      <div className="flex items-center gap-2 md:gap-8">
        <Link
          href="/blog"
          className={`text-xs uppercase tracking-widest transition-all duration-200 ${styles.blogLink}`}
          onMouseEnter={handleBlogLinkMouseEnter}
          onMouseLeave={handleBlogLinkMouseLeave}
        >
          Blog &rsaquo;
        </Link>

        {/* Hamburger — mobile only */}
        <button
          onClick={openMenu}
          aria-label="Open menu"
          className={`md:hidden flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer ${styles.menuButton}`}
        >
          <Menu size={20} />
        </button>
      </div>

    </nav>
    <MobileMenu open={menuOpen} onClose={closeMenu} />
  </>
  );
}
