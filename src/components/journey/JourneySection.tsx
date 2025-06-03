'use client'
import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import InteractiveTimeline from './InteractiveTimeline'

const JourneySection: React.FC = () => {
  const { scrollYProgress } = useScroll()

  const opacity = useTransform(scrollYProgress,
    [0, 0.2, 0.8, 1],
    [1, 1, 0.8, 0]
  )

  const scale = useTransform(scrollYProgress,
    [0, 0.2, 0.8, 1],
    [1, 1, 0.95, 0.9]
  )

  return (
    <section id="journey" className="py-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <motion.div
        className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-500/10 to-transparent"
        style={{
          opacity,
          scale,
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-full h-96 bg-gradient-to-t from-purple-500/10 to-transparent"
        style={{
          opacity,
          scale,
        }}
      />

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-8 md:px-16 flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full text-center mb-16"
        >
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-5xl sm:text-6xl font-bold relative inline-block">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                My Professional Journey
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </h2>
          </motion.div>
          <motion.p
            className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Explore my professional path and key milestones that have shaped my career in software development and technology.
          </motion.p>
        </motion.div>

        <motion.div
          className="w-full max-w-6xl relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Decorative line effects */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/50 to-transparent" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-6 h-6 rounded-full bg-blue-500/30 blur-sm" />
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-6 h-6 rounded-full bg-purple-500/30 blur-sm" />

          <InteractiveTimeline />
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </section>
  )
}

export default JourneySection
