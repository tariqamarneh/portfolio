// src/components/JourneySection.tsx
import React from 'react'
import InteractiveTimeline from './InteractiveTimeline'
import ScrollAnimationWrapper from './ScrollAnimationWrapper'

const JourneySection: React.FC = () => {
  return (
    <section id="journey" className="py-20">
      <div className="container mx-auto px-8 md:px-16 flex flex-col items-center">
        <ScrollAnimationWrapper>
          <h2 className="text-5xl font-bold mb-16 text-center neon-text">
            My Journey
          </h2>
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <div className="w-full max-w-4xl">
            <InteractiveTimeline />
          </div>
        </ScrollAnimationWrapper>
      </div>
    </section>
  )
}

export default JourneySection