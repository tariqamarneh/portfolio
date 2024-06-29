'use client'

import React, { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
}

const GradientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    const stars: Star[] = []
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25
      })
    }

    const drawGradient = (scrollPosition: number) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = Math.min(scrollPosition / maxScroll, 1)

      const startColor = [0, 31, 63] 
      const endColor = [0, 0, 0] 

      const currentColor = startColor.map((start, i) => 
        Math.round(start + (endColor[i] - start) * scrollPercentage)
      )

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, `rgb(${currentColor.join(',')})`)
      gradient.addColorStop(1, '#000000') 

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const drawStars = () => {
      ctx.save()
      ctx.fillStyle = 'white'
      for (let star of stars) {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }

    const moveStars = () => {
      for (let star of stars) {
        star.x += star.vx
        star.y += star.vy

        if (star.x < 0 || star.x > canvas.width) star.vx = -star.vx
        if (star.y < 0 || star.y > canvas.height) star.vy = -star.vy
      }
    }

    const animate = () => {
      drawGradient(window.scrollY)
      drawStars()
      moveStars()
      requestAnimationFrame(animate)
    }

    animate()

    const handleScroll = () => {
      drawGradient(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />
}

export default GradientBackground