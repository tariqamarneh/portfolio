'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Code2, Database, Cloud, Brain, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { usePortfolioData, Skill } from '@/context/PortfolioDataContext'
import { GlowCard } from '@/components/ui/glow-card'

const getCategoryIcon = (category: string, className = 'w-3 h-3') => {
  const props = { className, strokeWidth: 1.8 } as const
  switch (category) {
    case 'frontend': return <Code2 {...props} />
    case 'backend':  return <Code2 {...props} />
    case 'database': return <Database {...props} />
    case 'devops':   return <Cloud {...props} />
    case 'ai':       return <Brain {...props} />
    default:         return <Code2 {...props} />
  }
}

const ProficiencyBar = React.memo<{ level: string }>(({ level }) => {
  const pct = level === 'Expert' ? 100 : level === 'Intermediate' ? 60 : 30
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-[2px] rounded-full bg-abyss-700 relative overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-lumen-700 to-lumen-400"
        />
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] shrink-0 w-20 text-right text-abyss-400">
        {level}
      </span>
    </div>
  )
})
ProficiencyBar.displayName = 'ProficiencyBar'

const SkillCard = React.memo<{ skill: Skill; index: number }>(({ skill, index }) => {
  const years = new Date().getFullYear() - skill.yearStarted

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.035, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <GlowCard glowColor="lumen" className="p-6 h-full">
        <div className="relative">
          <div className="flex items-start justify-between mb-5">
            <div className="relative w-12 h-12 flex items-center justify-center rounded-xl
              bg-abyss-950/80 border border-abyss-700">
              <Image
                src={skill.icon}
                width={26}
                height={26}
                alt={`${skill.name} Logo`}
                loading="lazy"
                className="opacity-90"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
            <div className="text-right">
              <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-abyss-500">
                Exp
              </div>
              <div className="font-mono text-sm text-lumen-400 tabular-nums">
                {years > 0 ? `${years}+ yrs` : '<1 yr'}
              </div>
            </div>
          </div>

          <h3 className="font-display text-xl mb-2.5 text-abyss-100">
            {skill.name}
          </h3>

          <p className="text-sm mb-5 leading-relaxed min-h-[40px] font-light text-abyss-400">
            {skill.description}
          </p>

          <ProficiencyBar level={skill.level} />
        </div>
      </GlowCard>
    </motion.div>
  )
})
SkillCard.displayName = 'SkillCard'

const SkillsSection: React.FC = () => {
  type Category = 'all' | 'frontend' | 'backend' | 'database' | 'devops' | 'ai'
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { skills, learningItems } = usePortfolioData()

  const filteredSkills = useMemo(() =>
    skills
      .filter(s => activeCategory === 'all' || s.category === activeCategory)
      .filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="grid grid-cols-12 gap-6 mb-14 md:mb-18"
        >
          <div className="col-span-12 md:col-span-7">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-px bg-lumen-400" />
              <span className="eyebrow">Chapter · 04 / Craft</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.02] text-abyss-100">
              Tools of the{' '}
              <span className="text-lumen">trade.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 flex items-end">
            <p className="text-base md:text-lg leading-relaxed font-light text-abyss-300">
              The languages, frameworks, and tools I reach for daily — with the
              years of shipped systems to back them up.
            </p>
          </div>
        </motion.div>

        {/* Filters — pill row + search */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-12">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((category) => {
              const isActive = activeCategory === category.key
              return (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[11px] uppercase tracking-[0.15em]
                    transition-all duration-200
                    ${isActive
                      ? 'bg-lumen-400 text-abyss-950 shadow-[0_8px_25px_-10px_rgba(76,220,202,0.6)]'
                      : 'bg-abyss-900/70 border border-abyss-700 text-abyss-300 hover:text-lumen-400 hover:border-lumen-500/40'}
                  `}
                >
                  {getCategoryIcon(category.key)}
                  {category.label}
                </button>
              )
            })}
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-abyss-400" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search tools…"
              className="w-full md:w-64 pl-10 pr-4 py-2.5 rounded-full text-sm
                transition-colors duration-200
                bg-abyss-900/70 border border-abyss-700 text-abyss-100 placeholder:text-abyss-500 focus:border-lumen-500
                focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`grid-${activeCategory}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {primarySkills.length > 0 && (
              <div className="mb-14">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-lumen-400" />
                    <span className="eyebrow">Primary · Deep craft</span>
                  </h3>
                  <span className="eyebrow-dim">{String(primarySkills.length).padStart(2, '0')}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {primarySkills.map((skill, index) => (
                    <SkillCard key={skill.id} skill={skill} index={index} />
                  ))}
                </div>
              </div>
            )}

            {secondarySkills.length > 0 && (
              <div className="mb-14">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-abyss-500" />
                    <span className="eyebrow-dim">Secondary · Working knowledge</span>
                  </h3>
                  <span className="eyebrow-dim">{String(secondarySkills.length).padStart(2, '0')}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {secondarySkills.map((skill, index) => (
                    <SkillCard key={skill.id} skill={skill} index={index} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Currently learning — accent panel */}
        {learningItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-8 p-6 md:p-8 rounded-3xl overflow-hidden relative
              bg-abyss-900/60 border border-lumen-500/25"
            style={{ boxShadow: '0 20px 60px -30px rgba(76, 220, 202, 0.25)' }}
          >
            {/* Soft teal glow */}
            <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(76,220,202,0.12), transparent 70%)' }}
              aria-hidden="true"
            />

            <div className="relative flex items-center gap-3 mb-5">
              <Sparkles className="w-4 h-4 text-lumen-400" strokeWidth={1.8} />
              <span className="eyebrow">In the lab · Currently learning</span>
            </div>
            <div className="relative flex flex-wrap gap-2">
              {learningItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full
                    transition-colors
                    bg-abyss-950/70 border border-abyss-700 hover:border-lumen-500/50"
                >
                  <span className="text-sm font-medium text-abyss-100">
                    {item.name}
                  </span>
                  {item.description && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-abyss-500">
                      · {item.description}
                    </span>
                  )}
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
