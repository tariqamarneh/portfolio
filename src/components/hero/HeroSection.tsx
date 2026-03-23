'use client'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import React, { useState, useRef } from 'react'
import { MapPin, Terminal, Github, Linkedin, ArrowDown } from 'lucide-react'
import ContactModal from '../contact/ContactModal'
import { useTheme } from '../general/GradientBackground'
import { usePortfolioData } from '@/context/PortfolioDataContext'

export default function HeroSection() {
  const { isDark } = useTheme()
  const { cvUrl } = usePortfolioData()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity }}
      id="home"
      className="min-h-dvh flex items-center justify-center relative overflow-hidden pt-16 pb-20 sm:pt-8 sm:pb-8"
      role="region"
      aria-label="Portfolio Introduction"
    >
      {/* Subtle accent glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

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
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 animate-pulse-glow" />
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-40 blur-md" />

            {/* Image container */}
            <div className="relative rounded-full p-1 bg-gradient-to-r from-blue-500 to-purple-600">
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

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`
                absolute -bottom-2 left-1/2 -translate-x-1/2
                px-4 py-2 rounded-full
                ${isDark ? 'glass-card' : 'glass-card-light'}
                flex items-center gap-2
              `}
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Available for work
              </span>
            </motion.div>
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

            {/* Name */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
              <span className={isDark ? 'text-white' : 'text-gray-900'}>Tariq</span>
              <br />
              <span className={isDark ? 'gradient-text' : 'gradient-text-light'}>
                Amarneh
              </span>
            </h1>

            {/* Role */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6
                ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}
              `}
            >
              <Terminal className="w-5 h-5" />
              <span className="font-medium">Software Development Engineer at Amazon</span>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`flex items-center justify-center lg:justify-start gap-2 mb-6 sm:mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              <MapPin className="w-5 h-5" />
              <span>Based in Jordan</span>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="
                  px-8 py-3.5 rounded-full font-semibold
                  bg-gradient-to-r from-blue-600 to-purple-600 text-white
                  hover:shadow-lg hover:shadow-blue-500/25
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
                    ? 'border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400'
                    : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                  }
                `}
              >
                Download CV
              </a>

              {/* Social Links */}
              <div className="flex gap-3">
                <a
                  href="https://github.com/tariqamarneh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    p-3 rounded-xl transition-all duration-300
                    ${isDark
                      ? 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }
                  `}
                  aria-label="GitHub Profile"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/tariq-naser/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    p-3 rounded-xl transition-all duration-300
                    ${isDark
                      ? 'bg-gray-800/50 text-gray-400 hover:text-[#0a66c2] hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:text-[#0a66c2] hover:bg-gray-200'
                    }
                  `}
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
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
