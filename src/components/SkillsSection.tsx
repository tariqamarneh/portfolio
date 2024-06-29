// src/components/SkillsSection.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Skill = {
  name: string
  level: number
  category: 'frontend' | 'backend' | 'ai'
  icon: string
}

const skills: Skill[] = [
  { name: "Python", level: 95, category: "backend", icon: "🐍" },
  { name: "FastAPI", level: 95, category: "backend", icon: "🚀" },
  { name: "MongoDB", level: 90, category: "backend", icon: "🛢" },
  { name: "Next.js", level: 90, category: "frontend", icon: "📱" },
  { name: "React", level: 85, category: "frontend", icon: "⚛️" },
  { name: "TypeScript", level: 80, category: "frontend", icon: "🔷" },
  { name: "Tailwind CSS", level: 80, category: "frontend", icon: "🎨" },
  { name: "TensorFlow", level: 75, category: "ai", icon: "🧠" },
  { name: "PyTorch", level: 70, category: "ai", icon: "🔥" },
  { name: "NLP", level: 80, category: "ai", icon: "💬" },
  { name: "Langchain", level: 80, category: "ai", icon: "🤖" },
]

const SkillCard: React.FC<{ skill: Skill }> = ({ skill }) => {
  return (
    <motion.div 
      className="glass-effect rounded-xl p-6 shadow-xl"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-5xl mb-4">{skill.icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{skill.name}</h3>
      <div className="w-full bg-indigo-900 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
          style={{ width: `${skill.level}%` }}
        />
      </div>
      <p className="text-indigo-200">{skill.level}% proficiency</p>
    </motion.div>
  )
}

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'backend' | 'ai'>('all')

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory)

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-8 md:px-16">
        <motion.h2 
          className="text-5xl font-bold mb-16 text-center neon-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Skills
        </motion.h2>
        <div className="flex justify-center space-x-4 mb-12">
          {['all', 'frontend', 'backend', 'ai'].map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category as any)}
              className={`px-6 py-2 rounded-full text-lg font-semibold ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'glass-effect text-indigo-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
