'use client'

import React, { useMemo, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
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

  const sortedEvents = useMemo(
    () => [...journeyEvents].sort((a, b) => b.date.localeCompare(a.date)),
    [journeyEvents]
  )

  // Scroll-linked progress for the glowing dot
  // "start center" = 0% when container top reaches viewport center
  // "end center" = 100% when container bottom reaches viewport center
  // This works regardless of how tall the container is
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 })
  const lineHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%'])

  if (sortedEvents.length === 0) {
    return null
  }

  return (
    <div ref={containerRef} className="relative py-4">
      {/* Timeline track (background) */}
      <div className={`absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 ${
        isDark ? 'bg-gray-800' : 'bg-gray-200'
      }`} />

      {/* Timeline filled portion (scroll-linked) */}
      <motion.div
        className="absolute left-1/2 top-0 w-0.5 -translate-x-1/2 origin-top"
        style={{
          height: lineHeight,
          background: isDark
            ? 'linear-gradient(180deg, #06b6d4, #8b5cf6, #d946ef)'
            : 'linear-gradient(180deg, #0891b2, #7c3aed, #c026d3)',
        }}
      >
        {/* Glowing dot at the bottom of filled line */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full"
          style={{
            background: '#06b6d4',
            boxShadow: '0 0 12px rgba(6,182,212,0.6), 0 0 30px rgba(139,92,246,0.3)',
          }}
        />
      </motion.div>

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
