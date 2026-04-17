'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const name = 'Tariq Amarneh'

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setShowSplash(false)
      return
    }
    const timer = setTimeout(() => setShowSplash(false), 2100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#0a0807]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {/* Warm ember glow backdrop */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(255,112,67,0.15), transparent 60%)'
              }}
            />

            <div className="relative flex flex-col items-center gap-8">
              {/* Name animation */}
              <div className="flex overflow-hidden">
                {name.split('').map((letter, i) => (
                  <motion.span
                    key={i}
                    className={`font-display text-4xl sm:text-6xl md:text-7xl ${
                      letter === ' ' ? 'w-4 sm:w-6' : ''
                    }`}
                    style={{
                      fontVariationSettings: '"opsz" 144, "SOFT" 60',
                      letterSpacing: '-0.025em',
                      background: 'linear-gradient(135deg, #f5ede0 0%, #ff7043 60%, #c64420 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.25 + i * 0.04,
                      ease: [0.2, 0.8, 0.2, 1],
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </div>

              {/* Loading bar — hairline ember */}
              <motion.div
                className="relative w-40 h-px bg-ink-800 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 bg-ember-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut' }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Children hydrate behind splash */}
      <div style={{ visibility: showSplash ? 'hidden' : 'visible' }}>
        {children}
      </div>
    </>
  )
}