'use client'

import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 })
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 })

  const trailX = useSpring(cursorX, { stiffness: 150, damping: 20 })
  const trailY = useSpring(cursorY, { stiffness: 150, damping: 20 })

  useEffect(() => {
    // Check for touch device
    const onTouch = () => setIsTouch(true)
    window.addEventListener('touchstart', onTouch, { once: true, passive: true })

    // Check for reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setIsTouch(true) // Hide cursor on reduced motion too
      return
    }

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)

    // Detect hoverable elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isClickable = target.closest('a, button, [role="button"], input, textarea, select, [tabindex]')
      setIsHovering(!!isClickable)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseover', onMouseOver)

    // Hide default cursor
    document.body.classList.add('custom-cursor-active')

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseover', onMouseOver)
      document.body.classList.remove('custom-cursor-active')
    }
  }, [cursorX, cursorY, isVisible])

  if (isTouch) return null

  return (
    <>
      {/* Glow trail */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <div
          className={`rounded-full transition-all duration-300 ${
            isHovering ? 'w-14 h-14' : 'w-10 h-10'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.15), rgba(139,92,246,0.08), transparent 70%)',
            opacity: isVisible ? 1 : 0,
          }}
        />
      </motion.div>

      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <div
          className={`rounded-full transition-all duration-200 ${
            isHovering
              ? 'w-4 h-4 bg-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
              : 'w-2 h-2 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
          }`}
          style={{ opacity: isVisible ? 1 : 0 }}
        />
      </motion.div>
    </>
  )
}
