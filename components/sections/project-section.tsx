"use client";

import { FadeImage } from "@/components/fade-image";

const accessories = [
  {
    id: 1,
    name: "공간스타일링",
    description: "고객의 취향과 라이프스타일을 반영하여\n감각적이고 조화로운 공간을 연출합니다.",
    image: "/images/collection/goldenhour/goldenhour4.jpg",
  },
  {
    id: 2,
    name: "제품컨설팅",
    description: "공간에 가장 잘 어울리는 오브제와 가구를\n선별하여 맞춤형 제안을 드립니다.",
    image: "/images/collection/goldenhour/goldenhour5.jpg",
  },
  {
    id: 3,
    name: "제품판매",
    description: "공간의 가치를 높여주는 파인드카테고리만의\n엄선된 셀렉션 제품들을 만나보세요.",
    image: "/images/collection/goldenhour/11glass.png",
  },
];

export function CollectionSection() {
  return (
    <section id="accessories" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-20 md:px-12 lg:px-20 md:py-10">
        <h2 className="text-3xl tracking-tight md:text-4xl text-center text-[#1A1A1A]">
          FIND your CATEGORY
        </h2>
      </div>

      {/* Accessories Grid/Carousel */}
      <div className="pb-24">
        {/* Mobile: Horizontal Carousel */}
        <div className="flex gap-6 overflow-x-auto px-6 pb-4 md:hidden snap-x snap-mandatory scrollbar-hide">
          {accessories.map((accessory) => (
            <div key={accessory.id} className="group flex-shrink-0 w-[75vw] snap-center">
              {/* Image */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary">
                <FadeImage
                  src={accessory.image || "/placeholder.svg"}
                  alt={accessory.name}
                  fill
                  className="object-cover group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="py-6 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <h3 className="text-2xl font-medium leading-snug text-[#1A1A1A] whitespace-pre-line">
                    {accessory.name}
                  </h3>
                  {accessory.description && (
                    <p className="mt-1 text-base text-[#1A1A1A]/70 whitespace-pre-line font-medium">
                      {accessory.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 md:px-12 lg:px-20">
          {accessories.map((accessory) => (
            <div key={accessory.id} className="group">
              {/* Image */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary">
                <FadeImage
                  src={accessory.image || "/placeholder.svg"}
                  alt={accessory.name}
                  fill
                  className="object-cover group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="py-6 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <h3 className="text-2xl font-medium leading-snug text-[#1A1A1A] whitespace-pre-line">
                    {accessory.name}
                  </h3>
                  {accessory.description && (
                    <p className="mt-1 text-base text-[#1A1A1A]/70 whitespace-pre-line font-medium">
                      {accessory.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
