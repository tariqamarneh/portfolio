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
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#04070d]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {/* Teal signal glow backdrop */}
            <div
              className="absolute inset-0 pointer-events-none opacity-50"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(76,220,202,0.12), transparent 55%)'
              }}
            />

            <div className="relative flex flex-col items-center gap-10">
              {/* Orbit loader — a dot circling the rising name */}
              <div className="relative">
                <motion.div
                  className="absolute -inset-10 sm:-inset-14"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  <motion.div
                    className="w-full h-full rounded-full border border-lumen-500/15"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                  >
                    <span className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-lumen-400 shadow-[0_0_12px_rgba(76,220,202,0.9)]" />
                  </motion.div>
                </motion.div>

                {/* Name animation */}
                <div className="flex overflow-hidden px-2">
                  {name.split('').map((letter, i) => (
                    <motion.span
                      key={i}
                      className={`font-display text-3xl sm:text-5xl md:text-6xl tracking-tight ${
                        letter === ' ' ? 'w-3 sm:w-5' : ''
                      }`}
                      style={{
                        background: 'linear-gradient(120deg, #e2e9f5 0%, #76e9d8 60%, #2fc9b9 100%)',
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
                      {letter === ' ' ? ' ' : letter}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Loading bar — hairline teal */}
              <motion.div
                className="relative w-40 h-px bg-abyss-700 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 bg-lumen-400"
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
