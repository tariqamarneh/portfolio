'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import ReactLenis from 'lenis/react'

/**
 * Site-wide Lenis smooth scrolling — one root instance for the whole page.
 * Gentle lerp keeps the glide calm; native behavior is preserved for
 * keyboard, reduced-motion users, and touch devices (Lenis falls back to
 * native momentum on touch by default).
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnabled(!prefersReduced)
  }, [])

  if (!enabled) return <>{children}</>

  return (
    <ReactLenis root options={{ lerp: 0.09, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
