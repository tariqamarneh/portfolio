'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import ContactModal from '../contact/ContactModal'
import { useTheme } from '@/components/general/GradientBackground'

const TypingAnimation = ({ text, speed = 0.05 }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <span>{text}</span>
  }

  return (
    <div className="inline-block">
      {text.split('').map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * speed }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  )
}

export default function HeroSection() {
  const { isDark } = useTheme()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Set loaded after mount to trigger animations
    setIsLoaded(true)
  }, [])

  const scrollToContact = () => {
    setIsModalOpen(true)
    window.scrollTo({ behavior: 'smooth', top: 0 })
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
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

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center text-center relative overflow-hidden"
      role="region"
      aria-label="Portfolio Introduction"
    >
      <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>

      <motion.div
        className="container mx-auto px-8 md:px-16 relative z-10 py-10"
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <motion.div
            className="mb-8 md:mb-0 relative group"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-300 blur-sm"></div>
            <div className="relative">
              <Image
                src="/images/my_photo.png"
                alt="Tariq Amarneh"
                width={250}
                height={250}
                className="rounded-full border-4 border-gray-800 shadow-lg transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
          </motion.div>

          <motion.div
            className="text-left max-w-2xl"
            variants={itemVariants}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-4 gradient-text"
              variants={itemVariants}
            >
              <TypingAnimation text='Tariq Amarneh' />
            </motion.h1>

            <motion.div
              className={`text-lg ${isDark ? 'text-gray-400':'text-gray-600'} mb-4`}
              variants={itemVariants}
            >
              <TypingAnimation text='Based in Jordan' />
            </motion.div>

            <motion.div
              className={`text-xl md:text-2xl mb-6 ${isDark ? 'text-blue-300':'text-blue-500'}`}
              variants={itemVariants}
            >
              <TypingAnimation text='SDE at Amazon' />
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <button
                onClick={scrollToContact}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-full hover:from-indigo-600 hover:to-purple-700 transition duration-300 text-center transform hover:-translate-y-1"
                aria-label="Contact Me"
              >
                <TypingAnimation text='Get in touch' />
              </button>

              <a
                href="/Tariq_Naser.pdf"
                download
                className="px-8 py-3 bg-transparent border-2 border-indigo-500 text-indigo-500 font-bold rounded-full hover:bg-indigo-500 hover:text-white transition-all duration-300 text-center transform hover:-translate-y-1"
                aria-label="Download CV"
              >
                <TypingAnimation text='Download CV' />
              </a>

              <div className="flex space-x-6 items-center justify-center">
                <a
                  href="https://github.com/tariqamarneh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-indigo-500 ${isDark ? 'hover:text-white':'hover:text-black'} transition-colors duration-300 transform hover:-translate-y-1`}
                  aria-label="Visit GitHub Profile"
                >
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/tariq-naser/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-indigo-500 ${isDark ? 'hover:text-white':'hover:text-black'} transition-colors duration-300 transform hover:-translate-y-1`}
                  aria-label="Visit LinkedIn Profile"
                >
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  )
}
