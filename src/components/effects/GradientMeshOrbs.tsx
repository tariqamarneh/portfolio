'use client'

import React from 'react'

export default function GradientMeshOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Cyan orb - top left */}
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full animate-orb-1 opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.3), transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* Violet orb - top right */}
      <div
        className="absolute -top-20 -right-40 w-[600px] h-[600px] rounded-full animate-orb-2 opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* Fuchsia orb - bottom center */}
      <div
        className="absolute -bottom-40 left-1/4 w-[400px] h-[400px] rounded-full animate-orb-3 opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(217,70,239,0.2), transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* Small accent orb */}
      <div
        className="absolute top-1/3 right-1/4 w-[200px] h-[200px] rounded-full animate-orb-4 opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.2), rgba(139,92,246,0.1), transparent 70%)',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
