// src/components/SkillsSection.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollAnimationWrapper from './ScrollAnimationWrapper'

type Skill = {
  name: string
  level: number
  category: 'frontend' | 'backend' | 'ai' | "devops"
  icon: string
}

const skills: Skill[] = [
  { name: "Java", level: 90, category: "backend", icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/java-colored.svg" },
  { name: "Spring Boot", level: 80, category: "backend", icon: "/spring-boot-logo.svg" },
  { name: "Python", level: 95, category: "backend", icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/python-colored.svg" },
  { name: "FastAPI", level: 95, category: "backend", icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/fastapi-colored.svg" },
  { name: "MongoDB", level: 90, category: "backend", icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/mongodb-colored.svg" },
  { name: "Postgres", level: 90, category: "backend", icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/postgresql-colored.svg" },
  { name: "Next.js", level: 85, category: "frontend", icon: "/nextjs_icon_dark.svg" },
  { name: "TypeScript", level: 80, category: "frontend", icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/typescript-colored.svg" },
  { name: "Tailwind CSS", level: 80, category: "frontend", icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tailwindcss-colored.svg" },
  { name: "Langchain", level: 80, category: "ai", icon: "/langchain-logo.svg" },
  { name: "TensorFlow", level: 75, category: "ai", icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tensorflow-colored.svg" },
  { name: "PyTorch", level: 70, category: "ai", icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/pytorch-colored.svg" },
  { name: "Git", level: 90, category: "devops", icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/git-colored.svg" },
  { name: "Docker", level: 85, category: "devops", icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/docker-colored.svg" },
  { name: "Azure", level: 80, category: "devops", icon: "/azure-icon-svgrepo-com.svg" },

]

const SkillCard: React.FC<{ skill: Skill }> = ({ skill }) => {
  return (
    <ScrollAnimationWrapper>
      <motion.div 
        className="glass-effect rounded-xl p-6 shadow-xl"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-5xl mb-4"><img src={skill.icon} width="36" height="36" alt="Logo" /></div>
        <h3 className="text-xl font-bold mb-2 text-white">{skill.name}</h3>
        <div className="w-full bg-indigo-900 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
            style={{ width: `${skill.level}%` }}
          />
        </div>
        <p className="text-indigo-200">{skill.level}% proficiency</p>
      </motion.div>
    </ScrollAnimationWrapper>
  )
}

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'backend' | 'ai'>('all')

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory)

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4 sm:px-8 md:px-16">
        <ScrollAnimationWrapper>
          <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center gradient-text">
            Skills
          </h2>
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['all', 'frontend', 'backend', 'devops', 'ai'].map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category as any)}
                className={`px-4 py-2 mx-2org.example.utils.writer rounded-full text-sm md:text-base font-semibold ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'glass-effect text-blue-200 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </ScrollAnimationWrapper>
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
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
