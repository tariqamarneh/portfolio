'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Code2, Database, Cloud, Brain, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from '../general/GradientBackground'
import { usePortfolioData, Skill } from '@/context/PortfolioDataContext'
import { useTilt } from '@/hooks/useTilt'

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'frontend':
      return <Code2 className="w-4 h-4" />
    case 'backend':
      return <Code2 className="w-4 h-4" />
    case 'database':
      return <Database className="w-4 h-4" />
    case 'devops':
      return <Cloud className="w-4 h-4" />
    case 'ai':
      return <Brain className="w-4 h-4" />
    default:
      return <Code2 className="w-4 h-4" />
  }
}

const ProficiencyDots = React.memo<{ level: string; isDark: boolean }>(({ level, isDark }) => {
  const dots = level === 'Expert' ? 5 : level === 'Intermediate' ? 3 : 1
  const color = level === 'Expert' ? 'bg-green-500' : level === 'Intermediate' ? 'bg-blue-500' : 'bg-yellow-500'

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-colors ${
            i <= dots ? color : isDark ? 'bg-gray-700' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  )
})
ProficiencyDots.displayName = 'ProficiencyDots'

const SkillCard = React.memo<{ skill: Skill; index: number }>(({ skill, index }) => {
  const { isDark } = useTheme()
  const years = new Date().getFullYear() - skill.yearStarted
  const { ref, style: tiltStyle, onMouseMove, onMouseLeave } = useTilt(5)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={tiltStyle}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`
        rounded-xl p-4
        ${isDark ? 'bg-gray-900/50' : 'bg-white/50'}
        border border-white/10
        hover:border-cyan-500/20 transition-all duration-200
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <Image
            src={skill.icon}
            width={28}
            height={28}
            alt={`${skill.name} Logo`}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        </div>

        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {skill.name}
            </h3>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {years > 0 ? `${years}+ yrs` : '<1 yr'}
            </span>
          </div>
          <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {skill.description}
          </p>
          <ProficiencyDots level={skill.level} isDark={isDark} />
        </div>
      </div>
    </motion.div>
  )
})
SkillCard.displayName = 'SkillCard'

const SkillsSection: React.FC = () => {
  type Category = 'all' | 'frontend' | 'backend' | 'database' | 'devops' | 'ai'
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { isDark } = useTheme()
  const { skills, learningItems } = usePortfolioData()

  const filteredSkills = useMemo(() =>
    skills
      .filter(skill => activeCategory === 'all' || skill.category === activeCategory)
      .filter(skill =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [skills, activeCategory, searchQuery]
  )

  const primarySkills = useMemo(() => filteredSkills.filter(s => s.isPrimary), [filteredSkills])
  const secondarySkills = useMemo(() => filteredSkills.filter(s => !s.isPrimary), [filteredSkills])

  const categories: { key: Category; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'backend', label: 'Backend' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'database', label: 'Database' },
    { key: 'devops', label: 'DevOps' },
    { key: 'ai', label: 'AI/ML' },
  ]

  return (
    <section id="skills" className="section-padding relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-display">
            <span className={isDark ? 'gradient-text' : 'gradient-text-light'}>
              Skills & Expertise
            </span>
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-full" />
          <p className={`mt-6 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Technologies I work with daily
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium
                  flex items-center gap-2 transition-colors duration-200
                  ${activeCategory === category.key
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white'
                    : `${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'} hover:bg-opacity-80`
                  }
                `}
              >
                {getCategoryIcon(category.key)}
                {category.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search skills..."
              className={`
                w-56 pl-10 pr-4 py-2 rounded-full text-sm
                ${isDark ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'}
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
              `}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className={`absolute left-3 top-2.5 h-4 w-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
        <AnimatePresence mode="wait">
          <motion.div
            key={`grid-${activeCategory}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Primary Skills */}
            {primarySkills.length > 0 && (
              <div className="mb-8">
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600" />
                  Primary Skills
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {primarySkills.map((skill, index) => (
                    <SkillCard key={skill.id} skill={skill} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Secondary Skills */}
            {secondarySkills.length > 0 && (
              <div className="mb-8">
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="w-2 h-2 rounded-full bg-gray-500" />
                  Secondary Skills
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {secondarySkills.map((skill, index) => (
                    <SkillCard key={skill.id} skill={skill} index={index} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        </motion.div>

        {/* Currently Learning */}
        {learningItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`mt-12 p-6 rounded-2xl ${isDark ? 'bg-gradient-to-br from-violet-900/20 to-cyan-900/20 border border-violet-500/20' : 'bg-gradient-to-br from-violet-50 to-cyan-50 border border-violet-200'}`}
          >
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Sparkles className="w-5 h-5 text-purple-500" />
              Currently Learning
            </h3>
            <div className="flex flex-wrap gap-3">
              {learningItems.map((item) => (
                <div
                  key={item.id}
                  className={`
                    px-4 py-2 rounded-full
                    ${isDark ? 'bg-gray-800/80 text-gray-300' : 'bg-white text-gray-700'}
                    border ${isDark ? 'border-gray-700' : 'border-gray-200'}
                  `}
                >
                  <span className="font-medium">{item.name}</span>
                  <span className={`ml-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {item.description}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default SkillsSection
