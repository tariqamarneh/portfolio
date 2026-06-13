'use client'

import React from 'react'
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
  const { ref, revealed } = useReveal<HTMLDivElement>()

  return (
    <div ref={ref} className="min-h-[80vh] flex items-center justify-center px-6 py-28">
      <div className="max-w-5xl mx-auto">
        <div
          className={`flex items-center gap-3 mb-6 justify-center transition-opacity duration-700 ${revealed ? 'opacity-100' : 'opacity-0'}`}
        >
          <span className="w-8 h-px bg-lumen-400" />
          <span className="eyebrow">Chapter · 02 / Story</span>
        </div>

        <h2
          style={{ transitionDelay: revealed ? '100ms' : '0ms' }}
          className={`
            font-display leading-[1] tracking-tight text-center
            text-[clamp(2.2rem,6.5vw,5rem)]
            transition-all duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]
            ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
            text-abyss-100
          `}
        >
          Every line of code is
          <br />
          <span className="text-lumen">a decision made.</span>
        </h2>

        {/* Rule — pure CSS scale-X, no scroll tracking */}
        <div
          className={`h-px mx-auto mt-12 bg-gradient-to-r from-transparent via-lumen-400 to-transparent origin-center
            transition-transform duration-[1400ms] ease-out
            ${revealed ? 'scale-x-100' : 'scale-x-0'}`}
          style={{ transitionDelay: revealed ? '350ms' : '0ms' }}
        />

        <p
          style={{ transitionDelay: revealed ? '450ms' : '0ms' }}
          className={`
            mt-12 text-lg md:text-xl leading-relaxed text-center max-w-2xl mx-auto font-light
            transition-all duration-700
            ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            text-abyss-300
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
  const { ref, revealed } = useReveal<HTMLDivElement>()

  return (
    <div ref={ref} className="min-h-[80vh] flex items-center px-6 md:px-12 lg:px-20 py-24">
      <div className="w-full grid grid-cols-12 gap-8 md:gap-12 items-center max-w-7xl mx-auto">
        {/* Portrait — cool glow frame */}
        <div
          className={`col-span-12 md:col-span-6 h-[60vh] relative rounded-[2rem] overflow-hidden
            ring-1 ring-abyss-600/60
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
          {/* Cool teal wash */}
          <div className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-50"
            style={{ background: 'linear-gradient(135deg, rgba(118,233,216,0.3), transparent 55%)' }}
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-abyss-950/70 via-transparent" />
        </div>

        {/* Text */}
        <div className="col-span-12 md:col-span-6">
          <div
            className={`flex items-center gap-3 mb-5 transition-opacity duration-700 ${revealed ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: revealed ? '150ms' : '0ms' }}
          >
            <span className="w-6 h-px bg-lumen-400" />
            <span className="eyebrow">Where it started</span>
          </div>

          <h3
            style={{ transitionDelay: revealed ? '250ms' : '0ms' }}
            className={`
              font-display text-3xl sm:text-4xl md:text-5xl leading-[1.02] mb-6
              transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]
              ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              text-abyss-100
            `}
          >
            A data science grad <br />
            with a{' '}
            <span className="text-lumen">dream to build.</span>
          </h3>

          <p
            style={{ transitionDelay: revealed ? '400ms' : '0ms' }}
            className={`
              text-base md:text-lg leading-relaxed max-w-xl font-light
              transition-all duration-700
              ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
              text-abyss-300
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
  const { journeyEvents } = usePortfolioData()
  const sorted = [...journeyEvents].sort((a, b) => a.date.localeCompare(b.date))

  if (sorted.length === 0) return null

  return <MilestonesInner sorted={sorted} />
}

function MilestonesInner({ sorted }: { sorted: ReturnType<typeof usePortfolioData>['journeyEvents'] }) {
  const { ref, revealed } = useReveal<HTMLDivElement>()

  return (
    <div ref={ref} className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-24">
      <div
        className={`text-center mb-14 max-w-2xl mx-auto transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]
          ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="flex items-center gap-3 mb-4 justify-center">
          <span className="w-6 h-px bg-lumen-400" />
          <span className="eyebrow">Milestones</span>
        </div>
        <h3 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.02] text-abyss-100">
          Moments that <br />
          <span className="text-lumen">shaped the path.</span>
        </h3>
      </div>

      <div className="relative max-w-3xl w-full">
        {/* Flight path — faint gradient line */}
        <div className="absolute left-5 md:left-6 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-abyss-600 to-transparent" />

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
                <div className="
                  w-10 h-10 md:w-12 md:h-12 rounded-full
                  flex items-center justify-center
                  bg-abyss-800 border border-lumen-500/40
                  shadow-[0_0_30px_-8px_rgba(76,220,202,0.45)]
                ">
                  <Image src={event.icon} width={22} height={22} alt="" className="object-contain" style={{ width: 'auto', height: 'auto' }} />
                </div>
              </div>

              <div className="pt-1 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-lumen-400">
                    {event.date}
                  </span>
                  <span className="h-px flex-1 bg-abyss-700" />
                </div>
                <h4 className="font-display text-xl md:text-2xl mb-1 text-abyss-100">
                  {event.title}
                </h4>
                <p className="text-sm md:text-base leading-relaxed font-light text-abyss-400">
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
            <span className="w-6 h-px bg-lumen-400" />
            <span className="eyebrow">Right now</span>
          </div>
          <h3 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.02] mb-6 text-abyss-100">
            What drives me <br />
            <span className="text-lumen">today.</span>
          </h3>
          <p className="text-base md:text-lg leading-relaxed font-light text-abyss-300">
            Software Development Engineer at Amazon — writing Java and Python,
            learning out loud, and shipping things I&apos;d be proud to show my future self.
          </p>
        </div>

        {/* Pillars — glass cards, pure CSS stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              style={{
                transitionDelay: revealed ? `${150 + i * 80}ms` : '0ms',
                willChange: revealed ? 'auto' : 'transform, opacity',
              }}
              className={`
                group relative p-6 md:p-8 panel
                transition-[opacity,transform,border-color,box-shadow] duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]
                panel-hover
                ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
            >
              <div className="flex items-start gap-4">
                <span className="mt-1.5 shrink-0 font-mono text-[10px] tabular-nums text-lumen-400">
                  0{i + 1}
                </span>
                <div>
                  <h4 className="font-display text-xl md:text-2xl mb-2 text-abyss-100">
                    {p.title}
                  </h4>
                  <p className="text-sm md:text-base leading-relaxed font-light text-abyss-400">
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
