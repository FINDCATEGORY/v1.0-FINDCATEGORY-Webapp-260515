"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/dashboard/sidebar";
import { Header } from "@/components/admin/dashboard/header";
import { OverviewSection } from "@/components/admin/dashboard/sections/overview";
import { PipelineSection } from "@/components/admin/dashboard/sections/pipeline";
import { DealsSection } from "@/components/admin/dashboard/sections/deals";
import { CustomersSection } from "@/components/admin/dashboard/sections/customers";
import { TeamSection } from "@/components/admin/dashboard/sections/team";
import { ForecastingSection } from "@/components/admin/dashboard/sections/forecasting";
import { ReportsSection } from "@/components/admin/dashboard/sections/reports";
import { SettingsSection } from "@/components/admin/dashboard/sections/settings";

export type Section = "overview" | "pipeline" | "deals" | "customers" | "team" | "forecasting" | "reports" | "settings";

export default function Dashboard() {
    const [activeSection, setActiveSection] = useState<Section>("overview");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const renderSection = () => {
        switch (activeSection) {
            case "overview":
                return <OverviewSection />;
            case "pipeline":
                return <PipelineSection />;
            case "deals":
                return <DealsSection />;
            case "customers":
                return <CustomersSection />;
            case "team":
                return <TeamSection />;
            case "forecasting":
                return <ForecastingSection />;
            case "reports":
                return <ReportsSection />;
            case "settings":
                return <SettingsSection />;
            default:
                return <OverviewSection />;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#EBEBDF] text-[#4C050C]">
            <Sidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                collapsed={sidebarCollapsed}
                onCollapsedChange={setSidebarCollapsed}
            />
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ease-out ${sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"
                    }`}
            >
                <Header activeSection={activeSection} />
                <main className="flex-1 p-6 overflow-auto">
                    <div
                        key={activeSection}
                        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                        {renderSection()}
                    </div>
                </main>
            </div>
        </div>
    );
}
