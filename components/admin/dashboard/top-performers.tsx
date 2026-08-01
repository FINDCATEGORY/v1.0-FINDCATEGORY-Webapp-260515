"use client";

import { MessageSquare, ArrowUpRight } from "lucide-react";

const inquiries = [
  { name: "김민석", subject: "골든아워 보울 재입고 문의", status: "pending", date: "10분 전" },
  { name: "이현주", subject: "B2B 핏인 서비스 신청 건", status: "answered", date: "1시간 전" },
  { name: "박지수", subject: "멤버십 등급 상향 기준이 궁금합니다.", status: "pending", date: "2시간 전" },
  { name: "최은영", subject: "프레스티지 혜택 관련 문의", status: "answered", date: "어제" },
  { name: "정태현", subject: "오브제 사이즈 문의드립니다.", status: "answered", date: "어제" },
];

export function TopPerformers() {
  return (
    <div className="bg-white border border-[#1A1A1A]/10 rounded-[24px] shadow-sm p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-[#1A1A1A] font-sans">최근 접수된 1:1 문의</h3>
          <p className="text-sm text-[#1A1A1A]/60 mt-1 font-sans font-medium">답변이 필요한 문의 내역</p>
        </div>
        <button className="flex items-center gap-1 text-sm text-[#1A1A1A] hover:text-[#1A1A1A]/80 font-bold transition-colors group font-sans">
          전체 보기
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      <div className="space-y-4">
        {inquiries.map((inquiry, index) => (
          <div
            key={inquiry.name + index}
            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover:bg-white/50 transition-all duration-200 cursor-pointer animate-in fade-in slide-in-from-right-2 gap-3 sm:gap-0"
            style={{ animationDelay: `${(index + 4) * 100}ms`, animationFillMode: "both" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base font-bold text-[#1A1A1A] font-sans truncate max-w-[220px]">{inquiry.subject}</p>
                <p className="text-sm text-[#1A1A1A]/60 font-medium font-sans mt-0.5">{inquiry.name} • {inquiry.date}</p>
              </div>
            </div>

            <div className="flex justify-end w-full sm:w-auto">
              {inquiry.status === "pending" ? (
                <span className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold font-sans">
                  답변 대기
                </span>
              ) : (
                <span className="px-3 py-1.5 rounded-lg bg-white text-[#1A1A1A]/60 text-xs font-bold font-sans">
                  답변 완료
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
