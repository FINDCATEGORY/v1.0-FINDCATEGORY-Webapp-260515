"use client"

export const dynamic = 'force-dynamic'

import { useParams, useRouter } from "next/navigation"
import { products } from "@/components/product/product"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ProductDetailModal } from "@/components/product/product-detail-modal"

export default function DetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const product = products.find((p) => p.id === Number(id))

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        제품을 찾을 수 없어요.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 뒤로가기 버튼 */}
      <div className="px-4 pt-6 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#1A1A1A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로가기
        </button>
      </div>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductDetailModal product={product} />
        </div>
      </section>
    </div>
  )
}