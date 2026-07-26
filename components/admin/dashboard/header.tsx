"use client";

import { cn } from "@/lib/utils";
import type { Section } from "@/app/membership/admin/page";
import { Bell, Search, Calendar, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/login";

interface HeaderProps {
  activeSection: Section;
}

const sectionTitles: Record<Section, string> = {
  overview: "운영 홈",
  customers: "파트너사 명부",
  reports: "스타일링 제안 & 문의",
  team: "컬렉션 관리",
  add_collection: "컬렉션 등록",
  inventory: "상품 관리",
  deals: "주문",
  pipeline: "계약관리",
  analytics: "매출/성과 분석",
  settings: "시스템 설정",
};

export function Header({ activeSection }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/membership");
  };

  return (
    <header className="h-[80px] bg-[#EBEBDF]/95 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8 border-b border-[#4C050C]/10">
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-black text-[#4C050C] font-sans">
          {sectionTitles[activeSection]}
        </h1>
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white border border-[#4C050C]/10 rounded-full shadow-sm text-sm font-bold text-[#4C050C]/60 font-sans">
          <Calendar className="w-4 h-4 text-[#4C050C]" />
          <span>최근 30일</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div
          className={cn(
            "relative flex items-center transition-all duration-300",
            searchFocused ? "w-72" : "w-56"
          )}
        >
          <Search className={cn("absolute left-4 w-4 h-4 transition-colors", searchFocused ? "text-[#4C050C]" : "text-[#4C050C]/40")} />
          <input
            type="text"
            placeholder="검색..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-10 pl-11 pr-4 rounded-full bg-white border border-[#4C050C]/10 text-sm font-bold text-[#4C050C] placeholder:text-[#4C050C]/40 focus:outline-none focus:border-[#4C050C]/30 focus:ring-2 focus:ring-[#4C050C]/10 transition-all shadow-sm font-sans"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#4C050C]/10 text-[#4C050C]/60 hover:text-[#4C050C] hover:bg-[#EBEBDF] transition-all shadow-sm">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse border-2 border-white" />
        </button>

        {/* Logout button */}
        <button 
          onClick={handleLogout}
          title="로그아웃"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[#4C050C]/10 text-[#4C050C]/60 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
