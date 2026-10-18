"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useCallback, useEffect, useRef, useState } from "react";
import { scenarios, type TraceScenario, type TraceSpan } from "@/content/profile";

const LEAD_IN = 900; // customer bubble settles before the trace starts
const TYPING = 700; // "typing" before the reply lands
const AUTO_ADVANCE = 6500; // pause on a finished run before the next scenario

const kindColor: Record<TraceSpan["kind"], string> = {
  llm: "var(--signal)",
  tool: "var(--tool)",
  logic: "var(--logic)",
};

function totalOf(scenario: TraceScenario) {
  return Math.max(...scenario.spans.map((s) => s.start + s.duration));
}

function seconds(ms: number) {
  return `${(ms / 1000).toFixed(2)}s`;
}

function Bubble({
  side,
  text,
  dir,
  gloss,
}: {
  side: "in" | "out";
  text: string;
  dir: "rtl" | "ltr";
  gloss?: string;
}) {
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
      style={{ transformOrigin: side === "in" ? "bottom left" : "bottom right" }}
      className={`max-w-[88%] ${side === "in" ? "self-start" : "self-end"}`}
    >
      <div
        dir={dir}
        className={`rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed ${
          side === "in"
            ? "rounded-bl-md border border-rule bg-bubble-in"
            : "rounded-br-md bg-bubble-out"
        } ${dir === "rtl" ? "font-arabic" : ""}`}
      >
        {text}
      </div>
      {gloss && (
        <p className={`mt-1.5 px-1 text-xs leading-snug text-faint ${side === "out" ? "text-right" : ""}`}>
          {gloss}
        </p>
      )}
    </motion.div>
  );
}

function Typing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      className="flex gap-1 self-end rounded-2xl rounded-br-md bg-bubble-out px-4 py-3.5"
      aria-label="Agent is typing"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-pulse rounded-full bg-muted"
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </motion.div>
  );
}

export function LiveTrace() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.12 });

  const [index, setIndex] = useState(0);
  const [elapsed, setElapsedState] = useState(0);
  const elapsedRef = useRef(0);
  const setElapsed = useCallback((ms: number) => {
    elapsedRef.current = ms;
    setElapsedState(ms);
  }, []);
  const [userPicked, setUserPicked] = useState(false);
  const [runKey, setRunKey] = useState(0);

  const scenario = scenarios[index];
  const total = totalOf(scenario);
  // Reduced motion shows every run already finished.
  const traceTime = reduce ? total + TYPING : Math.max(0, elapsed - LEAD_IN);
  const finished = traceTime >= total + TYPING;
  const tick = Math.ceil(total / 1000);

  // Advance the clock with rAF while the panel is on screen.
  useEffect(() => {
    if (reduce || !inView) return;
    const end = LEAD_IN + total + TYPING;
    let frame = 0;
    let last = performance.now();
    const step = (now: number) => {
      elapsedRef.current = Math.min(end, elapsedRef.current + (now - last));
      last = now;
      setElapsed(elapsedRef.current);
      if (elapsedRef.current < end) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, total, runKey, setElapsed]);

  // Cycle scenarios until the visitor picks one.
  useEffect(() => {
    if (userPicked || reduce || !finished || !inView) return;
    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % scenarios.length);
      setElapsed(0);
      setRunKey((k) => k + 1);
    }, AUTO_ADVANCE);
    return () => clearTimeout(id);
  }, [finished, userPicked, reduce, inView, setElapsed]);

  const pick = useCallback(
    (i: number) => {
      setUserPicked(true);
      setIndex(i);
      setElapsed(0);
      setRunKey((k) => k + 1);
    },
    [setElapsed],
  );

  const showTyping = traceTime >= total && !finished;

  return (
    <div
      ref={rootRef}
      className="overflow-hidden rounded-[20px] border border-rule bg-ink-2 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.6)]"
    >
      {/* Scenario picker */}
      <div className="flex items-center justify-between gap-2 border-b border-rule px-3 py-3 sm:px-5">
        <div role="tablist" aria-label="Demo conversation" className="flex min-w-0 gap-0.5 overflow-x-auto rounded-full bg-ink-3 p-1 [scrollbar-width:none] sm:gap-1">
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === index}
              onClick={() => pick(i)}
              className={`press relative shrink-0 rounded-full px-3.5 py-3 text-[13px] leading-none font-medium whitespace-nowrap transition-colors sm:px-3.5 sm:text-[13px] ${
                i === index ? "text-ink" : "text-muted hover:text-text"
              }`}
            >
              {i === index && (
                <motion.span
                  layoutId="scenario-pill"
                  className="absolute inset-0 rounded-full bg-text"
                  transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                />
              )}
              <span className="relative max-sm:hidden">{s.label}</span>
              <span className="relative sm:hidden">{s.short}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => pick(index)}
          aria-label="Replay"
          className="press flex size-11 shrink-0 items-center justify-center gap-2 rounded-full font-mono sm:h-11 sm:w-auto sm:px-3 text-xs text-muted transition-colors hover:text-text"
        >
          <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
            <path d="M13 8a5 5 0 1 1-1.46-3.54M13 2.5v2.5h-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="max-sm:hidden">Replay</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Conversation */}
        <div className="flex min-h-[260px] flex-col gap-3 border-b border-rule p-4 sm:p-5 lg:min-h-[380px] lg:border-r lg:border-b-0">
          <p className="text-xs text-faint">WhatsApp conversation</p>
          <div className="flex flex-1 flex-col justify-start gap-3" aria-live="polite">
            <AnimatePresence mode="popLayout">
              <Bubble key={`${scenario.id}-${runKey}-in`} side="in" {...scenario.customer} />
              {showTyping && <Typing key="typing" />}
              {finished && <Bubble key={`${scenario.id}-${runKey}-out`} side="out" {...scenario.reply} />}
            </AnimatePresence>
          </div>
          {/* Decorative WhatsApp-style composer: anchors the chat and fills the column under short threads. */}
          <div className="mt-2 flex items-center gap-2" aria-hidden>
            <div className="flex h-10 flex-1 items-center rounded-full border border-rule bg-ink px-4 text-sm text-faint">
              Type a message
            </div>
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-signal-soft text-signal">
              <svg viewBox="0 0 16 16" className="size-4">
                <path d="M2.5 8h9M8 3.5 12.5 8 8 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Trace waterfall */}
        <div className="p-4 sm:p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <p className="text-xs text-faint">Agent trace</p>
            <p className="font-mono text-xs tabular-nums text-muted">
              {traceTime >= total ? (
                <span className="text-ok">completed in {seconds(total)}</span>
              ) : (
                seconds(traceTime)
              )}
            </p>
          </div>

          <div className="font-mono text-[12px]">
            {/* time axis */}
            <div className="grid grid-cols-[116px_1fr_44px] items-end gap-3 pb-1.5 sm:grid-cols-[176px_1fr_52px]">
              <span />
              <div className="relative h-4">
                {Array.from({ length: tick + 1 }, (_, i) => (
                  <span
                    key={i}
                    className={`absolute -translate-x-1/2 text-[10px] text-faint first:translate-x-0 ${i % 2 ? "max-sm:hidden" : ""}`}
                    style={{ left: `${((i * 1000) / (tick * 1000)) * 100}%` }}
                  >
                    {i}s
                  </span>
                ))}
              </div>
              <span />
            </div>

            <ul className="relative">
              {scenario.spans.map((span, i) => {
                const started = traceTime >= span.start;
                const progress = Math.min(1, Math.max(0, (traceTime - span.start) / span.duration));
                const left = (span.start / (tick * 1000)) * 100;
                const width = (span.duration / (tick * 1000)) * 100;
                return (
                  <li
                    key={`${scenario.id}-${i}`}
                    className="grid grid-cols-[116px_1fr_44px] items-center gap-3 py-[5px] transition-opacity duration-300 sm:grid-cols-[176px_1fr_52px]"
                    style={{ opacity: started ? 1 : 0.28 }}
                  >
                    <div
                      className="min-w-0 [--indent:7px] sm:[--indent:12px]"
                      style={{ paddingLeft: `calc(${span.depth} * var(--indent))` }}
                    >
                      <p className="leading-snug text-text [overflow-wrap:anywhere] max-sm:text-[10.5px]">
                        {/* No-break space keeps the tree mark on the same line as the name. */}
                        {span.depth > 0 && <span className="text-faint">└\u00a0</span>}
                        {span.name}
                      </p>
                      <p className="hidden truncate text-[10.5px] text-faint sm:block">{span.detail}</p>
                    </div>
                    <div className="relative h-3.5 rounded-sm bg-ink-3/60">
                      <div
                        className="absolute inset-y-0 rounded-sm"
                        style={{
                          left: `${left}%`,
                          width: `${width * progress}%`,
                          background: kindColor[span.kind],
                          opacity: progress < 1 ? 0.95 : 0.8,
                        }}
                      />
                    </div>
                    <span className="text-right tabular-nums text-muted">
                      {started ? `${Math.round(span.duration * progress)}ms` : ""}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-rule pt-3 text-[11px] text-muted">
              {(
                [
                  ["llm", "LLM call"],
                  ["tool", "Tool / API"],
                  ["logic", "Graph logic"],
                ] as const
              ).map(([kind, label]) => (
                <span key={kind} className="flex items-center gap-1.5">
                  <span className="size-2 rounded-[2px]" style={{ background: kindColor[kind] }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
