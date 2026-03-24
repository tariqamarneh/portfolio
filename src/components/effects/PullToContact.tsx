'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Mail } from 'lucide-react'
import { useTheme } from '../general/GradientBackground'

const PULL_THRESHOLD = 80

export default function PullToContact() {
  const { isDark } = useTheme()
  const [progress, setProgress] = useState(0)
  const touchStartY = useRef(0)
  const atBottom = useRef(false)
  const pulling = useRef(false)
  const progressRef = useRef(0)

  useEffect(() => {
    if (!('ontouchstart' in window)) return

    const onTouchStart = (e: TouchEvent) => {
      const scrollBottom = window.innerHeight + window.scrollY
      const docHeight = document.documentElement.scrollHeight
      atBottom.current = scrollBottom >= docHeight - 10
      if (atBottom.current) {
        touchStartY.current = e.touches[0].clientY
        pulling.current = true
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!pulling.current || !atBottom.current) return
      // Positive delta = finger moving up = pulling past bottom
      const delta = touchStartY.current - e.touches[0].clientY
      if (delta > 10) {
        const p = Math.min(delta / PULL_THRESHOLD, 1)
        progressRef.current = p
        setProgress(p)
      } else {
        progressRef.current = 0
        setProgress(0)
      }
    }

    const onTouchEnd = () => {
      if (progressRef.current >= 1) {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
      }
      pulling.current = false
      progressRef.current = 0
      setProgress(0)
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  if (progress === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex flex-col items-center pb-6 md:hidden">
      {/* Pull indicator */}
      <div
        className={`
          flex items-center gap-2 px-5 py-2.5 rounded-full
          ${isDark ? 'bg-gray-900/90 text-gray-300' : 'bg-white/90 text-gray-700'}
          border ${isDark ? 'border-cyan-500/30' : 'border-cyan-400/30'}
          backdrop-blur-sm shadow-lg
          transition-transform duration-100
        `}
        style={{
          transform: `translateY(${(1 - progress) * 30}px)`,
          opacity: progress,
        }}
      >
        <Mail className="w-4 h-4 text-cyan-500" />
        <span className="text-sm font-medium">
          {progress >= 1 ? 'Release to contact' : 'Pull to contact'}
        </span>
        {/* Progress arc */}
        <svg width="20" height="20" viewBox="0 0 20 20" className="ml-1">
          <circle cx="10" cy="10" r="8" fill="none" stroke={isDark ? '#374151' : '#e5e7eb'} strokeWidth="2" />
          <circle
            cx="10" cy="10" r="8" fill="none"
            stroke="#06b6d4" strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${progress * 50.3} 50.3`}
            transform="rotate(-90 10 10)"
          />
        </svg>
      </div>
    </div>
  )
}
