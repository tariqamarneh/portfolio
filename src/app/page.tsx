// src/app/page.tsx
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/HeroSection'
import ProjectsSection from '@/components/ProjectsSection'
import SkillsSection from '@/components/SkillsSection'
import JourneySection from '@/components/JourneySection'
import ContactSection from '@/components/ContactSection'
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator'

const GradientBackground = dynamic(() => import('@/components/GradientBackground'), {
  ssr: false,
})


const AudioEasterEgg = dynamic(() => import('@/components/AudioEasterEgg'), {
  ssr: false,
})

export const metadata: Metadata = {
  title: 'Tariq Amarneh - Web Developer & AI Enthusiast',
  description: 'Portfolio of a web developer specializing in Next.js, Python, and Generative AI',
}

export default function Home() {
  return (
    <main className="relative">
      <GradientBackground />
      <div className="relative z-10">
        <ScrollProgressIndicator/>
        <HeroSection />
        <ProjectsSection />
        <SkillsSection />
        <JourneySection />
        <ContactSection />
      </div>
      <AudioEasterEgg />
    </main>
  )
}