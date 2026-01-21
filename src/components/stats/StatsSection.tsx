'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Briefcase, FolderGit2, Award, Layers } from 'lucide-react'
import { useTheme } from '../general/GradientBackground'

interface Stat {
  icon: React.ElementType
  value: number
  suffix: string
  label: string
  color: string
}

const stats: Stat[] = [
  {
    icon: Briefcase,
    value: 2.3,
    suffix: '+',
    label: 'Years Experience',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: FolderGit2,
    value: 10,
    suffix: '+',
    label: 'Projects Completed',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Award,
    value: 2,
    suffix: '',
    label: 'Certifications',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Layers,
    value: 15,
    suffix: '+',
    label: 'Technologies',
    color: 'from-green-500 to-emerald-500'
  }
]

const AnimatedCounter: React.FC<{ value: number; suffix: string; isInView: boolean }> = ({
  value,
  suffix,
  isInView
}) => {
  const [count, setCount] = useState(0)
  const isDecimal = value % 1 !== 0

  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const steps = 60
    const stepValue = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += stepValue
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <span className="tabular-nums">
      {isDecimal ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  )
}

const StatsSection: React.FC = () => {
  const { isDark } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-16 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`
            rounded-3xl p-8 md:p-12
            ${isDark ? 'glass-card' : 'glass-card-light'}
            accent-glow
          `}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`
                    w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center
                    bg-gradient-to-br ${stat.color}
                  `}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <div className={`text-4xl md:text-5xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} isInView={isInView} />
                  </div>

                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default StatsSection
