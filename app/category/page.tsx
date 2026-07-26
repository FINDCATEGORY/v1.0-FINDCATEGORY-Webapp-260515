"use client"

import { Header } from "@/components/header"
import Image from "next/image"
import { ProductGrid } from "@/components/category/product-grid"
import { collectionTexts } from "@/components/category/product"
import { useState, useEffect, useRef } from "react"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/detail/ui/cart-context"

export default function CategoryPage() {
  const { setIsOpen, items } = useCart()
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0)
  const [selectedCategory, setSelectedCategory] = useState<string | null>("모든제품")
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

  const textCategories = [
    "모든제품",
    "플레이트",
    "커트러리",
    "소품",
    "오브제",
    "글라스",
  ]

  const currentText = selectedCategory
    ? collectionTexts[selectedCategory] || collectionTexts["default"]
    : collectionTexts["default"]

  return (
    <div className="flex min-h-screen flex-col bg-[#EBEBDF]">
      <Header />

      <div className="flex flex-1 flex-col md:flex-row pt-20">
        <aside className="w-full bg-[#EBEBDF] border-b border-neutral-800 md:sticky md:top-20 md:h-[calc(100vh-80px)] md:w-64 md:border-r md:overflow-y-auto no-scrollbar">
          <nav className="p-3 md:p-6 flex flex-col gap-3 md:gap-0">
            <ul className="flex flex-row gap-2 overflow-x-auto no-scrollbar md:flex-col md:gap-2">
              {textCategories.map((category) => (
                <li key={category} className="flex-shrink-0 w-auto md:w-full">
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-center px-4 py-2.5 text-sm rounded-full md:rounded-md transition-colors whitespace-nowrap font-sans
                      ${selectedCategory === category
                        ? "bg-[#4C050C] text-white font-bold shadow-sm"
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
          <div className="mb-8 text-[#4C050C]">
            <h2 className="text-xl md:text-2xl font-bold mb-2 font-sans">{currentText?.title}</h2>
            <p className="text-sm md:text-base opacity-80 font-sans">{currentText?.description}</p>
          </div>
          <div className="flex-1">
            <ProductGrid selectedCategory={selectedCategory || "모든제품"} />
          </div>
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