"use client";

import React from "react";
import LucideCircleDollarSignIcon from "lucide-react"; // Import the missing icon component

import { cn } from "@/lib/utils";
import type { Section } from "@/app/membership/admin/page";
import {
  LayoutDashboard,
  GitBranch,
  Handshake,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Building2,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/login";

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "대시보드 요약", icon: LayoutDashboard },
  { id: "pipeline", label: "파이프라인", icon: GitBranch },
  { id: "deals", label: "거래 관리", icon: Handshake },
  { id: "customers", label: "고객 관리", icon: Building2 },
  { id: "team", label: "팀 성과 관리", icon: Users },
  { id: "forecasting", label: "매출 예측", icon: TrendingUp },
  { id: "reports", label: "보고서", icon: BarChart3 },
  { id: "settings", label: "설정", icon: Settings },
];

export function Sidebar({
  activeSection,
  onSectionChange,
  collapsed,
  onCollapsedChange,
}: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.refresh();
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-out flex flex-col",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logout Button */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <button onClick={handleLogout} className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[#4C050C]">
            <LogOut className="w-5 h-5 text-white" />
          </div>
          <span
            className={cn(
              "font-semibold text-lg text-sidebar-foreground whitespace-nowrap transition-all duration-300 text-left",
              collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            )}
          >
            로그아웃
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {/* Active indicator */}
              <span
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-accent transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-transform duration-200",
                  isActive ? "text-accent" : "group-hover:scale-110"
                )}
              />
              <span
                className={cn(
                  "whitespace-nowrap transition-all duration-300",
                  collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>메뉴 접기</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
