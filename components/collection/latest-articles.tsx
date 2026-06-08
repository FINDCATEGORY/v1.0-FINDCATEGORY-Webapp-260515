import Image from "next/image"
import Link from "next/link"
import { BookOpen } from "lucide-react"

const articles = [
  {
    category: "1st collection",
    date: "May 5, 2026",
    title: "Coming soon",
    image: "/images/Reb	eccaUdall-RebeccaHopePhotography-1254_06b82e3c-bef0-4e13-9e98-ba8750849578.webp",
    href: "/blog/llm-implementation",
  },
  {
    category: "2nd collection",
    date: "May 5, 2025",
    title: "Coming soon",
    image: "/images/RebeccaUdall-Nov2023-4539_4b53ffba-cf1d-4e25-a18d-965748bfee39.webp",
    href: "/blog/generative-ai-design",
  },
  {
    category: "3rd collection",
    date: "May 5, 2025",
    title: "Coming soon",
    image: "/images/02_main_image03.jpg",
    href: "/blog/ai-video-generation",
  },
]

export default function LatestArticles() {
  return (
    <section id="blog" className="py-10 px-0">
      <div className="mx-auto max-w-7xl">
        {/* 상단 ACME 디자인 섹션 추가 */}
        <div className="bg-transparent rounded-3xl p-8 md:p-12 shadow-sm border border-[#4C050C] mb-10 flex flex-col md:flex-row items-center gap-5">
          {/* 왼쪽 이미지 */}
          <div className="w-full md:w-1/2 aspect-[5/6] rounded-2xl overflow-hidden relative">
            <Image
              src="/images/04gallery02.jpg"
              alt="Plates and paper"
              fill
              className="object-cover"
            />
          </div>

          {/* 오른쪽 텍스트 및 버튼 */}
          <div className="w-full md:w-1/2 flex flex-col items-start md:items-start text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-semibold text-[#4C050C] leading-tight mb-18">
              What did you think of our service?
            </h1>
            
            <p className="text-lg text-[#4C050C]/80 mb-12 max-w-md">
              파인드카테고리의 스타일링을 경험해보세요
            </p>
            
            <div className="w-full flex flex-col items-center md:items-start gap-4">
              <span className="text-sm text-[#4C050C]/60">Takes less than 2 minutes</span>
              <button className="w-full bg-[#4C050C] text-[#EBEBDF] font-medium py-4 rounded-xl hover:bg-[#4C050C]/90 transition-colors">
                Incomplete Setup
              </button>
            </div>
          </div>
        </div>

        {/* Section Header: justify-center 추가로 중앙 정렬 */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-center font-medium text-foreground/70"> Get Ready : Coming soon</span>
        </div>

        <h2 className="text-3xl md:text-4xl text-[#4C050C] text-center mb-12">출시예정 콘텐츠</h2>

        {/* Articles Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {articles.map((article, index) => (
            <div key={index}>
              <div style={{ borderRadius: "16px", overflow: "hidden", marginBottom: "16px" }}>
                <Image src={article.image} alt={article.title} width={400} height={250} style={{ width: "100%", height: "208px", objectFit: "cover" }} />
              </div>
              <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", background: "#4C050C", color: "#EBEBDF", padding: "4px 12px", borderRadius: "99px" }}>
                  {article.category}
                </span>
                <span style={{ fontSize: "12px", color: "#888" }}>{article.date}</span>
              </div>
              <h3 style={{ fontSize: "18px", color: "#4C050C" }}>{article.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}