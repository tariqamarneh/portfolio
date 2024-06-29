// src/components/HeroSection.tsx
'use client'
import Image from 'next/image'
import { TypeAnimation } from 'react-type-animation'
import ScrollAnimationWrapper from './ScrollAnimationWrapper'

export default function HeroSection() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center text-center relative overflow-hidden">
      <div className="container mx-auto px-8 md:px-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <ScrollAnimationWrapper animation="fade-in">
            <div className="mb-8 md:mb-0 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-300 blur-sm"></div>
              <div className="relative">
                <Image
                  src="/images/my_photo.png"
                  alt="Your Name"
                  width={250}
                  height={250}
                  className="rounded-full border-4 border-gray-800 shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </ScrollAnimationWrapper>
          <div className="text-left">
            <ScrollAnimationWrapper animation="fade-in">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 gradient-text">
                Tariq Amarneh
              </h1>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animation="fade-up">
              <div className="text-xl md:text-2xl mb-6 text-blue-300">
                <TypeAnimation
                  sequence={[
                    'Web Developer',
                    2000,
                    'Python Expert',
                    2000,
                    'AI Enthusiast',
                    2000
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper>
            <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#contact" 
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-full hover:from-indigo-600 hover:to-purple-700 transition duration-300 text-center"
                >
                  Get in touch
                </a>
                <a 
                  href="/Tariq_Naser.pdf" 
                  download
                  className="px-8 py-3 bg-transparent border-2 border-indigo-500 text-indigo-500 font-bold rounded-full hover:bg-indigo-500 hover:text-white transition duration-300 text-center"
                >
                  Download CV
                </a>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </div>
    </section>
  )
}