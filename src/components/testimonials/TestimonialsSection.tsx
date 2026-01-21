'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight, Linkedin } from 'lucide-react'
import { useTheme } from '../general/GradientBackground'
import { usePortfolioData } from '@/context/PortfolioDataContext'

const TestimonialsSection: React.FC = () => {
  const { isDark } = useTheme()
  const { testimonials } = usePortfolioData()
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section id="testimonials" className="section-padding relative">
      <div className="container mx-auto max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className={isDark ? 'gradient-text' : 'gradient-text-light'}>
              What People Say
            </span>
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          <p className={`mt-6 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Recommendations from colleagues and collaborators
          </p>
        </motion.div>

        {/* Testimonial Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className={`
            rounded-3xl p-8 md:p-12
            ${isDark ? 'glass-card' : 'glass-card-light'}
            accent-glow
          `}>
            {/* Quote Icon */}
            <div className="absolute -top-6 left-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Quote className="w-6 h-6 text-white" />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="pt-4"
              >
                {/* Content */}
                <p className={`text-lg md:text-xl leading-relaxed mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  &ldquo;{testimonials[currentIndex]?.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {testimonials[currentIndex]?.name}
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {testimonials[currentIndex]?.role} at {testimonials[currentIndex]?.company}
                    </p>
                  </div>

                  {testimonials[currentIndex]?.linkedinUrl && (
                    <a
                      href={testimonials[currentIndex].linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        p-2 rounded-lg transition-colors
                        ${isDark ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-400/10' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}
                      `}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`
                      w-2 h-2 rounded-full transition-all duration-300
                      ${index === currentIndex
                        ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-600'
                        : isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'
                      }
                    `}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={prevTestimonial}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}
                  `}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}
                  `}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialsSection
