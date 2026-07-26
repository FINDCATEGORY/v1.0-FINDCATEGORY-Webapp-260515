"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, MoreHorizontal, Clock, Building2, PackageSearch, CreditCard, Truck } from "lucide-react";

interface Request {
  id: string;
  company: string;
  items: string;
  budget: number;
  manager: string;
  daysInStage: number;
  priority: "High" | "Medium" | "Low";
}

interface Stage {
  id: string;
  name: string;
  icon: any;
  requests: Request[];
  totalBudget: number;
}

const initialStages: Stage[] = [
  {
    id: "received",
    name: "의뢰 접수",
    icon: PackageSearch,
    totalBudget: 0,
    requests: [],
  },
  {
    id: "quoting",
    name: "견적 진행",
    icon: Building2,
    totalBudget: 0,
    requests: [],
  },
  {
    id: "awaiting_payment",
    name: "결제 대기",
    icon: CreditCard,
    totalBudget: 0,
    requests: [],
  },
  {
    id: "processing",
    name: "구매/배송 진행",
    icon: Truck,
    totalBudget: 0,
    requests: [],
  },
];

const priorityConfig = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-[#EBEBDF] text-[#4C050C]/60",
};

function RequestCard({ request, index }: { request: Request; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group bg-white border border-[#4C050C]/10 rounded-2xl p-5 cursor-grab active:cursor-grabbing hover:border-[#4C050C]/30 hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EBEBDF]/50 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[#4C050C]/60" />
          </div>
          <div>
            <span className="text-base font-black text-[#4C050C] font-sans truncate max-w-[140px] block">{request.company}</span>
            <span className={`inline-block px-2 py-0.5 mt-1 rounded-md text-[10px] font-bold font-sans ${priorityConfig[request.priority]}`}>
              {request.priority} Priority
            </span>
          </div>
        </div>
        <button className={cn(
          "w-8 h-8 flex items-center justify-center rounded-xl text-[#4C050C]/40 hover:text-[#4C050C] hover:bg-[#EBEBDF] transition-all duration-200",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="text-sm font-bold text-[#4C050C]/80 font-sans mb-4 line-clamp-2 leading-relaxed">
        {request.items}
      </div>

      <div className="flex items-center gap-2 text-base text-[#4C050C] font-black font-sans mb-4 bg-[#EBEBDF]/30 p-2.5 rounded-xl">
        예상 예산: {request.budget.toLocaleString()}만 P
      </div>

      <div className="flex items-center justify-between text-xs font-bold text-[#4C050C]/60 font-sans border-t border-[#4C050C]/10 pt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-[#4C050C]/10 flex items-center justify-center text-[10px] text-[#4C050C]">
            {request.manager.charAt(0)}
          </div>
          {request.manager}
        </div>
        <div className="flex items-center gap-1.5 bg-[#EBEBDF]/50 px-2 py-1 rounded-lg">
          <Clock className="w-3.5 h-3.5" />
          {request.daysInStage}일째
        </div>
      </div>
    </div>
  );
}

export function PipelineSection() {
  const stages = initialStages;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#4C050C] font-sans">계약관리</h2>
          <p className="text-sm font-bold text-[#4C050C]/60 mt-1 font-sans">기업/대량 구매 고객의 의뢰 파이프라인을 관리합니다.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#4C050C] text-white rounded-full text-sm font-bold hover:bg-[#4C050C]/90 transition-colors duration-200 font-sans shadow-sm">
          <Plus className="w-4 h-4" />
          새 의뢰 등록
        </button>
      </div>

      {/* Pipeline board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
        {stages.map((stage, stageIndex) => (
          <div
            key={stage.id}
            className="bg-[#EBEBDF]/30 border border-[#4C050C]/5 rounded-[24px] p-5 min-h-[600px] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${stageIndex * 100}ms`, animationFillMode: "both" }}
          >
            {/* Stage header */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-[#4C050C]/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBEBDF] flex items-center justify-center">
                  <stage.icon className="w-5 h-5 text-[#4C050C]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#4C050C] font-sans">{stage.name}</h3>
                  <span className="text-xs font-bold text-[#4C050C]/60 font-sans block mt-0.5">
                    {stage.requests.length}건 진행중
                  </span>
                </div>
              </div>
            </div>

            {/* Total Budget Summary */}
            <div className="mb-6 px-2">
              <div className="flex justify-between items-center text-sm font-bold text-[#4C050C]/60 font-sans mb-1">
                <span>단계별 총 예상액</span>
                <span className="text-[#4C050C] font-black">{stage.totalBudget.toLocaleString()}만 P</span>
              </div>
            </div>

            {/* Deals */}
            <div className="space-y-4 flex-1">
              {stage.requests.map((request, dealIndex) => (
                <RequestCard key={request.id} request={request} index={dealIndex} />
              ))}
            </div>

            {/* Add deal to stage */}
            <button className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-[#4C050C]/20 text-sm font-bold text-[#4C050C]/60 hover:text-[#4C050C] hover:border-[#4C050C]/40 hover:bg-white transition-all duration-200 font-sans">
              <Plus className="w-4 h-4" />
              의뢰 추가
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
