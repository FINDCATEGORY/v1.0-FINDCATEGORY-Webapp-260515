"use client"

import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"

export function ParticleSphere() {
    const PARTICLE_COUNT = 1500 // Reduced particle count to make images more visible
    const PARTICLE_SIZE_MIN = 0.005
    const PARTICLE_SIZE_MAX = 0.010
    const SPHERE_RADIUS = 9
    const POSITION_RANDOMNESS = 4
    const ROTATION_SPEED_X = 0.0
    const ROTATION_SPEED_Y = 0.001
    const PARTICLE_OPACITY = 1

    const textureUrls = useMemo(() => [
        "/images/04gallery01.jpg",
        "/images/04gallery02.jpg",
        "/images/04gallery03.jpg",
        "/images/04gallery04.jpg",
        "/images/04gallery05.jpg",
        "/images/04gallery06.jpg",
        "/images/05gallery01.png",
        "/images/05gallery02.png",
        "/images/05gallery03.png",
        "/images/05gallery04.png",
        "/images/02-main-image01.png",
        "/images/6collection01.png",
        "/images/6collection02.png",
        "/images/6collection03.png",
    ], [])

    const IMAGE_COUNT = textureUrls.length
    const IMAGE_SIZE = 2.5

    const groupRef = useRef<THREE.Group>(null)

    const textures = useTexture(textureUrls)

    useEffect(() => {
        textures.forEach((texture) => {
            if (texture) {
                texture.wrapS = THREE.ClampToEdgeWrapping
                texture.wrapT = THREE.ClampToEdgeWrapping
                texture.flipY = false
                texture.needsUpdate = true
            }
        })
    }, [textures])

    const particles = useMemo(() => {
        const particles = []

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Generate points on sphere surface with some random variation
            const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT)
            const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi

            // Add random variation to make it more organic
            const radiusVariation = SPHERE_RADIUS + (Math.random() - 0.5) * POSITION_RANDOMNESS

            const x = radiusVariation * Math.cos(theta) * Math.sin(phi)
            const y = radiusVariation * Math.cos(phi)
            const z = radiusVariation * Math.sin(theta) * Math.sin(phi)

            particles.push({
                position: [x, y, z] as [number, number, number],
                scale: Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN,
                color: new THREE.Color().setHSL(
                    Math.random() * 0.1 + 0.05, // Yellow-orange hues
                    0.8,
                    0.6 + Math.random() * 0.3,
                ),
                rotationSpeed: (Math.random() - 0.5) * 0.01,
            })
        }

        return particles
    }, [PARTICLE_COUNT, SPHERE_RADIUS, POSITION_RANDOMNESS, PARTICLE_SIZE_MIN, PARTICLE_SIZE_MAX])

    const orbitingImages = useMemo(() => {
        const images = []

        for (let i = 0; i < IMAGE_COUNT; i++) {
            const angle = (i / IMAGE_COUNT) * Math.PI * 2
            const x = SPHERE_RADIUS * Math.cos(angle)
            const y = 0.5
            const z = SPHERE_RADIUS * Math.sin(angle)

            const position = new THREE.Vector3(x, y, z)
            const center = new THREE.Vector3(0, 0, 0)
            const outwardDirection = position.clone().sub(center).normalize()

            // Create a rotation that makes the plane face outward
            const euler = new THREE.Euler()
            const matrix = new THREE.Matrix4()
            matrix.lookAt(position, position.clone().add(outwardDirection), new THREE.Vector3(0, 1, 0))
            euler.setFromRotationMatrix(matrix)

            euler.z += Math.PI

            images.push({
                position: [x, y, z] as [number, number, number],
                rotation: [euler.x, euler.y, euler.z] as [number, number, number],
                textureIndex: i % textures.length,
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6), // Added random colors
            })
        }

        return images
    }, [IMAGE_COUNT, SPHERE_RADIUS, textures.length])

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += ROTATION_SPEED_Y
            groupRef.current.rotation.x += ROTATION_SPEED_X
        }
    })

    return (
        <group ref={groupRef}>
            {/* Existing particles */}
            {particles.map((particle, index) => (
                <mesh key={index} position={particle.position} scale={particle.scale}>
                    <sphereGeometry args={[1, 8, 6]} />
                    <meshBasicMaterial color={particle.color} transparent opacity={PARTICLE_OPACITY} />
                </mesh>
            ))}

            {orbitingImages.map((image, index) => (
                <mesh key={`image-${index}`} position={image.position} rotation={image.rotation}>
                    <planeGeometry args={[IMAGE_SIZE, IMAGE_SIZE * 1.25]} />
                    <meshBasicMaterial map={textures[image.textureIndex]} opacity={1} side={THREE.DoubleSide} transparent />
                </mesh>
            ))}
        </group>
    )
}
