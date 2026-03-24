'use client'

import { useState, useEffect, useRef } from 'react'

interface MousePosition {
  x: number
  y: number
  isTouch: boolean
}

export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0, isTouch: false })
  const tickingRef = useRef(false)

  useEffect(() => {
    let isTouch = false

    const onTouchStart = () => {
      isTouch = true
      setPosition(prev => ({ ...prev, isTouch: true }))
    }

    const onMouseMove = (e: MouseEvent) => {
      if (isTouch || tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY, isTouch: false })
        tickingRef.current = false
      })
    }

    window.addEventListener('touchstart', onTouchStart, { once: true, passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return position
}
