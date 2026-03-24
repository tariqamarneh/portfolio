'use client'
import Image from 'next/image'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import React, { useState, useRef, useEffect } from 'react'
import { MapPin, Terminal, Github, Linkedin, ArrowDown } from 'lucide-react'
import ContactModal from '../contact/ContactModal'
import { useTheme } from '../general/GradientBackground'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import { useTypingEffect } from '@/hooks/useTypingEffect'
import GradientMeshOrbs from '../effects/GradientMeshOrbs'

const roles = [
  'Software Development Engineer',
  'AI Enthusiast',
  'Full Stack Developer',
  'Problem Solver',
]

const MagneticIcon = ({ children, href, ariaLabel, className }: {
  children: React.ReactNode
  href: string
  ariaLabel: string
  className: string
}) => {
  const iconRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 15 })
  const springY = useSpring(y, { stiffness: 200, damping: 15 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!iconRef.current) return
      const rect = iconRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distX = e.clientX - centerX
      const distY = e.clientY - centerY
      const distance = Math.sqrt(distX * distX + distY * distY)
      const threshold = 100

      if (distance < threshold) {
        const strength = (1 - distance / threshold) * 0.35
        x.set(distX * strength)
        y.set(distY * strength)
      } else {
        x.set(0)
        y.set(0)
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [x, y])

  return (
    <motion.div ref={iconRef} style={{ x: springX, y: springY, display: 'inline-flex' }}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    </motion.div>
  )
}

export default function HeroSection() {
  const { isDark } = useTheme()
  const { cvUrl } = usePortfolioData()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const containerRef = useRef(null)
  const { displayText } = useTypingEffect({ roles, typingSpeed: 70, deletingSpeed: 35, pauseDuration: 2500 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  const nameLetters = 'Tariq'.split('')
  const lastNameLetters = 'Amarneh'.split('')

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity }}
      id="home"
      className="min-h-dvh flex items-center justify-center relative overflow-hidden pt-16 pb-20 sm:pt-8 sm:pb-8"
      role="region"
      aria-label="Portfolio Introduction"
    >
      {/* Gradient Mesh Orbs Background */}
      <GradientMeshOrbs />

      <motion.div
        style={{ y }}
        className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10"
      >
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-20">
          {/* Profile Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Animated ring */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 opacity-20 animate-pulse-glow" />
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 opacity-40 blur-md" />

            {/* Image container */}
            <div className="relative rounded-full p-1 bg-gradient-to-r from-cyan-500 to-violet-600">
              <div className="rounded-full overflow-hidden w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-gray-900">
                <Image
                  src="/images/my_photo.png"
                  alt="Tariq Amarneh"
                  width={288}
                  height={288}
                  className="rounded-full object-cover"
                  priority
                />
              </div>
            </div>

            {/* Status badge - clickable, opens contact modal */}
            <motion.button
              onClick={() => setIsModalOpen(true)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.5 }}
              className={`
                absolute -bottom-2 left-1/2 -translate-x-1/2
                px-4 py-2 rounded-full cursor-pointer
                ${isDark ? 'glass-card' : 'glass-card-light'}
                flex items-center gap-2
              `}
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Available for work
              </span>
            </motion.button>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center lg:text-left max-w-xl"
          >
            {/* Greeting */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-lg mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Hello, I&apos;m
            </motion.p>

            {/* Name - Letter by letter reveal with display font */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 font-display">
              <span className="inline-flex overflow-hidden">
                {nameLetters.map((letter, i) => (
                  <motion.span
                    key={`first-${i}`}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.5 + i * 0.06,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className={isDark ? 'text-white' : 'text-gray-900'}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
              <br />
              <span className="inline-flex overflow-hidden">
                {lastNameLetters.map((letter, i) => (
                  <motion.span
                    key={`last-${i}`}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.8 + i * 0.06,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className={isDark ? 'gradient-text' : 'gradient-text-light'}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            </h1>

            {/* Typing Role Effect */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6
                ${isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-600'}
              `}
            >
              <Terminal className="w-5 h-5" />
              <span className="font-medium">
                {displayText}
                <span className="animate-blink ml-0.5 text-cyan-400">|</span>
              </span>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className={`flex items-center justify-center lg:justify-start gap-2 mb-6 sm:mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              <MapPin className="w-5 h-5" />
              <span>Based in Jordan</span>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="
                  px-8 py-3.5 rounded-full font-semibold
                  bg-gradient-to-r from-cyan-500 to-violet-600 text-white
                  hover:shadow-lg hover:shadow-cyan-500/25
                  transition-all duration-300
                  accent-glow-hover
                "
              >
                Get in touch
              </button>

              <a
                href={cvUrl}
                download
                className={`
                  px-8 py-3.5 rounded-full font-semibold
                  border-2 transition-all duration-300
                  ${isDark
                    ? 'border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400'
                    : 'border-gray-300 text-gray-700 hover:border-cyan-500 hover:text-cyan-600'
                  }
                `}
              >
                Download CV
              </a>

              {/* Social Links - Magnetic */}
              <div className="flex gap-3">
                <MagneticIcon
                  href="https://github.com/tariqamarneh"
                  ariaLabel="GitHub Profile"
                  className={`
                    p-3 rounded-xl transition-all duration-300
                    ${isDark
                      ? 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }
                  `}
                >
                  <Github className="w-5 h-5" />
                </MagneticIcon>
                <MagneticIcon
                  href="https://www.linkedin.com/in/tariq-naser/"
                  ariaLabel="LinkedIn Profile"
                  className={`
                    p-3 rounded-xl transition-all duration-300
                    ${isDark
                      ? 'bg-gray-800/50 text-gray-400 hover:text-[#0a66c2] hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:text-[#0a66c2] hover:bg-gray-200'
                    }
                  `}
                >
                  <Linkedin className="w-5 h-5" />
                </MagneticIcon>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 hidden sm:flex"
      >
        <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Scroll down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        </motion.div>
      </motion.div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.section>
  )
}
