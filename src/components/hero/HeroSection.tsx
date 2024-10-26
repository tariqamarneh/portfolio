'use client'
import Image from 'next/image'
import { TypeAnimation } from 'react-type-animation'
import ScrollAnimationWrapper from '../general/ScrollAnimationWrapper'
import TypingAnimation from '../general/TypingAnimation'
import { motion, useInView } from 'framer-motion'
import React, { useState } from 'react'
import ContactModal from '../contact/ContactModal'

export default function HeroSection(): JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center text-center relative overflow-hidden">
      <div className="container mx-auto px-8 md:px-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <ScrollAnimationWrapper animation="fade-in">
            <div className="mb-8 md:mb-0 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-300 blur-sm"></div>
              <motion.div
                ref={ref}
                className="relative"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Image
                  src="/images/my_photo.png"
                  alt="Your Name"
                  width={250}
                  height={250}
                  className="rounded-full border-4 border-gray-800 shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
              </motion.div>
            </div>
          </ScrollAnimationWrapper>
          <div className="text-left">
            <ScrollAnimationWrapper animation="fade-in">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 gradient-text">
                <TypingAnimation text='Tariq Amarneh' />
              </h1>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animation="fade-up">
              <div className="text-xl md:text-2xl mb-6 text-blue-300">
                <TypeAnimation
                  sequence={[
                    'Web Developer',
                    2000,
                    'Java And Python Expert',
                    2000,
                    'AI Enthusiast',
                    2000
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-full hover:from-indigo-600 hover:to-purple-700 transition duration-300 text-center"
                >
                  <TypingAnimation text='Get in touch' />
                </button>
                <a
                  href="/Tariq_Naser.pdf"
                  download
                  className="px-8 py-3 bg-transparent border-2 border-indigo-500 text-indigo-500 font-bold rounded-full hover:bg-indigo-500 hover:text-white transition duration-300 text-center"
                >
                  <TypingAnimation text='Download CV' />
                </a>
                <div className="flex space-x-6 items-center justify-center">
                  <a href="https://github.com/tariqamarneh" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-white transition-colors duration-300">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/in/tariq-naser/" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-white transition-colors duration-300">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  )
} 