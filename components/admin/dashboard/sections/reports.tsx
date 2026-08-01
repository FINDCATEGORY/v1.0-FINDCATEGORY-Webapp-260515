"use client";

import React from "react"

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Search,
  Filter
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const responseTimeData = [
  { day: "Mon", time: 45 },
  { day: "Tue", time: 52 },
  { day: "Wed", time: 38 },
  { day: "Thu", time: 65 },
  { day: "Fri", time: 48 },
  { day: "Sat", time: 120 },
  { day: "Sun", time: 95 },
];

const categoryData = [
  { name: "상품 문의", value: 45, color: "#1A1A1A" },
  { name: "배송/교환", value: 30, color: "rgba(76, 5, 12, 0.7)" },
  { name: "결제/환불", value: 15, color: "rgba(76, 5, 12, 0.4)" },
  { name: "기타", value: 10, color: "#FFFFFF" },
];

const inquiries = [
  { id: "1", title: "골든아워 컬렉션 재입고 문의", customer: "김민준 (PRESTIGE)", category: "상품 문의", date: "10분 전", status: "pending" },
  { id: "2", title: "파손 상품 교환 요청", customer: "이서연 (EDITION)", category: "배송/교환", date: "1시간 전", status: "in-progress" },
  { id: "3", title: "결제 카드 변경", customer: "박지훈 (SOCIAL)", category: "결제/환불", date: "3시간 전", status: "resolved" },
  { id: "4", title: "멤버십 승급 기준 문의", customer: "최유진 (EDITION)", category: "기타", date: "1일 전", status: "resolved" },
  { id: "5", title: "선물 포장 옵션 추가", customer: "정태영 (PRESTIGE)", category: "상품 문의", date: "1일 전", status: "resolved" },
];

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  index,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType<any>;
  color: string;
  index: number;
}) {
  return (
    <div
      className="group bg-white border border-[#1A1A1A]/10 rounded-[24px] p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
    >
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-white")}>
        <Icon className={cn("w-6 h-6 text-[#1A1A1A]", color)} />
      </div>
      <h3 className="text-sm font-bold text-[#1A1A1A]/60 font-sans mb-1">{title}</h3>
      <div className="text-3xl font-black text-[#1A1A1A] font-sans mb-2">{value}</div>
      <p className="text-xs font-bold text-[#1A1A1A]/50 font-sans">{description}</p>
    </div>
  );
}

export function ReportsSection() {
  const [chartsLoaded, setChartsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setChartsLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A1A] font-sans">1:1 문의 관리</h2>
          <p className="text-sm font-bold text-[#1A1A1A]/60 mt-1 font-sans">
            고객 문의 사항을 신속하게 처리하고 서비스 품질을 관리합니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1A1A1A]/20 text-[#1A1A1A] rounded-full text-sm font-bold hover:bg-white transition-colors duration-200 font-sans">
            <Filter className="w-4 h-4" />
            필터
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="미답변 문의"
          value="12"
          description="현재 대기 중인 문의건"
          icon={AlertCircle}
          color="text-red-600"
          index={0}
        />
        <StatCard
          title="평균 응답 시간"
          value="45분"
          description="최근 7일 평균"
          icon={Clock}
          color="text-[#1A1A1A]"
          index={1}
        />
        <StatCard
          title="당월 처리 완료"
          value="342"
          description="이번 달 해결된 문의"
          icon={CheckCircle2}
          color="text-emerald-600"
          index={2}
        />
        <StatCard
          title="고객 만족도"
          value="4.8"
          description="5점 만점 기준"
          icon={MessageSquare}
          color="text-amber-500"
          index={3}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response time trend */}
        <div className="bg-white border border-[#1A1A1A]/10 rounded-[24px] p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-[#1A1A1A] font-sans">주간 응답 시간 추이</h3>
              <p className="text-sm font-bold text-[#1A1A1A]/60 mt-1 font-sans">요일별 평균 답변 소요 시간 (분)</p>
            </div>
          </div>
          <div className={`h-[280px] transition-opacity duration-700 ${chartsLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" strokeOpacity={0.1} vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#1A1A1A", opacity: 0.7, fontSize: 12, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#1A1A1A", opacity: 0.7, fontSize: 12, fontWeight: 700 }}
                  tickFormatter={(value) => `${value}m`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(76, 5, 12, 0.1)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "#1A1A1A",
                    fontFamily: "sans-serif"
                  }}
                  itemStyle={{ color: "#1A1A1A" }}
                  formatter={(value: number) => [`${value}분`, "응답 시간"]}
                />
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="#1A1A1A"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#FFFFFF", stroke: "#1A1A1A", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "#1A1A1A", stroke: "#FFFFFF", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inquiry Categories pie chart */}
        <div className="bg-white border border-[#1A1A1A]/10 rounded-[24px] p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <div className="mb-6">
            <h3 className="text-xl font-black text-[#1A1A1A] font-sans">문의 유형 분류</h3>
            <p className="text-sm font-bold text-[#1A1A1A]/60 mt-1 font-sans">전체 문의 유형 비율</p>
          </div>
          <div className="flex items-center gap-8 h-[250px]">
            <div className={`w-[200px] h-[200px] transition-opacity duration-700 ${chartsLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", fontWeight: "bold", border: "none", backgroundColor: "#FFFFFF", color: "#1A1A1A" }}
                    itemStyle={{ color: "#1A1A1A" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-4">
              {categoryData.map((category, index) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between animate-in fade-in slide-in-from-right-2"
                  style={{ animationDelay: `${(index + 5) * 100}ms`, animationFillMode: "both" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: category.color }} />
                    <span className="text-sm font-bold text-[#1A1A1A] font-sans">{category.name}</span>
                  </div>
                  <span className="text-sm font-black text-[#1A1A1A] font-sans">{category.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry List */}
      <div className="bg-white border border-[#1A1A1A]/10 rounded-[24px] overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
        <div className="flex items-center justify-between p-6 border-b border-[#1A1A1A]/10">
          <div>
            <h3 className="text-xl font-black text-[#1A1A1A] font-sans">최근 접수 문의</h3>
            <p className="text-sm font-bold text-[#1A1A1A]/60 mt-1 font-sans">실시간 접수 현황</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-[#1A1A1A]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="문의 검색..." 
              className="pl-9 pr-4 py-2 bg-white/30 border border-[#1A1A1A]/10 rounded-full text-sm font-bold text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:border-[#1A1A1A]/30 focus:ring-1 focus:ring-[#1A1A1A]/30 w-[200px]"
            />
          </div>
        </div>
        <div className="divide-y divide-[#1A1A1A]/5">
          {inquiries.map((inquiry, index) => (
            <div
              key={inquiry.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-white/20 transition-colors duration-150 cursor-pointer animate-in fade-in slide-in-from-left-2"
              style={{ animationDelay: `${(index + 6) * 50}ms`, animationFillMode: "both" }}
            >
              <div className="flex items-start gap-4 mb-4 sm:mb-0">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  inquiry.status === "pending" ? "bg-red-100 text-red-600" :
                  inquiry.status === "in-progress" ? "bg-amber-100 text-amber-600" :
                  "bg-emerald-100 text-emerald-600"
                )}>
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-base font-black text-[#1A1A1A] font-sans">{inquiry.title}</p>
                    {inquiry.status === "pending" && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#1A1A1A]/60 font-sans">
                    <span>{inquiry.customer}</span>
                    <span className="w-1 h-1 rounded-full bg-[#1A1A1A]/20" />
                    <span>{inquiry.category}</span>
                    <span className="w-1 h-1 rounded-full bg-[#1A1A1A]/20" />
                    <span>{inquiry.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end sm:justify-start w-full sm:w-auto">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#1A1A1A] hover:bg-white transition-all duration-200 font-sans w-full justify-center sm:w-auto">
                  {inquiry.status === "resolved" ? "답변 보기" : "답변 하기"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
