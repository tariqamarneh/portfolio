'use client'

import { motion } from 'framer-motion'
import React from 'react'
import { ExternalLink, Github as GithubIcon, Star, Calendar } from 'lucide-react'
import { useTheme } from '../general/GradientBackground'
import Image from 'next/image'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import { useTilt } from '@/hooks/useTilt'

type BentoSize = 'large' | 'tall' | 'standard'

function getBentoSize(index: number, isFeatured: boolean): BentoSize {
  if (isFeatured) return 'large'
  if (index === 1) return 'tall'
  return 'standard'
}

function getBentoClasses(size: BentoSize): string {
  switch (size) {
    case 'large': return 'md:col-span-2 md:row-span-2'
    case 'tall': return 'md:row-span-2'
    case 'standard': return ''
  }
}

const ProjectCard = React.memo<{ project: Project; isFeatured?: boolean; index: number; bentoSize: BentoSize }>(({ project, isFeatured, index, bentoSize }) => {
  const { isDark } = useTheme()
  const isLive = !project.linkUrl.includes('github.com')
  const { ref, style: tiltStyle, onMouseMove, onMouseLeave } = useTilt(8)

  const imageHeight = bentoSize === 'large' ? 'h-72 md:h-80' : bentoSize === 'tall' ? 'h-52 md:h-64' : 'h-52'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      style={tiltStyle}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`
        group relative rounded-2xl overflow-hidden
        ${isDark ? 'bg-gray-900/50' : 'bg-white/50'}
        border ${isFeatured ? 'border-cyan-500/30' : 'border-white/10'}
        transition-all duration-300 hover:border-cyan-500/30
        ${getBentoClasses(bentoSize)}
      `}
    >
      {/* Badges Container */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        {isFeatured && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-current" />
            Featured
          </div>
        )}

        <span className={`
          px-3 py-1.5 rounded-full text-xs font-medium
          ${isLive
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
          }
        `}>
          {isLive ? '● Live Demo' : '◐ GitHub Only'}
        </span>
      </div>

      {/* Project Image */}
      <div className={`relative ${imageHeight} overflow-hidden`}>
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
          <h3 className={`${isFeatured ? 'text-2xl' : 'text-xl'} font-bold text-white font-display`}>{project.title}</h3>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-5">
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
    </motion.div>
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
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-display">
            <span className={isDark ? 'gradient-text' : 'gradient-text-light'}>
              My Projects
            </span>
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-full" />
          <p className={`mt-6 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Building solutions that solve real problems
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[minmax(200px,auto)] gap-4 lg:gap-6">
          {featuredProject && (
            <ProjectCard project={featuredProject} isFeatured index={0} bentoSize="large" />
          )}
          {otherProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index + 1}
              bentoSize={getBentoSize(index + 1, false)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
