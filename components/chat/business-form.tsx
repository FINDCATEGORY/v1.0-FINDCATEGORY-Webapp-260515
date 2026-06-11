"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function BusinessForm({ defaultType = "대량구매" }: { defaultType?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    type: defaultType,
    companyName: "",
    managerName: "",
    contact: "",
    email: "",
    text: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsSuccess(true)
      } else {
        alert("오류가 발생했습니다. 잠시 후 다시 시도해 주세요.")
      }
    } catch (error) {
      alert("서버와 통신할 수 없습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md bg-white border border-[#4C050C]/10 rounded-2xl p-8 shadow-xl mt-2 text-center flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-[#4C050C]/10 rounded-full flex items-center justify-center text-[#4C050C] text-2xl font-bold mb-2">✓</div>
        <h3 className="text-xl font-bold text-[#4C050C] font-sans">접수 완료</h3>
        <p className="text-[#4C050C]/70 text-sm font-medium">성공적으로 접수되었습니다.<br/>담당자가 확인 후 회신드리겠습니다.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white border border-[#4C050C]/10 rounded-2xl p-6 shadow-xl mt-2 flex flex-col gap-5">
      <h3 className="font-bold text-[#4C050C] text-xl font-sans">비즈니스 문의하기</h3>
      
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-[#4C050C] font-sans">문의 유형</label>
        <select 
          className="w-full h-10 px-3 rounded-md border border-[#4C050C]/20 bg-transparent text-sm font-sans focus:outline-none focus:border-[#4C050C]"
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
        >
          <option value="대량구매">대량구매</option>
          <option value="공간 스타일링 신청">공간 스타일링 신청</option>
          <option value="기타 제휴">기타 제휴</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-bold text-[#4C050C] font-sans">회사명/상호명</label>
        <Input required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="회사명을 입력해 주세요" className="border-[#4C050C]/20 focus-visible:ring-[#4C050C] bg-transparent" />
      </div>
      
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-[#4C050C] font-sans">담당자 성함</label>
        <Input required value={formData.managerName} onChange={e => setFormData({...formData, managerName: e.target.value})} placeholder="성함을 입력해 주세요" className="border-[#4C050C]/20 focus-visible:ring-[#4C050C] bg-transparent" />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-bold text-[#4C050C] font-sans">연락처</label>
        <Input required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="010-0000-0000" className="border-[#4C050C]/20 focus-visible:ring-[#4C050C] bg-transparent" />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-bold text-[#4C050C] font-sans">이메일</label>
        <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="example@email.com" className="border-[#4C050C]/20 focus-visible:ring-[#4C050C] bg-transparent" />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-bold text-[#4C050C] font-sans">문의 내용</label>
        <Textarea required value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} placeholder="자세한 문의 내용을 입력해 주세요" className="min-h-[100px] border-[#4C050C]/20 focus-visible:ring-[#4C050C] resize-none bg-transparent" />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-[#4C050C] hover:bg-[#4C050C]/90 text-white mt-2 h-11 font-bold font-sans rounded-xl">
        {isSubmitting ? "접수 중..." : "문의 접수하기"}
      </Button>
    </form>
  )
}
