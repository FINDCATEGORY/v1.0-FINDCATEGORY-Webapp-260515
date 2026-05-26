import { Header } from "@/components/header";
import Hero from "@/components/project/hero"
import { EditorialSection } from "@/components/sections/editorial-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import LatestArticles from "@/components/project/latest-articles"
import { FooterSection } from "@/components/sections/footer-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <EditorialSection />
      <TestimonialsSection />
      <LatestArticles />
      <FooterSection />
    </main>
  )
}
