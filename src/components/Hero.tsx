"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { profile } from "@/content/profile";
import { LiveTrace } from "./LiveTrace";

const ease = [0.23, 1, 0.32, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const words = profile.name.split(" ");

  return (
    <section id="top" className="relative isolate pt-28 pb-20 sm:pt-32 lg:pb-28">
      <div className="grid-paper pointer-events-none absolute inset-0 -z-10" aria-hidden />

      <div className="mx-auto max-w-[1240px] gutter">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted"
        >
          <span>
            {profile.role} at <span className="text-text">{profile.company}</span>
          </span>
          <span>{profile.location}</span>
        </motion.p>

        <h1 className="wide mt-5 text-[clamp(3.4rem,10.4vw,9rem)] leading-[0.9] font-extrabold tracking-[-0.045em]">
          {words.map((word, i) => (
            <span key={word} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                className="inline-block"
                initial={reduce ? false : { y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, ease, delay: 0.15 + i * 0.09 }}
              >
                {word}
                {i < words.length - 1 && " "}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.45 }}
            className="max-w-[54ch] text-lg leading-relaxed text-muted sm:text-xl"
          >
            {profile.intro}
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.55 }}
            className="flex flex-wrap gap-3"
          >
            <a
              href="#work"
              className="press rounded-full bg-text px-5 py-3 text-[15px] font-medium text-ink transition-opacity hover:opacity-90"
            >
              See selected work
            </a>
            <a
              href={profile.cv}
              download="Tariq-Naser-CV.pdf"
              className="press rounded-full border border-rule px-5 py-3 text-[15px] font-medium transition-colors hover:border-muted"
            >
              Download CV
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="press rounded-full px-3 py-3 text-[15px] font-medium text-muted transition-colors hover:text-text"
            >
              Email me
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.6 }}
          className="mt-14"
        >
          <LiveTrace />
          <p className="mt-4 max-w-[70ch] text-sm leading-relaxed text-faint">
            A replay of the kind of agent I build. The spans follow the real graph: a guard, a router, then the
            agent&apos;s own steps. Timings are shortened for the demo. Pick a conversation to watch it run.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
