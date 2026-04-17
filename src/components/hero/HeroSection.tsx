'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import React, { useState, useRef, useEffect } from 'react'
import { ArrowDown, ArrowRight, Github, Linkedin, MapPin } from 'lucide-react'
import ContactModal from '../contact/ContactModal'
import { useTheme } from '../general/GradientBackground'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import { useTypingEffect } from '@/hooks/useTypingEffect'
import { Spotlight } from '@/components/ui/spotlight'
import { ElegantShape } from '@/components/ui/elegant-shape'

const roles = [
  'Software Development Engineer',
  'Applied AI Practitioner',
  'Full-Stack Builder',
]

// Subtle magnetic hover for social icons — premium feel, doesn't get in the way
const MagneticIcon: React.FC<{
  children: React.ReactNode
  href: string
  ariaLabel: string
  className: string
}> = ({ children, href, ariaLabel, className }) => {
  const iconRef = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 250, damping: 20 })
  const springY = useSpring(y, { stiffness: 250, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!iconRef.current) return
      const rect = iconRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distX = e.clientX - centerX
      const distY = e.clientY - centerY
      const distance = Math.sqrt(distX * distX + distY * distY)
      const threshold = 90

      if (distance < threshold) {
        const strength = (1 - distance / threshold) * 0.35
        x.set(distX * strength)
        y.set(distY * strength)
      } else {
        x.set(0); y.set(0)
      }
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [x, y])

  return (
    <motion.a
      ref={iconRef}
      style={{ x: springX, y: springY }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </motion.a>
  )
}

export default function HeroSection() {
  const { isDark } = useTheme()
  const { cvUrl } = usePortfolioData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { displayText } = useTypingEffect({ roles, typingSpeed: 65, deletingSpeed: 30, pauseDuration: 2200 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const yOffset = useTransform(scrollYProgress, [0, 0.5], [0, 60])

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity }}
      id="home"
      className="min-h-dvh relative overflow-hidden flex items-center"
      role="region"
      aria-label="Introduction"
    >
      {/* Spotlight — the signature premium effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill={isDark ? '#ffad80' : '#ff7043'}
      />

      {/* Floating geometric shapes — premium atmospheric backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-ember-500/[0.18]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-ember-700/[0.15]"
          className="right-[-5%] md:right-[0%] top-[65%] md:top-[70%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-ember-400/[0.12]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={180}
          height={55}
          rotate={20}
          gradient="from-ember-300/[0.12]"
          className="right-[15%] md:right-[20%] top-[8%] md:top-[12%]"
        />
      </div>

      {/* Soft ember glow bottom-right */}
      <div
        className="absolute bottom-[-30%] right-[-15%] w-[700px] h-[700px] rounded-full animate-drift-1 pointer-events-none"
        aria-hidden="true"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(255,112,67,0.12), transparent 65%)'
            : 'radial-gradient(circle, rgba(255,112,67,0.1), transparent 65%)'
        }}
      />

      <motion.div
        style={{ y: yOffset }}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-24 pb-16 sm:pt-32 sm:pb-24"
      >
        <div className="grid grid-cols-12 gap-8 md:gap-10 items-center">
          {/* Copy — 7 cols on desktop */}
          <div className="col-span-12 lg:col-span-7 lg:col-start-1 order-2 lg:order-1">
            {/* Small status pill */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`
                inline-flex items-center gap-2.5 mb-8 sm:mb-10
                px-3.5 py-1.5 rounded-full
                ${isDark ? 'bg-ink-800/70 border border-ink-700' : 'bg-paper-100/80 border border-ink-800/10'}
              `}
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-ember-500 animate-ping opacity-60" />
                <span className="relative rounded-full bg-ember-500 w-2 h-2" />
              </span>
              <span className={`font-mono text-[11px] tracking-[0.15em] uppercase ${isDark ? 'text-ink-300' : 'text-ink-700'}`}>
                Available for work
              </span>
            </motion.div>

            {/* Name — the centerpiece. Big, readable, one clear gradient accent */}
            <h1 className={`font-display leading-[0.9] tracking-tight mb-6 sm:mb-8 text-[clamp(2.8rem,9vw,7.5rem)] ${isDark ? 'text-ink-100' : 'text-ink-950'}`}
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                className="block"
              >
                Tariq
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                className="block italic text-sun"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                Amarneh.
              </motion.span>
            </h1>

            {/* One-line role — clean, uncluttered */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="mb-6"
            >
              <p className={`text-lg sm:text-xl md:text-2xl leading-relaxed max-w-2xl ${isDark ? 'text-ink-300' : 'text-ink-700'}`}>
                I&apos;m a{' '}
                <span className={`font-medium ${isDark ? 'text-ink-100' : 'text-ink-950'}`}>
                  {displayText}
                  <span className="animate-blink ml-0.5 text-ember-500">|</span>
                </span>
                <br className="hidden sm:block" />
                crafting software that feels{' '}
                <span className="italic text-ember-500">inevitable</span>.
              </p>
            </motion.div>

            {/* Location — quiet line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className={`flex items-center gap-2 mb-10 sm:mb-12 ${isDark ? 'text-ink-400' : 'text-ink-500'}`}
            >
              <MapPin className="w-4 h-4" strokeWidth={1.8} />
              <span className="text-sm">Amman, Jordan · UTC+3</span>
            </motion.div>

            {/* CTAs — two buttons + social icons, clean */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <button onClick={() => setIsModalOpen(true)} className="btn-primary group">
                <span>Get in touch</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
              </button>

              <a href={cvUrl} download className="btn-secondary">
                <span>Download CV</span>
              </a>

              <div className="flex items-center gap-2 ml-1 sm:ml-2">
                <MagneticIcon
                  href="https://github.com/tariqamarneh"
                  ariaLabel="GitHub"
                  className={`
                    p-2.5 rounded-full transition-colors duration-300
                    ${isDark
                      ? 'text-ink-300 hover:text-ember-400 hover:bg-ink-800'
                      : 'text-ink-700 hover:text-ember-600 hover:bg-paper-100'}
                  `}
                >
                  <Github className="w-5 h-5" strokeWidth={1.8} />
                </MagneticIcon>
                <MagneticIcon
                  href="https://www.linkedin.com/in/tariq-naser/"
                  ariaLabel="LinkedIn"
                  className={`
                    p-2.5 rounded-full transition-colors duration-300
                    ${isDark
                      ? 'text-ink-300 hover:text-ember-400 hover:bg-ink-800'
                      : 'text-ink-700 hover:text-ember-600 hover:bg-paper-100'}
                  `}
                >
                  <Linkedin className="w-5 h-5" strokeWidth={1.8} />
                </MagneticIcon>
              </div>
            </motion.div>
          </div>

          {/* Portrait — 5 cols, clean framed image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="col-span-12 lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative w-[240px] sm:w-[300px] lg:w-[380px] aspect-[4/5]">
              {/* Soft ember glow behind photo */}
              <div
                className="absolute -inset-6 rounded-full opacity-40 blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(255,112,67,0.3), transparent 70%)' }}
                aria-hidden="true"
              />

              {/* Image frame */}
              <div className={`
                relative w-full h-full rounded-[2rem] overflow-hidden
                ${isDark ? 'bg-ink-800' : 'bg-paper-100'}
                ring-1 ring-ink-700/50
              `}>
                <Image
                  src="/images/my_photo.png"
                  alt="Tariq Amarneh"
                  fill
                  sizes="(max-width: 640px) 240px, (max-width: 1024px) 300px, 380px"
                  className="object-cover"
                  priority
                />
                {/* Subtle warm overlay */}
                <div
                  className="absolute inset-0 mix-blend-soft-light opacity-40 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(255,173,128,0.3), transparent 60%)' }}
                />
                {/* Vignette bottom */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent, rgba(10,8,7,0.3))' }}
                />
              </div>

              {/* Floating stat card — bottom right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className={`
                  absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-5
                  px-4 py-3 rounded-2xl
                  ${isDark ? 'bg-ink-900/95 border border-ink-700' : 'bg-paper-50/95 border border-ink-800/10'}
                  backdrop-blur-xl shadow-2xl
                `}
              >
                <div className="eyebrow-dim mb-0.5">Since</div>
                <div className={`font-display text-xl ${isDark ? 'text-ink-100' : 'text-ink-950'}`}
                  style={{ fontVariationSettings: '"opsz" 72, "SOFT" 30' }}>
                  2022
                </div>
              </motion.div>

              {/* Top-left badge — Amazon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className={`
                  absolute -top-3 -left-3 sm:-top-4 sm:-left-4
                  px-3 py-2 rounded-2xl flex items-center gap-2
                  ${isDark ? 'bg-ink-900/95 border border-ember-500/40' : 'bg-paper-50/95 border border-ember-500/40'}
                  backdrop-blur-xl shadow-2xl
                `}
              >
                <span className="w-1.5 h-1.5 bg-ember-500 rounded-full animate-pulse-soft" />
                <span className={`font-mono text-[10px] uppercase tracking-[0.15em] ${isDark ? 'text-ink-200' : 'text-ink-800'}`}>
                  SDE @ Amazon
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint — subtle, bottom center */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
      >
        <span className={`font-mono text-[10px] uppercase tracking-[0.25em] ${isDark ? 'text-ink-400' : 'text-ink-500'}`}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className={`w-3.5 h-3.5 ${isDark ? 'text-ember-400' : 'text-ember-600'}`} strokeWidth={1.8} />
        </motion.div>
      </motion.div>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.section>
  )
}