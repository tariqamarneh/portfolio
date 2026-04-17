'use client'

import React, { useEffect, useRef, ReactNode } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: 'ember' | 'amber' | 'sage' | 'gold'
}

const glowColorMap = {
  ember: { base: 20, spread: 40 },   // ember-500 hue
  amber: { base: 35, spread: 35 },
  sage:  { base: 140, spread: 60 },
  gold:  { base: 45, spread: 30 },
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'ember',
}) => {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e
      if (cardRef.current) {
        cardRef.current.style.setProperty('--x', x.toFixed(2))
        cardRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2))
        cardRef.current.style.setProperty('--y', y.toFixed(2))
        cardRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2))
      }
    }

    document.addEventListener('pointermove', syncPointer)
    return () => document.removeEventListener('pointermove', syncPointer)
  }, [])

  const { base, spread } = glowColorMap[glowColor]

  const styles: React.CSSProperties = {
    ['--base' as string]: base,
    ['--spread' as string]: spread,
    ['--radius' as string]: '14',
    ['--border' as string]: '1',
    ['--backdrop' as string]: 'hsl(30 8% 10% / 0.55)',
    ['--backup-border' as string]: 'hsl(30 12% 18% / 0.7)',
    ['--size' as string]: '260',
    ['--outer' as string]: '1',
    ['--border-size' as string]: 'calc(var(--border, 1) * 1px)',
    ['--spotlight-size' as string]: 'calc(var(--size, 150) * 1px)',
    ['--hue' as string]: 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 20) 100% 60% / var(--bg-spot-opacity, 0.08)), transparent
    )`,
    backgroundColor: 'var(--backdrop, transparent)',
    backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
    backgroundPosition: '50% 50%',
    backgroundAttachment: 'fixed',
    border: 'var(--border-size) solid var(--backup-border)',
    position: 'relative',
    touchAction: 'none',
  }

  const beforeAfterStyles = `
    [data-glow]::before,
    [data-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: calc(var(--border-size) * -1);
      border: var(--border-size) solid transparent;
      border-radius: calc(var(--radius) * 1px);
      background-attachment: fixed;
      background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
      background-repeat: no-repeat;
      background-position: 50% 50%;
      mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
    }
    [data-glow]::before {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 20) 100% 60% / var(--border-spot-opacity, 1)), transparent 100%
      );
      filter: brightness(1.6);
    }
    [data-glow]::after {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(0 0% 100% / var(--border-light-opacity, 0.8)), transparent 100%
      );
    }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      <div
        ref={cardRef}
        data-glow
        style={styles}
        className={`rounded-2xl relative shadow-[0_1rem_3rem_-1rem_rgba(0,0,0,0.6)] ${className}`}
      >
        {children}
      </div>
    </>
  )
}