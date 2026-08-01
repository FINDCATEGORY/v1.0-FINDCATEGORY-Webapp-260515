"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import type * as THREE from "three"

function DottedSphere({ radius = 1.2, dotCount = 50, dotSize = 0.025 }) {
  const groupRef = useRef<THREE.Group>(null)

  const dots = useMemo(() => {
    const positions: [number, number, number][] = []
    const phi = Math.PI * (3 - Math.sqrt(5)) // golden angle for even distribution

    for (let i = 0; i < dotCount; i++) {
      const y = 1 - (i / (dotCount - 1)) * 2
      const radiusAtY = Math.sqrt(1 - y * y)
      const theta = phi * i

      const x = Math.cos(theta) * radiusAtY * radius
      const z = Math.sin(theta) * radiusAtY * radius
      positions.push([x, y * radius, z])
    }
    return positions
  }, [radius, dotCount])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {dots.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[dotSize, 8, 8]} />
          <meshStandardMaterial
            color="#1A1A1A"
            emissive="#1A1A1A"
            emissiveIntensity={1.2}
            metalness={0.7}
            roughness={0.2}
            transparent={false}
            opacity={1}
          />
        </mesh>
      ))}
    </group>
  )
}

// Core removed

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={1} color="#cccccc" />
      <pointLight position={[0, 0, 5]} intensity={1.5} color="#ffffff" />

      <DottedSphere radius={1.2} dotCount={200} dotSize={0.025} />
    </>
  )
}

export function ParticleOrb() {
  return (
    <div className="w-48 h-48 relative flex items-center justify-center">
      {/* Outer glow effect */}
      <div className="absolute inset-[-30%] bg-gradient-radial from-[#1A1A1A]/20 via-[#1A1A1A]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      {/* Center Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <span className="text-[#1A1A1A] font-bold text-xl font-sans tracking-wide">Talk to AI</span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ background: "transparent", position: "absolute", inset: 0 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
