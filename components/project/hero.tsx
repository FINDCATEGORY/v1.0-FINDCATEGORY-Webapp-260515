"use client"

import { ArrowDownRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Hero() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = 500
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
      <div className="px-6 mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="lg:max-w-3xl pt-0">
            <h1 className="leading-tight text-balance text-center text-white font-semibold leading-7 tracking-tight text-accent text-5xl">
              파인드카테고리Ⓡ 스타일링 제안
            </h1>
            <p className="mt-6 text-foreground/70 text-center">
              Styling by O0i(오공아이)
            </p>
            <Link
              href="#works"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity"
            >
              Styling by O0i Works
              <ArrowDownRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 px-6">
        <div
          className="relative overflow-hidden transition-transform duration-200 ease-out"
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

      {/* 추가된 콘텐츠 영역 */}
      <div className="px-6 mx-auto max-w-7xl mt-16">
        <div className="flex flex-col gap-4">
          <span className="text-sm font-medium text-foreground/70 text-center">
            FINDCATEGORYⓇTableware
          </span>

          <h2 className="text-3xl text-center mb-6 md:text-5xl">
            테이블웨어 with 뢰슈티
          </h2>

          <p className="text-foreground/70 text-center">
            스위스식 감자 팬케이크 Rösti (뢰슈티) 강판에 간 감자를 프라이팬에 노릇하게 구운 감자 팬케이크.<br></br>
            전통적으로 스위스의 아침 식사로 알려져 있으며, 한국의 감자채전과 같은 인상을 준다.
          </p>
        </div>
      </div>
    </section>
  )
}