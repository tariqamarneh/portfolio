'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import React, { useState, useRef } from 'react'
import { ExternalLink, Github as GithubIcon } from 'lucide-react'
import Github from '../../../public/Github'
import { useTheme } from '@/components/general/GradientBackground'
import Image from 'next/image'

type Project = {
  title: string
  description: string
  technologies: string[]
  imageUrl: string
  linkUrl: string
  color: string
}

const projects: Project[] = [
  {
    title: "Hogwarts artifacts",
    description: "Back-end application designed to demonstrate typical use cases and best practices in Spring Boot development",
    technologies: ["Java", "Spring Boot", "CI/CD", "Azure"],
    imageUrl: "/images/hogwarts.png",
    linkUrl: "https://github.com/tariqamarneh/hogwarts-artifacts-online",
    color: "#FF6B6B"
  },
  {
    title: "DocViz",
    description: "A web app that summarizes documents and extract key phrases and insights using the power of AI.",
    technologies: ["Python", "Next.js", "FastAPI", "MongoDB"],
    imageUrl: "/images/docviz.png",
    linkUrl: "https://docviz.online",
    color: "#4ECDC4"
  },
  {
    title: "AiRefMe",
    description: "A web app with three chatbots, normal chat, chat with your document, and weather API chatbot",
    technologies: ["Python", "selenium", "FastAPI", "Langchain", "JavaScript"],
    imageUrl: "/images/airefme.png",
    linkUrl: "https://github.com/tariqamarneh/AI_Reference_Application",
    color: "#45B7D1"
  },
  {
    title: "AccesibilityHelper",
    description: "Application that will add a little a button to any website you visit, that will perform any action you want, eather by writing it or by voice command.",
    technologies: ["Python", "MongoDB", "FastAPI", "Langchain"],
    imageUrl: "/images/accesHelp.png",
    linkUrl: "https://github.com/tariqamarneh/AccesibilityHelper",
    color: "#96CEB4"
  },
]

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { isDark } = useTheme()
  const cardRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["0 1", "1.2 1"]
  })

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1])

  const cardVariants = {
    initial: {
      y: 60,
      opacity: 0,
      scale: 0.8,
    },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: index * 0.2
      }
    }
  }

  const overlayVariants = {
    hidden: {
      opacity: 0,
      backdropFilter: "blur(0px)"
    },
    visible: {
      opacity: 1,
      backdropFilter: "blur(3px)",
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <motion.div
      ref={cardRef}
      style={{ scale, opacity }}
      variants={cardVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className={`
        group relative rounded-2xl overflow-hidden
        ${isDark ? 'bg-gray-900/50' : 'bg-white/50'}
        backdrop-blur-sm border border-gray-200/10
        hover:border-${project.color}/30
        transition-all duration-300 ease-out
        shadow-[0_0_30px_rgba(0,0,0,0.1)]
        hover:shadow-[0_0_50px_rgba(0,0,0,0.15)]
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glass Morphism Effect */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `
            radial-gradient(circle at top left, ${project.color}40, transparent),
            radial-gradient(circle at bottom right, ${project.color}20, transparent)
          `
        }}
      />

      {/* Project Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-cover transform transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <motion.div
          className="absolute inset-0"
          variants={overlayVariants}
          initial="hidden"
          animate={isHovered ? "visible" : "hidden"}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80" />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.a
              href={project.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center gap-2 px-8 py-3 rounded-full
                bg-white text-gray-900 font-semibold
                hover:bg-gray-100 transform
                transition-all duration-300
                shadow-[0_0_20px_rgba(255,255,255,0.3)]
                hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]
              "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {project.linkUrl.includes('github.com') ? (
                <>
                  <GithubIcon className="w-5 h-5" />
                  View on GitHub
                </>
              ) : (
                <>
                  <ExternalLink className="w-5 h-5" />
                  Visit Project
                </>
              )}
            </motion.a>
          </div>
        </motion.div>

        {/* Project Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pt-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <motion.h3
            className="text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {project.title}
          </motion.h3>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, techIndex) => (
            <motion.span
              key={techIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + techIndex * 0.1 }}
              className={`
                px-3 py-1 text-sm font-medium rounded-full
                border backdrop-blur-sm
                ${isDark
                  ? 'bg-gray-800/50 text-gray-300 border-gray-700/50'
                  : 'bg-gray-100/50 text-gray-800 border-gray-200/50'
                }
                hover:border-${project.color}/50
                transition-colors duration-300
              `}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const ProjectsSection: React.FC = () => {
  const { isDark } = useTheme()
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-16 relative overflow-hidden"
    >
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
          className="text-center mb-20"
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
                My Projects
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
            Explore my latest projects and technical achievements
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
