"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Plus, Minus, ArrowLeft, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/detail/ui/cart-context"

interface ProductDetailModalProps {
  product: {
    id: number
    name: string
    price: string
    image: string
    categories: string[]
    description: string
  }
  onClose?: () => void
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart, items, setIsOpen } = useCart()

  const productImages = [product.image]
  const totalCartCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      setIsOpen(true)
    }, 500)
  }

  const updateQuantity = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change))
  }

  // Specifications based on categories or default luxury specs
  const categoryName = Array.isArray(product.categories) ? product.categories[0] : (product.categories || "Tableware");
  const specs = [
    { label: "Dimensions", value: "85 cm height x 90 cm width x 88 cm depth" },
    { label: "Material", value: "Premium crafted sustainable materials & solid finish" },
    { label: "Finish", value: "Matte artisanal texture with refined protective glaze" },
    { label: "Comfort", value: "Ergonomically balanced for everyday functional elegance" },
    { label: "Weight Capacity", value: "Up to 150 kg (330 lbs) durability tested" },
    { label: "Assembly", value: "Arrives fully assembled & inspected" },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-full w-full bg-white text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white overflow-hidden">
      {/* 
        ========================================================
        LEFT PANEL : EDITORIAL INFO & ACTION CARD
        ========================================================
      */}
      <aside className="w-full lg:w-[420px] xl:w-[480px] bg-white p-6 sm:p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/10 z-10 flex-shrink-0">
        <div>
          {/* Brand Logo & Top Header */}
          <div className="flex items-center justify-between mb-2">
            <Link href="/" className="inline-block group">
              <h1 className="text-xl sm:text-2xl font-black tracking-tighter uppercase text-[#1A1A1A] group-hover:opacity-80 transition-opacity">
                FINDCATEGORY©
              </h1>
            </Link>

            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/60 hover:text-[#1A1A1A] py-1 px-3 rounded-full border border-black/10"
              >
                Close
              </button>
            )}
          </div>

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/50 font-medium my-6">
            <button onClick={onClose} className="hover:text-[#1A1A1A] transition-colors underline underline-offset-2">
              Shop
            </button>
            <span>›</span>
            <span className="text-[#1A1A1A] font-bold truncate max-w-[240px]">{product.name}</span>
          </div>

          {/* White Info Card (Reference Style) */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-black/5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-black text-[#1A1A1A] tracking-tight leading-snug flex-1">
                {product.name}
              </h2>
              <p className="text-xs text-[#1A1A1A]/70 font-normal leading-relaxed sm:max-w-[180px]">
                {product.description || "자연스러운 텍스처와 감각적인 실루엣이 공간에 따뜻한 감성과 세련된 무드를 선사합니다."}
              </p>
            </div>

            <div className="pt-2">
              <p className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
                {product.price}
              </p>
            </div>

            {/* Quantity & Action */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-[#1A1A1A]/60 pb-1">
                <span>Quantity</span>
                <div className="flex items-center border border-black/15 rounded-full px-2.5 py-1 gap-3 bg-white">
                  <button
                    type="button"
                    onClick={() => updateQuantity(-1)}
                    disabled={quantity <= 1}
                    className="p-1 hover:bg-black/5 rounded-full text-[#1A1A1A]/60 hover:text-[#1A1A1A] disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-[#1A1A1A] w-6 text-center select-none font-mono">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(1)}
                    className="p-1 hover:bg-black/5 rounded-full text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={added}
                className="w-full py-4 px-6 bg-[#1A1A1A] hover:bg-black text-white font-bold rounded-xl active:scale-[0.99] transition-all flex items-center justify-between shadow-lg group disabled:bg-emerald-700"
              >
                <span className="text-sm tracking-wide">
                  {added ? "Added To Cart" : (quantity > 1 ? `Add To Cart (${quantity})` : "Add To Cart")}
                </span>
                {added ? (
                  <Check className="w-5 h-5 text-white animate-in zoom-in duration-300" />
                ) : (
                  <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
                )}
              </button>
            </div>
          </div>

          {/* Detailed Specifications / Bullet Points (Reference Style) */}
          <div className="space-y-3 mt-8 text-xs text-[#1A1A1A]/75 leading-relaxed font-normal px-1">
            <p className="text-[#1A1A1A] font-bold mb-3 uppercase tracking-wider text-[11px]">Product Specifications</p>
            <ul className="space-y-2 list-none">
              {specs.map((spec, i) => (
                <li key={i} className="flex items-baseline gap-2">
                  <span className="text-black/40 font-bold">•</span>
                  <span><strong className="font-semibold text-[#1A1A1A]">{spec.label}:</strong> {spec.value}</span>
                </li>
              ))}
            </ul>

            <p className="italic text-[11px] text-[#1A1A1A]/50 font-serif pt-4 leading-normal">
              Elegant and enveloping — the FINDCATEGORY collection transforms any space into a luxurious retreat.
            </p>
          </div>
        </div>

        {/* Bottom Footnote Info */}
        <div className="mt-12 pt-8 border-t border-black/10 text-[11px] text-[#1A1A1A]/50 space-y-1 font-mono">
          <p className="font-sans font-bold text-[#1A1A1A]/70">Instagram</p>
          <p>(02) 682-1402</p>
          <p>37°33'58.8"N 126°58'40.2"E</p>
        </div>
      </aside>

      {/* 
        ========================================================
        RIGHT PANEL : FULL-SCREEN STUDIO SHOWCASE
        ========================================================
      */}
      <main className="flex-1 bg-white min-h-[60vh] lg:min-h-full relative flex items-center justify-center p-8 sm:p-12 lg:p-20 overflow-hidden">
        {/* Top Right Navigation Bar inside Modal */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 lg:top-12 lg:right-12 z-20 flex items-center gap-4 sm:gap-6 text-xs font-bold tracking-wider uppercase text-[#1A1A1A]">
          <Link href="/" className="hover:opacity-60 transition-opacity hidden sm:inline-block">
            HOME
          </Link>
          <button
            onClick={onClose}
            className="hover:opacity-60 transition-opacity underline underline-offset-4 decoration-2"
          >
            SHOP ALL
          </button>

          <button
            onClick={() => {
              onClose?.();
              setIsOpen(true);
            }}
            className="px-4 py-2 bg-[#1A1A1A] text-white rounded-full hover:bg-[#333] active:scale-95 transition-all flex items-center gap-2 shadow-md font-semibold"
          >
            <span className="tracking-widest">CART</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
              {totalCartCount}
            </span>
          </button>
        </div>

        {/* Center Studio Product Image */}
        <div className="relative w-full max-w-[500px] sm:max-w-[600px] lg:max-w-[750px] h-[380px] sm:h-[500px] md:h-[620px] lg:h-[700px] transition-transform duration-700 ease-out hover:scale-[1.03] flex items-center justify-center">
          <Image
            src={productImages[currentImageIndex] || "/images/collection/goldenhour/1.png"}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 90vw, 60vw"
            className="object-contain drop-shadow-2xl transition-all duration-500 hover:drop-shadow-[0_25px_35px_rgba(0,0,0,0.25)] p-4"
            priority
          />
        </div>

        {/* Optional Image Carousel Indicators if multiple images */}
        {productImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-black/5">
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)}
              className="p-1 hover:bg-black/10 rounded-full transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#1A1A1A]" />
            </button>
            <span className="text-xs font-mono font-bold px-2">
              {currentImageIndex + 1} / {productImages.length}
            </span>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % productImages.length)}
              className="p-1 hover:bg-black/10 rounded-full transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-[#1A1A1A]" />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
