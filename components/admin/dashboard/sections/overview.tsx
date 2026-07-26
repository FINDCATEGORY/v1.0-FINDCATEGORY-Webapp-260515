"use client";

import { MetricCard } from "@/components/admin/dashboard/metric-card";
import { RevenueChart } from "@/components/admin/dashboard/charts/revenue-chart";
import { PipelineOverview } from "@/components/admin/dashboard/charts/pipeline-overview";
import { RecentDeals } from "@/components/admin/dashboard/recent-deals";
import { TopPerformers } from "@/components/admin/dashboard/top-performers";
import { DollarSign, TrendingUp, Users, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { getDashboardMetrics } from "@/app/actions/dashboard";

export function OverviewSection() {
  const [metrics, setMetrics] = useState<{
    totalRevenue: number | null;
    membershipCount: number | null;
    orderCount: number | null;
    inquiryCount: number | null;
  }>({
    totalRevenue: null,
    membershipCount: null,
    orderCount: null,
    inquiryCount: null,
  });

  useEffect(() => {
    async function fetchMetrics() {
      const data = await getDashboardMetrics();
      setMetrics(data);
    }
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="누적 계약 금액"
          value={metrics.totalRevenue === null ? "..." : `₩ ${metrics.totalRevenue.toLocaleString()}`}
          change="DB 연동 대기중"
          changeType="neutral"
          icon={DollarSign}
          delay={0}
        />
        <MetricCard
          title="이번 주 주문 건수"
          value={metrics.orderCount === null ? "..." : `${metrics.orderCount}`}
          change="DB 연동 대기중"
          changeType="neutral"
          icon={TrendingUp}
          delay={1}
        />
        <MetricCard
          title="신규 가입 파트너"
          value={metrics.membershipCount === null ? "..." : `${metrics.membershipCount}`}
          change="연동됨"
          changeType="positive"
          icon={Users}
          delay={2}
        />
        <MetricCard
          title="접수된 1:1 문의"
          value={metrics.inquiryCount === null ? "..." : `${metrics.inquiryCount}`}
          change="DB 연동 대기중"
          changeType="neutral"
          icon={Target}
          delay={3}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <PipelineOverview />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentDeals />
        <TopPerformers />
      </div>
    </div>
  );
}
