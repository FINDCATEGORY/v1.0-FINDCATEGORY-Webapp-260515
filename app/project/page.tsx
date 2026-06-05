import { Header } from "@/components/header";
import Hero from "@/components/project/hero"
import About from "@/components/project/About"
import { EditorialSection } from "@/components/sections/editorial-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import LatestArticles from "@/components/project/latest-articles"
import { FooterSection } from "@/components/sections/footer-section";

export default function ProjectPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <EditorialSection />
      <TestimonialsSection />
      <LatestArticles />
      <FooterSection />
    </main>
  )
}
