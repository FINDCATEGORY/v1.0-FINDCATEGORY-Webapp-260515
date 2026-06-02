"use client"

import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  name: string
  price: string
  image: string
  category: string
}

// 예시 상품 데이터
const products: Product[] = [
  { id: "1", name: "Premium Plate", price: "₩29,000", image: "/images/plate1.jpg", category: "플레이트 | plate" },
  { id: "2", name: "Modern Glass", price: "₩18,000", image: "/images/cup1.jpg", category: "컵 | Drinkware" },
]

export function ProductCardGrid({ hoveredCategory }: { hoveredCategory: string | null }) {
  const filteredProducts = hoveredCategory
    ? products.filter((p) => p.category === hoveredCategory)
    : products

  return (
    // grid-cols 설정을 변경하여 이미지 레이아웃 크기를 키웠습니다.
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {filteredProducts.map((product) => (
        <Link href="/category/detail" key={product.id} className="group block cursor-pointer">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-900">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="mt-3">
            <h3 className="text-base font-medium text-[#4C050C]">{product.name}</h3>
            <p className="text-sm text-gray-400 mt-0.5">{product.price}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}