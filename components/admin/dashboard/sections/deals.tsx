"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  ChevronDown,
  Package,
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  member: string;
  tier: string;
  items: string;
  amount: number;
  status: "completed" | "processing" | "shipping";
  orderDate: string;
}

const orders: Order[] = [];

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", label: "결제/배송완료" },
  processing: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", label: "상품준비중" },
  shipping: { icon: Package, color: "text-blue-600", bg: "bg-blue-50", label: "배송중" },
};

export function DealsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "all" || order.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-[#4C050C] font-sans">주문</h2>
        <p className="text-sm font-bold text-[#4C050C]/60 mt-1 font-sans">회원들의 상품 주문 내역을 통합 관리합니다.</p>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#4C050C]/10 rounded-[24px] shadow-sm p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4C050C]/60" />
            <input
              type="text"
              placeholder="주문번호, 회원명, 상품명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-72 h-10 pl-10 pr-4 rounded-full bg-[#EBEBDF]/50 border-transparent text-sm font-bold font-sans text-[#4C050C] placeholder:text-[#4C050C]/40 focus:outline-none focus:ring-2 focus:ring-[#4C050C]/20 transition-all duration-200"
            />
          </div>
          <div className="flex items-center gap-2 ml-2">
            {["all", "completed", "processing", "shipping"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold font-sans transition-all duration-200 border",
                  selectedFilter === filter
                    ? "bg-[#4C050C] text-white border-[#4C050C]"
                    : "bg-transparent text-[#4C050C] border-[#4C050C]/20 hover:bg-[#EBEBDF]"
                )}
              >
                {filter === "all" ? "전체 상태" : statusConfig[filter as keyof typeof statusConfig].label}
              </button>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#EBEBDF]/50 text-sm font-bold text-[#4C050C] hover:bg-[#EBEBDF] transition-colors duration-200 font-sans">
          <Filter className="w-4 h-4" />
          상세 필터
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#4C050C]/10 rounded-[24px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#4C050C]/10 bg-[#EBEBDF]/30">
                <th className="text-left py-4 px-6 text-xs font-bold text-[#4C050C]/60 uppercase tracking-wider font-sans">
                  주문번호
                </th>
                <th className="text-left py-4 px-6 text-xs font-bold text-[#4C050C]/60 uppercase tracking-wider font-sans">
                  회원 정보
                </th>
                <th className="text-left py-4 px-6 text-xs font-bold text-[#4C050C]/60 uppercase tracking-wider font-sans">
                  <button className="flex items-center gap-1 hover:text-[#4C050C] transition-colors">
                    주문 금액
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left py-4 px-6 text-xs font-bold text-[#4C050C]/60 uppercase tracking-wider font-sans">주문 상품</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-[#4C050C]/60 uppercase tracking-wider font-sans">상태</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-[#4C050C]/60 uppercase tracking-wider font-sans">
                  <button className="flex items-center gap-1 hover:text-[#4C050C] transition-colors">
                    주문 일시
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="w-16"></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;

                return (
                  <tr
                    key={order.id}
                    className="border-b border-[#4C050C]/5 last:border-0 hover:bg-[#EBEBDF]/20 transition-colors duration-150 cursor-pointer animate-in fade-in slide-in-from-left-2"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
                  >
                    <td className="py-5 px-6">
                      <span className="text-sm font-bold text-[#4C050C] font-sans">{order.orderNumber}</span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#4C050C] font-sans">{order.member}</span>
                        <span className="text-xs font-bold text-[#4C050C]/60 font-sans mt-0.5">{order.tier}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-sm font-black text-[#4C050C] font-sans">
                        ₩ {order.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-sm font-bold text-[#4C050C]/80 font-sans truncate max-w-[200px] block">
                        {order.items}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold font-sans", status.bg, status.color)}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-sm font-bold text-[#4C050C]/60 font-sans">{order.orderDate}</span>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <button className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-[#4C050C]/40 hover:text-[#4C050C] hover:bg-[#EBEBDF] transition-all duration-200">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#4C050C]/10 bg-[#EBEBDF]/10">
          <span className="text-sm font-bold text-[#4C050C]/60 font-sans">
            총 {orders.length}개 주문 중 {filteredOrders.length}개 표시
          </span>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-xl text-sm font-bold text-[#4C050C]/60 hover:text-[#4C050C] hover:bg-[#EBEBDF] transition-colors duration-200 font-sans">
              이전
            </button>
            <button className="px-4 py-2 rounded-xl text-sm font-black bg-[#4C050C] text-white font-sans shadow-sm">
              1
            </button>
            <button className="px-4 py-2 rounded-xl text-sm font-bold text-[#4C050C]/60 hover:text-[#4C050C] hover:bg-[#EBEBDF] transition-colors duration-200 font-sans">
              2
            </button>
            <button className="px-4 py-2 rounded-xl text-sm font-bold text-[#4C050C]/60 hover:text-[#4C050C] hover:bg-[#EBEBDF] transition-colors duration-200 font-sans">
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
