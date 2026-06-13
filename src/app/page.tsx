import { Metadata } from 'next'
import Script from 'next/script'
import HomeShell from './HomeShell'

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
      <HomeShell />
    </>
  )
}
