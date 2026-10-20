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
      <div className="mx-auto max-w-[1240px] gutter">
        <h1 className="wide text-[clamp(3rem,10.4vw,8rem)] leading-[0.9] font-extrabold tracking-[-0.045em]">
          {words.map((word, i) => (
            <span key={word} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                className="inline-block"
                initial={reduce ? false : { y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, ease, delay: 0.1 + i * 0.09 }}
              >
                {word}
                {i < words.length - 1 && "\u00a0"}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Who, where and before: the recruiter's first question, answered at the second size. */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
          className="mt-5 text-lg leading-snug font-medium text-pretty sm:mt-6 sm:text-2xl"
        >
          {/* One fact per line on phones, so no line starts with a separator. */}
          <span className="block sm:inline">
            {profile.role} at {profile.company}
          </span>
          <span className="text-muted">
            <span className="max-sm:hidden"> · </span>
            <span className="block sm:inline">{profile.location}</span>
            <span className="max-sm:hidden"> · </span>
            <span className="block sm:inline">Previously {profile.previously}</span>
          </span>
        </motion.p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.4 }}
            className="max-w-[54ch] text-lg leading-relaxed text-muted sm:text-xl"
          >
            {profile.intro}
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.48 }}
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
              download="Tariq-Amarneh-CV.pdf"
              className="press rounded-full border border-rule px-5 py-3 text-[15px] font-medium transition-colors hover:border-muted"
            >
              Download CV
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="press rounded-full py-3 text-[15px] font-medium text-muted underline max-sm:hidden sm:px-3 decoration-rule decoration-1 transition-colors hover:text-text hover:decoration-signal"
            >
              Email me
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.56 }}
          className="mt-14"
        >
          <LiveTrace />
          <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-faint">
            A replay of the kind of agent I build. The spans follow the real graph: a guard, a router, then the
            agent&apos;s own steps. Timings are shortened for the demo. Pick a conversation to watch it run.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
