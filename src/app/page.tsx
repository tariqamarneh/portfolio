import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import HeroSection from '../components/hero/HeroSection'
import ScrollProgressIndicator from '../components/general/ScrollProgressIndicator'
import Footer from '../components/footer/Footer'
import { ThemeProvider, ThemeToggle } from '../components/general/GradientBackground'
import { ErrorBoundary } from '../components/general/ErrorBoundary'
import { PortfolioDataProvider } from '@/context/PortfolioDataContext'

// Lazy load components with loading states
const AboutSection = dynamic(() => import('../components/about/AboutSection'), {
  loading: () => <div className="h-96 animate-pulse" />,
})
const StatsSection = dynamic(() => import('../components/stats/StatsSection'), {
  loading: () => <div className="h-48 animate-pulse" />,
})
const JourneySection = dynamic(() => import('../components/journey/JourneySection'), {
  loading: () => <div className="h-screen animate-pulse" />,
})
const ProjectsSection = dynamic(() => import('../components/projects/ProjectsSection'), {
  loading: () => <div className="h-screen animate-pulse" />,
})
const SkillsSection = dynamic(() => import('../components/skills/SkillsSection'), {
  loading: () => <div className="h-screen animate-pulse" />,
})
const TestimonialsSection = dynamic(() => import('../components/testimonials/TestimonialsSection'), {
  loading: () => <div className="h-96 animate-pulse" />,
})
const ContactSection = dynamic(() => import('../components/contact/ContactSection'), {
  loading: () => <div className="h-screen animate-pulse" />,
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
            <div className="relative z-10">
            <ScrollProgressIndicator />

            {/* Hero Section */}
            <ErrorBoundary>
              <HeroSection />
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
          </SplashScreen>
          </ThemeProvider>
        </PortfolioDataProvider>
      </main>
    </>
  )
}
