"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { useEffect } from "react"

interface Product {
  id: number
  name: string
  image: string
}

interface ProductModalProps {
  product: Product | null
  onClose: () => void
  allProducts: Product[]
  onProductClick: (product: Product) => void
}

export function ProductModal({ product, onClose, allProducts, onProductClick }: ProductModalProps) {
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [product])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  if (!product) return null

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 transition-opacity duration-300 ease-out md:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-sm flex-col overflow-hidden border-2 border-white bg-white shadow-2xl transition-all duration-300 ease-out md:max-w-2xl md:border-[3px]"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp 0.3s ease-out" }}
      >
        {/* Blue Header */}
        <div className="flex items-center justify-between bg-[#0a0a0a] px-3 py-2 md:px-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wide text-white md:text-sm">{product.name}</h2>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center border-2 border-white bg-white transition-colors hover:bg-gray-100 md:h-7 md:w-7"
            aria-label="Close"
          >
            <X className="h-3 w-3 text-[#1a3aa8] md:h-4 md:w-4" strokeWidth={3} />
          </button>
        </div>

        {/* Product Image */}
        <div className="flex flex-1 items-center justify-center bg-[#e5e5e5] p-4 md:p-6">
          <div className="relative h-[200px] w-[200px] md:h-[300px] md:w-[300px]">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-[#0a0a0a] px-3 pb-2 text-center md:px-4 md:pb-3">
          <p className="font-mono text-[10px] uppercase tracking-wide md:text-xs">RELEASED JULY 2024 [ARCHIVED]</p>
        </div>

        {/* Related Products section */}
        <div className="border-t-2 border-white bg-[#e5e5e5] px-3 py-2 md:px-4 md:py-3">
          <h3 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wide md:text-xs">Related Products</h3>
          <div className="grid grid-cols-4 gap-1 md:gap-2">
            {relatedProducts.map((relatedProduct) => (
              <button
                key={relatedProduct.id}
                onClick={() => onProductClick(relatedProduct)}
                className="group relative aspect-square overflow-hidden bg-white transition-transform duration-200 hover:-translate-y-1"
              >
                <Image
                  src={relatedProduct.image || "/placeholder.svg"}
                  alt={relatedProduct.name}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
