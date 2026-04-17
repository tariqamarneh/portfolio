'use client'

import React from 'react'
import { Quote, Linkedin } from 'lucide-react'
import { useTheme } from '../general/GradientBackground'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import { StackingCards, StackingCard } from '@/components/ui/stacking-cards'

const TestimonialsSection: React.FC = () => {
  const { isDark } = useTheme()
  const { testimonials } = usePortfolioData()

  if (testimonials.length === 0) return null

  // Sticky header — stays pinned at top while cards stack below
  const header = (
    <div
      className={`
        h-full w-full flex items-end
        bg-gradient-to-b from-ink-950 via-ink-950/95 to-transparent
        ${isDark ? '' : 'from-paper-50 via-paper-50/95'}
        pointer-events-none
      `}
    >
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-10 lg:px-12 pt-16 md:pt-20 pb-6 pointer-events-auto">
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-12 md:col-span-8">
            <div className="flex items-center gap-3 mb-2 md:mb-3">
              <span className="w-8 h-px bg-ember-500" />
              <span className="eyebrow">Chapter · 05 / Words</span>
            </div>
            <h2
              className={`font-display leading-[0.98] tracking-tight ${isDark ? 'text-ink-100' : 'text-ink-950'}`}
              style={{
                fontVariationSettings: '"opsz" 144, "SOFT" 40',
                fontSize: 'clamp(1.75rem, 5vw, 3.75rem)',
              }}
            >
              Words from{' '}
              <span
                className="italic text-sun"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                people I&apos;ve built with.
              </span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 flex md:justify-end">
            <p className={`text-sm md:text-base leading-relaxed ${isDark ? 'text-ink-400' : 'text-ink-600'}`}>
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
              className={`
                relative w-full rounded-3xl overflow-hidden p-5 sm:p-6 md:p-8 lg:p-10
                flex flex-col gap-4 sm:gap-5
                h-[min(68dvh,500px)] sm:h-[min(62dvh,520px)] md:h-[min(62dvh,540px)]
                shadow-[0_40px_90px_-30px_rgba(0,0,0,0.45)]
                ${isDark
                  ? 'bg-ink-900/95 border border-ink-700'
                  : 'bg-paper-50/95 border border-ink-800/10'}
              `}
            >
              {/* Soft ember glow in the top-right */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(255,112,67,0.14), transparent 70%)' }}
              />

              {/* Top row — quote glyph + counter */}
              <div className="relative flex items-start justify-between shrink-0">
                <div className="w-10 h-10 rounded-full bg-ember-500 flex items-center justify-center shadow-lg">
                  <Quote className="w-4 h-4 text-ink-950" strokeWidth={2.5} />
                </div>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] tabular-nums ${isDark ? 'text-ink-500' : 'text-ink-400'}`}
                >
                  {String(index + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
                </span>
              </div>

              {/* Quote body — scrollable if long */}
              <div className="relative flex-1 min-h-0 overflow-y-auto pr-2 custom-scroll">
                <p className={`text-base md:text-lg lg:text-xl leading-relaxed ${isDark ? 'text-ink-200' : 'text-ink-800'}`}>
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              {/* Attribution */}
              <div
                className={`relative flex items-end justify-between gap-3 pt-4 border-t shrink-0 ${isDark ? 'border-ink-700/70' : 'border-ink-800/10'}`}
              >
                <div className="min-w-0 flex-1">
                  <h4
                    className={`font-display text-xl md:text-2xl leading-tight truncate ${isDark ? 'text-ink-100' : 'text-ink-950'}`}
                    style={{ fontVariationSettings: '"opsz" 72, "SOFT" 30' }}
                  >
                    {t.name}
                  </h4>
                  <p
                    className={`font-mono text-[10px] uppercase tracking-[0.15em] mt-1 truncate ${isDark ? 'text-ink-400' : 'text-ink-500'}`}
                  >
                    {t.role}{t.company ? ` · ${t.company}` : ''}
                  </p>
                </div>
                {t.linkedinUrl && (
                  <a
                    href={t.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t.name} on LinkedIn`}
                    className={`
                      shrink-0 p-2 rounded-full border transition-colors
                      ${isDark
                        ? 'border-ink-700 text-ink-300 hover:text-ember-400 hover:border-ember-500/40'
                        : 'border-ink-800/10 text-ink-700 hover:text-ember-600 hover:border-ember-500/40'}
                    `}
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
