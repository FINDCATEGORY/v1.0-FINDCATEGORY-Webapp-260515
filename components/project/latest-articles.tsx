import Image from "next/image"
import Link from "next/link"
import { BookOpen } from "lucide-react"

const articles = [
  {
    category: "1st project",
    date: "May 5, 2026",
    title: "곧 공개됩니다.",
    image: "/images/RebeccaUdall-RebeccaHopePhotography-1254_06b82e3c-bef0-4e13-9e98-ba8750849578.webp",
    href: "/blog/llm-implementation",
  },
  {
    category: "3rd project",
    date: "May 5, 2025",
    title: "곧 공개됩니다.",
    image: "/images/RebeccaUdall-Nov2023-4539_4b53ffba-cf1d-4e25-a18d-965748bfee39.webp",
    href: "/blog/generative-ai-design",
  },
  {
    category: "2nd project",
    date: "May 5, 2025",
    title: "곧 공개됩니다.",
    image: "/images/02_main_image03.jpg",
    href: "/blog/ai-video-generation",
  },
]

export default function LatestArticles() {
  return (
    <section id="blog" className="py-20 px-6">
      <div className="mx-auto max-w-7xl">
        {/* 상단 ACME 디자인 섹션 추가 */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-border mb-16 flex flex-col md:flex-row items-center gap-12">
          {/* 왼쪽 이미지 */}
          <div className="w-full md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden relative">
            <Image
              src="/images/04gallery02.jpg" // 이미지 경로를 실제 경로로 수정하세요
              alt="Plates and paper"
              fill
              className="object-cover"
            />
          </div>

          {/* 오른쪽 텍스트 및 버튼 */}
          <div className="w-full md:w-1/2 flex flex-col items-start md:items-start text-center md:text-left">
           
            
            <h1 className="text-4xl md:text-5xl font-semibold text-black leading-tight mb-4">
              What did you think of our service?
            </h1>
            
            <p className="text-lg text-black mb-12 max-w-md">
              파인드카테고리의 스타일링을 경험해보세요
            </p>
            
            <div className="w-full flex flex-col items-center md:items-start gap-4">
              <span className="text-sm text-black">Takes less than 2 minutes</span>
              <button className="w-full bg-black text-white font-medium py-4 rounded-xl hover:bg-[#8A8A8A] transition-colors">
                Incomplete Setup
              </button>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4">
          
          <span className="text-left font-medium text-center text-foreground/70"> Get Ready : Coming soon</span>
        </div>

        <h2 className="text-3xl md:text-4xl text-white text-center mb-12">출시예정 콘텐츠</h2>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <Link key={index} href={article.href} className="group">
              <div className="rounded-2xl overflow-hidden mb-4">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={400}
                  height={250}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-xs font-medium text-foreground/60 bg-secondary px-3 py-1 rounded-full">
                  {article.category}
                </span>
                <span className="text-xs text-foreground/50">{article.date}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors capitalize">
                {article.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}