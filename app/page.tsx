import { Header } from "@/components/header";
import { HeroSection } from "@/components/sections/hero-section";
import { TechnologySection } from "@/components/sections/technology-section";
import { PhilosophySection } from "@/components/sections/philosophy-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { CollectionSection } from "@/components/sections/collection-section";
import { EditorialSection } from "@/components/sections/editorial-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FooterSection } from "@/components/sections/footer-section";

// Next.js 메인 페이지는 반드시 export default function이어야 합니다.
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header 내부에서 이제 Join 버튼과 모달 로직을 처리합니다 */}
      <Header />
      
      <HeroSection />
      <TechnologySection />
      <PhilosophySection />
      <GallerySection />
      <CollectionSection />
      <EditorialSection />
      <TestimonialsSection />
      <FooterSection />
    </main>
  );
}