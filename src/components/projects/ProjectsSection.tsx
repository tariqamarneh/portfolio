'use client'

import React from 'react'
import { ExternalLink, Github as GithubIcon, Star, ArrowUpRight, Calendar } from 'lucide-react'
import { useTheme } from '../general/GradientBackground'
import Image from 'next/image'
import { usePortfolioData } from '@/context/PortfolioDataContext'
import ReactMarkdown from 'react-markdown'
import { StackingCards, StackingCard } from '@/components/ui/stacking-cards'

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  imageUrl: string
  linkUrl: string
  date: string
  isFeatured?: boolean
  sortOrder: number
  linkType: 'live' | 'github' | 'both'
  githubUrl?: string
}

/**
 * Browser-window chrome for screenshots — traffic lights + URL pill.
 */
const BrowserChrome: React.FC<{
  title: string
  isDark: boolean
  linkType: string
  children: React.ReactNode
}> = ({ title, isDark, linkType, children }) => {
  const hostname = title.toLowerCase().replace(/\s+/g, '-').slice(0, 24)

  return (
    <div
      className={`
        relative w-full h-full overflow-hidden
        ${isDark ? 'bg-ink-950' : 'bg-paper-100'}
      `}
    >
      <div
        className={`
          flex items-center gap-2 px-3 py-2.5 border-b
          ${isDark ? 'bg-ink-900 border-ink-700/70' : 'bg-paper-50 border-ink-800/8'}
        `}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div
          className={`
            flex-1 mx-2 sm:mx-4 px-3 py-1 rounded-md font-mono text-[10px] truncate
            flex items-center gap-1.5
            ${isDark
              ? 'bg-ink-950/70 text-ink-300 border border-ink-700/50'
              : 'bg-paper-100 text-ink-600 border border-ink-800/5'}
          `}
        >
          <span className="text-ember-500">●</span>
          <span className="truncate">
            {linkType === 'github' ? `github.com/${hostname}` : `${hostname}.app`}
          </span>
        </div>
        <div className="w-12 hidden sm:block" />
      </div>
      <div className="relative w-full" style={{ height: 'calc(100% - 40px)' }}>
        {children}
      </div>
    </div>
  )
}

/**
 * Full project card — image with browser chrome on the left, content on the right.
 * Used inside a <StackingCard> slot.
 */
const ProjectCardBody: React.FC<{ project: Project; index: number; total: number }> = ({
  project,
  index,
  total,
}) => {
  const { isDark } = useTheme()
  const linkType = project.linkType || (project.linkUrl.includes('github.com') ? 'github' : 'live')

  return (
    <article
      className={`
        group w-full rounded-3xl overflow-hidden flex flex-col md:flex-row
        border shadow-[0_40px_90px_-30px_rgba(0,0,0,0.45)]
        ${isDark
          ? 'bg-ink-900/90 border-ink-700'
          : 'bg-paper-50/95 border-ink-800/10'}
      `}
    >
      {/* Image column — 55% on desktop */}
      <div
        className={`
          relative md:w-[55%] h-48 sm:h-56 md:h-auto shrink-0 p-4 md:p-5
          ${isDark
            ? 'bg-gradient-to-br from-ink-800/80 to-ink-950'
            : 'bg-gradient-to-br from-paper-100 to-paper-200/60'}
        `}
      >
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top right, rgba(255,112,67,0.18), transparent 55%)' }}
          aria-hidden="true"
        />
        <div className="relative w-full h-full rounded-xl overflow-hidden ring-1 ring-inset ring-ink-700/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]">
          <BrowserChrome title={project.title} isDark={isDark} linkType={linkType}>
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 90vw, 50vw"
              className="object-cover object-top"
              loading={index < 2 ? 'eager' : 'lazy'}
            />
            <div
              className="absolute inset-x-0 top-0 h-12 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(10,8,7,0.25), transparent)' }}
            />
          </BrowserChrome>
        </div>

        {project.isFeatured && (
          <div className="absolute top-6 right-6 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ember-500 text-ink-950 font-medium text-[10px] uppercase tracking-[0.15em] shadow-lg z-10">
            <Star className="w-3 h-3 fill-current" strokeWidth={2} />
            Featured
          </div>
        )}
      </div>

      {/* Content column */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-center min-w-0">
        <div
          className={`flex items-center justify-between gap-3 mb-5 font-mono text-[10px] uppercase tracking-[0.18em] ${isDark ? 'text-ink-400' : 'text-ink-500'}`}
        >
          <span className="flex items-center gap-2">
            <Calendar className="w-3 h-3" strokeWidth={2} />
            {project.date}
          </span>
          <span className="tabular-nums">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        <h3
          className={`font-display text-2xl sm:text-3xl md:text-4xl leading-[1.03] mb-4 ${isDark ? 'text-ink-100' : 'text-ink-950'}`}
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 40' }}
        >
          {project.title}
        </h3>

        <div className={`mb-5 text-sm md:text-base leading-relaxed line-clamp-4 ${isDark ? 'text-ink-300' : 'text-ink-700'}`}>
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="my-0">{children}</p>,
              a: ({ children, href }) => (
                <a href={href} className="text-ember-500 hover:text-ember-400">
                  {children}
                </a>
              ),
            }}
          >
            {project.description}
          </ReactMarkdown>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.technologies.slice(0, 7).map((tech, i) => (
            <span
              key={i}
              className={`
                px-2.5 py-0.5 rounded-full font-mono text-[10px]
                ${isDark
                  ? 'bg-ink-800/80 text-ink-300 border border-ink-700/70'
                  : 'bg-paper-100 text-ink-700 border border-ink-800/10'}
              `}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 7 && (
            <span className={`px-2 font-mono text-[10px] ${isDark ? 'text-ink-500' : 'text-ink-400'}`}>
              +{project.technologies.length - 7}
            </span>
          )}
        </div>

        <div
          className={`flex items-center gap-5 pt-5 mt-auto border-t ${isDark ? 'border-ink-700' : 'border-ink-800/10'}`}
        >
          <a
            href={project.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              inline-flex items-center gap-2 text-sm font-medium transition-colors
              ${isDark ? 'text-ember-400 hover:text-ember-300' : 'text-ember-600 hover:text-ember-500'}
            `}
          >
            {linkType === 'github' ? (
              <>
                <GithubIcon className="w-4 h-4" strokeWidth={2} /> View source
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" strokeWidth={2} /> Visit project
              </>
            )}
            <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
          </a>
          {linkType === 'both' && project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                inline-flex items-center gap-2 text-sm font-medium transition-colors
                ${isDark ? 'text-ink-400 hover:text-ember-400' : 'text-ink-500 hover:text-ember-600'}
              `}
            >
              <GithubIcon className="w-4 h-4" strokeWidth={2} /> Repo
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

const ProjectsSection: React.FC = () => {
  const { isDark } = useTheme()
  const { projects } = usePortfolioData()
  const allProjects = [...projects].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

  if (allProjects.length === 0) {
    return <section id="projects" className="section-padding" />
  }

  // Header is rendered INSIDE StackingCards as a sticky element so it stays
  // visible while cards stack below it.
  const header = (
    <div
      className={`
        h-full w-full flex items-end
        bg-gradient-to-b from-ink-950 via-ink-950/95 to-transparent
        ${isDark ? '' : 'from-paper-50 via-paper-50/95'}
        pointer-events-none
      `}
    >
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-10 lg:px-12 pt-16 md:pt-20 pb-6 pointer-events-auto">
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-12 md:col-span-8">
            <div className="flex items-center gap-3 mb-2 md:mb-3">
              <span className="w-8 h-px bg-ember-500" />
              <span className="eyebrow">Chapter · 03 / Work</span>
            </div>
            <h2
              className={`font-display leading-[0.95] tracking-tight ${isDark ? 'text-ink-100' : 'text-ink-950'}`}
              style={{
                fontVariationSettings: '"opsz" 144, "SOFT" 40',
                fontSize: 'clamp(1.75rem, 5vw, 3.75rem)',
              }}
            >
              Selected{' '}
              <span
                className="italic text-sun"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                work.
              </span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 flex md:justify-end">
            <p className={`text-sm md:text-base leading-relaxed ${isDark ? 'text-ink-400' : 'text-ink-600'}`}>
              {allProjects.length} case{allProjects.length === 1 ? '' : 's'} — scroll to stack.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <section id="projects" className="relative">
      <StackingCards header={header}>
        {allProjects.map((project, i) => (
          <StackingCard key={project.id}>
            <ProjectCardBody project={project} index={i} total={allProjects.length} />
          </StackingCard>
        ))}
      </StackingCards>
    </section>
  )
}

export default ProjectsSection