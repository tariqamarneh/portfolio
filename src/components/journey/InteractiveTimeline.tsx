'use client'

import React, { useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from '../general/GradientBackground'
import { usePortfolioData, JourneyEvent } from '@/context/PortfolioDataContext'

const TimelineEventCard = React.memo<{
  event: JourneyEvent
  isLeft: boolean
  index: number
}>(({ event, isLeft, index }) => {
  const { isDark } = useTheme()

  return (
    <motion.div
      className={`mb-12 flex items-center ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className={`w-1/2 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
        <span className={`inline-block mb-2 px-3 py-1 rounded-full text-sm font-medium ${
          isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-600'
        }`}>
          {event.date}
        </span>

        <h3 className={`text-lg font-bold mb-2 font-display ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {event.title}
        </h3>

        <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {event.description}
        </p>
      </div>

      <div className={`relative flex items-center justify-center w-12 h-12 rounded-full ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } border-2 border-cyan-500 shadow-md z-10`}>
        <Image
          src={event.icon}
          width={28}
          height={28}
          alt={`${event.title} logo`}
          className="object-contain"
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>

      <div className="w-1/2" />
    </motion.div>
  )
})
TimelineEventCard.displayName = 'TimelineEventCard'

const InteractiveTimeline: React.FC = () => {
  const { isDark } = useTheme()
  const { journeyEvents } = usePortfolioData()
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  const sortedEvents = useMemo(
    () => [...journeyEvents].sort((a, b) => b.date.localeCompare(a.date)),
    [journeyEvents]
  )

  // Pure vanilla scroll handler with RAF throttle
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        if (!containerRef.current || !lineRef.current || !dotRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const h = containerRef.current.offsetHeight
        const vh = window.innerHeight
        const start = vh * 0.15
        const end = vh * 0.85
        const range = h - (end - start)
        if (range <= 0) return
        const progress = Math.min(Math.max((start - rect.top) / range, 0), 1)
        const pct = `${progress * 100}%`
        lineRef.current.style.height = pct
        dotRef.current.style.top = pct
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (sortedEvents.length === 0) {
    return null
  }

  return (
    <div ref={containerRef} className="relative py-4">
      {/* Timeline track (background) */}
      <div className={`absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 ${
        isDark ? 'bg-gray-800' : 'bg-gray-200'
      }`} />

      {/* Timeline filled portion */}
      <div
        ref={lineRef}
        className="absolute left-1/2 top-0 w-0.5 -translate-x-1/2"
        style={{
          height: '0%',
          background: isDark
            ? 'linear-gradient(180deg, #06b6d4, #8b5cf6, #d946ef)'
            : 'linear-gradient(180deg, #0891b2, #7c3aed, #c026d3)',
        }}
      />

      {/* Glowing dot */}
      <div
        ref={dotRef}
        className="absolute left-1/2 w-3 h-3 rounded-full z-[5] pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{
          top: '0%',
          background: '#06b6d4',
          boxShadow: '0 0 12px rgba(6,182,212,0.6), 0 0 30px rgba(139,92,246,0.3)',
        }}
      />

      {/* Timeline events */}
      {sortedEvents.map((event, index) => (
        <TimelineEventCard
          key={event.id}
          event={event}
          isLeft={index % 2 === 0}
          index={index}
        />
      ))}
    </div>
  )
}

export default InteractiveTimeline
