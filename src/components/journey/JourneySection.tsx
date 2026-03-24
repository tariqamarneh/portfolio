'use client'
import React from 'react'
import { motion } from 'framer-motion'
import InteractiveTimeline from './InteractiveTimeline'
import { useTheme } from '../general/GradientBackground'

const JourneySection: React.FC = () => {
  const { isDark } = useTheme()
  return (
    <section id="journey" className="section-padding relative">
      <div className="container mx-auto max-w-6xl flex flex-col items-center relative z-10">
        <motion.div
          initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
          whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="w-full text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            <span className={isDark ? 'gradient-text' : 'gradient-text-light'}>
              My Professional Journey
            </span>
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-full" />
          <p className={`mt-6 max-w-2xl mx-auto text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Explore my professional path and key milestones that have shaped my career in software development and technology.
          </p>
        </motion.div>

        <div className="w-full max-w-6xl relative">
          <InteractiveTimeline />
        </div>
      </div>
    </section>
  )
}

export default JourneySection
