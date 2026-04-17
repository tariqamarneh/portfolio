'use client'

import React, { useRef, ReactNode } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ScrollExpandMediaProps {
  mediaSrc: string
  bgImageSrc: string
  title?: string
  date?: string
  scrollToExpand?: string
  children?: ReactNode
}

/**
 * Cinematic scroll-to-expand media — scroll-linked via useScroll + sticky.
 * Plays nicely inside a scrolling page (no window event hijacking).
 *
 * Layout:
 *   <section>
 *     <div ref={runwayRef} style="height:260vh">   ← scroll progress 0→1
 *       <div class="sticky top-0 h-screen">
 *         bg image, expanding media frame, split title
 *       </div>
 *     </div>
 *     <div>{children}</div>  ← flows naturally below, any height
 *   </section>
 */
const ScrollExpandMedia: React.FC<ScrollExpandMediaProps> = ({
  mediaSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  children,
}) => {
  const runwayRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  })

  // Expand media from small preview → near-fullscreen as progress 0 → 0.75
  const mediaWidth = useTransform(scrollYProgress, [0, 0.75], ['min(420px, 88vw)', '100vw'])
  const mediaHeight = useTransform(scrollYProgress, [0, 0.75], ['320px', '100vh'])
  const mediaRadius = useTransform(scrollYProgress, [0, 0.75], [24, 0])
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [0.9, 0])
  const darkOverlay = useTransform(scrollYProgress, [0, 0.75], [0.55, 0.15])

  // Title halves pull apart
  const leftX = useTransform(scrollYProgress, [0, 0.75], ['0vw', '-40vw'])
  const rightX = useTransform(scrollYProgress, [0, 0.75], ['0vw', '40vw'])
  const titleOpacity = useTransform(scrollYProgress, [0.6, 0.82], [1, 0])

  // Scroll hint fades out quickly
  const hintOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  const firstWord = title ? title.split(' ')[0] : ''
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : ''

  return (
    <section className="relative">
      {/* Scroll runway — provides the scroll distance for the animation */}
      <div ref={runwayRef} className="relative" style={{ height: '260vh' }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Background image — fades out */}
          <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 z-0">
            <Image
              src={bgImageSrc}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
            <motion.div
              style={{ opacity: darkOverlay }}
              className="absolute inset-0 bg-ink-950"
            />
          </motion.div>

          {/* Expanding media frame */}
          <motion.div
            style={{
              width: mediaWidth,
              height: mediaHeight,
              borderRadius: mediaRadius,
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
          >
            <Image
              src={mediaSrc}
              alt={title || 'Featured'}
              fill
              sizes="100vw"
              className="object-cover object-top"
            />
            {/* Subtle warm wash */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30 mix-blend-soft-light"
              style={{ background: 'linear-gradient(135deg, rgba(255,173,128,0.4), transparent 55%)' }}
            />
          </motion.div>

          {/* Split title overlay */}
          <motion.div
            style={{ opacity: titleOpacity }}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-4"
          >
            <div className="flex items-center gap-3 md:gap-6 lg:gap-8 flex-wrap justify-center">
              <motion.h2
                style={{
                  x: leftX,
                  fontVariationSettings: '"opsz" 144, "SOFT" 40',
                }}
                className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] leading-none text-ink-100 drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
              >
                {firstWord}
              </motion.h2>
              <motion.h2
                style={{
                  x: rightX,
                  fontVariationSettings: '"opsz" 144, "SOFT" 100',
                }}
                className="font-display italic text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] leading-none text-sun drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
              >
                {restOfTitle}
              </motion.h2>
            </div>
          </motion.div>

          {/* Date + scroll hint */}
          <motion.div
            style={{ opacity: hintOpacity }}
            className="absolute inset-x-0 bottom-8 z-30 flex flex-col items-center gap-2 pointer-events-none"
          >
            {date && (
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ember-400">
                {date}
              </p>
            )}
            {scrollToExpand && (
              <div className="flex items-center gap-2">
                <span className="w-6 h-px bg-ember-500" />
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ember-400">
                  {scrollToExpand}
                </p>
                <span className="w-6 h-px bg-ember-500" />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Children — revealed below the sticky stage, natural height */}
      {children && (
        <div className="relative z-10 px-6 md:px-10 lg:px-12 py-16 md:py-24 bg-ink-950">
          {children}
        </div>
      )}
    </section>
  )
}

export default ScrollExpandMedia