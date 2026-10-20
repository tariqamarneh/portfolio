"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { profile } from "@/content/profile";

const sections = [
  { id: "work", label: "Work" },
  { id: "career", label: "Career" },
  { id: "stack", label: "Stack" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

const lightQuery = "(prefers-color-scheme: light)";
const chromeColor = { light: "#f2f4f8", dark: "#0d1526" } as const;

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const media = window.matchMedia(lightQuery);
  media.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", onChange);
  };
}

function readTheme() {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia(lightQuery).matches ? "light" : "dark";
}

function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => null);

  // Keep the browser toolbar (Safari tint, Android status bar) on the chosen theme.
  useEffect(() => {
    if (!theme) return;
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute("content", chromeColor[theme]);
    });
  }, [theme]);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="press grid size-11 place-items-center rounded-full border border-rule text-muted transition-colors hover:text-text md:size-9"
    >
      <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
        <circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 2.75a7.25 7.25 0 0 1 0 14.5z" fill="currentColor" />
      </svg>
    </button>
  );
}

/** `home` keeps in-page anchors (smooth-scrolled by Lenis); other pages link back to the homepage sections. */
export function Nav({ home = false }: { home?: boolean }) {
  const base = home ? "" : "/";
  const links = sections.map((s) => ({ href: `${base}#${s.id}`, label: s.label }));
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Mark the section under the middle of the screen, so the bar says where you are.
  useEffect(() => {
    if (!home) return;
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { isIntersecting, target } of entries) {
          setCurrent((prev) => (isIntersecting ? target.id : prev === target.id ? null : prev));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [home]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggle?.focus();
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = () => desktop.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    // The page behind the open menu stays put.
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    menuRef.current?.querySelector("a")?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
      root.style.overflow = overflow;
    };
  }, [open]);


  return (
    <>
    <a
      href="#main"
      className="sr-only rounded-full bg-text px-4 py-2.5 text-sm font-medium text-ink focus-visible:not-sr-only focus-visible:fixed focus-visible:top-[calc(0.75rem+env(safe-area-inset-top))] focus-visible:left-3 focus-visible:z-[60]"
    >
      Skip to content
    </a>
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 bg-ink/70 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.2 }}
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
    </AnimatePresence>
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,border-color] duration-200 ${
        open || scrolled ? "border-b border-rule bg-ink" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1240px] items-center justify-between pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))] sm:px-8">
        <a href={home ? "#top" : "/"} onClick={() => setOpen(false)} className="wide flex h-11 items-center text-[15px] font-bold tracking-tight">
          {profile.name}
        </a>
        <div className="flex items-center gap-2">
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={current === link.href.slice(link.href.indexOf("#") + 1) ? "location" : undefined}
                  className="relative rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-text aria-[current]:text-text"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={profile.cv}
            download="Tariq-Amarneh-CV.pdf"
            className="press hidden h-9 items-center rounded-full border border-rule px-4 text-sm font-medium transition-colors hover:border-muted md:flex"
          >
            Download CV
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="press h-11 rounded-full bg-text px-5 text-sm font-medium text-ink md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
          <ThemeToggle />
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.18 } }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden md:hidden"
            ref={menuRef}
          >
            <ul className="px-[max(1rem,env(safe-area-inset-left))] pt-2 pb-6">
              {links.map((link) => (
                <li key={link.href} className="border-t border-rule">
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="wide flex h-16 items-center text-2xl font-bold tracking-[-0.03em]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="grid grid-cols-2 gap-3 border-t border-rule pt-4">
                <a
                  href={profile.cv}
                  download="Tariq-Amarneh-CV.pdf"
                  onClick={() => setOpen(false)}
                  className="press col-span-2 flex h-12 items-center justify-center rounded-full bg-text text-[15px] font-medium text-ink"
                >
                  Download CV
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  onClick={() => setOpen(false)}
                  className="press flex h-12 items-center justify-center rounded-full border border-rule text-[15px] font-medium"
                >
                  Email
                </a>
                <a
                  href={profile.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="press flex h-12 items-center justify-center rounded-full border border-rule text-[15px] font-medium"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </>
  );
}
