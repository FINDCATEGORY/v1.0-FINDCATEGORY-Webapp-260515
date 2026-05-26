"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Share2 } from "lucide-react";
import Image from "next/image";
import { Background } from "@/components/spaceplanning/background";
import { ProductCard } from "@/components/product-card";
import { FooterSection } from "@/components/sections/footer-section";
import { HeroSection } from "@/components/sections/hero-section";

const features = [
  {
    id: 1,
    title: "린넨 라운드 테이블클로스",
    price: "$129",
    badge: "Premium",
    description: "Built specifically for modern product teams, every aspect is intentionally designed to help teams focus on what they do best: planning, building, and shipping great products.",
    image: "/images/spaceProduct01.png",
    videoId: "m9SBy_v-N3Y"
  },
  {
    id: 2,
    title: "스켈롭 디너 플레이트",
    price: "$85",
    badge: "Handmade",
    description: "Flexibility for your team's unique way of working. Designed to remove friction and accelerate your development cycle.",
    image: "/images/spaceProduct02.png",
    videoId: "3_YV-R6C0uM"
  },
  {
    id: 3,
    title: "데이지 무라노 글라스",
    price: "$210",
    badge: "Limited",
    description: "More than 15,000 product teams globally agree. Every detail is refined for professional quality and speed.",
    image: "/images/spaceProduct03.png",
    videoId: "TdpBRZ0dZhw"
  },
];

export default function SpacePlanningPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const selectedItem = features.find((item) => item.id === selectedId);

  return (
    <main className="w-full flex flex-col items-center text-white min-h-screen pb-20">
      <Header />
      
   <section className="relative w-full h-[80vh] max-w-7xl overflow-hidden rounded-[42px] md:rounded-[72px] mt-6">
  <Background src="/images/mainproject-001-260521.mp4" placeholder="/alt-placeholder.png" />
  
  {/* 영상 중앙 글씨 영역 */}
  <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center text-center p-6">
    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
      발견 : 스위스식 가정식 제안
    </h1>
    <p className="text-xl md:text-2xl text-white/80">
      SPACE STYLING by O0i
    </p>
  </div>
</section>
      
      {/* 1. 기존 3단 그리드 (수정 안 함) */}
      <section className="w-full max-w-7xl py-24 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((item) => (
            <motion.div
              key={item.id}
              layoutId={`card-${item.id}`}
              onClick={() => setSelectedId(item.id)}
              className="relative aspect-square overflow-hidden rounded-3xl border border-white/5 shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image src={item.image} alt={item.title} fill className={`object-cover transition-opacity duration-700 ${hoveredId === item.id ? "opacity-0" : "opacity-60"}`} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/40 to-transparent">
                <div className="flex justify-between items-end">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/10">
                    <Plus className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 2. 하단 카드 섹션 개선 (가시성 확보) */}
      <section className="w-full py-24 px-6 flex justify-center bg-black/20 border-t border-white/5">
        <div className="w-full">
          <h2 className="text-3xl font-bold mb-12 text-center">오늘의 레시피</h2>
          {/* ProductCard 자체는 수정 안 함. 감싸는 div의 속성으로 크기 제어 */}
          <div className="transform scale-100 hover:scale-[1.01] transition-transform duration-500">
             <ProductCard />
          </div>
        </div>
      </section>

      {/* 3. 모달 (수정 안 함) */}
      <AnimatePresence>
        {selectedId && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedId(null)} />
            <motion.div layoutId={`card-${selectedId}`} className="bg-[#121212] w-full max-w-2xl rounded-[40px] p-0 relative z-10 border border-white/10 overflow-hidden shadow-2xl">
              <div className="relative w-full aspect-video">
                <Image src={selectedItem.image} alt={selectedItem.title} fill className="object-cover" />
              </div>
              <div className="px-12 py-12">
                <h2 className="text-4xl font-bold mb-6">{selectedItem.title}</h2>
                <p className="text-gray-400 text-lg mb-12">{selectedItem.description}</p>
                <div className="flex gap-4">
                  <button className="flex-1 px-8 py-4 bg-white text-black rounded-full font-bold flex items-center justify-center gap-2"><Plus className="w-5 h-5" /> Add</button>
                  <button className="flex-1 px-8 py-4 bg-[#262626] text-white rounded-full font-bold flex items-center justify-center gap-2"><Share2 className="w-5 h-5" /> Share</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
            <FooterSection />
      </AnimatePresence>
    </main>
  );
}