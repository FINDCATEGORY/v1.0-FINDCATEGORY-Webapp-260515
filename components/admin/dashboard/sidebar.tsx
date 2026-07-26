"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Section } from "@/app/membership/admin/page";
import {
  Home,
  Users,
  Package,
  ShoppingBag,
  Settings,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign
} from "lucide-react";

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const navGroups = [
  {
    groupId: "overview",
    groupLabel: "운영 홈",
    icon: Home,
    isDirectLink: true,
    sectionId: "overview" as Section,
    items: []
  },
  {
    groupId: "crm",
    groupLabel: "고객 관리 (CRM)",
    icon: Users,
    items: [
      { id: "customers" as Section, label: "파트너사 명부" },
      { id: "reports" as Section, label: "스타일링 제안 & 문의" },
    ]
  },
  {
    groupId: "curation",
    groupLabel: "상품 관리",
    icon: Package,
    items: [
      { id: "inventory" as Section, label: "상품 관리" },
    ]
  },
  {
    groupId: "deals",
    groupLabel: "주문 & 계약",
    icon: ShoppingBag,
    items: [
      { id: "deals" as Section, label: "주문" },
      { id: "pipeline" as Section, label: "계약관리" },
    ]
  },
  {
    groupId: "system",
    groupLabel: "시스템 관리",
    icon: Settings,
    items: [
      { id: "analytics" as Section, label: "매출/성과 분석" },
      { id: "settings" as Section, label: "시스템 설정" },
    ]
  }
];

export function Sidebar({
  activeSection,
  onSectionChange,
  collapsed,
  onCollapsedChange,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-out flex flex-col",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border overflow-hidden shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-primary">
            <CircleDollarSign className="w-5 h-5 text-primary-foreground" />
          </div>
          <span
            className={cn(
              "font-semibold text-lg text-sidebar-foreground whitespace-nowrap transition-all duration-300",
              collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            )}
          >
            관리자 시스템
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 no-scrollbar">
        {navGroups.map((group) => {
          const GroupIcon = group.icon;
          const isDirect = group.isDirectLink;
          const hasActiveItem = isDirect ? activeSection === group.sectionId : group.items.some(item => item.id === activeSection);

          if (isDirect) {
            return (
              <div key={group.groupId} className="flex flex-col mb-1">
                <button
                  onClick={() => onSectionChange(group.sectionId!)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 group relative",
                    hasActiveItem
                      ? "bg-[#4C050C]/5 text-[#4C050C]"
                      : "text-muted-foreground hover:text-[#4C050C] hover:bg-sidebar-accent/50"
                  )}
                  title={collapsed ? group.groupLabel : undefined}
                >
                  {hasActiveItem && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-r-full bg-[#4C050C] transition-all" />
                  )}
                  <GroupIcon
                    className={cn(
                      "w-5 h-5 shrink-0 transition-transform duration-200",
                      hasActiveItem ? "text-[#4C050C]" : "group-hover:scale-110"
                    )}
                  />
                  <span
                    className={cn(
                      "flex-1 text-left whitespace-nowrap transition-all duration-300 font-sans tracking-tight",
                      collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                    )}
                  >
                    {group.groupLabel}
                  </span>
                </button>
              </div>
            );
          }

          return (
            <div key={group.groupId} className="flex flex-col mb-1">
              {/* Group Header */}
              <div
                onClick={() => {
                  if (collapsed) onCollapsedChange(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 group relative",
                  collapsed ? "cursor-pointer text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50" : "text-sidebar-foreground"
                )}
                title={collapsed ? group.groupLabel : undefined}
              >
                {/* Active indicator when collapsed */}
                <span
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-accent transition-all duration-300",
                    hasActiveItem && collapsed ? "opacity-100" : "opacity-0"
                  )}
                />
                
                <GroupIcon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-transform duration-200",
                    hasActiveItem && collapsed ? "text-accent" : "group-hover:scale-110"
                  )}
                />
                
                <span
                  className={cn(
                    "flex-1 text-left whitespace-nowrap transition-all duration-300 font-sans tracking-tight",
                    collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                  )}
                >
                  {group.groupLabel}
                </span>
              </div>

              {/* Items */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  !collapsed ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0"
                )}
              >
                <div className="flex flex-col space-y-1 pl-9 pr-2 py-1">
                  {group.items.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 relative font-sans",
                          isActive
                            ? "bg-[#4C050C]/5 text-[#4C050C] font-bold"
                            : "text-muted-foreground hover:text-[#4C050C] hover:bg-sidebar-accent/50"
                        )}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#4C050C] transition-all" />
                        )}
                        <span className={cn("transition-transform duration-200 block", isActive ? "translate-x-1" : "")}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collapse button */}
      <div className="p-3 border-t border-sidebar-border shrink-0">
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
