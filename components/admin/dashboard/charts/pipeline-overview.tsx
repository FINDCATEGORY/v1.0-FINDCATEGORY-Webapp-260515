"use client";

import { useState, useEffect } from "react";

const stages = [
  { name: "리드", value: 45, count: 892, color: "bg-chart-1" },
  { name: "적격", value: 28, count: 556, color: "bg-chart-2" },
  { name: "제안", value: 18, count: 357, color: "bg-chart-3" },
  { name: "협상", value: 9, count: 179, color: "bg-accent" },
];

export function PipelineOverview() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl p-5 h-[380px] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-foreground">파이프라인 단계</h3>
        <p className="text-sm text-muted-foreground mt-0.5">단계별 분포</p>
      </div>

      <div className="space-y-5">
        {stages.map((stage, index) => (
          <div key={stage.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{stage.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{stage.count}</span>
                <span className="text-sm font-semibold text-foreground">{stage.value}%</span>
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${stage.color} rounded-full transition-all duration-1000 ease-out`}
                style={{
                  width: isLoaded ? `${stage.value}%` : "0%",
                  transitionDelay: `${index * 150}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total pipeline value */}
      <div className="mt-6 pt-5 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">총 파이프라인 가치</span>
          <span className="text-xl font-bold text-foreground">$4.8M</span>
        </div>
      </div>
    </div>
  );
}
