'use client'

import React, { useRef, ReactNode } from 'react'
import { motion, useScroll, useTransform, useMotionValue, MotionValue } from 'framer-motion'
import ReactLenis from 'lenis/react'

/**
 * Sticky stacking cards — each card pins below the header, and the next one
 * scrolls up to cover it. Covered cards scale down for a deck-of-cards depth.
 *
 * When `header` is passed, it pins at the top of the section and stays visible
 * while the cards stack below it. Cards sit in the middle of the viewport.
 */

export interface StackingCardsProps {
  children: ReactNode
  /** Optional sticky header shown above the stack (stays visible while scrolling) */
  header?: ReactNode
  className?: string
}

// Shared vertical rhythm — header height + card top-offset must match.
const HEADER_HEIGHT_VH = 22   // sticky header is 22vh tall
const CARD_TOP_VH      = 26   // cards stick just below the header (slight gap)

export const StackingCards: React.FC<StackingCardsProps> = ({ header, children, className = '' }) => {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  const items = React.Children.toArray(children).filter(React.isValidElement)
  const total = items.length

  return (
    <ReactLenis root>
      <main
        ref={container}
        className={`
          relative flex w-full flex-col items-center
          pb-[22vh] sm:pb-[24vh] lg:pb-[26vh]
          ${className}
        `}
      >
        {/* Sticky header — stays visible while the deck scrolls through */}
        {header && (
          <div
            className="sticky top-0 z-30 w-full"
            style={{ height: `${HEADER_HEIGHT_VH}vh` }}
          >
            {header}
          </div>
        )}

        {items.map((child, i) => {
          const targetScale = Math.max(0.72, 1 - (total - i - 1) * 0.06)
          return React.cloneElement(child as React.ReactElement, {
            i,
            progress: scrollYProgress,
            range: [i * 0.2, 1] as [number, number],
            targetScale,
            stickyTopVh: header ? CARD_TOP_VH : 2,
            key: (child as React.ReactElement).key ?? `stack-${i}`,
          })
        })}
      </main>
    </ReactLenis>
  )
}

export interface StackingCardProps {
  children: ReactNode
  /** Injected by <StackingCards> — do not pass manually */
  i?: number
  progress?: MotionValue<number>
  range?: [number, number]
  targetScale?: number
  /** Where the card pins vertically (vh). Injected by the parent. */
  stickyTopVh?: number
  className?: string
}

export const StackingCard: React.FC<StackingCardProps> = ({
  children,
  i = 0,
  progress,
  range = [0, 1],
  targetScale = 1,
  stickyTopVh = 2,
  className = '',
}) => {
  const fallback = useMotionValue(0)
  const scaleMV = useTransform(progress ?? fallback, range, [1, targetScale])

  return (
    <div
      className="sticky flex items-start justify-center px-4 sm:px-6 lg:px-10 w-full"
      style={{ top: `${stickyTopVh}vh` }}
    >
      <motion.div
        style={{
          scale: scaleMV,
          // Small per-card offset so stacked-deck edges peek above the current card
          marginTop: `${i * 14}px`,
        }}
        className={`
          flex origin-top flex-col overflow-hidden
          w-full max-w-[360px] sm:max-w-[560px] md:max-w-[720px] lg:max-w-[900px]
          ${className}
        `}
      >
        {children}
      </motion.div>
    </div>
  )
}