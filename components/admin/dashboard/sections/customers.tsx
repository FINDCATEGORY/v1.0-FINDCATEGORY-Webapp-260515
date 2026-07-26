"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  ExternalLink,
  Star,
  TrendingUp,
  Filter,
  MapPin,
  MessageSquare,
  Building2,
  Briefcase
} from "lucide-react";

import { getPartners } from "@/app/actions/partners";

export function CustomersSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPartners() {
      const data = await getPartners();
      const formattedData = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        company_name: p.company_name,
        department: p.department,
        orders: 0, // 기본값
        joinDate: p.created_at ? new Date(p.created_at).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }) : "알 수 없음"
      }));
      setMembers(formattedData);
      setLoading(false);
    }
    loadPartners();
  }, []);

  const filteredMembers = members.filter((member) => {
    return member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (member.company_name && member.company_name.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const totalOrders = members.reduce((acc, c) => acc + c.orders, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "총 회원 수",
            value: members.length.toString() + "명",
            icon: Users,
            color: "text-[#4C050C]",
          },
          {
            label: "총 누적 주문",
            value: `${totalOrders}건`,
            icon: DollarSign,
            color: "text-[#4C050C]",
          },
          {
            label: "이번 달 신규 가입",
            value: "DB 집계 중",
            icon: TrendingUp,
            color: "text-emerald-600",
          },
        ].map((stat, index) => (
          <Card
            key={stat.label}
            className="border-[#4C050C]/10 bg-white rounded-[24px] shadow-sm hover:-translate-y-1 transition-transform duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#4C050C]/60 font-sans">{stat.label}</p>
                  <p className={`text-3xl font-black mt-2 font-sans ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#EBEBDF] flex items-center justify-center">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white rounded-[24px] p-4 border border-[#4C050C]/10 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4C050C]/60" />
            <Input
              placeholder="이름 또는 이메일 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[280px] bg-[#EBEBDF]/50 border-transparent focus:border-[#4C050C]/30 focus:ring-[#4C050C]/20 rounded-full font-sans font-medium text-[#4C050C] placeholder:text-[#4C050C]/40"
            />
          </div>
        </div>
        <Button className="rounded-full bg-[#4C050C] hover:bg-[#4C050C]/90 text-white font-bold font-sans">
          <Plus className="w-4 h-4 mr-2" />
          회원 추가
        </Button>
      </div>

      {/* Customer Cards */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4C050C]"></div>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="flex justify-center py-20 text-[#4C050C]/60 font-sans font-bold">
          등록된 파트너사가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMembers.map((member, index) => (
          <Card
            key={member.id}
            className="border-[#4C050C]/10 bg-white rounded-[24px] shadow-sm hover:-translate-y-1 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14 bg-[#4C050C]/5 border border-[#4C050C]/10">
                    <AvatarFallback className="text-[#4C050C] font-black font-sans text-lg">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-black text-xl text-[#4C050C] font-sans">
                      {member.name}
                    </h3>
                    <p className="text-sm font-bold text-[#4C050C]/60 font-sans mt-0.5">가입일: {member.joinDate}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 bg-[#EBEBDF]/30 p-4 rounded-2xl">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#4C050C]/80 font-sans">
                    <Building2 className="w-4 h-4 text-[#4C050C]/40" />
                    {member.company_name}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-[#4C050C]/80 font-sans">
                    <Briefcase className="w-4 h-4 text-[#4C050C]/40" />
                    {member.department || "부서 미지정"}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-[#4C050C]/80 font-sans">
                    <Mail className="w-4 h-4 text-[#4C050C]/40" />
                    {member.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-[#4C050C]/80 font-sans">
                    <Phone className="w-4 h-4 text-[#4C050C]/40" />
                    {member.phone}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-[#4C050C]/60 font-sans">누적 주문</span>
                    <span className="font-black text-[#4C050C] font-sans">{member.orders}건</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 rounded-xl border-[#4C050C]/20 text-[#4C050C] font-bold font-sans hover:bg-[#EBEBDF]">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  1:1 메시지
                </Button>
                <Button variant="outline" size="sm" className="flex-1 rounded-xl border-[#4C050C]/20 text-[#4C050C] font-bold font-sans hover:bg-[#EBEBDF]">
                  <Calendar className="w-4 h-4 mr-2" />
                  주문 내역
                </Button>
                <Button variant="ghost" size="sm" className="rounded-xl text-[#4C050C] hover:bg-[#EBEBDF]">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}
    </div>
  );
}
