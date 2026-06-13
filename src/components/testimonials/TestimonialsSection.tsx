'use client'

import React from 'react'
import { Quote } from 'lucide-react'
import { Linkedin } from '@/components/icons/BrandIcons'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import { StackingCards, StackingCard } from '@/components/ui/stacking-cards'

const TestimonialsSection: React.FC = () => {
  const { testimonials } = usePortfolioData()

  if (testimonials.length === 0) return null

  // Sticky header — stays pinned at top while cards stack below
  const header = (
    <div className="h-full w-full flex items-end pointer-events-none">
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-10 lg:px-12 pt-16 md:pt-20 pb-6 pointer-events-auto">
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-12 md:col-span-8">
            <div className="flex items-center gap-3 mb-2 md:mb-3">
              <span className="w-8 h-px bg-lumen-400" />
              <span className="eyebrow">Chapter · 05 / Words</span>
            </div>
            <h2
              className="font-display leading-[1.02] tracking-tight text-abyss-100"
              style={{ fontSize: 'clamp(1.75rem, 5vw, 3.5rem)' }}
            >
              Words from{' '}
              <span className="text-lumen">people I&apos;ve built with.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 flex md:justify-end">
            <p className="text-sm md:text-base leading-relaxed font-light text-abyss-400">
              {testimonials.length} voice{testimonials.length === 1 ? '' : 's'} — scroll to stack.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <section id="testimonials" className="relative">
      <StackingCards header={header}>
        {testimonials.map((t, index) => (
          <StackingCard key={t.id || index}>
            <article
              className="relative w-full rounded-3xl overflow-hidden p-5 sm:p-6 md:p-8 lg:p-10
                flex flex-col gap-4 sm:gap-5
                h-[min(68dvh,500px)] sm:h-[min(62dvh,520px)] md:h-[min(62dvh,540px)]
                shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)]
                bg-abyss-900/95 border border-abyss-600/60"
            >
              {/* Soft teal glow in the top-right */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(76,220,202,0.12), transparent 70%)' }}
              />

              {/* Top row — quote glyph + counter */}
              <div className="relative flex items-start justify-between shrink-0">
                <div className="w-10 h-10 rounded-full bg-lumen-400 flex items-center justify-center shadow-[0_8px_25px_-8px_rgba(76,220,202,0.6)]">
                  <Quote className="w-4 h-4 text-abyss-950" strokeWidth={2.5} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] tabular-nums text-abyss-500">
                  {String(index + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
                </span>
              </div>

              {/* Quote body — scrollable if long */}
              <div className="relative flex-1 min-h-0 overflow-y-auto pr-2 custom-scroll">
                <p className="text-base md:text-lg lg:text-xl leading-relaxed font-light text-abyss-200">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              {/* Attribution */}
              <div className="relative flex items-end justify-between gap-3 pt-4 border-t shrink-0 border-abyss-700/70">
                <div className="min-w-0 flex-1">
                  <h4 className="font-display text-xl md:text-2xl leading-tight truncate text-abyss-100">
                    {t.name}
                  </h4>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] mt-1 truncate text-abyss-400">
                    {t.role}{t.company ? ` · ${t.company}` : ''}
                  </p>
                </div>
                {t.linkedinUrl && (
                  <a
                    href={t.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t.name} on LinkedIn`}
                    className="shrink-0 p-2 rounded-full border transition-colors
                      border-abyss-700 text-abyss-300 hover:text-lumen-400 hover:border-lumen-500/40"
                  >
                    <Linkedin className="w-3.5 h-3.5" strokeWidth={1.8} />
                  </a>
                )}
              </div>
            </article>
          </StackingCard>
        ))}
      </StackingCards>
    </section>
  )
}

export default TestimonialsSection
