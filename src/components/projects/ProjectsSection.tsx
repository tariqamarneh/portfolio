'use client'

import { motion } from 'framer-motion'
import React, { useRef, useEffect, useState } from 'react'
import { ExternalLink, Github as GithubIcon, Star, Calendar, ArrowRight } from 'lucide-react'
import { useTheme } from '../general/GradientBackground'
import Image from 'next/image'
import { usePortfolioData } from '@/context/PortfolioDataContext'

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

const HorizontalProjectCard = React.memo<{ project: Project; isFeatured?: boolean; index: number; total: number }>(
  ({ project, isFeatured, index, total }) => {
    const { isDark } = useTheme()
    const isLive = !project.linkUrl.includes('github.com')

    return (
      <div
        className={`
          group relative h-full rounded-2xl overflow-hidden
          ${isDark ? 'bg-gray-900/60' : 'bg-white/40'}
          border ${isFeatured ? 'border-cyan-500/30' : isDark ? 'border-white/10' : 'border-stone-200/30'}
          transition-all duration-300 hover:border-cyan-500/30
          hover:shadow-xl ${isDark ? 'hover:shadow-cyan-500/10' : 'hover:shadow-gray-300/30'}
          flex flex-col md:flex-row
        `}
      >
        {/* Image */}
        <div className="relative md:w-[55%] h-40 md:h-auto overflow-hidden shrink-0">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover project-img-pan"
            sizes="(max-width: 768px) 85vw, 40vw"
            loading="lazy"
          />

          <div className="absolute top-4 left-4 flex items-center gap-2">
            {isFeatured && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                Featured
              </div>
            )}
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
              isLive
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
            }`}>
              {isLive ? '● Live Demo' : '◐ GitHub Only'}
            </span>
          </div>

          <div className={`absolute bottom-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium ${
            isDark ? 'bg-black/40 text-gray-300' : 'bg-white/60 text-gray-600'
          } backdrop-blur-sm`}>
            {index + 1} / {total}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 flex flex-col justify-center">
          <h3 className={`text-xl md:text-3xl font-bold mb-2 md:mb-3 font-display ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {project.title}
          </h3>

          <div className={`flex items-center gap-1.5 mb-2 md:mb-4 text-xs md:text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
            {project.date}
          </div>

          <p className={`mb-3 md:mb-6 text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-none ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-6">
            {project.technologies.map((tech, i) => (
              <span key={i} className={`px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-medium rounded-full ${
                isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                {tech}
              </span>
            ))}
          </div>

          <a
            href={project.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200
              ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}
            `}
          >
            {project.linkUrl.includes('github.com') ? (
              <><GithubIcon className="w-4 h-4" /> View on GitHub</>
            ) : (
              <><ExternalLink className="w-4 h-4" /> Visit Project</>
            )}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    )
  }
)
HorizontalProjectCard.displayName = 'HorizontalProjectCard'

const ProjectsSection: React.FC = () => {
  const { isDark } = useTheme()
  const { projects } = usePortfolioData()
  const sectionRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const featuredProject = projects.find(p => p.isFeatured)
  const otherProjects = projects.filter(p => !p.isFeatured)
  const allProjects = [...(featuredProject ? [featuredProject] : []), ...otherProjects]
  const numCards = allProjects.length || 1

  const [sectionHeight, setSectionHeight] = useState('400vh')

  useEffect(() => {
    const updateHeight = () => {
      const isMobile = window.innerWidth < 768
      setSectionHeight(isMobile ? `${numCards * 80}vh` : `${numCards * 100}vh`)
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [numCards])

  // Single scroll handler: pinning (direct DOM) + lerp-smoothed horizontal translation + progress bar
  // Pinning is done via direct style mutations instead of React state to avoid re-renders/flashing
  // Horizontal movement uses lerp interpolation (inspired by Codrops parallax gallery) for buttery motion
  useEffect(() => {
    let lastPinState = ''
    let targetX = 0
    let currentX = 0
    let targetProgress = 0
    let currentProgress = 0
    let rafId: number
    let dynamicEase = 0.08
    let lastScrollY = window.scrollY
    let lastScrollTime = performance.now()

    const EASE_MIN = 0.04  // slow/precise drag
    const EASE_MAX = 0.14  // fast flick momentum
    const EASE_DECAY = 0.92 // how fast ease returns to baseline

    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor

    // Scroll listener: reads scroll position, measures velocity, computes targets
    const handleScroll = () => {
      // Measure scroll velocity to scale lerp ease dynamically
      const now = performance.now()
      const dt = now - lastScrollTime
      const dy = Math.abs(window.scrollY - lastScrollY)
      lastScrollTime = now
      lastScrollY = window.scrollY

      if (dt > 0) {
        const velocity = dy / dt // px per ms
        // Map velocity (0..3 px/ms) to ease range
        const velocityFactor = Math.min(velocity / 3, 1)
        dynamicEase = EASE_MIN + (EASE_MAX - EASE_MIN) * velocityFactor
      }
      if (!sectionRef.current || !innerRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const vh = window.innerHeight
      const scrollDistance = sectionRef.current.offsetHeight - vh

      // Pinning via direct DOM mutations (no React state = no re-renders)
      let pinState: string
      if (rect.top <= 0 && rect.bottom > vh) {
        pinState = 'pinned'
      } else if (rect.bottom <= vh) {
        pinState = 'after'
      } else {
        pinState = 'before'
      }

      if (pinState !== lastPinState) {
        lastPinState = pinState
        const el = innerRef.current
        if (pinState === 'pinned') {
          el.style.position = 'fixed'
          el.style.top = '0'
          el.style.bottom = ''
        } else if (pinState === 'after') {
          el.style.position = 'absolute'
          el.style.top = ''
          el.style.bottom = '0'
        } else {
          el.style.position = 'relative'
          el.style.top = ''
          el.style.bottom = ''
        }
      }

      // Update targets for lerp loop
      if (scrollDistance > 0) {
        const progress = Math.min(Math.max(-rect.top / scrollDistance, 0), 1)
        if (trackRef.current) {
          const maxT = Math.max(trackRef.current.scrollWidth - window.innerWidth + 40, 0)
          targetX = -progress * maxT
        }
        targetProgress = progress
      }
    }

    // Render loop: lerps currentX toward targetX every frame (smooth motion)
    // Ease decays toward baseline between scroll events for natural deceleration
    const tick = () => {
      dynamicEase = lerp(dynamicEase, EASE_MIN, 1 - EASE_DECAY)
      currentX = lerp(currentX, targetX, dynamicEase)
      currentProgress = lerp(currentProgress, targetProgress, dynamicEase)

      // Only write to DOM if still moving (> 0.5px from target)
      if (Math.abs(currentX - targetX) > 0.5) {
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${currentX}px, 0, 0)`
        }
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${currentProgress})`
        }
      } else if (currentX !== targetX) {
        // Snap to final position
        currentX = targetX
        currentProgress = targetProgress
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${targetX}px, 0, 0)`
        }
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${targetProgress})`
        }
      }

      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  if (allProjects.length === 0) {
    return <section id="projects" className="section-padding" />
  }

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative"
      style={{ height: sectionHeight }}
    >
      <div ref={innerRef} className="left-0 right-0 h-screen z-30 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
          whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="text-center pt-12 md:pt-20 pb-4 md:pb-6 px-4 shrink-0"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-display">
            <span className={isDark ? 'gradient-text' : 'gradient-text-light'}>
              My Projects
            </span>
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-full" />
          <p className={`mt-4 text-lg hidden md:block ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Building solutions that solve real problems
          </p>
        </motion.div>

        {/* Horizontal track */}
        <div className="flex-1 min-h-0 flex items-center overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-6 h-[85%] md:h-[70%] pl-[8vw] pr-[8vw]"
            style={{ willChange: 'transform' }}
          >
            {allProjects.map((project, index) => (
              <div
                key={project.id}
                className="w-[75vw] md:w-[70vw] lg:w-[55vw] h-full shrink-0"
              >
                <HorizontalProjectCard
                  project={project}
                  isFeatured={project.isFeatured}
                  index={index}
                  total={allProjects.length}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-8 pb-8 shrink-0">
          <div className={`h-0.5 rounded-full max-w-xs mx-auto overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <div
              ref={progressBarRef}
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
          <p className={`text-center text-xs mt-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            Scroll to explore projects
          </p>
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
