'use client'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import React, { useState, useEffect, useRef } from 'react'
import ContactModal from '../contact/ContactModal'
import { useTheme } from '@/components/general/GradientBackground'

const TypingAnimation = ({ text, speed = 0.05 }) => {
  const [isClient, setIsClient] = useState(false)
  const letters = text.split('')

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <span>{text}</span>
  }

  return (
    <span className="inline-block">
      {letters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * speed,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

const FloatingElement = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

export default function HeroSection() {
  const { isDark } = useTheme()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const scrollToContact = () => {
    setIsModalOpen(true)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const glowVariants = {
    initial: { scale: 1, opacity: 0.5 },
    animate: {
      scale: 1.2,
      opacity: [0.4, 0.6, 0.4],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
      }
    }
  }

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity }}
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-20"
      role="region"
      aria-label="Portfolio Introduction"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 to-transparent opacity-40"></div>
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
          variants={glowVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          variants={glowVariants}
          initial="initial"
          animate="animate"
          style={{ animationDelay: "-1.5s" }}
        />
      </div>

      <motion.div
        style={{ y }}
        className="container mx-auto px-8 md:px-16 relative z-10"
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          {/* Profile Image Section */}
          <motion.div
            className="relative group"
            variants={itemVariants}
          >
            <FloatingElement>
              <div className="relative">
                {/* Decorative rings */}
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur-lg transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-75 group-hover:opacity-100 blur-lg transition-opacity duration-500"
                  animate={{
                    scale: [1.1, 1, 1.1],
                    rotate: [0, -360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                {/* Profile Image */}
                <div className="relative rounded-full border-4 border-white/10 shadow-2xl overflow-hidden w-64 h-64">
                  <Image
                    src="/images/my_photo.png"
                    alt="Tariq Amarneh"
                    width={256}
                    height={256}
                    className="rounded-full transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                </div>
              </div>
            </FloatingElement>
          </motion.div>

          {/* Content Section */}
          <motion.div
            className="text-center md:text-left max-w-2xl"
            variants={itemVariants}
          >
            {/* Name */}
            <motion.div
              className="mb-4 relative"
              variants={itemVariants}
            >
              <h1 className="text-6xl md:text-7xl font-bold mb-2">
                <span className="inline-block">
                  <TypingAnimation text="Tariq" />
                </span>
                <br />
                <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                  <TypingAnimation text="Amarneh" speed={0.07} />
                </span>
              </h1>
            </motion.div>

            {/* Location */}
            <motion.div
              className={`text-xl ${isDark ? 'text-gray-400':'text-gray-600'} mb-6`}
              variants={itemVariants}
            >
              <FloatingElement delay={0.5}>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <TypingAnimation text="Based in Jordan" speed={0.08} />
                </div>
              </FloatingElement>
            </motion.div>

            {/* Role */}
            <motion.div
              className={`text-2xl md:text-3xl mb-8 ${isDark ? 'text-blue-300':'text-blue-500'}`}
              variants={itemVariants}
            >
              <FloatingElement delay={1}>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  <TypingAnimation text="SDE at Amazon" speed={0.08} />
                </div>
              </FloatingElement>
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center"
              variants={itemVariants}
            >
              <motion.button
                onClick={scrollToContact}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full
                  hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300
                  shadow-[0_0_20px_rgba(66,153,225,0.5)] hover:shadow-[0_0_25px_rgba(66,153,225,0.8)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TypingAnimation text="Get in touch" speed={0.08} />
              </motion.button>

              <motion.a
                href="/Tariq_Naser.pdf"
                download
                className="px-8 py-3 bg-transparent border-2 border-blue-500 text-blue-500 font-bold rounded-full
                  hover:bg-blue-500 hover:text-white transform hover:scale-105 transition-all duration-300
                  shadow-[0_0_20px_rgba(66,153,225,0.2)] hover:shadow-[0_0_25px_rgba(66,153,225,0.4)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TypingAnimation text="Download CV" speed={0.08} />
              </motion.a>

              {/* Social Links */}
              <div className="flex space-x-6 items-center">
                <motion.a
                  href="https://github.com/tariqamarneh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-blue-500 hover:text-blue-600 transform hover:scale-110 transition-all duration-300`}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/tariq-naser/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-blue-500 hover:text-blue-600 transform hover:scale-110 transition-all duration-300`}
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-blue-500 rounded-full p-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="w-2 h-2 bg-blue-500 rounded-full mx-auto"
            animate={{
              y: [0, 16, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.div>
      </motion.div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.section>
  )
}
