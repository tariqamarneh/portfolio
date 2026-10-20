"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { alsoShipped, work, type Work as WorkItem } from "@/content/profile";
import { WorkVisual } from "./WorkVisuals";

function CaseStudy({
  item,
  index,
  onActive,
  active,
  articleHref,
}: {
  item: WorkItem;
  index: number;
  onActive: (index: number) => void;
  active: boolean;
  articleHref?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const centered = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const seen = useInView(ref, { amount: 0.4, once: true });

  useEffect(() => {
    if (centered) onActive(index);
  }, [centered, onActive, index]);

  return (
    <article
      ref={ref}
      className={`py-12 transition-opacity duration-300 lg:min-h-[64vh] lg:py-[12vh] ${
        active ? "lg:opacity-100" : "lg:opacity-45"
      }`}
    >
      <h3 className="wide text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.05] font-bold tracking-[-0.03em] text-balance">
        {item.title}
      </h3>
      <p className="mt-3 text-sm text-muted">{item.where}</p>

      {/* Inline visual on small screens */}
      <div data-ui className="mt-8 rounded-2xl bg-ink-2 px-4 py-6 lg:hidden">
        <WorkVisual visual={item.visual} active={seen} />
      </div>

      <dl className="mt-8 grid max-w-[60ch] gap-5 text-[17px] leading-relaxed">
        <div>
          <dt className="text-sm text-faint">The problem</dt>
          <dd className="mt-1 text-muted">{item.problem}</dd>
        </div>
        <div>
          <dt className="text-sm text-faint">What I built</dt>
          <dd className="mt-1 text-muted">{item.built}</dd>
        </div>
        <div>
          <dt className="text-sm text-faint">Result</dt>
          <dd className="mt-1 text-xl leading-snug font-medium text-text">{item.result}</dd>
        </div>
      </dl>
      {articleHref && (
        <a
          href={articleHref}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-signal transition-opacity hover:opacity-80"
        >
          Read the write-up →
        </a>
      )}
      <ul className="mt-6 flex flex-wrap gap-2">
        {item.stack.map((s) => (
          <li key={s} className="rounded-full bg-ink-3 px-3 py-1 text-[13px] text-muted">
            {s}
          </li>
        ))}
      </ul>
    </article>
  );
}

/** `liveArticles`: slugs of published articles, passed from the server so article text stays out of this bundle. */
export function Work({ liveArticles = [] }: { liveArticles?: string[] }) {
  const [active, setActive] = useState(0);

  return (
    <section id="work">
      <div className="mx-auto max-w-[1240px] gutter">
        <div className="grid gap-x-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div>
            <h2 className="wide pt-28 text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
              Selected work
            </h2>
            <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-muted">
              Five problems I owned from design to production, with the numbers they moved.
            </p>
            {work.map((item, i) => (
              <CaseStudy
                key={item.id}
                item={item}
                active={active === i}
                index={i}
                onActive={setActive}
                articleHref={item.article && liveArticles.includes(item.article) ? `/writing/${item.article}` : undefined}
              />
            ))}
          </div>

          {/* Sticky visual on large screens */}
          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-dvh items-center py-24">
              <div data-ui className="relative aspect-[11/10] w-full overflow-hidden rounded-[24px] bg-ink-2 p-8">
                <div className="absolute top-5 left-8 flex gap-1.5" aria-hidden>
                  {work.map((w, i) => (
                    <span
                      key={w.id}
                      className={`h-1 rounded-full transition-[width,background-color] duration-300 ease-out ${
                        i === active ? "w-8 bg-signal" : "w-3 bg-rule"
                      }`}
                    />
                  ))}
                </div>
                {/* Old and new visuals overlap while they swap, so the panel is never blank between cases. */}
                <div className="relative h-full">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={work[active].id}
                      className="absolute inset-0 pt-6"
                      initial={{ opacity: 0, filter: "blur(4px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.2 } }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <WorkVisual visual={work[active].visual} active />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 lg:pt-8">
          <h3 className="wide text-2xl font-bold tracking-[-0.02em]">Also shipped</h3>
          <ul className="mt-8 grid gap-x-12 gap-y-4 sm:grid-cols-2">
            {alsoShipped.map((line) => (
              <li key={line} className="flex gap-3 text-[17px] leading-snug text-muted">
                <span className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-signal" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
