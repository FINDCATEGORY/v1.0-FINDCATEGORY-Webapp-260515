"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, Clock, CheckCircle2, Package } from "lucide-react";

const orders = [
  {
    product: "골든아워 엣지 보울 외 2건",
    value: "₩ 145,000",
    status: "completed",
    date: "2시간 전",
    customer: "이주용",
  },
  {
    product: "셀룰리안 모먼트 우븐 라탄 플레이트",
    value: "₩ 185,000",
    status: "processing",
    date: "5시간 전",
    customer: "김서연",
  },
  {
    product: "에메랄드 포레스트 우드 핸들 커트러리",
    value: "₩ 280,000",
    status: "processing",
    date: "1일 전",
    customer: "박민우",
  },
  {
    product: "골든아워 테이블클로스",
    value: "₩ 117,000",
    status: "shipping",
    date: "2일 전",
    customer: "정하은",
  },
  {
    product: "셀룰리안 모먼트 플로럴 엠보싱 디너 플레이트",
    value: "₩ 220,000",
    status: "completed",
    date: "3일 전",
    customer: "최지훈",
  },
];

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    label: "결제/배송완료",
  },
  processing: {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    label: "상품준비중",
  },
  shipping: {
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50",
    label: "배송중",
  },
};

export function RecentDeals() {
  return (
    <div className="bg-white border border-[#4C050C]/10 rounded-[24px] shadow-sm p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-[#4C050C] font-sans">최근 주문 및 결제 내역</h3>
          <p className="text-sm text-[#4C050C]/60 mt-1 font-sans font-medium">실시간 주문 현황</p>
        </div>
        <button className="flex items-center gap-1 text-sm text-[#4C050C] hover:text-[#4C050C]/80 font-bold transition-colors group font-sans">
          전체 보기
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => {
          const status = statusConfig[order.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;

          return (
            <div
              key={order.customer + index}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover:bg-[#EBEBDF]/50 transition-all duration-200 cursor-pointer animate-in fade-in slide-in-from-left-2 gap-4 sm:gap-0"
              style={{ animationDelay: `${(index + 3) * 100}ms`, animationFillMode: "both" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#4C050C]/5 flex items-center justify-center text-lg font-black text-[#4C050C] group-hover:bg-[#4C050C]/10 transition-all duration-200 font-sans">
                  {order.customer.charAt(0)}
                </div>
                <div>
                  <p className="text-base font-bold text-[#4C050C] font-sans truncate max-w-[200px]">{order.product}</p>
                  <p className="text-sm text-[#4C050C]/60 font-medium font-sans mt-0.5">{order.customer} • {order.date}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pl-16 sm:pl-0">
                <span className="text-base font-black text-[#4C050C] font-sans">{order.value}</span>
                <div className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold font-sans", status.bg, status.color)}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {status.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
