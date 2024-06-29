// src/components/ProjectsSection.tsx
'use client'

import { motion } from 'framer-motion'
import ScrollAnimationWrapper from './ScrollAnimationWrapper'
import { useState } from 'react'

type Project = {
  title: string
  description: string
  technologies: string[]
  imageUrl: string
  linkUrl: string
}

const projects: Project[] = [
  {
    title: "DocViz",
    description: "A web app that summarizes documents and extract key phrases and insights using AI.",
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

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div 
      className="glass-effect rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative h-64">
        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-contain" />
        <motion.div 
          className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <a 
            href={project.linkUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-full hover:from-indigo-600 hover:to-purple-700 transition duration-300"
          >
            View Project
          </a>
        </motion.div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 text-white">{project.title}</h3>
        <p className="text-indigo-200 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span key={index} className="px-3 py-1 bg-indigo-800 text-indigo-200 text-sm font-semibold rounded-full">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-8 md:px-16">
        <ScrollAnimationWrapper>
          <h2 className="text-5xl font-bold mb-16 text-center neon-text">
            Projects
          </h2>
        </ScrollAnimationWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <ScrollAnimationWrapper key={project.title} animation="slide-in">
              <ProjectCard project={project} />
            </ScrollAnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}