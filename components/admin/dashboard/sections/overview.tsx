"use client";

import { MetricCard } from "@/components/admin/dashboard/metric-card";
import { RevenueChart } from "@/components/admin/dashboard/charts/revenue-chart";
import { PipelineOverview } from "@/components/admin/dashboard/charts/pipeline-overview";
import { RecentDeals } from "@/components/admin/dashboard/recent-deals";
import { TopPerformers } from "@/components/admin/dashboard/top-performers";
import { DollarSign, TrendingUp, Users, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { getTotalPointsAllUsers } from "@/app/actions/points";

export function OverviewSection() {
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);

  useEffect(() => {
    async function fetchTotal() {
      const { totalPoints } = await getTotalPointsAllUsers();
      setTotalRevenue(totalPoints);
    }
    fetchTotal();
  }, []);

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="총 매출"
          value={totalRevenue === null ? "..." : `${totalRevenue.toLocaleString()} P`}
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
          delay={0}
        />
        <MetricCard
          title="전환율"
          value="24.8%"
          change="+3.2%"
          changeType="positive"
          icon={TrendingUp}
          delay={1}
        />
        <MetricCard
          title="진행 중인 거래"
          value="147"
          change="-5"
          changeType="negative"
          icon={Target}
          delay={2}
        />
        <MetricCard
          title="신규 리드"
          value="892"
          change="+18.3%"
          changeType="positive"
          icon={Users}
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
