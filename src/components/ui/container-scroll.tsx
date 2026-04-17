'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion'

/**
 * Scroll-driven 3D tilt reveal. Title translates up while a "card"
 * rotates from an X-axis tilt to flat, creating a cinematic reveal.
 * Perfect for featuring a signature visual element (like the Spline scene).
 */
export const ContainerScrollReveal = ({
  titleComponent,
  children,
}: {
  titleComponent: React.ReactNode
  children: React.ReactNode
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const scaleDimensions = (): [number, number] => (isMobile ? [0.78, 0.95] : [1.05, 1])

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0])
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions())
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <div
      className="h-[50rem] md:h-[60rem] flex items-center justify-center relative p-2 md:p-16"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-28 w-full relative"
        style={{ perspective: '1000px' }}
      >
        <Header translate={translate}>{titleComponent}</Header>
        <Card rotate={rotate} scale={scale}>{children}</Card>
      </div>
    </div>
  )
}

const Header = ({ translate, children }: { translate: MotionValue<number>; children: React.ReactNode }) => (
  <motion.div
    style={{ translateY: translate }}
    className="max-w-6xl mx-auto text-center"
  >
    {children}
  </motion.div>
)

const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>
  scale: MotionValue<number>
  children: React.ReactNode
}) => (
  <motion.div
    style={{
      rotateX: rotate,
      scale,
      boxShadow:
        '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
    }}
    className="max-w-6xl -mt-8 md:-mt-12 mx-auto h-[28rem] md:h-[36rem] w-full border border-ink-700 p-2 md:p-4 bg-ink-900 rounded-[24px] md:rounded-[30px] shadow-2xl"
  >
    <div className="h-full w-full overflow-hidden rounded-[20px] bg-ink-950 md:rounded-2xl">
      {children}
    </div>
  </motion.div>
)