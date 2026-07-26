"use client";

import { useState, useEffect } from "react";

const stages = [
  { name: "법인 고객", value: 65, count: 1250, color: "bg-[#4C050C]/20" },
  { name: "개인사업자", value: 25, count: 480, color: "bg-[#4C050C]/50" },
  { name: "일반/기타", value: 10, count: 192, color: "bg-[#4C050C]" },
];

export function PipelineOverview() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white border border-[#4C050C]/10 rounded-[24px] shadow-sm p-6 sm:p-8 h-[380px] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 flex flex-col">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#4C050C] font-sans">파트너 유형 분포</h3>
        <p className="text-sm text-[#4C050C]/60 mt-1 font-sans font-medium">가입 파트너 기준 비율</p>
      </div>

      <div className="space-y-6 flex-1">
        {stages.map((stage, index) => (
          <div key={stage.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#4C050C] font-sans">{stage.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#4C050C]/60 font-medium font-sans">{stage.count.toLocaleString()}명</span>
                <span className="text-sm font-black text-[#4C050C] font-sans min-w-[36px] text-right">{stage.value}%</span>
              </div>
            </div>
            <div className="h-2.5 bg-[#EBEBDF] rounded-full overflow-hidden">
              <div
                className={`h-full ${stage.color} rounded-full transition-all duration-1000 ease-out`}
                style={{
                  width: isLoaded ? `${stage.value}%` : "0%",
                  transitionDelay: `${index * 150}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total pipeline value */}
      <div className="mt-4 pt-6 border-t border-[#4C050C]/10">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#4C050C]/60 font-bold font-sans">총 파트너 수</span>
          <span className="text-2xl font-black text-[#4C050C] font-sans">1,922명</span>
        </div>
      </div>
    </div>
  );
}
