"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export function GallerySection() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);
  const rafRef = useRef<number | null>(null);

  const images = [
    { src: "/images/05gallery01.png", alt: "Modern architecture at sunrise" },
    { src: "/images/05gallery02.png", alt: "Modern architecture in daylight" },
    { src: "/images/05gallery03.png", alt: "Modern architecture at dusk" },
  ,
  ];

  const updateTransform = useCallback(() => {
    if (!galleryRef.current) return;

    const rect = galleryRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = galleryRef.current.offsetHeight;

    const scrollableRange = sectionHeight - windowHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableRange));

    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateTransform);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateTransform();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateTransform]);

  const isLastImage = images.length - 1;

  const fullscreenStartProgress = 0.6;
  const fullscreenProgress = Math.max(0, Math.min(1, (scrollProgress - fullscreenStartProgress) / (1 - fullscreenStartProgress)));
  const easedFullscreenProgress = 1 - Math.pow(1 - fullscreenProgress, 3);

  return (
    <section
      id="gallery"
      ref={galleryRef}
      className="relative bg-[#171717]]"
      style={{ minHeight: `${(images.length + 1) * 50}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center z-[px-4">
        <div className="relative w-full max-w-5xl h-[70vh] md:h-[80vh]">

<div 
    className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none"
    style={{
      // 스크롤 초반(0.2 미만)에만 보이고 이후에는 사라지도록 설정
      opacity: scrollProgress < 0.2 ? 1 : 0,
      transition: 'opacity 0.5s ease',
    }}
  >
    <h2 className="text-4xl md:text-6xl font-light text-white text-center">
      
    </h2>
  </div>

          {images.map((image, index) => {
            const isLast = index === isLastImage;
            const imageProgress = scrollProgress * images.length - index;
            const stackProgress = Math.max(0, Math.min(1, imageProgress));

            let translateY = (1 - stackProgress) * 100;
            let scale = 0.8 + stackProgress * 0.2;
            let opacity = stackProgress;

            if (isLast) {
              const normalScale = 0.8 + stackProgress * 0.2;
              const expandedScale = 1 + easedFullscreenProgress * 0.8;
              scale = normalScale + Math.max(0, stackProgress - 0.8) * 5 * (expandedScale - normalScale);
            }

            const zIndex = index;
            const borderRadius = isLast && easedFullscreenProgress > 0.3 ? (1 - easedFullscreenProgress) * 16 : undefined;

            return (
              <div
                key={index}
                className="absolute inset-0 flex items-start justify-center z-[100] pointer-events-none pt-10 md:pt-12"
                style={{
                  zIndex,
                  transform: `translate3d(0, ${translateY}%, 0) scale(${scale}) translateZ(0)`,
                  WebkitTransform: `translate3d(0, ${translateY}%, 0) scale(${scale}) translateZ(0)`,
                  opacity,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  willChange: "transform, opacity",
                  WebkitFontSmoothing: "antialiased",
                }}
              >
                <div
                  className="relative w-full h-full overflow-hidden rounded-xl md:rounded-2xl"
                  style={{
                    borderRadius: borderRadius !== undefined ? `${borderRadius}px` : undefined,
                  }}
                >
                  <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" priority={index < 3} />
                  <button
                    type="button"
                    className="absolute inset-0 cursor-zoom-in bg-transparent"
                    aria-label={`Preview ${image.alt}`}
                    onClick={() => {
                      setPreviewImage(image);
                      setPreviewOpen(true);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={(open) => {
        setPreviewOpen(open);
        if (!open) {
          setPreviewImage(null);
        }
      }}>
        <DialogContent className="max-w-[95vw] p-0 overflow-hidden sm:max-w-[80vw]">
          <div className="relative bg-black min-h-[60vh] sm:min-h-[70vh]">
            {previewImage ? (
              <Image
                src={previewImage.src}
                alt={previewImage.alt}
                fill
                className="object-contain"
                priority
              />
            ) : null}
            <DialogClose className="absolute top-4 right-4 rounded-full bg-white/90 p-2 text-black shadow-lg transition hover:bg-white" />
          </div>
          <div className="bg-background p-6 text-left">
            <DialogTitle className="text-xl">Image Preview</DialogTitle>
            <DialogDescription>{previewImage?.alt}</DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
