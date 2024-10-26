'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Search } from 'lucide-react';
import ScrollAnimationWrapper from '../general/ScrollAnimationWrapper';
import Image from 'next/image';


type Skill = {
  name: string;
  level: string;
  category: 'frontend' | 'backend' | 'database' | 'ai' | 'devops';
  icon: string;
  description?: string;
  yearStarted?: number;
}

const skills: Skill[] = [
  {
    name: "Java",
    level: 'Expert',
    category: "backend",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/java-colored.svg",
    description: "Enterprise application development, Spring ecosystem",
    yearStarted: 2024
  },
  {
    name: "Spring Boot",
    level: 'Intermediate',
    category: "backend",
    icon: "/spring-boot-logo.svg",
    description: "Enterprise application development, Spring ecosystem",
    yearStarted: 2024
  },
  {
    name: "Python",
    level: 'Expert',
    category: "backend",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/python-colored.svg",
    description: "Web application development, machine learning",
    yearStarted: 2020
  },
  {
    name: "FastAPI",
    level: 'Expert',
    category: "backend",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/fastapi-colored.svg",
    description: "Backend web application, clean code",
    yearStarted: 2022
  },
  {
    name: "MongoDB",
    level: 'Expert',
    category: "database",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/mongodb-colored.svg",
    description: "",
    yearStarted: 2021
  },
  {
    name: "Postgres",
    level: 'Expert',
    category: "database",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/postgresql-colored.svg",
    description: "",
    yearStarted: 2023
  },
  {
    name: "MySQL",
    level: 'Expert',
    category: "database",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/mysql-colored.svg",
    description: "",
    yearStarted: 2023
  },
  {
    name: "redis",
    level: 'Expert',
    category: "database",
    icon: "/redis-logo-svgrepo-com.svg",
    description: "",
    yearStarted: 2023
  },
  {
    name: "Next.js",
    level: 'Intermediate',
    category: "frontend",
    icon: "/nextjs_icon_dark.svg",
    description: "Simple frontend application development, clean code",
    yearStarted: 2023
  },
  {
    name: "TypeScript",
    level: 'Intermediate',
    category: "frontend",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/typescript-colored.svg",
    description: "",
    yearStarted: 2023
  },
  {
    name: "Tailwind CSS",
    level: 'Intermediate',
    category: "frontend",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tailwindcss-colored.svg",
    description: "",
    yearStarted: 2023
  },
  {
    name: "Langchain",
    level: 'Expert',
    category: "ai",
    icon: "/langchain-logo.svg",
    description: "Summarizing large pdf's, chatbots, AI applications",
    yearStarted: 2023
  },
  {
    name: "TensorFlow",
    level: 'Intermediate',
    category: "ai",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tensorflow-colored.svg",
    description: "Machine learning models, computer vision",
    yearStarted: 2020
  },
  {
    name: "PyTorch",
    level: 'Intermediate',
    category: "ai",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/pytorch-colored.svg",
    description: "NLP, pattern recognition",
    yearStarted: 2020
  },
  {
    name: "Git",
    level: 'Expert',
    category: "devops",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/git-colored.svg",
    description: "",
    yearStarted: 2019
  },
  {
    name: "Docker",
    level: 'Expert',
    category: "devops",
    icon: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/docker-colored.svg",
    description: "",
    yearStarted: 2019
  },
  {
    name: "Azure",
    level: 'Expert',
    category: "devops",
    icon: "/azure-icon-svgrepo-com.svg",
    description: "Web service, container registry, CI/CD",
    yearStarted: 2023
  },
  {
    name: "kubernetes",
    level: 'Beginner',
    category: "devops",
    icon: "/kubernetes.svg",
    description: "",
    yearStarted: 2024
  },
];

const SkillCard: React.FC<{
  skill: Skill,
  isDetailView: boolean,
  onClick: () => void
}> = ({ skill, isDetailView, onClick }) => {
  const years = new Date().getFullYear() - (skill.yearStarted || new Date().getFullYear());

  return (
    <ScrollAnimationWrapper>
      <motion.div
        className={`glass-effect rounded-xl p-6 shadow-xl cursor-pointer
          ${isDetailView ? 'col-span-2 sm:col-span-3 lg:col-span-5' : ''}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        onClick={onClick}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Image
              src={skill.icon}
              width={46}
              height={46}
              alt={`${skill.name} Logo`} 
            />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-white">{skill.name}</h3>
              <span className="text-sm text-indigo-200">
                {skill.yearStarted ? `${years}+ years` : ''}
              </span>
            </div>
            <p className="text-indigo-200 mb-2">{skill.level}</p>
            {isDetailView && skill.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-blue-200 text-sm mt-2"
              >
                {skill.description}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </ScrollAnimationWrapper>
  );
};

const SkillsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'backend' | 'database' | 'ai' | 'devops'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'stats'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const filteredSkills = skills
    .filter(skill => activeCategory === 'all' || skill.category === activeCategory)
    .filter(skill =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const skillLevels = {
    'Expert': filteredSkills.filter(s => s.level === 'Expert').length,
    'Intermediate': filteredSkills.filter(s => s.level === 'Intermediate').length,
    'Beginner': filteredSkills.filter(s => s.level === 'Beginner').length,
  };

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4 sm:px-8 md:px-16">
        <ScrollAnimationWrapper>
          <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center gradient-text">
            Skills & Expertise
          </h2>
        </ScrollAnimationWrapper>

        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap justify-center gap-2">
            {['all', 'frontend', 'backend', 'database', 'devops', 'ai'].map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category as any)}
                className={`px-4 py-2 rounded-full text-sm md:text-base font-semibold ${activeCategory === category
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

          <div className="flex gap-4 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search skills..."
                className="pl-10 pr-4 py-2 rounded-full bg-opacity-20 bg-white backdrop-blur-md border border-white/10 text-white placeholder-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(viewMode === 'grid' ? 'stats' : 'grid')}
              className="p-2 rounded-full glass-effect"
            >
              <BarChart className="h-5 w-5 text-white" />
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredSkills.map((skill) => (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  isDetailView={expandedSkill === skill.name}
                  onClick={() => setExpandedSkill(expandedSkill === skill.name ? null : skill.name)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="stats"
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Proficiency Breakdown</h3>
                {Object.entries(skillLevels).map(([level, count]) => (
                  <div key={level} className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-blue-200">{level}</span>
                      <span className="text-blue-200">{count}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / filteredSkills.length) * 100}%` }}
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Category Distribution</h3>
                {['frontend', 'backend', 'devops', 'ai'].map(category => {
                  const count = filteredSkills.filter(s => s.category === category).length;
                  return (
                    <div key={category} className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-blue-200">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        <span className="text-blue-200">{count}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / filteredSkills.length) * 100}%` }}
                          className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SkillsSection;