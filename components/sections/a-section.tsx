"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { ParticleSphere } from "@/components/ui/particle-sphere"
import { ChevronDown } from "lucide-react"


export function ASection() {
    const [isVisible, setIsVisible] = useState(true)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
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
        <div className="w-full h-screen bg-[#EBEBDF] relative">
            <div className={`fixed top-50 left-0 right-0 z-10 p-6 transition-opacity duration-500 ease-in-out ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>

            </div>

            <Canvas camera={{ position: [-10, 1.5, 10], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <ParticleSphere />
                <OrbitControls enablePan={!isMobile} enableZoom={isMobile} enableRotate={true} />
            </Canvas>

            <button
                onClick={handleScrollDown}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-[#4C050C]/50 hover:text-[#4C050C] transition-colors duration-300"
            >
                <span className="text-sm tracking-[0.2em] uppercase mb-2">More</span>
                <ChevronDown size={24} className="animate-bounce" />
            </button>
        </div>
    )
}