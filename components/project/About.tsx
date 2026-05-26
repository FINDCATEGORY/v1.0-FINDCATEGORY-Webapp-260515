import { ArrowUpRight, Cpu, Info } from "lucide-react"
import Link from "next/link"

export default function About() {
  return (
    <section id="about" className="py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div>
        <div className="flex flex-col items-center gap-2 mb-6">
          <Info className="w-5 h-5 text-accent" strokeWidth={2} />
          <span className="text-sm font-medium text-foreground/70">FINDCATEGORYⓇTableware</span>
        </div>

        {/* 제목 중앙 정렬 */}
        <h2 className="text-3xl md:text-4xl text-foreground leading-tight text-center">
          테이블웨어 with 뢰슈티
        </h2>

        {/* 설명 문구 중앙 정렬 */}
        <p className="mt-6 text-foreground/70 leading-relaxed text-center">
          스위스식 감자 팬케이크 Rösti (뢰슈티). 강판에 간 감자를 프라이팬에 노릇하게 구운 감자 팬케이크.<br />
          전통적으로 스위스의 아침 식사로 알려져 있으며, 한국의 감자채전과 같은 인상을 준다.
        </p>
          </div>

      
        </div>
      </div>
    </section>
  )
}
