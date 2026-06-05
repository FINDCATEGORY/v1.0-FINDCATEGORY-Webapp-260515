"use client"

import { ArrowDown } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Hero() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      // 스크롤 범위를 늘려 영상이 머무는 시간을 길게 조정
      const maxScroll = 1200 
      const progress = Math.min(scrolled / maxScroll, 1)
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scale = 1 - scrollProgress * 0.15
  const borderRadius = scrollProgress * 24

  return (
    <section id="home" className="pt-28 pb-16">
      <div className="px-6 mx-auto max-w-7xl flex flex-col items-center text-center">
        <div className="max-w-3xl">
          <h1 className="leading-tight text-[#4C050C] font-semibold tracking-tight text-5xl">
            파인드카테고리Ⓡ 스타일링 제안
          </h1>
          <p className="mt-6 text-foreground/70">
            Styling by OgongI
          </p>
          <Link
            href="#"
            className="text-left mt-16 inline-flex gap-2 px-6 py-3 text-sm font-medium hover:opacity-90 "
          ><ArrowDown className="h-4 w-4" />
            Styling by O0i Works
            <ArrowDown className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* 영상 컨테이너: h-[200vh]로 높이를 늘려 sticky 고정 구간 확보 */}
      <div className="mt-0 h-[200vh]">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-6">
          <div
            className="relative w-full max-w-7xl overflow-hidden transition-transform duration-100 ease-out"
            style={{
              transform: `scale(${scale})`,
              borderRadius: `${borderRadius}px`,
            }}
          >
            <video
              src="/images/project1.mp4"
              className="w-full h-auto object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </div>


  
     
    </section>
  )
}