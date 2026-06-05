"use client"

import { Header } from "@/components/header"
import Image from "next/image"
import { ProductGrid } from "@/components/category/product-grid"
import { categoryBanners, collectionTexts } from "@/components/category/product"
import { useState, useEffect, useRef } from "react"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/detail/ui/cart-context"

export default function CategoryPage() {
  const { setIsOpen, items } = useCart()
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCartAnimating, setIsCartAnimating] = useState(false)
  const prevTotalRef = useRef(totalItems)

  useEffect(() => {
    if (totalItems > prevTotalRef.current) {
      setIsCartAnimating(true)
      const timer = setTimeout(() => setIsCartAnimating(false), 300)
      prevTotalRef.current = totalItems
      return () => clearTimeout(timer)
    }
    prevTotalRef.current = totalItems
  }, [totalItems])

  const imageCategories = [
    "골든아워 콜렉션",
    "셀룰리안 모먼트 콜렉션",
    "에메랄드 포레스트 콜렉션",
  ]

  const textCategories = [
    "플레이트",
    "커트러리",
    "소품",
    "오브제",
    "글라스",
  ]

  const currentBanner = selectedCategory
    ? categoryBanners[selectedCategory] || categoryBanners["default"]
    : categoryBanners["default"]

  const currentText = selectedCategory
    ? collectionTexts[selectedCategory] || collectionTexts["default"]
    : collectionTexts["default"]

  return (
    <div className="flex min-h-screen flex-col bg-[#EBEBDF]">
      <Header />

      <div className="flex flex-1 flex-col md:flex-row pt-20">
        <aside className="w-full bg-[#EBEBDF] border-b border-neutral-800 md:sticky md:top-20 md:h-[calc(100vh-80px)] md:w-64 md:border-r md:overflow-y-auto no-scrollbar">
          <nav className="p-3 md:p-6 flex flex-col gap-3 md:gap-0">
            <ul className="flex flex-row gap-3 overflow-x-auto no-scrollbar md:flex-col md:gap-0 md:pb-6">
              {imageCategories.map((category) => {
                const menuImage = categoryBanners[category] || categoryBanners["default"]
                return (
                  <li key={category} className="flex-shrink-0 w-36 md:w-full md:mb-6">
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className="w-full text-center flex flex-col items-center gap-2 md:gap-3"
                    >
                      <div className="relative w-full aspect-[4/5] md:aspect-[5/4] overflow-hidden rounded-md border border-[#4C050C]/20">
                        <Image src={menuImage} alt={category} fill className="object-cover" />
                      </div>
                      <span className={`text-xs md:text-sm whitespace-nowrap transition-colors ${selectedCategory === category ? "text-[#4C050C] font-bold" : "text-[#4C050C]/70 hover:text-[#4C050C]"}`}>
                        {category}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="hidden md:block w-full h-px bg-[#4C050C]/10 mb-6" />

            <ul className="flex flex-row gap-2 overflow-x-auto no-scrollbar md:flex-col md:gap-1">
              {textCategories.map((category) => (
                <li key={category} className="flex-shrink-0 w-auto md:w-full">
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-center px-4 py-2 text-sm rounded-full md:rounded-md transition-colors whitespace-nowrap
                      ${selectedCategory === category
                        ? "bg-[#4C050C] text-white font-bold"
                        : "bg-[#4C050C]/5 text-[#4C050C]/80 hover:bg-[#4C050C]/10"
                      }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex flex-1 flex-col p-4 md:p-6">
          {(!selectedCategory || selectedCategory === "모든제품") ? (
            <div className="flex flex-col gap-12">
              {imageCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="w-full text-left group"
                >
                  <div className="relative mb-6 w-full aspect-[21/9] overflow-hidden rounded-lg bg-neutral-900 shadow-lg">
                    <Image
                      src={categoryBanners[category]}
                      alt={category}
                      fill
                      className={`object-cover transition-transform duration-500 group-hover:scale-105 ${category === "셀룰리안 모먼트 콜렉션" ? "object-top" : "object-center"}`}
                    />
                  </div>
                  <div className="text-[#4C050C]">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-[#4C050C]/80 transition-colors">
                      {collectionTexts[category]?.title}
                    </h2>
                    <p className="text-sm md:text-base opacity-80">
                      {collectionTexts[category]?.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="relative mb-6 w-full aspect-[21/9] overflow-hidden rounded-lg bg-neutral-900 shadow-lg">
                {currentBanner && <Image src={currentBanner} alt="Banner" fill priority className={`object-cover ${selectedCategory === "셀룰리안 모먼트 콜렉션" ? "object-top" : "object-center"}`} />}
              </div>
              <div className="mb-8 text-[#4C050C]">
                <h2 className="text-xl md:text-2xl font-bold mb-2">{currentText.title}</h2>
                <p className="text-sm md:text-base opacity-80">{currentText.description}</p>
              </div>
              <div className="flex-1">
                <ProductGrid selectedCategory={selectedCategory} />
              </div>
            </>
          )}
        </main>
      </div>

      <button id="cart-floating-button" onClick={() => setIsOpen(true)} className={`fixed bottom-6 right-6 p-4 bg-[#4C050C] text-white rounded-full shadow-lg hover:bg-[#4C050C]/90 transition-transform duration-300 z-[60] flex items-center justify-center pointer-events-auto ${isCartAnimating ? "scale-125 -rotate-12" : "scale-100 rotate-0"}`}>
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-[#4C050C] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-[#4C050C]">
            {totalItems}
          </span>
        )}
      </button>
    </div>
  )
}