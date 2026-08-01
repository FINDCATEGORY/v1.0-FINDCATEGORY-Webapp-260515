"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  delay = 0,
}: MetricCardProps) {
  return (
    <div
      className="group relative bg-white border border-[#1A1A1A]/10 rounded-[24px] shadow-sm p-6 sm:p-8 hover:-translate-y-1 transition-transform duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom-4 flex flex-col justify-between"
      style={{ animationDelay: `${delay * 100}ms`, animationFillMode: "both" }}
    >
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs sm:text-sm text-[#1A1A1A]/60 uppercase tracking-wider font-bold font-sans">
            {title}
          </span>
          <div className="w-10 h-10 rounded-full bg-[#1A1A1A]/5 flex items-center justify-center group-hover:bg-[#1A1A1A]/10 transition-colors duration-300">
            <Icon className="w-5 h-5 text-[#1A1A1A] transition-colors duration-300" />
          </div>
        </div>

        <div className="flex items-end gap-3 mt-4">
          <span className="text-3xl lg:text-4xl font-black text-[#1A1A1A] tracking-tight font-sans">
            {value}
          </span>
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-bold mb-1 font-sans",
              changeType === "positive" && "text-emerald-600",
              changeType === "negative" && "text-red-600",
              changeType === "neutral" && "text-[#1A1A1A]/60"
            )}
          >
            {changeType === "positive" && <TrendingUp className="w-4 h-4" />}
            {changeType === "negative" && (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{change}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
