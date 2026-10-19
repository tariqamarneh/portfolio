"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { profile } from "@/content/profile";
import { Portrait } from "./Portrait";

const channels = [
  { label: "Phone", value: profile.phoneDisplay, href: profile.phoneHref },
  { label: "WhatsApp", value: "Message me", href: profile.whatsappHref },
  { label: "LinkedIn", value: "in/tariq-amarneh", href: profile.linkedin },
  { label: "GitHub", value: "tariqamarneh", href: profile.github },
];

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  return (
    <section id="contact" className="relative isolate overflow-hidden border-t border-rule pt-24 pb-10">
      <div className="grid-paper pointer-events-none absolute inset-0 -z-10 rotate-180" aria-hidden />
      <div className="mx-auto max-w-[1240px] gutter">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Portrait className="w-[min(50vw,200px)] lg:order-last lg:w-full" />
          <div>
            <h2 className="wide text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
              Get in touch
            </h2>
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted">
              I&apos;m open to conversations about AI agents, backend systems and engineering roles. Email is the
              fastest way to reach me.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={`mailto:${profile.email}`}
            className="wide py-2 text-[clamp(1.05rem,calc((100vw-2.25rem)/14.2),4rem)] leading-none font-bold tracking-[-0.035em] break-all underline decoration-rule decoration-2 underline-offset-[0.18em] transition-colors hover:decoration-signal"
          >
            {profile.email}
          </a>
          <button
            type="button"
            onClick={copy}
            className="press relative h-11 min-w-[118px] rounded-full border border-rule px-4 text-sm font-medium transition-colors hover:border-muted"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? "done" : "idle"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className={`block ${copied ? "text-ok" : ""}`}
              >
                {copied ? "Copied" : "Copy email"}
              </motion.span>
            </AnimatePresence>
          </button>
          <a
            href={profile.cv}
            download="Tariq-Amarneh-CV.pdf"
            className="press flex h-11 items-center rounded-full bg-text px-5 text-sm font-medium text-ink transition-opacity hover:opacity-90"
          >
            Download CV
          </a>
        </div>

        <ul className="mt-16 grid border-t border-rule sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c) => (
            <li key={c.label} className="border-b border-rule sm:odd:border-r sm:even:pl-6 lg:border-r lg:pl-6 lg:first:pl-0 lg:last:border-r-0">
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group block py-6"
              >
                <span className="text-sm text-faint">{c.label}</span>
                <span className="mt-1 block text-lg font-medium transition-colors group-hover:text-signal">
                  {c.value}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <footer className="mt-20 flex flex-wrap justify-between gap-4 text-sm text-faint">
          <p>
            © 2026 {profile.name} ·{" "}
            <span lang="ar" dir="rtl">
              {profile.nameAr}
            </span>
          </p>
          <p>Built with Next.js, Tailwind CSS and Motion</p>
        </footer>
      </div>
    </section>
  );
}
