'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * SPACE JOURNEY — the persistent 3D layer behind the whole page.
 *
 * "Drift": a layered starfield plus slow-moving teal/indigo nebula clouds with
 * deep scroll parallax. Rendered with VANILLA three.js (no react-three-fiber) —
 * fiber's reconciler is coupled to a specific React version and breaks under
 * Next 15's vendored React 19, so we drive the scene imperatively instead. This
 * is lighter and immune to future React/Next upgrades. Honors reduced-motion,
 * caps the frame rate, dims to ambient on phones, and disposes GPU resources.
 */

function makeGlowTexture(rgb: string) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, `rgba(${rgb}, 0.55)`)
  g.addColorStop(0.4, `rgba(${rgb}, 0.18)`)
  g.addColorStop(1, `rgba(${rgb}, 0)`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

export default function SpaceJourney() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    mount.style.opacity = isMobile ? '0.5' : '1'

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 6

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    mount.appendChild(renderer.domElement)

    /* ── Starfield ── */
    const starCount = isMobile ? 450 : 1300
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const r = 9 + Math.random() * 14
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7
      starPos[i * 3 + 2] = -Math.abs(r * Math.cos(phi)) - 2
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({
      size: 0.045, sizeAttenuation: true, color: 0xc9dcec,
      transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending,
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    /* ── Nebula clouds ── */
    const tealTex = makeGlowTexture('76, 220, 202')
    const indigoTex = makeGlowTexture('124, 140, 248')
    // [x, y, z, scale, opacity, teal?]
    const specs: [number, number, number, number, number, boolean][] = [
      [-5, 2.5, -8, 11, 0.55, true],
      [5.5, -2, -10, 13, 0.4, false],
      [0, -3, -12, 10, 0.3, true],
      [-3.5, -1.5, -6, 7, 0.35, false],
      [4.5, 2.8, -7, 8, 0.4, true],
      [1.5, 0.5, -14, 16, 0.25, false],
    ]
    const nebula = new THREE.Group()
    const spriteMats: THREE.SpriteMaterial[] = []
    for (const [x, y, z, s, opacity, teal] of specs) {
      const mat = new THREE.SpriteMaterial({
        map: teal ? tealTex : indigoTex,
        transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending,
      })
      spriteMats.push(mat)
      const sprite = new THREE.Sprite(mat)
      sprite.scale.set(s, s, 1)
      sprite.position.set(x, y, z)
      nebula.add(sprite)
    }
    scene.add(nebula)

    /* ── Interaction state ── */
    let progress = 0
    let mouseX = 0
    let mouseY = 0
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      progress = Math.min(1, window.scrollY / max)
    }
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    if (!isMobile) window.addEventListener('mousemove', onMouse, { passive: true })

    /* ── Render loop (frame-rate capped) ── */
    const damp = (a: number, b: number, l: number, dt: number) => THREE.MathUtils.damp(a, b, l, dt)
    const fps = reducedMotion ? 12 : 30
    const interval = 1000 / fps
    let raf = 0
    let last = 0
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      if (document.hidden || t - last < interval) return
      const dt = Math.min(0.05, (t - last) / 1000)
      last = t
      if (!reducedMotion) {
        stars.rotation.z += dt * 0.004
        stars.rotation.y += dt * 0.002
        const time = t * 0.001
        nebula.children.forEach((child, i) => {
          const sp = specs[i]
          const speed = 0.03 + (i % 3) * 0.012
          child.position.x = sp[0] + Math.sin(time * speed + i * 1.7) * 0.9
          child.position.y = sp[1] + Math.cos(time * speed * 0.8 + i) * 0.5
        })
      }
      stars.position.y = damp(stars.position.y, progress * 3.5, 3, dt)
      nebula.position.y = damp(nebula.position.y, progress * 3, 3, dt)
      camera.position.x = damp(camera.position.x, mouseX * 0.4, 2, dt)
      camera.position.y = damp(camera.position.y, mouseY * 0.3, 2, dt)
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(loop)

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouse)
      starGeo.dispose()
      starMat.dispose()
      spriteMats.forEach(m => m.dispose())
      tealTex.dispose()
      indigoTex.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />
}
