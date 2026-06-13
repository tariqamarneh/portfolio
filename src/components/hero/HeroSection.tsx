'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import React, { useState, useRef, useEffect } from 'react'
import { ArrowDown, ArrowRight, MapPin } from 'lucide-react'
import { Github, Linkedin } from '@/components/icons/BrandIcons'
import ContactModal from '../contact/ContactModal'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import { useTypingEffect } from '@/hooks/useTypingEffect'

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
    // Cache the icon's center; re-measure only on scroll/resize, not per mousemove.
    let cx = 0, cy = 0, measured = false
    const measure = () => {
      if (!iconRef.current) { measured = false; return }
      const rect = iconRef.current.getBoundingClientRect()
      cx = rect.left + rect.width / 2
      cy = rect.top + rect.height / 2
      measured = true
    }
    const handleMouseMove = (e: MouseEvent) => {
      if (!measured) measure()
      if (!measured) return
      const distX = e.clientX - cx
      const distY = e.clientY - cy
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
    measure()
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
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

// Floating glass chip — orbits the 3D signal on desktop
const OrbitChip: React.FC<{
  className: string
  delay: number
  children: React.ReactNode
}> = ({ className, delay, children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
    className={`absolute hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-2xl
      bg-abyss-800/60 border border-abyss-600/60 backdrop-blur-xl
      shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] animate-float ${className}`}
  >
    {children}
  </motion.div>
)

export default function HeroSection() {
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
      {/* Floating chips around the signal (rendered by the fixed 3D canvas) */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <OrbitChip className="right-[12%] top-[24%]" delay={1.2}>
          <span className="w-1.5 h-1.5 rounded-full bg-lumen-400 animate-pulse-soft" />
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-abyss-200">
            SDE @ Amazon
          </span>
        </OrbitChip>
        <OrbitChip className="right-[28%] bottom-[22%]" delay={1.4}>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-abyss-300">
            Shipping since <span className="text-lumen-400">2022</span>
          </span>
        </OrbitChip>
      </div>

      <motion.div
        style={{ y: yOffset }}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-24 pb-16 sm:pt-32 sm:pb-24"
      >
        <div className="max-w-3xl">
          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 mb-8 sm:mb-10 px-3.5 py-1.5 rounded-full
              bg-abyss-800/60 border border-abyss-600/60 backdrop-blur-md"
          >
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-lumen-400 animate-ping opacity-60" />
              <span className="relative rounded-full bg-lumen-400 w-2 h-2" />
            </span>
            <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-abyss-300">
              Available for work
            </span>
          </motion.div>

          {/* Name — the centerpiece */}
          <h1 className="font-display leading-[0.95] tracking-tight mb-6 sm:mb-8 text-[clamp(2.8rem,8.5vw,7rem)] text-abyss-100">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="block font-bold"
            >
              Tariq
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              className="block font-bold text-lumen"
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
            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed max-w-2xl font-light text-abyss-300">
              I&apos;m a{' '}
              <span className="font-medium text-abyss-100">
                {displayText}
                <span className="animate-blink ml-0.5 text-lumen-400">|</span>
              </span>
              <br className="hidden sm:block" />
              crafting software that feels{' '}
              <span className="text-lumen-400">inevitable</span>.
            </p>
          </motion.div>

          {/* Location — quiet line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-center gap-2 mb-10 sm:mb-12 text-abyss-400"
          >
            <MapPin className="w-4 h-4" strokeWidth={1.8} />
            <span className="text-sm">Amman, Jordan · UTC+3</span>
          </motion.div>

          {/* CTAs — two buttons + social icons */}
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
                className="p-2.5 rounded-full transition-colors duration-300 text-abyss-300 hover:text-lumen-400 hover:bg-abyss-800"
              >
                <Github className="w-5 h-5" strokeWidth={1.8} />
              </MagneticIcon>
              <MagneticIcon
                href="https://www.linkedin.com/in/tariq-naser/"
                ariaLabel="LinkedIn"
                className="p-2.5 rounded-full transition-colors duration-300 text-abyss-300 hover:text-lumen-400 hover:bg-abyss-800"
              >
                <Linkedin className="w-5 h-5" strokeWidth={1.8} />
              </MagneticIcon>
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
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-abyss-400">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-3.5 h-3.5 text-lumen-400" strokeWidth={1.8} />
        </motion.div>
      </motion.div>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.section>
  )
}
