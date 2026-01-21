'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Code2, Brain, Rocket, Coffee } from 'lucide-react'
import { useTheme } from '../general/GradientBackground'

const highlights = [
  {
    icon: Code2,
    title: 'Software Engineer',
    description: '2.3+ years building scalable applications',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Brain,
    title: 'AI Engineer',
    description: '1+ year working with ML & Generative AI',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Rocket,
    title: 'Problem Solver',
    description: 'Passionate about elegant solutions',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Coffee,
    title: 'Continuous Learner',
    description: 'Always exploring new technologies',
    color: 'from-green-500 to-emerald-500'
  }
]

const AboutSection: React.FC = () => {
  const { isDark } = useTheme()

  return (
    <section id="about" className="section-padding relative">
      <div className="container mx-auto max-w-6xl">
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
              About Me
            </span>
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Hi! I&apos;m <span className="font-semibold text-blue-500">Tariq Amarneh</span>, a Software Development Engineer
              at Amazon with a passion for building impactful technology solutions.
            </p>

            <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              With <span className="font-semibold">2.3+ years</span> of experience in software engineering and
              <span className="font-semibold"> 1+ year</span> specializing in AI/ML, I thrive on creating
              applications that solve real-world problems at scale.
            </p>

            <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              My journey from Data Science graduate to Software Engineer at Amazon has been driven by
              curiosity and a commitment to continuous learning. I love working with modern technologies
              like Java, Spring Boot, Python, and Next.js to build robust and user-friendly applications.
            </p>

            <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              When I&apos;m not coding, you&apos;ll find me exploring the latest in AI research, contributing to
              open-source projects, or enjoying a good cup of coffee while brainstorming new ideas.
            </p>
          </motion.div>

          {/* Highlight Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {highlights.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className={`
                    p-5 rounded-2xl
                    ${isDark ? 'glass-card' : 'glass-card-light'}
                    hover:scale-105 transition-transform duration-300
                    group
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-xl mb-4 flex items-center justify-center
                    bg-gradient-to-br ${item.color}
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
