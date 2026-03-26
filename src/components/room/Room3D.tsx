'use client'

import React, { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, RoundedBox, Float } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '../general/GradientBackground'

// Scroll to section helper
const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// Shared hover state type
interface InteractiveProps {
  position: [number, number, number]
  onClick: () => void
  label: string
}

// Floating label that appears on hover
function HoverLabel({ text, visible, position }: { text: string; visible: boolean; position: [number, number, number] }) {
  const { camera } = useThree()
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    if (ref.current) {
      ref.current.quaternion.copy(camera.quaternion)
    }
  })

  if (!visible) return null

  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[text.length * 0.14 + 0.3, 0.35]} />
        <meshBasicMaterial color="#0e1117" opacity={0.9} transparent />
      </mesh>
      <Text fontSize={0.16} color="#67e8f9" anchorX="center" anchorY="middle">
        {text}
      </Text>
    </group>
  )
}

// === DESK ITEMS ===

function Desk({ isDark }: { isDark: boolean }) {
  return (
    <group>
      {/* Desktop surface */}
      <RoundedBox args={[5, 0.12, 2.8]} position={[0, 0, 0]} radius={0.04} smoothness={4}>
        <meshStandardMaterial color={isDark ? '#1a1a2e' : '#d4c5a9'} roughness={0.3} metalness={0.1} />
      </RoundedBox>
      {/* Legs */}
      {[[-2.2, -1.1, -1.1], [2.2, -1.1, -1.1], [-2.2, -1.1, 1.1], [2.2, -1.1, 1.1]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.06, 0.06, 2.1, 8]} />
          <meshStandardMaterial color={isDark ? '#16162a' : '#b8a88a'} roughness={0.4} metalness={0.2} />
        </mesh>
      ))}
      {/* Desk mat */}
      <mesh position={[0, 0.07, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.4, 1.8]} />
        <meshStandardMaterial color={isDark ? '#0f1729' : '#c4b896'} roughness={0.8} />
      </mesh>
    </group>
  )
}

function Monitor({ position, onClick, label }: InteractiveProps) {
  const group = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const screenRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (group.current) {
      group.current.position.y = position[1] + (hovered ? 0.08 : 0)
    }
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = hovered ? 1.5 : 0.6
    }
  })

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
    >
      {/* Screen */}
      <RoundedBox args={[2.0, 1.2, 0.06]} position={[0, 0.7, -0.8]} radius={0.03} smoothness={4}>
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.8} />
      </RoundedBox>
      {/* Screen face */}
      <mesh ref={screenRef} position={[0, 0.7, -0.765]}>
        <planeGeometry args={[1.8, 1.0]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.6}
          roughness={0.1}
        />
      </mesh>
      {/* Code lines on screen */}
      {[0.3, 0.15, 0, -0.15, -0.3].map((y, i) => (
        <mesh key={i} position={[-0.3 + i * 0.08, 0.7 + y, -0.76]}>
          <planeGeometry args={[0.5 + Math.random() * 0.8, 0.04]} />
          <meshBasicMaterial color={['#8b5cf6', '#06b6d4', '#a78bfa', '#22d3ee', '#7c3aed'][i]} opacity={0.5} transparent />
        </mesh>
      ))}
      {/* Stand */}
      <mesh position={[0, 0.15, -0.8]}>
        <boxGeometry args={[0.15, 0.3, 0.15]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Stand base */}
      <mesh position={[0, 0.02, -0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 16]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.3} />
      </mesh>
      <HoverLabel text={label} visible={hovered} position={[0, 1.6, -0.8]} />
    </group>
  )
}

function BookStack({ position, onClick, label }: InteractiveProps) {
  const group = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (group.current) {
      group.current.position.y = position[1] + (hovered ? 0.08 : 0)
    }
  })

  const bookColors = ['#8b5cf6', '#06b6d4', '#ec4899', '#a78bfa', '#22d3ee']

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
    >
      {bookColors.map((color, i) => (
        <RoundedBox
          key={i}
          args={[0.55, 0.08, 0.7]}
          position={[0, 0.14 + i * 0.09, 0]}
          radius={0.01}
          smoothness={2}
        >
          <meshStandardMaterial
            color={color}
            roughness={0.6}
            emissive={color}
            emissiveIntensity={hovered ? 0.3 : 0}
          />
        </RoundedBox>
      ))}
      <HoverLabel text={label} visible={hovered} position={[0, 0.9, 0]} />
    </group>
  )
}

function CoffeeMug({ position, onClick, label }: InteractiveProps) {
  const group = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = position[1] + (hovered ? 0.08 : 0)
      if (hovered) {
        group.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
      } else {
        group.current.rotation.y = 0
      }
    }
  })

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
    >
      {/* Cup body */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.35, 16]} />
        <meshStandardMaterial
          color="#1e1e3a"
          roughness={0.3}
          emissive="#8b5cf6"
          emissiveIntensity={hovered ? 0.3 : 0.05}
        />
      </mesh>
      {/* Coffee inside */}
      <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.13, 16]} />
        <meshStandardMaterial color="#3a1a0a" roughness={0.2} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.2, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#1e1e3a" roughness={0.3} />
      </mesh>
      {/* Steam */}
      {hovered && (
        <Float speed={3} floatIntensity={0.3} rotationIntensity={0.2}>
          <mesh position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#ffffff" opacity={0.2} transparent />
          </mesh>
        </Float>
      )}
      <HoverLabel text={label} visible={hovered} position={[0, 0.8, 0]} />
    </group>
  )
}

function Keyboard({ isDark }: { isDark: boolean }) {
  return (
    <group position={[0, 0.08, 0.5]}>
      <RoundedBox args={[1.6, 0.05, 0.55]} radius={0.02} smoothness={2}>
        <meshStandardMaterial color={isDark ? '#111128' : '#d4cfc0'} roughness={0.4} metalness={0.3} />
      </RoundedBox>
      {/* Key rows */}
      {[-0.15, 0, 0.15].map((z, row) =>
        Array.from({ length: 12 }, (_, col) => (
          <mesh key={`${row}-${col}`} position={[-0.66 + col * 0.12, 0.04, z]}>
            <boxGeometry args={[0.09, 0.02, 0.09]} />
            <meshStandardMaterial
              color={isDark ? '#1a1a3e' : '#c8c0b0'}
              emissive={isDark ? '#8b5cf6' : '#0d9488'}
              emissiveIntensity={0.05}
            />
          </mesh>
        ))
      )}
    </group>
  )
}

function Plant({ position, onClick, label }: InteractiveProps) {
  const group = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (group.current) {
      group.current.position.y = position[1] + (hovered ? 0.08 : 0)
    }
  })

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
    >
      {/* Pot */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.18, 0.14, 0.28, 12]} />
        <meshStandardMaterial color="#2a1a3e" roughness={0.7} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.29, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.17, 12]} />
        <meshStandardMaterial color="#1a0a0a" roughness={0.9} />
      </mesh>
      {/* Leaves */}
      {[0, 1.2, 2.4, 3.6, 5.0].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.08, 0.4 + i * 0.06, Math.sin(angle) * 0.08]} rotation={[0.3 - i * 0.1, angle, 0.2]}>
          <sphereGeometry args={[0.1 + i * 0.01, 8, 8]} />
          <meshStandardMaterial
            color={hovered ? '#22d3ee' : '#10b981'}
            emissive={hovered ? '#22d3ee' : '#10b981'}
            emissiveIntensity={hovered ? 0.4 : 0.1}
            roughness={0.6}
          />
        </mesh>
      ))}
      <HoverLabel text={label} visible={hovered} position={[0, 1.0, 0]} />
    </group>
  )
}

function Envelope({ position, onClick, label }: InteractiveProps) {
  const group = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = position[1] + (hovered ? 0.12 : 0)
      if (hovered) {
        group.current.rotation.z = Math.sin(state.clock.elapsedTime * 4) * 0.05
      } else {
        group.current.rotation.z = 0
      }
    }
  })

  return (
    <group
      ref={group}
      position={position}
      rotation={[0, 0.3, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
    >
      {/* Envelope body */}
      <RoundedBox args={[0.55, 0.35, 0.03]} radius={0.01} smoothness={2}>
        <meshStandardMaterial
          color="#1e1e3a"
          emissive="#ec4899"
          emissiveIntensity={hovered ? 0.4 : 0.05}
          roughness={0.5}
        />
      </RoundedBox>
      {/* Flap triangle */}
      <mesh position={[0, 0.08, 0.02]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.28, 0.28]} />
        <meshStandardMaterial
          color="#2a1a4a"
          emissive="#ec4899"
          emissiveIntensity={hovered ? 0.3 : 0}
          side={THREE.DoubleSide}
        />
      </mesh>
      <HoverLabel text={label} visible={hovered} position={[0, 0.6, 0]} />
    </group>
  )
}

function Headphones({ position, onClick, label }: InteractiveProps) {
  const group = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (group.current) {
      group.current.position.y = position[1] + (hovered ? 0.08 : 0)
    }
  })

  return (
    <group
      ref={group}
      position={position}
      rotation={[0.3, 0.5, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
    >
      {/* Headband */}
      <mesh position={[0, 0.15, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.2, 0.025, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Left ear cup */}
      <mesh position={[-0.2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
        <meshStandardMaterial
          color="#1e1e3a"
          emissive="#8b5cf6"
          emissiveIntensity={hovered ? 0.5 : 0.1}
          metalness={0.5}
        />
      </mesh>
      {/* Right ear cup */}
      <mesh position={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
        <meshStandardMaterial
          color="#1e1e3a"
          emissive="#8b5cf6"
          emissiveIntensity={hovered ? 0.5 : 0.1}
          metalness={0.5}
        />
      </mesh>
      <HoverLabel text={label} visible={hovered} position={[0, 0.6, 0]} />
    </group>
  )
}

// === LIGHTING ===

function Lighting({ isDark }: { isDark: boolean }) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.3 : 0.6} />
      <directionalLight position={[5, 8, 5]} intensity={isDark ? 0.6 : 0.8} color={isDark ? '#c4b5fd' : '#ffffff'} castShadow />
      <pointLight position={[0, 2, -0.8]} intensity={isDark ? 0.8 : 0.3} color="#06b6d4" distance={5} />
      <pointLight position={[-2, 1, 1]} intensity={isDark ? 0.3 : 0.1} color="#8b5cf6" distance={4} />
      <pointLight position={[2, 1, 1]} intensity={isDark ? 0.3 : 0.1} color="#ec4899" distance={4} />
    </>
  )
}

// === SCENE ===

function Scene({ isDark }: { isDark: boolean }) {
  return (
    <>
      <Lighting isDark={isDark} />

      <Desk isDark={isDark} />
      <Keyboard isDark={isDark} />

      <Monitor
        position={[0, 0.06, 0]}
        onClick={() => scrollTo('projects')}
        label="PROJECTS"
      />

      <BookStack
        position={[-1.8, 0.06, -0.4]}
        onClick={() => scrollTo('skills')}
        label="SKILLS"
      />

      <Plant
        position={[1.9, 0.06, -0.6]}
        onClick={() => scrollTo('about')}
        label="ABOUT ME"
      />

      <CoffeeMug
        position={[1.5, 0.06, 0.7]}
        onClick={() => scrollTo('journey')}
        label="JOURNEY"
      />

      <Envelope
        position={[-1.4, 0.12, 0.7]}
        onClick={() => scrollTo('contact')}
        label="CONTACT"
      />

      <Headphones
        position={[1.9, 0.06, 0.2]}
        onClick={() => scrollTo('testimonials')}
        label="TESTIMONIALS"
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.5}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 6}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  )
}

// === MAIN COMPONENT ===

export default function Room3D() {
  const { isDark } = useTheme()

  return (
    <section id="workspace" className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Title */}
      <div className="absolute top-8 left-0 right-0 z-10 text-center pointer-events-none">
        <h2 className="text-2xl md:text-4xl font-bold font-display">
          <span className={isDark ? 'gradient-text' : 'gradient-text-light'}>
            Explore My Workspace
          </span>
        </h2>
        <p className={`mt-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Click on objects to navigate
        </p>
      </div>

      <Canvas
        camera={{ position: [4, 3.5, 4], fov: 35 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene isDark={isDark} />
        </Suspense>
      </Canvas>

      {/* Bottom fade */}
      <div className={`absolute bottom-0 left-0 right-0 h-24 pointer-events-none ${
        isDark
          ? 'bg-gradient-to-t from-gray-950 to-transparent'
          : 'bg-gradient-to-t from-stone-50 to-transparent'
      }`} />
    </section>
  )
}