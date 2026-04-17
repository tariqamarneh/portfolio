'use client'

import React from 'react'
import { useTheme } from '../general/GradientBackground'

/**
 * Quiet ambient backdrop — a single anchored ember glow and counter-light.
 * Aesthetic: subtle, premium, warm. Not a floating-orb cluster.
 */
export default function GradientMeshOrbs() {
  const { isDark } = useTheme()

  if (!isDark) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-[10%] right-[-15%] w-[700px] h-[700px] rounded-full animate-drift-1 opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(255,112,67,0.2), transparent 65%)' }}
        />
        <div
          className="absolute bottom-[-25%] left-[-10%] w-[600px] h-[600px] rounded-full animate-drift-2 opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(198,68,32,0.14), transparent 70%)' }}
        />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Dominant ember sun — bottom right */}
      <div
        className="absolute bottom-[-20%] right-[-15%] w-[700px] h-[700px] md:w-[1000px] md:h-[1000px] rounded-full animate-drift-1"
        style={{
          background: 'radial-gradient(circle, rgba(255,112,67,0.15) 0%, rgba(198,68,32,0.08) 35%, transparent 70%)',
        }}
      />
      {/* Counter-glow — top left */}
      <div
        className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full animate-drift-2"
        style={{
          background: 'radial-gradient(circle, rgba(255,173,128,0.08), transparent 65%)',
        }}
      />
    </div>
  )
}