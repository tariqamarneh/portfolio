import React from 'react'
import InteractiveTimeline from './InteractiveTimeline'
import ScrollAnimationWrapper from '../general/ScrollAnimationWrapper'

const JourneySection: React.FC = () => {
  return (
    <section id="journey" className="py-20">
      <div className="container mx-auto px-4 sm:px-8 md:px-16 flex flex-col items-center">
        <ScrollAnimationWrapper>
          <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-center gradient-text">
            My Professional Journey
          </h2>
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <div className="w-full max-w-6xl">
            <InteractiveTimeline />
          </div>
        </ScrollAnimationWrapper>
      </div>
    </section>
  )
}

export default JourneySection