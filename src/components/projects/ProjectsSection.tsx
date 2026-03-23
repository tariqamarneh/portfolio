'use client'

import { motion } from 'framer-motion'
import React from 'react'
import { ExternalLink, Github as GithubIcon, Star, Calendar } from 'lucide-react'
import { useTheme } from '../general/GradientBackground'
import Image from 'next/image'
import { usePortfolioData } from '@/context/PortfolioDataContext'

const ProjectCard = React.memo<{ project: Project; isFeatured?: boolean }>(({ project, isFeatured }) => {
  const { isDark } = useTheme()
  const isLive = !project.linkUrl.includes('github.com')

  return (
    <div
      className={`
        group relative rounded-2xl overflow-hidden
        ${isDark ? 'bg-gray-900/50' : 'bg-white/50'}
        border ${isFeatured ? 'border-blue-500/50' : 'border-white/10'}
        transition-all duration-300
        ${isFeatured ? 'md:col-span-2' : ''}
      `}
    >
      {/* Badges Container */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        {/* Featured Badge */}
        {isFeatured && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-current" />
            Featured
          </div>
        )}

        {/* Status Badge */}
        <span className={`
          px-3 py-1.5 rounded-full text-xs font-medium
          ${isLive
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
          }
        `}>
          {isLive ? '● Live Demo' : '◐ GitHub Only'}
        </span>
      </div>
      {/* End Badges Container */}

      {/* Project Image */}
      <div className={`relative ${isFeatured ? 'h-72' : 'h-52'} overflow-hidden`}>
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <a
            href={project.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors"
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
          </a>
        </div>

        {/* Project Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className={`${isFeatured ? 'text-2xl' : 'text-xl'} font-bold text-white`}>{project.title}</h3>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-5">
        {/* Date */}
        <div className={`flex items-center gap-1.5 mb-3 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <Calendar className="w-4 h-4" />
          {project.date}
        </div>

        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4 ${isFeatured ? 'text-base' : 'text-sm'}`}>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, techIndex) => (
            <span
              key={techIndex}
              className={`
                px-2.5 py-1 text-xs font-medium rounded-full
                ${isDark
                  ? 'bg-gray-800 text-gray-300'
                  : 'bg-gray-100 text-gray-700'
                }
              `}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
})
ProjectCard.displayName = 'ProjectCard'

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  imageUrl: string
  linkUrl: string
  date: string
  isFeatured?: boolean
}

const ProjectsSection: React.FC = () => {
  const { isDark } = useTheme()
  const { projects } = usePortfolioData()

  const featuredProject = projects.find(p => p.isFeatured)
  const otherProjects = projects.filter(p => !p.isFeatured)

  return (
    <section id="projects" className="section-padding relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className={isDark ? 'gradient-text' : 'gradient-text-light'}>
              My Projects
            </span>
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          <p className={`mt-6 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Building solutions that solve real problems
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {featuredProject && (
            <ProjectCard project={featuredProject} isFeatured />
          )}
          {otherProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
