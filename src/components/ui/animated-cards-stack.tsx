'use client'

import * as React from 'react'
import {
  HTMLMotionProps,
  MotionValue,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Scroll-driven stacked card deck.
 * Cards stack with depth; as the user scrolls past the container, each card
 * rotates into place and then flies up and out — revealing the next.
 */

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>
}

const ContainerScrollContext = React.createContext<ContainerScrollContextValue | undefined>(undefined)

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext)
  if (!context) throw new Error('useContainerScrollContext must be used within a ContainerScroll')
  return context
}

export const ContainerScroll: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  style,
  className,
  ...props
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  // Aligns progress 0→1 exactly with the sticky's pinned duration —
  // keeps every card on-screen while animating (no dead scroll).
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  })

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn('relative min-h-svh w-full', className)}
        style={{ perspective: '1000px', ...style }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  )
}
ContainerScroll.displayName = 'ContainerScroll'

export const CardsContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{ perspective: '1000px', ...props.style }}
      {...props}
    >
      {children}
    </div>
  )
}
CardsContainer.displayName = 'CardsContainer'

interface CardStickyProps extends HTMLMotionProps<'div'> {
  arrayLength: number
  index: number
  incrementY?: number
  incrementZ?: number
  incrementRotation?: number
}

export const CardTransformed = React.forwardRef<HTMLDivElement, CardStickyProps>(
  (
    {
      arrayLength,
      index,
      incrementY = 10,
      incrementZ = 10,
      incrementRotation = -index + 90,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const { scrollYProgress } = useContainerScrollContext()

    const start = index / (arrayLength + 1)
    const end = (index + 1) / (arrayLength + 1)
    const range = React.useMemo(() => [start, end], [start, end])
    const rotateRange = [range[0] - 1.5, range[1] / 1.5]

    const y = useTransform(scrollYProgress, range, ['0%', '-180%'])
    const rotate = useTransform(scrollYProgress, rotateRange, [incrementRotation, 0])
    const transform = useMotionTemplate`translateZ(${
      index * incrementZ
    }px) translateY(${y}) rotate(${rotate}deg)`

    const cardStyle = {
      top: index * incrementY,
      transform,
      backfaceVisibility: 'hidden' as const,
      zIndex: (arrayLength - index) * incrementZ,
      ...style,
    }

    return (
      <motion.div
        layout="position"
        ref={ref}
        style={cardStyle}
        className={cn(
          'absolute will-change-transform flex size-full flex-col gap-6 rounded-2xl border p-6 backdrop-blur-md',
          className
        )}
        {...props}
      />
    )
  }
)
CardTransformed.displayName = 'CardTransformed'