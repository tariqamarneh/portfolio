'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { BarChart, Search, Star, Code2, Database, Cloud } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from '../general/GradientBackground'

type Skill = {
  name: string
  level: string
  category: 'frontend' | 'backend' | 'database' | 'devops'
  icon: string
  description?: string
  yearStarted?: number
  color?: string
}

const skills: Skill[] = [
  {
    name: "Java",
    level: 'Expert',
    category: "backend",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/java-colored.svg",
    description: "Enterprise application development, Spring ecosystem",
    yearStarted: 2024,
    color: "#f89820"
  },
  {
    name: "Spring Boot",
    level: 'Intermediate',
    category: "backend",
    icon: "/skills_logo/spring-boot-logo.svg",
    description: "Enterprise application development, Spring ecosystem",
    yearStarted: 2024,
    color: "#6db33f"
  },
  {
    name: "Python",
    level: 'Expert',
    category: "backend",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/python-colored.svg",
    description: "Web application development, machine learning",
    yearStarted: 2020,
    color: "#3776ab"
  },
  {
    name: "FastAPI",
    level: 'Expert',
    category: "backend",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/fastapi-colored.svg",
    description: "Backend web application, clean code",
    yearStarted: 2022,
    color: "#009688"
  },
  {
    name: "MongoDB",
    level: 'Expert',
    category: "database",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/mongodb-colored.svg",
    description: "NoSQL database design and optimization",
    yearStarted: 2021,
    color: "#47A248"
  },
  {
    name: "Postgres",
    level: 'Expert',
    category: "database",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/postgresql-colored.svg",
    description: "Relational database management and optimization",
    yearStarted: 2023,
    color: "#336791"
  },
  {
    name: "MySQL",
    level: 'Expert',
    category: "database",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/mysql-colored.svg",
    description: "Database design and performance tuning",
    yearStarted: 2023,
    color: "#4479A1"
  },
  {
    name: "Next.js",
    level: 'Intermediate',
    category: "frontend",
    icon: "/skills_logo/nextjs_icon_dark.svg",
    description: "Modern frontend development with React",
    yearStarted: 2023,
    color: "#000000"
  },
  {
    name: "Tailwind CSS",
    level: 'Intermediate',
    category: "frontend",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tailwindcss-colored.svg",
    description: "Utility-first CSS framework",
    yearStarted: 2023,
    color: "#38B2AC"
  },
  {
    name: "Git",
    level: 'Expert',
    category: "devops",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/git-colored.svg",
    description: "Version control and collaboration",
    yearStarted: 2019,
    color: "#F05032"
  },
  {
    name: "Docker",
    level: 'Expert',
    category: "devops",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/docker-colored.svg",
    description: "Containerization and orchestration",
    yearStarted: 2019,
    color: "#2496ED"
  },
  {
    name: "Azure",
    level: 'Expert',
    category: "devops",
    icon: "/skills_logo/azure-icon.svg",
    description: "Cloud services and infrastructure",
    yearStarted: 2023,
    color: "#0089D6"
  },
]

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'frontend':
      return <Code2 className="w-5 h-5" />
    case 'backend':
      return <Code2 className="w-5 h-5" />
    case 'database':
      return <Database className="w-5 h-5" />
    case 'devops':
      return <Cloud className="w-5 h-5" />
    default:
      return <Star className="w-5 h-5" />
  }
}

const SkillCard: React.FC<{
  skill: Skill
  index: number
}> = ({ skill }) => {
  const { isDark } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: false, margin: "-100px" })
  const years = new Date().getFullYear() - (skill.yearStarted || new Date().getFullYear())

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.5,
        type: "tween",
        ease: "easeOut"
      }}
      className={`
        relative overflow-hidden rounded-2xl
        ${isDark ? 'bg-gray-900/50' : 'bg-white/50'}
        backdrop-blur-sm border border-gray-200/10
        shadow-[0_0_30px_rgba(0,0,0,0.1)]
        transition-all duration-300
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0 opacity-10 mix-blend-overlay"
        style={{
          backgroundImage: `
            radial-gradient(circle at top left, ${skill.color}40, transparent),
            radial-gradient(circle at bottom right, ${skill.color}20, transparent)
          `
        }}
      />

      <div className="relative p-6">
        <div className="flex items-start gap-4">
          {/* Icon with Glow */}
          <div className="relative">
            <div
              className="absolute inset-0 blur-xl opacity-40"
              style={{ backgroundColor: skill.color }}
            />
            <div className="relative">
              <Image
                src={skill.icon}
                width={46}
                height={46}
                alt={`${skill.name} Logo`}
                className="transform transition-transform duration-300 hover:scale-110"
              />
            </div>
          </div>

          <div className="flex-grow">
            <div className="flex justify-between items-start mb-2">
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {skill.name}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm px-2 py-1 rounded-full
                    ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}
                    ${isDark ? 'text-gray-300' : 'text-gray-600'}
                  `}
                >
                  {skill.yearStarted ? `${years}+ years` : ''}
                </span>
                {getCategoryIcon(skill.category)}
              </div>
            </div>

            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {skill.description}
            </p>
          </div>
        </div>
      </div>

      {/* Hover Border Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          boxShadow: isHovered
            ? `inset 0 0 0 1px ${skill.color}50`
            : `inset 0 0 0 1px transparent`
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

const SkillsSection: React.FC = () => {
  type Category = 'all' | 'frontend' | 'backend' | 'database' | 'devops'
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'stats'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const { isDark } = useTheme()

  const filteredSkills = skills
    .filter(skill => activeCategory === 'all' || skill.category === activeCategory)
    .filter(skill =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const categories = {
    'frontend': filteredSkills.filter(s => s.category === 'frontend').length,
    'backend': filteredSkills.filter(s => s.category === 'backend').length,
    'database': filteredSkills.filter(s => s.category === 'database').length,
    'devops': filteredSkills.filter(s => s.category === 'devops').length,
  }

  return (
    <section id="skills" className="py-16 relative overflow-hidden">
      {/* Modern Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#4F46E5,transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#7C3AED,transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
            className="inline-block"
          >
            <h2 className="text-6xl sm:text-7xl font-bold relative inline-block mb-4">
              <span className={`
                bg-clip-text text-transparent
                ${isDark
                  ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
                }
              `}>
                Skills & Expertise
              </span>
            </h2>
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mt-6 text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}
          >
            Explore my technical skills and areas of expertise
          </motion.p>
        </motion.div>

        <div className="mb-12 flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div className="flex flex-wrap justify-center gap-3">
            {(['all', 'frontend', 'backend', 'database', 'devops'] as Category[]).map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-medium
                  flex items-center gap-2
                  transition-all duration-300
                  ${activeCategory === category
                    ? `bg-gradient-to-r from-blue-500 to-purple-600
                       text-white shadow-lg shadow-blue-500/25`
                    : `${isDark ? 'bg-gray-800/50' : 'bg-white/50'}
                       backdrop-blur-sm border border-gray-200/10
                       ${isDark ? 'text-gray-300' : 'text-gray-600'}
                       hover:border-blue-500/30`
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {getCategoryIcon(category)}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-4 items-center">
            <motion.div
              className="relative"
              initial={false}
              animate={searchQuery ? { width: "240px" } : { width: "200px" }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="text"
                placeholder="Search skills..."
                className={`
                  w-full pl-10 pr-4 py-2.5 rounded-full
                  ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}
                  backdrop-blur-sm border border-gray-200/10
                  ${isDark ? 'text-white' : 'text-gray-900'}
                  placeholder:${isDark ? 'text-gray-400' : 'text-gray-500'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500/40
                  transition-all duration-300
                `}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className={`absolute left-3 top-3 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(viewMode === 'grid' ? 'stats' : 'grid')}
              className={`
                p-2.5 rounded-full
                ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}
                backdrop-blur-sm border border-gray-200/10
                hover:border-blue-500/30
                transition-all duration-300
              `}
            >
              <BarChart className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key={`grid-${activeCategory}-${searchQuery}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {filteredSkills.map((skill, index) => (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="stats"
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Category Stats */}
              <motion.div
                className={`
                  rounded-2xl p-8
                  ${isDark ? 'bg-gray-900/50' : 'bg-white/50'}
                  backdrop-blur-sm border border-gray-200/10
                `}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Category Distribution
                </h3>
                {Object.entries(categories).map(([category, count], index) => (
                  <motion.div
                    key={category}
                    className="mb-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </span>
                      </div>
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {count} skills
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / filteredSkills.length) * 100}%` }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                        transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default SkillsSection
