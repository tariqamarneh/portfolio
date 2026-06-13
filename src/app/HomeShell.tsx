'use client'

import dynamic from 'next/dynamic'
import HeroSection from '../components/hero/HeroSection'
import ScrollProgressIndicator from '../components/general/ScrollProgressIndicator'
import Footer from '../components/footer/Footer'
import { ThemeProvider } from '@/components/general/GradientBackground'
import { ErrorBoundary } from '@/components/general/ErrorBoundary'
import { PortfolioDataProvider } from '@/context/PortfolioDataContext'
import SmoothScroll from '@/components/general/SmoothScroll'

// Lazy load with polished skeleton loaders. These live in a Client Component
// because Next 15 disallows `ssr: false` dynamic imports in Server Components.
const CinematicStory = dynamic(() => import('../components/story/CinematicStory'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-lumen-400 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})
const ProjectsSection = dynamic(() => import('../components/projects/ProjectsSection'), {
  loading: () => (
    <div className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <div className="h-12 w-64 rounded-lg bg-white/5 animate-pulse mb-4" />
          <div className="h-1 w-24 rounded-full bg-white/5 animate-pulse mb-6" />
          <div className="h-4 w-80 max-w-full rounded bg-white/[0.03] animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div className="md:col-span-2 md:row-span-2 h-96 rounded-2xl bg-white/[0.03] animate-pulse" />
          <div className="h-72 rounded-2xl bg-white/[0.03] animate-pulse" />
          <div className="h-72 rounded-2xl bg-white/[0.03] animate-pulse" />
        </div>
      </div>
    </div>
  ),
})
const SkillsSection = dynamic(() => import('../components/skills/SkillsSection'), {
  loading: () => (
    <div className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <div className="h-12 w-72 rounded-lg bg-white/5 animate-pulse mb-4" />
          <div className="h-1 w-24 rounded-full bg-white/5 animate-pulse mb-6" />
          <div className="h-4 w-72 rounded bg-white/[0.03] animate-pulse" />
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[0,1,2,3,4,5].map((i) => (
            <div key={i} className="h-10 w-24 rounded-full bg-white/5 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0,1,2,3,4,5].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  ),
})
const TestimonialsSection = dynamic(() => import('../components/testimonials/TestimonialsSection'), {
  loading: () => (
    <div className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <div className="h-12 w-64 rounded-lg bg-white/5 animate-pulse mb-4" />
          <div className="h-1 w-24 rounded-full bg-white/5 animate-pulse" />
        </div>
        <div className="h-48 rounded-2xl bg-white/[0.03] animate-pulse" />
      </div>
    </div>
  ),
})
const ContactSection = dynamic(() => import('../components/contact/ContactSection'), {
  loading: () => (
    <div className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <div className="h-12 w-48 rounded-lg bg-white/5 animate-pulse mb-4" />
          <div className="h-1 w-24 rounded-full bg-white/5 animate-pulse mb-6" />
          <div className="h-4 w-96 max-w-full rounded bg-white/[0.03] animate-pulse" />
        </div>
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="h-12 rounded-lg bg-white/[0.03] animate-pulse" />
          <div className="h-12 rounded-lg bg-white/[0.03] animate-pulse" />
          <div className="h-32 rounded-lg bg-white/[0.03] animate-pulse" />
          <div className="h-12 w-40 rounded-full bg-white/5 animate-pulse mx-auto" />
        </div>
      </div>
    </div>
  ),
})
const GradientBackground = dynamic(() => import('../components/general/GradientBackground'), { ssr: false })
const SpaceJourney = dynamic(() => import('../components/three/SpaceJourney'), { ssr: false })
const FloatingNav = dynamic(() => import('../components/general/FloatingNav'), { ssr: false })
const CustomCursor = dynamic(() => import('../components/effects/CustomCursor'), { ssr: false })
const SplashScreen = dynamic(() => import('../components/effects/SplashScreen'), { ssr: false })
const CommandPalette = dynamic(() => import('../components/general/CommandPalette'), { ssr: false })
const PullToContact = dynamic(() => import('../components/effects/PullToContact'), { ssr: false })

export default function HomeShell() {
  return (
    <main className="relative">
      <PortfolioDataProvider>
        <ThemeProvider>
          <SmoothScroll>
            <CustomCursor />
            <SplashScreen>
              <GradientBackground />
              <SpaceJourney />
              <FloatingNav />
              <CommandPalette />
              <div className="relative z-10">
                <ScrollProgressIndicator />

                <ErrorBoundary>
                  <HeroSection />
                </ErrorBoundary>

                <ErrorBoundary>
                  <CinematicStory />
                </ErrorBoundary>

                <ErrorBoundary>
                  <ProjectsSection />
                </ErrorBoundary>

                <ErrorBoundary>
                  <SkillsSection />
                </ErrorBoundary>

                <ErrorBoundary>
                  <TestimonialsSection />
                </ErrorBoundary>

                <ErrorBoundary>
                  <ContactSection />
                </ErrorBoundary>

                <ErrorBoundary>
                  <Footer />
                </ErrorBoundary>
              </div>
              <PullToContact />
            </SplashScreen>
          </SmoothScroll>
        </ThemeProvider>
      </PortfolioDataProvider>
    </main>
  )
}
