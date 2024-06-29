// src/components/ScrollAnimationWrapper.tsx
'use client'

import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollAnimationWrapperProps {
  children: React.ReactNode
  animation?: 'fade-up' | 'fade-in' | 'slide-in'
}

const ScrollAnimationWrapper: React.FC<ScrollAnimationWrapperProps> = ({ children, animation = 'fade-up' }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current

    if (element) {
      gsap.set(element, { opacity: 0, y: animation === 'fade-up' ? 50 : 0 })

      ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
          })
        },
        onLeave: () => {
          gsap.to(element, {
            opacity: 0,
            y: animation === 'fade-up' ? 50 : 0,
            duration: 1,
            ease: 'power3.out'
          })
        },
        onEnterBack: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
          })
        },
        onLeaveBack: () => {
          gsap.to(element, {
            opacity: 0,
            y: animation === 'fade-up' ? 50 : 0,
            duration: 1,
            ease: 'power3.out'
          })
        }
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [animation])

  return <div ref={ref}>{children}</div>
}

export default ScrollAnimationWrapper