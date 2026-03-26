'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTheme } from '../general/GradientBackground'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import Image from 'next/image'

// Shared animation presets
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
}

// ─── Opening: big statement ───

function OpeningChapter() {
  const { isDark } = useTheme()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.5], ['0%', '100%'])

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center px-6 py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={stagger}
        className="text-center max-w-4xl mx-auto"
      >
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className={`text-sm md:text-base uppercase tracking-[0.3em] mb-6 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}
        >
          The Story So Far
        </motion.p>
        <motion.h2
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className={`text-4xl sm:text-6xl md:text-7xl font-display font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          From Curiosity
          <br />
          <span className={isDark ? 'gradient-text' : 'gradient-text-light'}>
            to Creation
          </span>
        </motion.h2>
        <motion.div
          style={{ width: lineWidth }}
          className="h-0.5 mx-auto mt-8 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-full"
        />
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className={`mt-8 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
        >
          A journey of building, breaking, learning — and building again.
        </motion.p>
      </motion.div>
    </div>
  )
}

// ─── Origin: split layout with parallax image ───

function OriginChapter() {
  const { isDark } = useTheme()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const imgY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <div ref={ref} className="min-h-screen flex items-center px-6 md:px-16 lg:px-24 py-24">
      <div className="w-full flex flex-col md:flex-row items-center gap-10 md:gap-16 max-w-7xl mx-auto">
        {/* Image with parallax */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 h-[50vh] md:h-[70vh] relative rounded-2xl overflow-hidden shrink-0"
        >
          <motion.div style={{ y: imgY }} className="absolute inset-[-10%]">
            <Image
              src="/images/my_photo.png"
              alt="Tariq Amarneh"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-gray-950/70 via-transparent' : 'bg-gradient-to-t from-stone-50/70 via-transparent'}`} />
        </motion.div>

        {/* Text */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-15%' }}
          variants={stagger}
          className="w-full md:w-1/2 max-w-xl"
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className={`text-sm uppercase tracking-[0.2em] mb-4 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}
          >
            Where It Started
          </motion.p>
          <motion.h3
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className={`text-3xl md:text-5xl font-display font-bold mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            A Data Science
            <br />
            graduate with a
            <br />
            <span className={isDark ? 'text-cyan-400' : 'text-cyan-600'}>dream to build.</span>
          </motion.h3>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Armed with a degree, endless curiosity, and a laptop — I set out to turn ideas into reality.
            From experimenting with ML models to shipping production code, every line taught me something new.
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Milestones: scroll-triggered journey events ───

function MilestonesChapter() {
  const { isDark } = useTheme()
  const { journeyEvents } = usePortfolioData()
  const sorted = [...journeyEvents].sort((a, b) => a.date.localeCompare(b.date))

  if (sorted.length === 0) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={stagger}
        className="text-center mb-16"
      >
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className={`text-sm uppercase tracking-[0.2em] mb-3 ${isDark ? 'text-fuchsia-400' : 'text-fuchsia-600'}`}
        >
          Milestones
        </motion.p>
        <motion.h3
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className={`text-3xl md:text-5xl font-display font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          Key moments that
          <br />
          <span className={isDark ? 'gradient-text' : 'gradient-text-light'}>shaped the path</span>
        </motion.h3>
      </motion.div>

      <div className="relative max-w-3xl w-full">
        {/* Vertical line */}
        <div className={`absolute left-5 md:left-7 top-0 bottom-0 w-px ${isDark ? 'bg-gradient-to-b from-cyan-500/50 via-violet-500/50 to-fuchsia-500/50' : 'bg-gradient-to-b from-cyan-500/30 via-violet-500/30 to-fuchsia-500/30'}`} />

        <div className="space-y-10 md:space-y-12">
          {sorted.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="flex items-start gap-4 md:gap-6"
            >
              <div className="relative z-10 shrink-0">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 ${
                  isDark ? 'bg-gray-900 border-cyan-500' : 'bg-white border-cyan-500'
                } shadow-lg shadow-cyan-500/20`}>
                  <Image src={event.icon} width={24} height={24} alt="" className="object-contain" style={{ width: 'auto', height: 'auto' }} />
                </div>
              </div>
              <div className="pt-1">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  isDark ? 'bg-cyan-500/15 text-cyan-300' : 'bg-cyan-100 text-cyan-700'
                }`}>
                  {event.date}
                </span>
                <h4 className={`text-lg md:text-xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {event.title}
                </h4>
                <p className={`text-sm md:text-base mt-1 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {event.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Growth numbers ───

function GrowthChapter() {
  const { isDark } = useTheme()

  const stats = [
    { value: '2.3+', label: 'Years of Experience' },
    { value: '10+', label: 'Projects Shipped' },
    { value: '15+', label: 'Technologies' },
    { value: '∞', label: 'Curiosity' },
  ]

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={stagger}
        className="text-center max-w-5xl mx-auto"
      >
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className={`text-sm uppercase tracking-[0.2em] mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}
        >
          The Numbers
        </motion.p>
        <motion.h3
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className={`text-3xl md:text-5xl font-display font-bold mb-16 ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          Growth in
          <span className={isDark ? ' gradient-text' : ' gradient-text-light'}> every dimension</span>
        </motion.h3>

        <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, type: 'spring', stiffness: 200 }}
              className="flex flex-col items-center"
            >
              <span className={`text-5xl md:text-7xl font-display font-bold ${
                isDark ? 'gradient-text' : 'gradient-text-light'
              }`}>
                {stat.value}
              </span>
              <span className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

// ─── Now: what drives me today ───

function NowChapter() {
  const { isDark } = useTheme()

  const pillars = [
    { emoji: '⚡', title: 'Building at Scale', desc: 'Engineering systems at Amazon that serve millions' },
    { emoji: '🧠', title: 'AI & Innovation', desc: 'Pushing boundaries with ML and Generative AI' },
    { emoji: '🌍', title: 'Open Source', desc: 'Contributing back to the community that taught me' },
    { emoji: '☕', title: 'Never Stop Learning', desc: 'Every day is day one' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={stagger}
        className="text-center max-w-4xl mx-auto"
      >
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className={`text-sm uppercase tracking-[0.2em] mb-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}
        >
          Right Now
        </motion.p>
        <motion.h3
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className={`text-3xl md:text-5xl font-display font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          What drives me
          <span className={isDark ? ' gradient-text' : ' gradient-text-light'}> today</span>
        </motion.h3>
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className={`text-lg mb-12 max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
        >
          Software Development Engineer at Amazon, specializing in Java, Spring Boot, Python, and AI/ML.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 text-left">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`p-5 md:p-6 rounded-2xl border ${
                isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/60 border-stone-200/50'
              }`}
            >
              <span className="text-2xl mb-3 block">{p.emoji}</span>
              <h4 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {p.title}
              </h4>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ─── Main export ───

export default function CinematicStory() {
  return (
    <section id="story">
      <OpeningChapter />
      <OriginChapter />
      <MilestonesChapter />
      <GrowthChapter />
      <NowChapter />
    </section>
  )
}