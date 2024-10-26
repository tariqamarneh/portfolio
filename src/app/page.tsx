import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/hero/HeroSection'
import ProjectsSection from '@/components/projects/ProjectsSection'
import SkillsSection from '@/components/skills/SkillsSection'
import JourneySection from '@/components/journey/JourneySection'
import ContactSection from '@/components/contact/ContactSection'
import ScrollProgressIndicator from '@/components/general/ScrollProgressIndicator'

const GradientBackground = dynamic(() => import('@/components/general/GradientBackground'), {
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
        <ScrollProgressIndicator />
        <HeroSection />
        <JourneySection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </div>
    </main>
  )
}