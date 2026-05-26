"use client"

import Link from "next/link"
import { ProductGrid } from "@/components/product-grid"
import { useState } from "react"
import { Heart } from "lucide-react"

export default function Home() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const categories = [
    "플레이트", 
    "커트러리", 
    "테이블클로스", 
    "컵", 
    "액세서리", 
    "CATEGORY 6", 
    "CATEGORY 7", 
    "CATEGORY 8"
  ]

return (
    <div className="flex min-h-screen flex-col bg-black md:flex-row">
      {/* Sidebar: bg-white 를 bg-neutral-950 또는 bg-black으로 변경 */}
      <aside className="w-full bg-neutral-950 p-4 md:sticky md:top-0 md:h-screen md:w-48 md:p-6 border-r border-neutral-800">
        <div className="mb-4 flex items-center justify-between md:mb-8 md:block">
          {/* 텍스트 색상을 white로 변경하여 배경과 대비되게 함 */}
         <h1 className="whitespace-nowrap text-base font-semibold text-white md:mb-2 md:text-lg">
         <Link href="/" className="hover:opacity-80 transition-opacity">
          FINDCATEGORYⓇ
        </Link>
</h1>
          {/* 다른 텍스트 요소들도 text-gray-400 등으로 변경 추천 */}
        </div>


        <nav onMouseLeave={() => setHoveredCategory(null)} className="hidden md:block">
          <ul className="flex flex-wrap gap-3 text-xs md:flex-col md:space-y-2 md:text-sm">
            {categories.map((category) => (
              <li key={category}>
                <button
                  onMouseEnter={() => setHoveredCategory(category)}
                  className={`block w-full text-left transition-all duration-200 ${
                    hoveredCategory === category ? "font-semibold text-blue-600" : "text-gray-400 hover:text-gray-600"
                  } ${hoveredCategory && hoveredCategory !== category ? "opacity-30" : "opacity-100"}`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-6 left-6 hidden text-xs text-muted-foreground md:block">
          
          
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="flex flex-1 flex-col overflow-y-auto scroll-smooth p-4 md:p-8"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="flex-1">
          <ProductGrid hoveredCategory={hoveredCategory} />
        </div>




        <footer className="mt-8 block py-6 text-center text-xs text-gray-600 md:hidden">
          <p className="mb-1">Copyright 2025</p>
          <p>FINDCATEGORYⓇ All rights reserved.</p>
        </footer>
      </main>
    </div>
  )
}
