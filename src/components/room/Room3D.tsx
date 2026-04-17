'use client'

import React, { useEffect, useState } from 'react'
import { SplineScene } from '@/components/ui/spline-scene'
import { Spotlight } from '@/components/ui/spotlight'
import { ContainerScrollReveal } from '@/components/ui/container-scroll'
import { useTheme } from '../general/GradientBackground'
import { Sparkles } from 'lucide-react'

/**
 * The "Studio" chapter — a scroll-triggered tilt reveal of an interactive
 * 3D Spline scene. On mobile we swap the live Spline scene for a lighter
 * static treatment — the 3D canvas tanks battery + perf on phones.
 */

function useIsSmallScreen() {
  const [small, setSmall] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = () => setSmall(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return small
}

// Decorative "scene" shown on mobile instead of the heavy Spline canvas.
const MobileScene: React.FC = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
    {/* Molten glow */}
    <div
      className="absolute inset-0 opacity-80"
      style={{
        background:
          'radial-gradient(ellipse 60% 60% at 50% 55%, rgba(255,157,92,0.35), transparent 65%), radial-gradient(ellipse 40% 40% at 30% 20%, rgba(255,112,67,0.18), transparent 70%)',
      }}
      aria-hidden
    />

    {/* Core orb */}
    <div className="relative flex flex-col items-center gap-4 px-6 text-center">
      <div
        className="relative w-32 h-32 rounded-full animate-float"
        style={{
          background:
            'radial-gradient(circle at 35% 30%, #ffd6b3 0%, #ff7043 40%, #8a2d0f 100%)',
          boxShadow:
            '0 30px 80px -10px rgba(255,112,67,0.5), inset -6px -8px 18px rgba(138,45,15,0.6), inset 4px 6px 18px rgba(255,214,179,0.6)',
        }}
      >
        <span className="absolute inset-0 rounded-full animate-pulse-soft ember-ring" />
      </div>
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ember-400">
        <Sparkles className="w-3 h-3" strokeWidth={2} />
        <span>Interactive on desktop</span>
      </div>
    </div>
  </div>
)

export default function Room3D() {
  const { isDark } = useTheme()
  const isSmallScreen = useIsSmallScreen()

  return (
    <section id="workspace" className="relative">
      <ContainerScrollReveal
        titleComponent={
          <div className="pb-6 md:pb-10 px-4">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <span className="w-8 h-px bg-ember-500" />
              <span className="eyebrow">Studio · Chapter 02</span>
              <span className="w-8 h-px bg-ember-500" />
            </div>
            <h2
              className={`font-display leading-[0.95] tracking-tight ${isDark ? 'text-ink-100' : 'text-ink-950'}`}
              style={{
                fontVariationSettings: '"opsz" 144, "SOFT" 40',
                fontSize: 'clamp(1.85rem, 6vw, 4.25rem)',
              }}
            >
              Built for{' '}
              <span className="italic text-sun" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                interaction.
              </span>
            </h2>
            <p className={`mt-4 text-sm md:text-lg max-w-xl mx-auto leading-relaxed ${isDark ? 'text-ink-300' : 'text-ink-700'}`}>
              {isSmallScreen
                ? 'A reminder that engineering is as much about feel as it is about logic.'
                : 'Drag the robot below. A small reminder that engineering is as much about feel as it is about logic.'}
            </p>
          </div>
        }
      >
        <div className="relative w-full h-full">
          {/* Spotlight overlay */}
          <Spotlight
            className="-top-20 left-0 md:left-40 md:-top-10"
            fill={isDark ? '#ffad80' : '#ff9d5c'}
          />

          {/* Mobile: lightweight static scene. Desktop: full Spline 3D. */}
          <div className="relative w-full h-full">
            {isSmallScreen ? (
              <MobileScene />
            ) : (
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            )}
          </div>

          {/* Tip badge — only on desktop where it applies */}
          {!isSmallScreen && (
            <div className="absolute bottom-3 left-3 md:bottom-5 md:left-5 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-950/70 border border-ink-700/70 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-ember-500 animate-pulse-soft" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-200">
                Drag to rotate
              </span>
            </div>
          )}
        </div>
      </ContainerScrollReveal>
    </section>
  )
}