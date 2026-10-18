"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Work } from "@/content/profile";

const ease = [0.23, 1, 0.32, 1] as const;

function useDraw(active: boolean, delay = 0) {
  const reduce = useReducedMotion();
  return {
    initial: reduce ? false : { pathLength: 0, opacity: 0 },
    animate: active || reduce ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
    transition: { duration: 0.9, ease, delay },
  } as const;
}

function Node({
  x,
  y,
  w,
  label,
  active,
  delay,
  tone = "llm",
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  active: boolean;
  delay: number;
  tone?: "llm" | "tool" | "logic" | "end";
}) {
  const reduce = useReducedMotion();
  const stroke = {
    llm: "var(--signal)",
    tool: "var(--tool)",
    logic: "var(--logic)",
    end: "var(--ok)",
  }[tone];
  return (
    <motion.g
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={active || reduce ? { opacity: 1, y: 0 } : { opacity: 0.25, y: 0 }}
      transition={{ duration: 0.5, ease, delay }}
    >
      <rect x={x} y={y} width={w} height={34} rx={9} fill="var(--ink-2)" stroke={stroke} strokeWidth={1.25} />
      <text
        x={x + w / 2}
        y={y + 21.5}
        textAnchor="middle"
        className="fill-text font-mono"
        style={{ fontSize: 12 }}
      >
        {label}
      </text>
    </motion.g>
  );
}

function Edge({ d, active, delay }: { d: string; active: boolean; delay: number }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="var(--faint)"
      strokeWidth={1.25}
      markerEnd="url(#arrow)"
      {...useDraw(active, delay)}
    />
  );
}

function Arrow() {
  return (
    <defs>
      <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0 0 8 4 0 8z" fill="var(--faint)" />
      </marker>
    </defs>
  );
}

function GraphVisual({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 440 400" className="h-full w-full" role="img" aria-label="Agent graph: guard, capability router, adaptive loop, final review">
      <Arrow />
      <Node x={150} y={10} w={140} label="guard" active={active} delay={0} />
      <Edge d="M220 44 V72" active={active} delay={0.1} />
      <Node x={130} y={74} w={180} label="capability_router" active={active} delay={0.15} />
      <Edge d="M220 108 V140" active={active} delay={0.25} />

      <motion.rect
        x={20}
        y={142}
        width={400}
        height={170}
        rx={16}
        fill="var(--signal-soft)"
        stroke="var(--rule)"
        strokeDasharray="4 5"
        initial={false}
        animate={{ opacity: active ? 1 : 0.3 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
      <text x={36} y={164} className="fill-muted" style={{ fontSize: 11 }}>
        adaptive loop · driven by the business schema
      </text>
      <Node x={40} y={180} w={110} label="mentions" active={active} delay={0.35} />
      <Edge d="M150 197 H178" active={active} delay={0.45} />
      <Node x={180} y={180} w={90} label="resolve" active={active} delay={0.5} tone="tool" />
      <Edge d="M270 197 H298" active={active} delay={0.6} />
      <Node x={300} y={180} w={104} label="live_lookup" active={active} delay={0.65} tone="tool" />
      <Edge d="M352 214 V244" active={active} delay={0.75} />
      <Node x={300} y={246} w={104} label="confirm" active={active} delay={0.8} tone="logic" />
      <Edge d="M300 263 H272" active={active} delay={0.85} />
      <Node x={180} y={246} w={90} label="commit" active={active} delay={0.9} tone="tool" />
      <Edge d="M180 263 H152" active={active} delay={0.95} />
      <Node x={40} y={246} w={110} label="answer" active={active} delay={1} />

      <Edge d="M95 280 V320 Q95 340 115 340 H148" active={active} delay={1.05} />
      <Node x={150} y={324} w={140} label="final_review" active={active} delay={1.1} />
      <Edge d="M290 341 H328" active={active} delay={1.2} />
      <Node x={330} y={324} w={90} label="reply" active={active} delay={1.25} tone="end" />
    </svg>
  );
}

function LatencyVisual({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const max = 80;
  const pct = (s: number) => `${(s / max) * 100}%`;
  const rows = [
    { label: "Before", from: 50, to: 80, color: "var(--faint)" },
    { label: "After", from: 10, to: 40, color: "var(--signal)" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-10 px-2 sm:px-6">
      {rows.map((row, i) => (
        <div key={row.label}>
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-sm text-muted">{row.label}</span>
            <span className="wide text-2xl font-bold tabular-nums sm:text-3xl">
              {row.from}–{row.to}s
            </span>
          </div>
          <div className="relative h-10 rounded-lg bg-ink-3">
            <motion.div
              className="absolute inset-y-0 rounded-lg"
              style={{ background: row.color }}
              initial={reduce ? false : { left: pct(row.from), width: 0 }}
              animate={
                active || reduce
                  ? { left: pct(row.from), width: pct(row.to - row.from) }
                  : { left: pct(row.from), width: 0 }
              }
              transition={{ duration: 0.9, ease, delay: 0.15 + i * 0.25 }}
            />
          </div>
        </div>
      ))}
      <div className="relative h-5 font-mono text-[11px] text-faint">
        {[0, 20, 40, 60, 80].map((s) => (
          <span key={s} className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full" style={{ left: pct(s) }}>
            {s}s
          </span>
        ))}
      </div>
      <p className="text-sm text-muted">Response time per customer message, by query type.</p>
    </div>
  );
}

function CompileVisual({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const lines = [
    ["Ask the customer for ", "@order", ""],
    ["", "/get_order", " using @order"],
    ["If it was bought within 14 days, ", "", ""],
    ["   ask: exchange or refund?", "", ""],
    ["Otherwise, explain the policy", "", ""],
  ];
  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-5">
      <div className="rounded-xl border border-rule bg-ink-2 p-4 text-[13px] leading-7 sm:text-sm">
        <p className="mb-1 text-xs text-faint">Returns.procedure</p>
        {lines.map(([pre, chip, post], i) => (
          <motion.p
            key={i}
            className="whitespace-pre-wrap"
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={active || reduce ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 0 }}
            transition={{ duration: 0.4, ease, delay: i * 0.07 }}
          >
            {pre}
            {chip && (
              <span
                className={`rounded-md px-1.5 py-0.5 font-mono text-[12px] ${
                  chip.startsWith("@") ? "bg-signal-soft text-signal" : "bg-ink-3 text-tool"
                }`}
              >
                {chip}
              </span>
            )}
            {post.split(/(@\w+)/).map((part, j) =>
              part.startsWith("@") ? (
                <span key={j} className="rounded-md bg-signal-soft px-1.5 py-0.5 font-mono text-[12px] text-signal">
                  {part}
                </span>
              ) : (
                part
              ),
            )}
          </motion.p>
        ))}
      </div>
      <svg viewBox="0 0 440 210" className="h-full w-full" role="img" aria-label="Compiled control-flow graph">
        <Arrow />
        <Node x={10} y={20} w={96} label="ask" active={active} delay={0.45} tone="llm" />
        <Edge d="M106 37 H134" active={active} delay={0.55} />
        <Node x={136} y={20} w={110} label="get_order" active={active} delay={0.6} tone="tool" />
        <Edge d="M246 37 H274" active={active} delay={0.7} />
        <Node x={276} y={20} w={150} label="judge ≤ 14 days" active={active} delay={0.75} tone="llm" />
        <Edge d="M320 54 Q320 100 250 112" active={active} delay={0.85} />
        <Edge d="M390 54 V128" active={active} delay={0.85} />
        <text x={262} y={92} className="fill-ok" style={{ fontSize: 11 }}>yes</text>
        <text x={398} y={96} className="fill-muted" style={{ fontSize: 11 }}>no</text>
        <Node x={60} y={112} w={190} label="ask exchange / refund" active={active} delay={0.95} tone="llm" />
        <Node x={300} y={130} w={126} label="say policy" active={active} delay={0.95} tone="llm" />
      </svg>
    </div>
  );
}

function RetrievalVisual({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const metrics = [
    { label: "Retrieval accuracy", before: 1, after: 1.8, note: "+80%" },
    { label: "Average search time", before: 1, after: 0.35, note: "−65%" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-10 px-2 sm:px-6">
      {metrics.map((m, i) => (
        <div key={m.label}>
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-sm text-muted">{m.label}</span>
            <span className="wide text-2xl font-bold sm:text-3xl">{m.note}</span>
          </div>
          {[
            { v: m.before, color: "var(--faint)", label: "before" },
            { v: m.after, color: "var(--signal)", label: "semantic engine" },
          ].map((bar, j) => (
            <div key={bar.label} className="mb-2 flex items-center gap-3">
              <div className="h-3 flex-1 rounded-full bg-ink-3">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: bar.color }}
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: active || reduce ? `${(bar.v / 1.8) * 100}%` : 0 }}
                  transition={{ duration: 0.8, ease, delay: 0.1 + i * 0.2 + j * 0.1 }}
                />
              </div>
              <span className="w-28 text-right text-xs text-faint">{bar.label}</span>
            </div>
          ))}
        </div>
      ))}
      <p className="text-sm text-muted">Measured on NEOM&apos;s document library, used by 300,000+ people.</p>
    </div>
  );
}

function ScaleVisual({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const dots = 150;
  return (
    <div className="flex h-full flex-col justify-center gap-5 px-2 sm:px-6">
      <div className="grid grid-cols-15 gap-1.5 sm:gap-2" aria-hidden>
        {Array.from({ length: dots }, (_, i) => (
          <motion.span
            key={i}
            className="aspect-square rounded-full bg-signal"
            initial={reduce ? false : { opacity: 0.12, scale: 0.6 }}
            animate={active || reduce ? { opacity: 0.9, scale: 1 } : { opacity: 0.12, scale: 0.6 }}
            transition={{ duration: 0.3, ease, delay: active ? i * 0.006 : 0 }}
          />
        ))}
      </div>
      <p className="text-sm text-muted">
        Each dot is 100,000 items. 15M+ items in Turkey now ship with serial numbers on their invoices.
      </p>
    </div>
  );
}

export function WorkVisual({ visual, active }: { visual: Work["visual"]; active: boolean }) {
  switch (visual) {
    case "graph":
      return <GraphVisual active={active} />;
    case "latency":
      return <LatencyVisual active={active} />;
    case "compile":
      return <CompileVisual active={active} />;
    case "retrieval":
      return <RetrievalVisual active={active} />;
    case "scale":
      return <ScaleVisual active={active} />;
  }
}
