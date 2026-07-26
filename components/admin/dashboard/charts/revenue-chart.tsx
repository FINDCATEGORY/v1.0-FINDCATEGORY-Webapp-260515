"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "1월", revenue: 186000, target: 180000 },
  { month: "2월", revenue: 205000, target: 190000 },
  { month: "3월", revenue: 237000, target: 200000 },
  { month: "4월", revenue: 273000, target: 220000 },
  { month: "5월", revenue: 209000, target: 230000 },
  { month: "6월", revenue: 314000, target: 250000 },
  { month: "7월", revenue: 352000, target: 270000 },
  { month: "8월", revenue: 389000, target: 290000 },
  { month: "9월", revenue: 421000, target: 310000 },
  { month: "10월", revenue: 458000, target: 330000 },
  { month: "11월", revenue: 492000, target: 350000 },
  { month: "12월", revenue: 547000, target: 380000 },
];

export function RevenueChart() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white border border-[#4C050C]/10 rounded-[24px] shadow-sm p-6 sm:p-8 h-[380px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-[#4C050C] font-sans">누적 계약 및 매출 추이</h3>
          <p className="text-sm text-[#4C050C]/60 mt-1 font-sans font-medium">월별 계약 목표 및 실제 매출</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-sans font-bold">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#4C050C]" />
            <span className="text-[#4C050C]/80">실제 매출</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#4C050C]/40" />
            <span className="text-[#4C050C]/80">목표 매출</span>
          </div>
        </div>
      </div>

      <div className={`h-[250px] transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4C050C" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#4C050C" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4C050C" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#4C050C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#4C050C" strokeOpacity={0.1} vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#4C050C", fontSize: 12, fontWeight: 600, fontFamily: "sans-serif" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#4C050C", fontSize: 12, fontWeight: 600, fontFamily: "sans-serif" }}
              tickFormatter={(value) => `${value / 1000}k`}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#EBEBDF",
                border: "1px solid rgba(76, 5, 12, 0.2)",
                borderRadius: "12px",
                fontSize: "12px",
                fontFamily: "sans-serif",
                fontWeight: 600,
                color: "#4C050C"
              }}
              labelStyle={{ color: "#4C050C", fontWeight: 700 }}
              itemStyle={{ color: "#4C050C" }}
              formatter={(value: number) => [`₩ ${(value).toLocaleString()}`, ""]}
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="#4C050C"
              strokeOpacity={0.3}
              strokeWidth={2}
              fill="url(#targetGradient)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4C050C"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
