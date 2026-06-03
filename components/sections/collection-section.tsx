"use client";

import { FadeImage } from "@/components/fade-image";

const accessories = [
  {
    id: 1,
    name: `스켈롭 크로커리 플레이트 
    Zita Scalloped Crockery Plate`,


    image: "/images/collection/goldenhour/goldenhour2.jpg",
  },
  {
    id: 2,
    name: `투코드 린넨 냅킨
Two Cord Linen Napkin`,


    image: "/images/collection/goldenhour/goldenhour4.jpg",
  },
  {
    id: 3,
    name: `클래식 커트러리
Classic Cutlery Model`,

    image: "/images/collection/goldenhour/goldenhour1.jpg",
  },
];

export function CollectionSection() {
  return (
    <section id="accessories" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-20 md:px-12 lg:px-20 md:py-10">
        <h2 className="text-3xl tracking-tight md:text-4xl text-center">
          Category : Products
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
              <div className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium leading-snug text-foreground" style={{ whiteSpace: "pre-line" }}>
                      {accessory.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground" style={{ whiteSpace: "pre-line" }}>
                      {accessory.description}
                    </p>
                  </div>
                  <span className="text-lg font-medium text-foreground">
                    {accessory.price}
                  </span>
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
              <div className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium leading-snug text-foreground" style={{ whiteSpace: "pre-line" }}>
                      {accessory.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground" style={{ whiteSpace: "pre-line" }}>
                      {accessory.description}
                    </p>
                  </div>
                  <span className="font-medium text-foreground text-2xl">
                    {accessory.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
