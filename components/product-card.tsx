"use client";

import { useState } from "react";
// Image 대신 video를 사용할 것이므로 Image는 유지하거나 제거 가능
import { Button } from "@/components/ui/button";

export function ProductCard() {
  return (
    <div className="w-full flex flex-col overflow-hidden rounded-[40px] border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.01]">
      
      {/* 이미지 영역을 비디오 영역으로 변경 */}
      <div className="w-full h-[450px] relative overflow-hidden bg-black">
        <video
          src="/images/7editorial1.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        {/* 배지 등 기존 요소 유지 */}
        <div className="absolute top-8 left-8">
          <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ff7b32]" />
            <span className="text-xs font-bold text-white tracking-widest uppercase">오늘의 레시피 : Today Recipe</span>
          </div>
        </div>
      </div>

      {/* 하단 텍스트 및 버튼 영역 (기존과 동일) */}
      <div className="w-full p-10 flex flex-col gap-6">
        <div className="space-y-2">
          <h3 className="text-4xl font-bold text-white tracking-tight">스위스 가정식 뢰슈티를 만나보세요</h3>
          <p className="text-white/50 text-lg leading-relaxed">
            - 공개 예정
          </p>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-white"></span>
        </div>
        <div className="flex gap-4 pt-2">
          <Button className="flex-1 rounded-full py-7 bg-white text-black text-lg font-bold ">Pre-order Now</Button>
          <Button className="flex-1 rounded-full py-7 bg-[#1a1a1a] text-white text-lg font-bold border border-white/10 hover:bg-[#262626]">Learn More</Button>
        </div>
      </div>
    </div>
  );
}