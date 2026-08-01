"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { ParticleSphere } from "@/components/ui/particle-sphere"
import { ChevronDown } from "lucide-react"

export function ASection() {
    const [isVisible, setIsVisible] = useState(true)
    const [isMobile, setIsMobile] = useState(false)
    const [controlsEl, setControlsEl] = useState<HTMLDivElement | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const handleScroll = () => {
            setIsVisible(window.scrollY < 50)
        }

        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener("scroll", handleScroll, { passive: true })
        window.addEventListener("resize", checkMobile)

        return () => {
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("resize", checkMobile)
        }
    }, [])

    const handleScrollDown = () => {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
    }

    return (
        <div className="w-full h-screen bg-white relative">
            <div className={`fixed top-50 left-0 right-0 z-10 p-6 transition-opacity duration-500 ease-in-out ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>

            </div>

            <div ref={containerRef} className="absolute inset-0 pointer-events-none">
                {isMounted && (
                    <Canvas eventSource={containerRef} camera={{ position: [-10, 0, 10], fov: 60 }} gl={{ antialias: true, alpha: true, powerPreference: "default" }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <Suspense fallback={null}>
                            <ParticleSphere />
                        </Suspense>
                        {controlsEl && !isMobile && (
                            <OrbitControls
                                domElement={controlsEl}
                                enablePan={true}
                                enableZoom={false}
                                enableRotate={true}
                                minPolarAngle={Math.PI / 2.1}
                                maxPolarAngle={Math.PI / 2.1}
                            />
                        )}
                    </Canvas>
                )}
            </div>

            {!isMobile && (
                <div
                    ref={setControlsEl}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[50vw] max-w-[500px] max-h-[300px] z-20 rounded-[50%] cursor-grab active:cursor-grabbing"
                    style={{ touchAction: 'none' }}
                />
            )}

            <button
                onClick={handleScrollDown}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors duration-300"
            >
                <span className="text-sm tracking-[0.2em] uppercase mb-2">More</span>
                <ChevronDown size={24} className="animate-bounce" />
            </button>
        </div>
    )
}