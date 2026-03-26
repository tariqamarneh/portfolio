import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import HeroSection from '../components/hero/HeroSection'
import ScrollProgressIndicator from '../components/general/ScrollProgressIndicator'
import Footer from '../components/footer/Footer'
import { ThemeProvider, ThemeToggle } from '@/components/general/GradientBackground'
import { ErrorBoundary } from '@/components/general/ErrorBoundary'
import { PortfolioDataProvider } from '@/context/PortfolioDataContext'

// Lazy load components with polished skeleton loaders
const AboutSection = dynamic(() => import('../components/about/AboutSection'), {
  loading: () => (
    <div className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <div className="h-12 w-72 rounded-lg bg-white/5 animate-pulse mb-4" />
          <div className="h-1 w-24 rounded-full bg-white/5 animate-pulse mb-6" />
          <div className="h-4 w-96 max-w-full rounded bg-white/[0.03] animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[0,1,2,3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  ),
})
const StatsSection = dynamic(() => import('../components/stats/StatsSection'), {
  loading: () => (
    <div className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 md:p-12 bg-white/[0.03] animate-pulse">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[0,1,2,3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/5" />
                <div className="h-10 w-20 rounded bg-white/5" />
                <div className="h-4 w-28 rounded bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
})
const JourneySection = dynamic(() => import('../components/journey/JourneySection'), {
  loading: () => (
    <div className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <div className="h-12 w-80 rounded-lg bg-white/5 animate-pulse mb-4" />
          <div className="h-1 w-24 rounded-full bg-white/5 animate-pulse" />
        </div>
        <div className="space-y-8">
          {[0,1,2,3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-3 h-3 mt-2 rounded-full bg-white/5 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-48 rounded bg-white/5 animate-pulse" />
                <div className="h-4 w-full rounded bg-white/[0.03] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
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
const GradientBackground = dynamic(() => import('../components/general/GradientBackground'), {
  ssr: false,
})
const FloatingNav = dynamic(() => import('../components/general/FloatingNav'), {
  ssr: false,
})
const CustomCursor = dynamic(() => import('../components/effects/CustomCursor'), {
  ssr: false,
})
const SplashScreen = dynamic(() => import('../components/effects/SplashScreen'), {
  ssr: false,
})
const CommandPalette = dynamic(() => import('../components/general/CommandPalette'), {
  ssr: false,
})
const PullToContact = dynamic(() => import('../components/effects/PullToContact'), {
  ssr: false,
})
const Room3D = dynamic(() => import('../components/room/Room3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[70vh] md:h-[80vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

export const metadata: Metadata = {
  title: 'Tariq Amarneh - Software Development Engineer',
  description: 'Portfolio of Tariq Amarneh - Software Development Engineer at Amazon, specializing in Java, Spring Boot, Python, and AI/ML',
  keywords: ['software engineer', 'Amazon', 'Java', 'Spring Boot', 'Python', 'AI', 'ML', 'portfolio', 'Tariq Amarneh'],
  authors: [{ name: 'Tariq Amarneh' }],
  alternates: {
    canonical: 'https://tariqamarneh.vercel.app',
  },
  openGraph: {
    title: 'Tariq Amarneh - Software Development Engineer',
    description: 'Portfolio of Tariq Amarneh - Software Development Engineer at Amazon, specializing in Java, Spring Boot, Python, and AI/ML',
    url: 'https://tariqamarneh.vercel.app',
    siteName: 'Tariq Amarneh Portfolio',
    images: [
      {
        url: 'https://tariqamarneh.vercel.app/images/my_photo.png',
        width: 288,
        height: 288,
        alt: 'Tariq Amarneh',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Tariq Amarneh - Software Development Engineer',
    description: 'Software Development Engineer at Amazon, specializing in Java, Spring Boot, Python, and AI/ML',
    images: ['https://tariqamarneh.vercel.app/images/my_photo.png'],
  },
}

export default function Home() {
  return (
    <>
      <Script
        id="schema-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Tariq Amarneh',
            url: 'https://tariqamarneh.vercel.app',
            jobTitle: 'Software Development Engineer',
            description: 'Software Development Engineer at Amazon, specializing in Java, Spring Boot, Python, and AI/ML',
            knowsAbout: ['Software Engineering', 'Java', 'Spring Boot', 'Python', 'Artificial Intelligence', 'Machine Learning'],
            image: 'https://tariqamarneh.vercel.app/images/my_photo.png',
            sameAs: [
              'https://github.com/tariqamarneh',
              'https://linkedin.com/in/tariq-naser',
            ],
          })
        }}
      />
      <main className="relative">
        <PortfolioDataProvider>
          <ThemeProvider>
            <CustomCursor />
            <SplashScreen>
            <ThemeToggle />
            <GradientBackground />
            <FloatingNav />
            <CommandPalette />
            <div className="relative z-10">
            <ScrollProgressIndicator />

            {/* Hero Section */}
            <ErrorBoundary>
              <HeroSection />
            </ErrorBoundary>

            {/* 3D Workspace */}
            <ErrorBoundary>
              <Room3D />
            </ErrorBoundary>

            {/* About Section */}
            <ErrorBoundary>
              <AboutSection />
            </ErrorBoundary>

            {/* Stats Section */}
            <ErrorBoundary>
              <StatsSection />
            </ErrorBoundary>

            {/* Journey Section */}
            <ErrorBoundary>
              <JourneySection />
            </ErrorBoundary>

            {/* Projects Section */}
            <ErrorBoundary>
              <ProjectsSection />
            </ErrorBoundary>

            {/* Skills Section */}
            <ErrorBoundary>
              <SkillsSection />
            </ErrorBoundary>

            {/* Testimonials Section */}
            <ErrorBoundary>
              <TestimonialsSection />
            </ErrorBoundary>

            {/* Contact Section */}
            <ErrorBoundary>
              <ContactSection />
            </ErrorBoundary>

            {/* Footer */}
            <ErrorBoundary>
              <Footer />
            </ErrorBoundary>
          </div>
          <PullToContact />
          </SplashScreen>
          </ThemeProvider>
        </PortfolioDataProvider>
      </main>
    </>
  )
}
