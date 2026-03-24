'use client'

import React, { useRef } from 'react'
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
    color: 'from-cyan-400 to-teal-400'
  },
  {
    icon: FolderGit2,
    value: 10,
    suffix: '+',
    label: 'Projects Completed',
    color: 'from-violet-500 to-fuchsia-500'
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

const SlotDigit = React.memo<{ digit: number; delay: number; isInView: boolean }>(({ digit, delay, isInView }) => (
  <span className="relative inline-block overflow-hidden align-bottom" style={{ height: '1em', lineHeight: 1 }}>
    <motion.span
      className="block"
      style={{ lineHeight: 1 }}
      initial={{ y: 0 }}
      animate={isInView ? { y: `${-digit}em` } : { y: 0 }}
      transition={{
        duration: 0.8 + digit * 0.1,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
        <span key={n} className="block text-center" style={{ height: '1em', lineHeight: 1 }}>{n}</span>
      ))}
    </motion.span>
  </span>
))
SlotDigit.displayName = 'SlotDigit'

const SlotMachineCounter = React.memo<{ value: number; suffix: string; isInView: boolean }>(({
  value, suffix, isInView
}) => {
  const isDecimal = value % 1 !== 0
  const displayStr = isDecimal ? value.toFixed(1) : Math.floor(value).toString()
  const chars = (displayStr + suffix).split('')

  return (
    <span className="inline-flex tabular-nums">
      {chars.map((char, i) => {
        if (/\d/.test(char)) {
          return <SlotDigit key={i} digit={parseInt(char)} delay={i * 0.12} isInView={isInView} />
        }
        return <span key={i} className="inline-block" style={{ lineHeight: 1 }}>{char}</span>
      })}
    </span>
  )
})
SlotMachineCounter.displayName = 'SlotMachineCounter'

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
                    <SlotMachineCounter value={stat.value} suffix={stat.suffix} isInView={isInView} />
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
