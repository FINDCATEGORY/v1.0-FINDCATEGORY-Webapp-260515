"use client"

import { useState, useMemo } from "react"
import { ProductCard } from "./product-card"
import { ProductModal } from "./product-modal"

const productImages = [
  "https://rebeccaudall.com/cdn/shop/files/GeorgianaLinenNapkin_Hazelnut.png?v=1774522031&width=588",
  "https://rebeccaudall.com/cdn/shop/files/RebeccaUdall-Nov2023-3933_0fa3fa6e-fa6f-4ca2-8a65-3c393fc4c001.jpg?v=1747054484&width=588",
  "https://rebeccaudall.com/cdn/shop/files/Untitled_design_-_2024-06-17T112548.067.png?v=1747003502&width=588",
  "https://rebeccaudall.com/cdn/shop/files/41_356e877b-593e-4284-80da-95c2b177aa0a.png?v=1767348693&width=588",
  "https://rebeccaudall.com/cdn/shop/files/Untitleddesign_62.jpg?v=1774010030&width=588",
  "https://rebeccaudall.com/cdn/shop/files/Untitled_design_-_2024-09-26T144043.501.png?v=1747003827&width=588",
  "https://rebeccaudall.com/cdn/shop/files/RebeccaUdall-RebeccaHopePhotography-0248.jpg?v=1763551904&width=588",
  "https://rebeccaudall.com/cdn/shop/files/Untitled_design_-_2025-05-27T141119.804.png?v=1772038792&width=588",
  "https://rebeccaudall.com/cdn/shop/files/58.png?v=1747134184&width=588",
  "https://rebeccaudall.com/cdn/shop/files/Untitled_design_-_2025-05-27T144322.001.png?v=1772038793&width=588",
  "https://rebeccaudall.com/cdn/shop/files/RebeccaUdall-RestariesShoot-RebeccaHopePhotography-5020.jpg?v=1747221073&width=588",
  "https://rebeccaudall.com/cdn/shop/files/2500_x_3000_-_2025-05-13T124054.662.png?v=1767351393&width=588",
  "https://rebeccaudall.com/cdn/shop/files/62_1d7f5a2d-4a86-42b1-91a2-573d5e849fe9.png?v=1747144443&width=588",
  "https://rebeccaudall.com/cdn/shop/files/Georgiana_Ladderstitch_Placemat_Burgundy_1.png?v=1747002844&width=588",
  "https://rebeccaudall.com/cdn/shop/files/2500_x_3000_42.png?v=1767619135&width=588",
  "https://rebeccaudall.com/cdn/shop/files/241.png?v=1776690515&width=588",
  "https://rebeccaudall.com/cdn/shop/files/Untitled_design_1_16f06516-85bf-42f9-bf50-9255b4bb5424.png?v=1747213486&width=588",
  "https://rebeccaudall.com/cdn/shop/files/PairofRippledTumblers_Carafe_55.jpg?v=1748356375&width=588",
  "https://rebeccaudall.com/cdn/shop/files/69_50ee916b-f879-46ab-bc3f-d038d31e746d.png?v=1772207631&width=588",
  "https://rebeccaudall.com/cdn/shop/files/2500_x_3000_7.png?v=1746999150&width=588",
  "https://rebeccaudall.com/cdn/shop/files/2500_x_3000_11.png?v=1767524174&width=588",
  "https://rebeccaudall.com/cdn/shop/files/BraidedNapkinRing-Gold.png?v=1760711200&width=588",
  "https://rebeccaudall.com/cdn/shop/files/12_7ac93d50-d1f3-4a70-8ebc-0c5a9ab4d2c7.jpg?v=1761309733&width=588",
  "https://rebeccaudall.com/cdn/shop/files/Untitled_design_-_2025-09-22T122130.690.png?v=1763638819&width=588",
  "https://rebeccaudall.com/cdn/shop/files/Untitled_design_3.png?v=1747213627&width=588",
  "https://rebeccaudall.com/cdn/shop/files/Untitled_design_-_2024-09-26T113545.420.png?v=1767355127&width=588",
  "https://rebeccaudall.com/cdn/shop/files/AlmaCandlestick_Tall_Green_0cec6347-de38-4598-8b54-b6d673b3662b.png?v=1772022917&width=588",
  "https://rebeccaudall.com/cdn/shop/files/2500_x_3000_39.png?v=1765534571&width=588",
  "https://rebeccaudall.com/cdn/shop/files/2500_x_3000_55.png?v=1747132171&width=588",
  "https://rebeccaudall.com/cdn/shop/files/RebeccaUdall-Oct2024-RebeccaHopePhotography-3914.jpg?v=1767355006&width=588",
  "https://rebeccaudall.com/cdn/shop/files/2500_x_3000_92.png?v=1769687851&width=588",
  "https://rebeccaudall.com/cdn/shop/files/Untitled_design_-_2024-10-10T121558.658.png?v=1747002859&width=588",
  "https://rebeccaudall.com/cdn/shop/files/4_53874138-7220-41f2-8b86-1b9cc37f5e6d.png?v=1747138437&width=588",
  "https://rebeccaudall.com/cdn/shop/files/RebeccaUdall-RebeccaHopePhotography-0067_9a843114-1d56-4392-97f7-2c20000d4131.jpg?v=1772038812&width=588",
  "https://rebeccaudall.com/cdn/shop/files/8_e9c1392d-8470-46d9-a268-6945736cdbf8.jpg?v=1747055060&width=588",
  "https://rebeccaudall.com/cdn/shop/files/RebeccaUdall-4826_e28c63d8-0422-4ad3-ad15-061bb6a33181.jpg?v=1747053329&width=588",
  "https://rebeccaudall.com/cdn/shop/files/64_f18ffe14-bf33-4935-9113-5e770ffd7574.png?v=1748343094&width=588",
  "https://rebeccaudall.com/cdn/shop/files/Untitled_design_-_2024-10-09T145807.792_499c9266-7ad6-42f1-aff1-53268a491094.png?v=1767354767&width=588",
  "https://rebeccaudall.com/cdn/shop/files/RebeccaUdall-RebeccaHopePhotography-0622_737144e9-6866-4b0b-a22a-d5c785e32f77.jpg?v=1747656242&width=588",
  "https://rebeccaudall.com/cdn/shop/files/RebeccaUdall-RebeccaHopePhotography-0606_6d5be752-4dea-475f-9a63-ecd65c02c12d.jpg?v=1767354876&width=588",
]

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

interface ProductGridProps {
  hoveredCategory: string | null
}

export function ProductGrid({ hoveredCategory }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const products = useMemo(() => {
    const shuffledImages = [...productImages, ...productImages.slice(0, 8)]

    return shuffledImages.map((image, index) => ({
      id: index + 1,
      name: `Product ${index + 1}`,
      image,
      category: categories[Math.floor(Math.random() * categories.length)],
    }))
  }, [])

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 xl:gap-x-6 xl:gap-y-8">
        {products.map((product) => {
          const shouldFade = hoveredCategory && product.category !== hoveredCategory

          return (
            <ProductCard
              key={product.id}
              {...product}
              onClick={() => setSelectedProduct(product)}
              isFaded={shouldFade}
            />
          )
        })}
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        allProducts={products}
        onProductClick={setSelectedProduct}
      />
    </>
  )
}
