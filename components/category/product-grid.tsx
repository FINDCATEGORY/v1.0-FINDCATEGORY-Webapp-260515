"use client";
import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/detail/ui/cart-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ProductDetailModal } from "@/components/category/product-detail-modal";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  categories: string[];
  description: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "골든아워 프린지 라피아 매트",
    price: "₩3,600",
    image: "/images/collection/goldenhour/1.png",
    categories: ["골든아워 콜렉션", "소품"],
    description: "라피아 소재의 프린지 장식 테이블 매트입니다. 자연스러운 텍스처가 테이블에 따뜻한 감성을 더해줍니다.",
  },
  {
    id: 2,
    name: "골든아워 라탄 언더 플레이트",
    price: "₩33,200",
    image: "/images/collection/goldenhour/2.png",
    categories: ["골든아워 콜렉션", "플레이트"],
    description: "라탄 소재로 제작된 언더 플레이트입니다. 골든아워 콜렉션의 따뜻한 톤과 어우러져 테이블을 우아하게 연출합니다.",
  },
  {
    id: 3,
    name: "골든아워 엣지 보울",
    price: "₩4,400",
    image: "/images/collection/goldenhour/3.png",
    categories: ["골든아워 콜렉션", "플레이트"],
    description: "섬세한 엣지 디테일이 돋보이는 보울입니다. 수프나 샐러드 등 다양한 요리에 활용할 수 있습니다.",
  },
  {
    id: 4,
    name: "골든아워 딥 플레이트",
    price: "₩10,800",
    image: "/images/collection/goldenhour/4.png",
    categories: ["골든아워 콜렉션", "플레이트"],
    description: "깊이감 있는 디자인의 플레이트입니다. 파스타, 리조또 등 깊은 그릇이 필요한 요리에 잘 어울립니다.",
  },
  {
    id: 5,
    name: "골든아워 엣지 디너플레이트",
    price: "₩12,500",
    image: "/images/collection/goldenhour/5.png",
    categories: ["골든아워 콜렉션", "플레이트"],
    description: "골든아워 콜렉션의 시그니처 엣지 디자인이 적용된 디너플레이트입니다. 일상적인 식사를 특별하게 만들어줍니다.",
  },
  {
    id: 6,
    name: "골든아워 플라워 냅킨",
    price: "₩6,300",
    image: "/images/collection/goldenhour/6.png",
    categories: ["골든아워 콜렉션", "소품"],
    description: "플라워 패턴이 수놓인 패브릭 냅킨입니다. 테이블 세팅에 화사한 포인트를 더해줍니다.",
  },
  {
    id: 7,
    name: "골든아워 리프 냅킨 버클",
    price: "₩1,100",
    image: "/images/collection/goldenhour/7.png",
    categories: ["골든아워 콜렉션", "오브제"],
    description: "리프 모양의 냅킨 버클입니다. 냅킨을 우아하게 고정해 테이블 세팅의 완성도를 높여줍니다.",
  },
  {
    id: 8,
    name: "골든아워 엠버우드 커트러리 set(4pcs)",
    price: "₩8,800",
    image: "/images/collection/goldenhour/8.png",
    categories: ["골든아워 콜렉션", "커트러리"],
    description: "엠버우드 핸들의 커트러리 4종 세트입니다. 포크, 나이프, 스푼이 포함되어 있으며 따뜻한 나무 소재가 골든아워의 감성을 담았습니다.",
  },
  {
    id: 9,
    name: "골든아워 선셋 글라스 시리즈",
    price: "₩4,700",
    image: "/images/collection/goldenhour/9.png",
    categories: ["골든아워 콜렉션", "글라스"],
    description: "노을빛을 담은 선셋 글라스 시리즈입니다. 음료의 색감과 어우러져 감각적인 테이블을 연출합니다.",
  },
  {
    id: 10,
    name: "골든아워 샌드 암포라 화병",
    price: "₩25,100",
    image: "/images/collection/goldenhour/10.png",
    categories: ["골든아워 콜렉션", "오브제"],
    description: "모래빛 암포라 형태의 화병입니다. 꽃을 꽂거나 단독으로 오브제로 활용하기에도 아름다운 디자인입니다.",
  },
  {
    id: 11,
    name: "골든아워 테이블클로스",
    price: "₩11,700",
    image: "/images/collection/goldenhour/11.png",
    categories: ["골든아워 콜렉션", "소품"],
    description: "골든아워 콜렉션의 무드를 담은 테이블클로스입니다. 부드러운 소재와 따뜻한 컬러로 테이블 전체 분위기를 완성합니다.",
  },
];

interface ProductGridProps {
  selectedCategory: string | null;
}

export function ProductGrid({ selectedCategory }: ProductGridProps) {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = selectedCategory && selectedCategory !== "모든제품"
    ? products.filter((p) => p.categories.includes(selectedCategory))
    : products;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filteredProducts.map((p) => (
          <div key={p.id} className="group block">
            <button
              onClick={() => setSelectedProduct(p)}
              className="w-full text-left"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-transparent">
                <Image src={p.image} alt={p.name} fill className="object-cover" />
              </div>
              <h3 className="text-[#4C050C] mt-3">{p.name}</h3>
              <p className="text-sm text-gray-400">{p.price}</p>
            </button>
            <Button
              onClick={() => addToCart(p)}
              className="w-full mt-2 bg-[#4C050C] text-white hover:bg-[#4C050C] hover:opacity-100 transition-none border-none"
            >
              담기
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent 
          onPointerDownOutside={(e) => {
            if ((e.target as Element).closest('#cart-floating-button')) {
              e.preventDefault();
            }
          }}
          className="w-screen h-[100dvh] max-w-none sm:w-[95vw] sm:h-auto sm:max-w-[90vw] lg:max-w-[1400px] sm:aspect-video overflow-y-auto bg-[#EBEBDF]/95 sm:border border-[#4C050C]/10 p-0 overflow-x-hidden rounded-none sm:rounded-lg"
        >
          <DialogTitle className="sr-only">{selectedProduct?.name || "제품 상세"}</DialogTitle>
          {selectedProduct && <ProductDetailModal product={selectedProduct} />}
        </DialogContent>
      </Dialog>
    </>
  );
}