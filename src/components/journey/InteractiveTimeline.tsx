'use client'

import React, { useMemo } from 'react'
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
          isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-600'
        }`}>
          {event.date}
        </span>

        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {event.title}
        </h3>

        <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {event.description}
        </p>
      </div>

      <div className={`relative flex items-center justify-center w-12 h-12 rounded-full ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } border-2 border-blue-500 shadow-md`}>
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

  // Sort events by date (newest first)
  const sortedEvents = useMemo(
    () => [...journeyEvents].sort((a, b) => b.date.localeCompare(a.date)),
    [journeyEvents]
  )

  if (sortedEvents.length === 0) {
    return null
  }

  return (
    <div className="relative py-4">
      {/* Timeline line */}
      <div className={`absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 ${
        isDark ? 'bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500' : 'bg-gradient-to-b from-blue-400 via-purple-400 to-blue-400'
      }`} />

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
