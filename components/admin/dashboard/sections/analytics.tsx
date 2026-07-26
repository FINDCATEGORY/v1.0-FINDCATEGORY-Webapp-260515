"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export function AnalyticsSection() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#4C050C]/10 rounded-[24px] shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-16 h-16 bg-[#EBEBDF] rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="w-8 h-8 text-[#4C050C]" />
        </div>
        <h2 className="text-2xl font-black text-[#4C050C] font-sans mb-2">매출/성과 분석</h2>
        <p className="text-[#4C050C]/60 font-medium font-sans">대시보드 통계 및 실적 분석 리포트 기능이 준비 중입니다.</p>
      </div>
    </div>
  );
}
