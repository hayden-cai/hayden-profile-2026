"use client";

import { useEffect } from "react";
import {
  X,
  User,
  Layers,
  Briefcase,
  Sparkles,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import styles from './MobileMenu.module.scss';

type SectionLink = {
  label: string;
  id: string;
  icon: typeof User;
};

const sectionLinks: SectionLink[] = [
  { label: "About", id: "about", icon: User },
  { label: "Stack", id: "stack", icon: Layers },
  { label: "Experience", id: "experience", icon: Briefcase },
  { label: "Work", id: "projects", icon: Sparkles },
  { label: "Contact", id: "contact", icon: Mail },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  // Lock body scroll + allow Escape to close while open
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const goToSection = (id: string) => {
    onClose();
    // Wait for the drawer close + scroll lock release before scrolling
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div
      className="md:hidden"
      aria-hidden={!open}
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${styles.backdrop}`}
        style={{ opacity: open ? 1 : 0 }}
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 bottom-0 z-50 flex flex-col transition-transform duration-300 ease-out ${styles.drawer}`}
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div className={`relative px-6 pt-6 pb-8 ${styles.drawerHeader}`}>
          <div className="flex items-center justify-between mb-8">
            <span className={styles.logo}>HC_PORTFOLIO</span>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className={`flex items-center justify-center rounded-full transition-colors duration-200 ${styles.closeButton}`}
            >
              <X size={18} />
            </button>
          </div>

          <h2 className={`font-bold leading-tight mb-2 ${styles.drawerName}`}>
            Hayden Cai
          </h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className={`text-xs ${styles.availableText}`}>
              Available for opportunities
            </span>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className={`text-xs tracking-widest uppercase px-2 mb-2 ${styles.navLabel}`}>
            Navigate
          </p>
          {sectionLinks.map(({ label, id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => goToSection(id)}
              className={`w-full flex items-center gap-4 px-2 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer border-none bg-transparent ${styles.navButton}`}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Icon size={18} style={{ color: "#888" }} />
              <span style={{ fontSize: 15 }}>{label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className={`px-6 py-5 ${styles.drawerFooter}`}>
          <button
            onClick={() => goToSection("contact")}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full transition-all duration-200 ${styles.contactButton}`}
          >
            Get in Touch
            <ArrowUpRight size={16} />
          </button>
        </div>
      </aside>
    </div>
  );
}
