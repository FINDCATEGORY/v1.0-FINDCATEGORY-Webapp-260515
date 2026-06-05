"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react"
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
}

export function ProductDetailModal({ product }: ProductDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const productImages = [product.image]

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setQuantity(1)
  }

  const updateQuantity = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change))
  }

  return (
    <div className="flex flex-col justify-start md:justify-center min-h-full space-y-8 p-6 pt-12 pb-24 md:p-10 lg:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* 이미지 */}
        <div className="flex justify-center w-full">
          <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
            <div className="relative w-full aspect-square">
              <Image
                src={productImages[currentImageIndex]}
                alt={product.name}
                fill
                className="object-contain"
              />
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (prev) => (prev - 1 + productImages.length) % productImages.length
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#4C050C]" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5 text-[#4C050C]" />
                  </button>
                </>
              )}
            </div>
            <div className="flex justify-center space-x-2 mt-4">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-[#4C050C]" : "bg-[#4C050C]/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 제품 정보 */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-[#4C050C] mb-2">{product.name}</h2>
          </div>

          <p className="text-[#4C050C]/80 leading-relaxed">{product.description}</p>

          <div className="flex flex-wrap gap-2">
            {product.categories.map((cat) => (
              <span
                key={cat}
                className="text-xs bg-[#4C050C]/10 text-[#4C050C] px-3 py-1 rounded-full border border-[#4C050C]/20"
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#4C050C]/80 mb-2 block font-medium">수량</label>
              <div className="flex items-center gap-3 border border-[#4C050C]/20 p-2 rounded-lg w-fit">
                <button
                  onClick={() => updateQuantity(-1)}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-[#4C050C]/10 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4 text-[#4C050C]" />
                </button>
                <span className="w-8 text-center text-[#4C050C] font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => updateQuantity(1)}
                  className="p-2 hover:bg-[#4C050C]/10 rounded transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#4C050C]" />
                </button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full bg-[#4C050C] text-white font-bold hover:bg-[#4C050C] hover:opacity-100 transition-none py-6 text-base mb-20"
            >
              {quantity > 1 ? `${quantity}개 장바구니에 담기` : "장바구니에 담기"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
