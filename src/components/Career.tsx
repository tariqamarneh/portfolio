"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { career, type Role } from "@/content/profile";

const AXIS_START = { y: 2019, m: 9 }; // Sep 2019
const now = new Date();
const NOW = { y: now.getFullYear(), m: now.getMonth() + 1 };

const toMonths = ({ y, m }: { y: number; m: number }) => y * 12 + (m - 1);
const parse = (s: string) => {
  const [y, m] = s.split("-").map(Number);
  return { y, m };
};
const AXIS_FROM = toMonths(AXIS_START);
const AXIS_SPAN = toMonths(NOW) + 1 - AXIS_FROM;

const monthName = (s: string) =>
  new Date(`${s}-01T00:00:00Z`).toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

function length(role: Role) {
  const months = toMonths(role.end ? parse(role.end) : NOW) - toMonths(parse(role.start)) + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y} yr`, m && `${m} mo`].filter(Boolean).join(" ");
}

function Row({
  role,
  open,
  onToggle,
}: {
  role: Role;
  open: boolean;
  onToggle: () => void;
}) {
  const startM = toMonths(parse(role.start)) - AXIS_FROM;
  const endM = toMonths(role.end ? parse(role.end) : NOW) + 1 - AXIS_FROM;
  const left = (startM / AXIS_SPAN) * 100;
  const width = ((endM - startM) / AXIS_SPAN) * 100;
  const study = role.kind === "study";
  // Watch the full-size track: the fill itself starts at scaleX(0), which has no area to observe.
  const trackRef = useRef<HTMLDivElement>(null);
  const seen = useInView(trackRef, { once: true, margin: "0px 0px -12% 0px" });

  return (
    <li className="border-b border-rule">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group relative grid w-full cursor-pointer gap-x-6 gap-y-3 py-5 text-left md:grid-cols-[minmax(0,300px)_minmax(0,1fr)_auto] md:items-center"
      >
        <div className="min-w-0 max-md:pr-14">
          <p className="text-lg leading-tight font-semibold transition-colors group-hover:text-signal">{role.org}</p>
          <p className="mt-0.5 text-sm text-muted">{role.title}</p>
        </div>
        <div>
          <div ref={trackRef} className="relative h-5">
            <div
              className={`absolute inset-y-0 overflow-hidden rounded-[5px] ${study ? "border border-dashed border-faint" : "bg-ink-3"}`}
              style={{ left: `${left}%`, width: `max(${width}%, 6px)` }}
            >
              {/* Each bar fills as its own row comes into view, so long expanded rows never leave it empty. */}
              <motion.div
                className="h-full origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: seen ? 1 : 0 }}
                transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
                style={{
                  background: study ? "color-mix(in oklab, var(--faint) 45%, transparent)" : "var(--signal)",
                }}
              />
            </div>
          </div>
          <p className="mt-2 font-mono text-xs text-faint" suppressHydrationWarning>
            {monthName(role.start)} – {role.end ? monthName(role.end) : "now"} · {length(role)}
          </p>
        </div>
        {/* Plus that becomes a minus: the row's visible "expand" cue, since touch screens have no hover. */}
        <span
          aria-hidden
          className="absolute top-5 right-0 grid size-10 place-items-center rounded-full border border-rule text-muted transition-colors group-hover:border-text group-hover:text-text group-aria-expanded:border-signal group-aria-expanded:text-signal md:static"
        >
          <span className="relative block size-3">
            <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 rounded-full bg-current" />
            <span className="absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 rounded-full bg-current transition-transform duration-300 group-aria-expanded:rotate-90" />
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.77, 0, 0.175, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-x-6 pb-8 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)_2.5rem]">
              <p className="text-sm text-faint">{role.place}</p>
              <div className="max-w-[68ch]">
                <p className="text-lg leading-snug text-text">{role.summary}</p>
                <ul className="mt-4 space-y-3 text-[16px] leading-relaxed text-muted">
                  {role.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-[0.65em] h-px w-3 shrink-0 bg-faint" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {role.tags.map((t) => (
                    <li key={t} className="rounded-full border border-rule px-3 py-1 font-mono text-xs text-muted">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Career() {
  const [open, setOpen] = useState<string | null>(career[career.length - 1].org);

  const years = Array.from({ length: NOW.y - AXIS_START.y }, (_, i) => AXIS_START.y + 1 + i);

  return (
    <section id="career" className="border-t border-rule py-24">
      <div className="mx-auto max-w-[1240px] gutter">
        <div className="grid gap-6 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] md:gap-x-6">
          <h2 className="wide text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
            Career
          </h2>
          <p className="max-w-[52ch] self-end text-lg leading-relaxed text-muted">
            From forecasting sales at a bank to running AI agents in production. Each bar is a role on the same
            timeline. Select one to see what I did there.
          </p>
        </div>

        <div className="relative mt-14">
          {/* Year axis */}
          <div className="grid gap-x-6 border-b border-rule pb-3 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
            <span className="hidden md:block" />
            <div className="relative h-4 font-mono text-[11px] text-faint">
              {years.map((y) => {
                const pos = ((toMonths({ y, m: 1 }) - AXIS_FROM) / AXIS_SPAN) * 100;
                return (
                  <span key={y} className="absolute -translate-x-1/2" style={{ left: `${pos}%` }}>
                    <span className={y % 2 ? "max-sm:hidden" : ""}>{y}</span>
                  </span>
                );
              })}
            </div>
          </div>

          <ul>
            {career.map((role) => (
              <Row
                key={role.org}
                role={role}
                open={open === role.org}
                onToggle={() => setOpen(open === role.org ? null : role.org)}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
