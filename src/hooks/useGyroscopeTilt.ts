'use client'

import { useEffect, useRef, useState } from 'react'

interface GyroscopeTilt {
  x: number
  y: number
  supported: boolean
}

/**
 * Returns subtle tilt values from the device gyroscope.
 * Only activates on mobile devices with orientation sensors.
 * On iOS 13+, requests permission on each tap until granted.
 */
export function useGyroscopeTilt(maxDeg = 20): GyroscopeTilt {
  const [tilt, setTilt] = useState<GyroscopeTilt>({ x: 0, y: 0, supported: false })
  const permissionGranted = useRef(false)
  const requesting = useRef(false)
  const currentX = useRef(0)
  const currentY = useRef(0)
  const targetX = useRef(0)
  const targetY = useRef(0)
  const rafId = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('ontouchstart' in window)) return
    if (typeof window.DeviceOrientationEvent === 'undefined') return

    const lerp = (a: number, b: number, f: number) => a + (b - a) * f

    const handleOrientation = (e: Event) => {
      const evt = e as DeviceOrientationEvent
      const gamma = evt.gamma ?? 0
      const beta = evt.beta ?? 0
      targetX.current = Math.max(-1, Math.min(1, gamma / maxDeg))
      targetY.current = Math.max(-1, Math.min(1, (beta - 45) / maxDeg))
    }

    const tick = () => {
      currentX.current = lerp(currentX.current, targetX.current, 0.08)
      currentY.current = lerp(currentY.current, targetY.current, 0.08)

      if (
        Math.abs(currentX.current - targetX.current) > 0.001 ||
        Math.abs(currentY.current - targetY.current) > 0.001
      ) {
        setTilt({ x: currentX.current, y: currentY.current, supported: true })
      }

      rafId.current = requestAnimationFrame(tick)
    }

    const startListening = () => {
      if (permissionGranted.current) return
      permissionGranted.current = true
      window.addEventListener('deviceorientation', handleOrientation, { passive: true })
      setTilt(prev => ({ ...prev, supported: true }))
      rafId.current = requestAnimationFrame(tick)
    }

    // Check if iOS permission API exists
    const DOE = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>
    }
    const needsPermission = typeof DOE.requestPermission === 'function'

    if (!needsPermission) {
      // Android / older iOS — just start
      startListening()
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation)
        cancelAnimationFrame(rafId.current)
      }
    }

    // iOS 13+: retry permission request on each tap until granted
    const onTap = async () => {
      if (permissionGranted.current || requesting.current) return
      requesting.current = true
      try {
        const result = await DOE.requestPermission!()
        if (result === 'granted') {
          startListening()
          // Permission granted — remove listener, no more prompts needed
          window.removeEventListener('touchend', onTap)
        }
      } catch {
        // Denied or error — will retry on next tap
      }
      requesting.current = false
    }

    // Use touchend (not touchstart) — iOS requires the gesture to have completed
    window.addEventListener('touchend', onTap, { passive: true })

    return () => {
      window.removeEventListener('touchend', onTap)
      window.removeEventListener('deviceorientation', handleOrientation)
      cancelAnimationFrame(rafId.current)
    }
  }, [maxDeg])

  return tilt
}
