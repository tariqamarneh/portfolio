'use client'

import React from 'react'
import { useTheme } from '../general/GradientBackground'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import Image from 'next/image'

// Single IntersectionObserver + CSS reveal — cheap alternative to framer-motion whileInView
function useReveal<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null)
  const [revealed, setRevealed] = React.useState(false)
  React.useEffect(() => {
    if (!ref.current || revealed) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && setRevealed(true)),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [revealed])
  return { ref, revealed }
}

/* ───────────────────────── OPENING ───────────────────────── */
function OpeningChapter() {
  const { isDark } = useTheme()
  const { ref, revealed } = useReveal<HTMLDivElement>()

  return (
    <div ref={ref} className="min-h-[80vh] flex items-center justify-center px-6 py-28">
      <div className="max-w-5xl mx-auto">
        <div
          className={`flex items-center gap-3 mb-6 justify-center transition-opacity duration-700 ${revealed ? 'opacity-100' : 'opacity-0'}`}
        >
          <span className="w-8 h-px bg-ember-500" />
          <span className="eyebrow">Chapter · 02 / Story</span>
        </div>

        <h2
          style={{
            fontVariationSettings: '"opsz" 144, "SOFT" 40',
            transitionDelay: revealed ? '100ms' : '0ms',
          }}
          className={`
            font-display leading-[0.95] tracking-tight text-center
            text-[clamp(2.4rem,7vw,5.5rem)]
            transition-all duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]
            ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
            ${isDark ? 'text-ink-100' : 'text-ink-950'}
          `}
        >
          Every line of code is
          <br />
          <span className="italic text-sun" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
            a decision made.
          </span>
        </h2>

        {/* Rule — pure CSS scale-X, no scroll tracking */}
        <div
          className={`h-px mx-auto mt-12 bg-gradient-to-r from-transparent via-ember-500 to-transparent origin-center
            transition-transform duration-[1400ms] ease-out
            ${revealed ? 'scale-x-100' : 'scale-x-0'}`}
          style={{ transitionDelay: revealed ? '350ms' : '0ms' }}
        />

        <p
          style={{ transitionDelay: revealed ? '450ms' : '0ms' }}
          className={`
            mt-12 text-lg md:text-xl leading-relaxed text-center max-w-2xl mx-auto
            transition-all duration-700
            ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            ${isDark ? 'text-ink-300' : 'text-ink-700'}
          `}
        >
          A journey of building, breaking, and rebuilding — this is how it
          started, and where it&apos;s going.
        </p>
      </div>
    </div>
  )
}

/* ───────────────────────── ORIGIN ───────────────────────── */
function OriginChapter() {
  const { isDark } = useTheme()
  const { ref, revealed } = useReveal<HTMLDivElement>()

  return (
    <div ref={ref} className="min-h-[80vh] flex items-center px-6 md:px-12 lg:px-20 py-24">
      <div className="w-full grid grid-cols-12 gap-8 md:gap-12 items-center max-w-7xl mx-auto">
        {/* Image — no scroll-driven parallax, just a clean reveal */}
        <div
          className={`col-span-12 md:col-span-6 h-[60vh] relative rounded-[2rem] overflow-hidden
            transition-all duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]
            ${revealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          <Image
            src="/images/my_photo.png"
            alt="Tariq Amarneh"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Warm wash */}
          <div className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-60"
            style={{ background: 'linear-gradient(135deg, rgba(255,173,128,0.35), transparent 55%)' }}
          />
          <div className={`absolute inset-0 pointer-events-none
            ${isDark ? 'bg-gradient-to-t from-ink-950/70 via-transparent' : 'bg-gradient-to-t from-paper-50/60 via-transparent'}`}
          />
        </div>

        {/* Text */}
        <div className="col-span-12 md:col-span-6">
          <div
            className={`flex items-center gap-3 mb-5 transition-opacity duration-700 ${revealed ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: revealed ? '150ms' : '0ms' }}
          >
            <span className="w-6 h-px bg-ember-500" />
            <span className="eyebrow">Where it started</span>
          </div>

          <h3
            style={{
              fontVariationSettings: '"opsz" 144, "SOFT" 40',
              transitionDelay: revealed ? '250ms' : '0ms',
            }}
            className={`
              font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] mb-6
              transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]
              ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              ${isDark ? 'text-ink-100' : 'text-ink-950'}
            `}
          >
            A data science grad <br />
            with a{' '}
            <span className="italic text-sun" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
              dream to build.
            </span>
          </h3>

          <p
            style={{ transitionDelay: revealed ? '400ms' : '0ms' }}
            className={`
              text-base md:text-lg leading-relaxed max-w-xl
              transition-all duration-700
              ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
              ${isDark ? 'text-ink-300' : 'text-ink-700'}
            `}
          >
            Armed with a degree, endless curiosity, and a laptop — I set out
            to turn ideas into shipped software. From ML experiments to
            production systems, every line has taught me something worth
            keeping.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── MILESTONES ───────────────────────── */
function MilestonesChapter() {
  const { isDark } = useTheme()
  const { journeyEvents } = usePortfolioData()
  const sorted = [...journeyEvents].sort((a, b) => a.date.localeCompare(b.date))

  if (sorted.length === 0) return null

  return <MilestonesInner isDark={isDark} sorted={sorted} />
}

function MilestonesInner({ isDark, sorted }: { isDark: boolean; sorted: ReturnType<typeof usePortfolioData>['journeyEvents'] }) {
  const { ref, revealed } = useReveal<HTMLDivElement>()

  return (
    <div ref={ref} className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-24">
      <div
        className={`text-center mb-14 max-w-2xl mx-auto transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]
          ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="flex items-center gap-3 mb-4 justify-center">
          <span className="w-6 h-px bg-ember-500" />
          <span className="eyebrow">Milestones</span>
        </div>
        <h3 className={`font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] ${isDark ? 'text-ink-100' : 'text-ink-950'}`}
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}>
          Moments that <br />
          <span className="italic text-sun" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
            shaped the path.
          </span>
        </h3>
      </div>

      <div className="relative max-w-3xl w-full">
        <div className={`absolute left-5 md:left-6 top-2 bottom-2 w-px ${isDark ? 'bg-ink-700' : 'bg-ink-800/15'}`} />

        <div className="space-y-10 md:space-y-12">
          {sorted.map((event, i) => (
            <div
              key={event.id}
              style={{ transitionDelay: revealed ? `${200 + i * 60}ms` : '0ms' }}
              className={`flex items-start gap-5 md:gap-7
                transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                ${revealed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
            >
              <div className="relative z-10 shrink-0">
                <div className={`
                  w-10 h-10 md:w-12 md:h-12 rounded-full
                  flex items-center justify-center
                  ${isDark ? 'bg-ink-900 border border-ember-500/50' : 'bg-paper-50 border border-ember-500/40'}
                  shadow-[0_0_30px_-8px_rgba(255,112,67,0.4)]
                `}>
                  <Image src={event.icon} width={22} height={22} alt="" className="object-contain" style={{ width: 'auto', height: 'auto' }} />
                </div>
              </div>

              <div className="pt-1 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember-500">
                    {event.date}
                  </span>
                  <span className={`h-px flex-1 ${isDark ? 'bg-ink-800' : 'bg-ink-800/10'}`} />
                </div>
                <h4 className={`font-display text-xl md:text-2xl mb-1 ${isDark ? 'text-ink-100' : 'text-ink-950'}`}
                  style={{ fontVariationSettings: '"opsz" 72, "SOFT" 30' }}>
                  {event.title}
                </h4>
                <p className={`text-sm md:text-base leading-relaxed ${isDark ? 'text-ink-400' : 'text-ink-700'}`}>
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── NOW ───────────────────────── */
function NowChapter() {
  const { isDark } = useTheme()
  const { ref, revealed } = useReveal<HTMLDivElement>()

  const pillars = [
    { title: 'Shipping at Scale',    desc: 'Writing systems at Amazon that run in production for millions.' },
    { title: 'Applied AI',           desc: 'Prototyping with LLMs — embedding intelligence where it earns its keep.' },
    { title: 'Craft over Ceremony',  desc: 'The best code looks obvious. Getting there takes everything else.' },
    { title: 'Day-One Mindset',      desc: 'Comfort is the enemy. Every morning is a chance to ship something better.' },
  ]

  return (
    <div ref={ref} className="min-h-[80vh] flex items-center justify-center px-6 py-28">
      <div className="w-full max-w-6xl mx-auto">
        <div
          className={`max-w-2xl mb-14 md:mb-16 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]
            ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-px bg-ember-500" />
            <span className="eyebrow">Right now</span>
          </div>
          <h3 className={`font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] mb-6 ${isDark ? 'text-ink-100' : 'text-ink-950'}`}
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}>
            What drives me <br />
            <span className="italic text-sun" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
              today.
            </span>
          </h3>
          <p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-ink-300' : 'text-ink-700'}`}>
            Software Development Engineer at Amazon — writing Java and Python,
            learning out loud, and shipping things I&apos;d be proud to show my future self.
          </p>
        </div>

        {/* Pillars — pure CSS stagger, no framer-motion overhead */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              style={{
                transitionDelay: revealed ? `${150 + i * 80}ms` : '0ms',
                willChange: revealed ? 'auto' : 'transform, opacity',
              }}
              className={`
                group relative p-6 md:p-8 rounded-2xl
                transition-[opacity,transform,border-color] duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]
                ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                ${isDark
                  ? 'bg-ink-900/50 border border-ink-700 hover:border-ember-500/40'
                  : 'bg-paper-50/70 border border-ink-800/10 hover:border-ember-500/40'}
              `}
            >
              <div className="flex items-start gap-4">
                <span className={`mt-1.5 shrink-0 font-mono text-[10px] tabular-nums ${isDark ? 'text-ember-400' : 'text-ember-600'}`}>
                  0{i + 1}
                </span>
                <div>
                  <h4 className={`font-display text-xl md:text-2xl mb-2 ${isDark ? 'text-ink-100' : 'text-ink-950'}`}
                    style={{ fontVariationSettings: '"opsz" 72, "SOFT" 30' }}>
                    {p.title}
                  </h4>
                  <p className={`text-sm md:text-base leading-relaxed ${isDark ? 'text-ink-400' : 'text-ink-700'}`}>
                    {p.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── MAIN ───────────────────────── */
export default function CinematicStory() {
  return (
    <section id="story">
      <OpeningChapter />
      <OriginChapter />
      <MilestonesChapter />
      <NowChapter />
    </section>
  )
}