'use client'

import React from 'react'
import { ExternalLink, Star, ArrowUpRight, Calendar } from 'lucide-react'
import { Github as GithubIcon } from '@/components/icons/BrandIcons'
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

// Two letters distilled from the title — a little maker's mark per project.
const monogram = (title: string) => {
  const words = title.replace(/[^a-zA-Z ]/g, ' ').split(/\s+/).filter(Boolean)
  if (words.length === 0) return '··'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

/**
 * Image-free project card — a "mission dossier". A generative accent panel
 * (glowing monogram, oversized index, hairline grid, corner brackets) on the
 * left; the write-up on the right. Accent alternates teal / indigo down the
 * stack so the deck reads with rhythm.
 */
const ProjectCardBody: React.FC<{ project: Project; index: number; total: number }> = ({
  project,
  index,
  total,
}) => {
  const linkType = project.linkType || (project.linkUrl.includes('github.com') ? 'github' : 'live')
  const teal = index % 2 === 0
  const accent = teal ? '#4cdcca' : '#7c8cf8'
  const accentSoft = teal ? 'rgba(76,220,202,0.14)' : 'rgba(124,140,248,0.14)'

  return (
    <article
      className="group relative w-full rounded-3xl overflow-hidden flex flex-col md:flex-row
        border border-abyss-600/60 bg-abyss-900/90 backdrop-blur-md
        shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)] transition-colors duration-500"
      style={{ ['--accent' as string]: accent }}
    >
      {/* hover halo */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: `inset 0 1px 0 ${accentSoft}, 0 0 0 1px ${accentSoft}` }}
        aria-hidden
      />

      {/* ── Accent dossier panel ── */}
      <div className="relative md:w-[40%] shrink-0 overflow-hidden p-6 md:p-8 flex flex-col justify-between
        min-h-[210px] md:min-h-[320px]
        bg-gradient-to-br from-abyss-800/70 to-abyss-950">
        {/* radial accent glow */}
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-70 group-hover:opacity-100"
          style={{ background: `radial-gradient(ellipse 80% 70% at 25% 20%, ${accentSoft}, transparent 60%)` }} aria-hidden />
        {/* hairline grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.5]"
          style={{
            backgroundImage: 'linear-gradient(rgba(226,233,245,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(226,233,245,0.04) 1px, transparent 1px)',
            backgroundSize: '38px 38px',
            maskImage: 'radial-gradient(ellipse at 30% 30%, black 30%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 30% 30%, black 30%, transparent 80%)',
          }} aria-hidden />
        {/* oversized index watermark */}
        <span className="pointer-events-none absolute -bottom-6 -right-2 font-display font-bold leading-none select-none tabular-nums
          text-[9rem] md:text-[12rem]"
          style={{ color: accent, opacity: 0.07 }} aria-hidden>
          {String(index + 1).padStart(2, '0')}
        </span>
        {/* corner brackets */}
        <span className="absolute top-4 left-4 w-4 h-4 border-l border-t" style={{ borderColor: `${accent}66` }} aria-hidden />
        <span className="absolute bottom-4 right-4 w-4 h-4 border-r border-b" style={{ borderColor: `${accent}66` }} aria-hidden />

        {/* top row — featured / status */}
        <div className="relative flex items-center justify-between">
          <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-abyss-400">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: accent }} />
            {linkType === 'github' ? 'open source' : 'deployed'}
          </span>
          {project.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-[0.15em] font-medium text-abyss-950"
              style={{ background: accent }}>
              <Star className="w-2.5 h-2.5 fill-current" strokeWidth={2} /> Featured
            </span>
          )}
        </div>

        {/* monogram mark */}
        <div className="relative">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl border bg-abyss-950/60 backdrop-blur-sm
            transition-transform duration-500 group-hover:-translate-y-0.5"
            style={{ borderColor: `${accent}55`, boxShadow: `0 10px 40px -12px ${accent}` }}>
            <span className="font-display font-bold text-2xl md:text-3xl" style={{ color: accent }}>
              {monogram(project.title)}
            </span>
          </div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-abyss-400">
            {project.technologies[0] ?? 'project'}
            <span className="text-abyss-600"> · </span>
            {project.date}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-center min-w-0">
        <div className="flex items-center justify-between gap-3 mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-abyss-400">
          <span className="flex items-center gap-2">
            <Calendar className="w-3 h-3" strokeWidth={2} />
            {project.date}
          </span>
          <span className="tabular-nums">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl leading-[1.05] mb-4 text-abyss-100">
          {project.title}
        </h3>

        <div className="mb-5 text-sm md:text-base leading-relaxed line-clamp-4 font-light text-abyss-300">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="my-0">{children}</p>,
              a: ({ children, href }) => (
                <a href={href} className="text-lumen-400 hover:text-lumen-300">
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
              className="px-2.5 py-0.5 rounded-full font-mono text-[10px]
                bg-abyss-800/80 text-abyss-300 border border-abyss-700/70"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 7 && (
            <span className="px-2 font-mono text-[10px] text-abyss-500">
              +{project.technologies.length - 7}
            </span>
          )}
        </div>

        <div className="flex items-center gap-5 pt-5 mt-auto border-t border-abyss-700">
          <a
            href={project.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors text-lumen-400 hover:text-lumen-300"
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
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
          </a>
          {linkType === 'both' && project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors text-abyss-400 hover:text-lumen-400"
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
  const { projects } = usePortfolioData()
  const allProjects = [...projects].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

  if (allProjects.length === 0) {
    return <section id="projects" className="section-padding" />
  }

  // Header is rendered INSIDE StackingCards as a sticky element so it stays
  // visible while cards stack below it.
  const header = (
    <div className="h-full w-full flex items-end pointer-events-none">
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-10 lg:px-12 pt-16 md:pt-20 pb-6 pointer-events-auto">
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-12 md:col-span-8">
            <div className="flex items-center gap-3 mb-2 md:mb-3">
              <span className="w-8 h-px bg-lumen-400" />
              <span className="eyebrow">Chapter · 03 / Work</span>
            </div>
            <h2
              className="font-display leading-[1] tracking-tight text-abyss-100"
              style={{ fontSize: 'clamp(1.75rem, 5vw, 3.5rem)' }}
            >
              Selected{' '}
              <span className="text-lumen">work.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 flex md:justify-end">
            <p className="text-sm md:text-base leading-relaxed font-light text-abyss-400">
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
