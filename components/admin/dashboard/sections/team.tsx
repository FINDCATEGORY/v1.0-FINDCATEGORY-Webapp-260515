"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  Package, 
  Target, 
  TrendingUp, 
  Sparkles, 
  Edit, 
  MoreHorizontal, 
  Layers,
  Image as ImageIcon,
  Plus,
  X
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getProducts } from "@/app/actions/product";
import { getCollections } from "@/app/actions/collection";

interface Collection {
  id: string;
  name: string;
  theme: string;
  status: string;
  imageColor: string;
  imageUrl?: string;
  productCount: number;
  totalSales: number;
  target_sales: number;
  growth: number;
  rank: number;
}

const initialCollections: Collection[] = [
  { id: "1", name: "골든아워 컬렉션", theme: "우아함과 따뜻함의 조화", status: "판매중", imageColor: "bg-amber-100 text-amber-700", productCount: 0, totalSales: 0, target_sales: 500, growth: 0, rank: 1 },
  { id: "2", name: "에메랄드 포레스트 컬렉션", theme: "자연의 생동감", status: "판매중", imageColor: "bg-emerald-100 text-emerald-700", productCount: 0, totalSales: 0, target_sales: 500, growth: 0, rank: 2 },
  { id: "3", name: "셀룰리안 모먼트 컬렉션", theme: "모던 럭셔리", status: "판매중", imageColor: "bg-blue-100 text-blue-700", productCount: 0, totalSales: 0, target_sales: 500, growth: 0, rank: 3 },
];

function CollectionCard({ collection, index }: { collection: Collection; index: number }) {
  const quotaPercentage = (collection.totalSales / collection.target_sales) * 100;
  const isAboveQuota = quotaPercentage >= 100;

  return (
    <div
      className={cn("rounded-3xl p-6 sm:p-8 flex flex-col shadow-sm relative overflow-hidden group transition-all hover:shadow-md", collection.imageColor)}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
    >
      {collection.imageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-15 group-hover:opacity-20 transition-opacity duration-500" 
          style={{ backgroundImage: `url(${collection.imageUrl})` }} 
        />
      )}
      
      <div className="relative z-10 flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl bg-white/20 backdrop-blur-sm`}>
              {collection.name.charAt(0)}
            </div>
            {collection.rank === 1 && (
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#1A1A1A] flex items-center justify-center border-2 border-white">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
          <div>
            <h4 className="text-lg font-black text-[#1A1A1A] font-sans">{collection.name}</h4>
            <p className="text-sm font-bold text-[#1A1A1A]/60 font-sans mt-0.5">{collection.theme}</p>
          </div>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#1A1A1A]/40 hover:text-[#1A1A1A] hover:bg-white transition-all duration-200">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 bg-white/30 p-4 rounded-2xl">
        <div>
          <p className="text-sm font-bold text-[#1A1A1A]/60 mb-1 font-sans">누적 판매 (만P)</p>
          <p className="text-xl font-black text-[#1A1A1A] font-sans">{collection.totalSales}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-[#1A1A1A]/60 mb-1 font-sans">등록 제품 수</p>
          <p className="text-xl font-black text-[#1A1A1A] font-sans">{collection.productCount}개</p>
        </div>
      </div>

      {/* Quota progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-bold text-[#1A1A1A]/60 font-sans">판매 목표 달성률</span>
          <span className={cn("font-black font-sans", isAboveQuota ? "text-[#1A1A1A]" : "text-[#1A1A1A]/60")}>
            {quotaPercentage.toFixed(0)}%
          </span>
        </div>
        <div className="h-2.5 bg-white rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-700", isAboveQuota ? "bg-[#1A1A1A]" : "bg-[#1A1A1A]/40")}
            style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Change indicator */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1A1A1A]/10">
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center px-4 py-2 rounded-xl bg-white/50 text-[#1A1A1A] font-bold text-sm hover:bg-white transition-colors font-sans">
            <Edit className="w-4 h-4 mr-2" />
            컬렉션 관리
          </button>
        </div>
        <div className={cn("flex items-center gap-1 text-sm font-black font-sans", collection.growth >= 0 ? "text-emerald-600" : "text-red-600")}>
          <TrendingUp className="w-4 h-4" />
          +{collection.growth}%
        </div>
      </div>
    </div>
  );
}

export function TeamSection() {
  const [chartLoaded, setChartLoaded] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setChartLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  async function loadData() {
    try {
      const dbCollections = await getCollections();
      const productsRes = await getProducts();
      const products = productsRes.success ? productsRes.data : [];
      
      let mappedCollections: Collection[] = [];
      
      if (dbCollections && dbCollections.length > 0) {
        mappedCollections = dbCollections.map((col: any) => ({
          id: col.id,
          name: col.name,
          theme: col.theme,
          status: col.status,
          imageColor: col.image_color,
          imageUrl: col.image_url,
          productCount: 0,
          totalSales: 0,
          target_sales: col.target_sales,
          growth: 0,
          rank: 0
        }));
      } else {
        // Fallback if DB is empty or fails
        mappedCollections = [...initialCollections];
      }

      // Calculate product counts per collection
      const updatedCollections = mappedCollections.map(col => {
        const count = products.filter((p: any) => 
          Array.isArray(p.categories) 
            ? p.categories.includes(col.name) 
            : p.categories === col.name
        ).length;
        
        return { ...col, productCount: count };
      });

      // Re-rank based on product count since sales are 0
      updatedCollections.sort((a, b) => b.productCount - a.productCount);
      updatedCollections.forEach((c, i) => c.rank = i + 1);

      setCollections(updatedCollections);
      
      const newPerformanceData = updatedCollections.map(c => ({
        name: c.name.replace(" 컬렉션", ""),
        sales: c.totalSales,
        target: c.target_sales
      }));
      setPerformanceData(newPerformanceData);

    } catch (error) {
      console.error("Failed to load collections:", error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const totalSales = collections.reduce((acc, m) => acc + m.totalSales, 0);
  const totalProducts = collections.reduce((acc, m) => acc + m.productCount, 0);
  const avgQuotaAttainment = collections.length > 0 ? collections.reduce((acc, m) => acc + (m.totalSales / m.target_sales) * 100, 0) / collections.length : 0;

  return (
    <div className="space-y-6">
      {/* Performance chart */}
      <div className="bg-white border border-[#1A1A1A]/10 rounded-[24px] shadow-sm p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-[#1A1A1A] font-sans">컬렉션별 판매 성과</h3>
            <p className="text-sm text-[#1A1A1A]/60 mt-1 font-sans font-bold">목표 대비 달성 현황</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold font-sans">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A]" />
              <span className="text-[#1A1A1A]/80">판매 (만P)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
              <span className="text-[#1A1A1A]/80">목표 (만P)</span>
            </div>
          </div>
        </div>
        <div className={`h-[280px] transition-opacity duration-700 ${chartLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" strokeOpacity={0.1} vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#1A1A1A", fontSize: 12, fontWeight: 700, fontFamily: "sans-serif" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#1A1A1A", fontSize: 12, fontWeight: 700, fontFamily: "sans-serif" }}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(76, 5, 12, 0.2)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "sans-serif",
                  color: "#1A1A1A"
                }}
                labelStyle={{ color: "#1A1A1A", fontWeight: 800 }}
                itemStyle={{ color: "#1A1A1A" }}
                cursor={{ fill: "rgba(76, 5, 12, 0.05)" }}
              />
              <Bar dataKey="target" fill="#FFFFFF" radius={[6, 6, 0, 0]} barSize={40} />
              <Bar dataKey="sales" fill="#1A1A1A" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team members grid -> Collections grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#1A1A1A] font-sans">운영 중인 컬렉션</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <CollectionCard key={collection.id} collection={collection} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
