'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ExternalLink, Github } from 'lucide-react'
import ScrollAnimationWrapper from '../general/ScrollAnimationWrapper'

type Project = {
  title: string
  description: string
  technologies: string[]
  imageUrl: string
  linkUrl: string
}

const projects: Project[] = [
  {
    title: "Hogwarts artifacts",
    description: "Back-end application designed to demonstrate typical use cases and best practices in Spring Boot development",
    technologies: ["Java", "Spring Boot", "CI/CD", "Azure"],
    imageUrl: "/images/hogwarts.png",
    linkUrl: "https://github.com/tariqamarneh/hogwarts-artifacts-online"
  },
  {
    title: "DocViz",
    description: "A web app that summarizes documents and extract key phrases and insights using the power of AI.",
    technologies: ["Python", "Next.js", "FastAPI", "MongoDB"],
    imageUrl: "/images/docviz.png",
    linkUrl: "https://docviz.online"
  },
  {
    title: "AiRefMe",
    description: "A web app with three chatbots, normal chat, chat with your document, and weather API chatbot",
    technologies: ["Python", "selenium", "FastAPI", "Langchain", "JavaScript"],
    imageUrl: "/images/airefme.png",
    linkUrl: "https://github.com/tariqamarneh/AI_Reference_Application"
  },
  {
    title: "AccesibilityHelper",
    description: "Application that will add a little a button to any website you visit, that will perform any action you want, eather by writing it or by voice command.",
    technologies: ["Python", "MongoDB", "FastAPI", "Langchain"],
    imageUrl: "/images/accesHelp.png",
    linkUrl: "https://github.com/tariqamarneh/AccesibilityHelper"
  },
]

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false)

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
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

  const isGithubLink = project.linkUrl.includes('github.com')

  return (
    <ScrollAnimationWrapper>
      <motion.div
        className="relative rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50"
        variants={cardVariants}
        custom={index}
        initial="hidden"
        whileInView="visible"
        whileHover="hover"
        viewport={{ once: true, margin: "-50px" }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <motion.img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-contain"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/60"
            variants={overlayVariants}
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
          >
            <a
              href={project.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:from-indigo-700 hover:to-purple-700 transform transition-all duration-300 hover:scale-105"
            >
              {isGithubLink ? <Github className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
              {isGithubLink ? 'View on GitHub' : 'Visit Project'}
            </a>
          </motion.div>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {project.title}
          </h3>
          <p className="text-gray-300 mb-4 line-clamp-2 hover:line-clamp-none transition-all duration-300">
            {project.description}
          </p>
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {project.technologies.map((tech, index) => (
              <motion.span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 text-indigo-200 text-sm font-medium rounded-full border border-indigo-700/30"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </ScrollAnimationWrapper>
  )
}

const ProjectsSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <ScrollAnimationWrapper>
            <motion.h2
              className="text-5xl font-bold mb-16 text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
              variants={titleVariants}
            >
              Projects
            </motion.h2>
          </ScrollAnimationWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProjectsSection