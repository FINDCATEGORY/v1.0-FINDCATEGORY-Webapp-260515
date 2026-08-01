"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Eye, EyeOff, FileText, CheckCircle2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface AuthCardProps {
  isLoading: boolean
  onSignIn: (e: React.FormEvent) => void
  onSignUp: (e: React.FormEvent) => void
  onSocialLogin?: (provider: string) => void
  onForgotPassword?: () => void
}

export function AuthCard({
  isLoading,
  onSignIn,
  onSignUp,
}: AuthCardProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("signup")
  
  // 입력 상태들
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (selectedFile.size > maxSize) {
        toast({ title: "파일 용량 초과", description: "5MB 이하만 가능합니다." })
        e.target.value = ""
        setFile(null)
        return
      }
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 로그인 탭일 때
    if (activeTab === "signin") {
      return onSignIn(e)
    }

    // 회원가입 탭일 때 (파일 체크 및 업로드)
    if (!file) {
      toast({ title: "파일 누락", description: "사업자등록증 파일을 반드시 첨부해주세요." })
      return
    }

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${email}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('licenses')
        .upload(fileName, file)

      if (uploadError) throw uploadError
      
      // 파일 업로드 성공 후 회원가입 로직 실행
      onSignUp(e)
    } catch (error) {
      console.error("오류 발생:", error)
      toast({ variant: "destructive", title: "전송 실패", description: "파일 전송 중 오류가 발생했습니다." })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl transform transition-all duration-300 hover:scale-[1.02]">
        
        <div className="flex items-center justify-center mb-8">
          <div className="flex bg-white/30 backdrop-blur-sm rounded-full p-1 border border-white/10">
            <button type="button" onClick={() => setActiveTab("signup")} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "signup" ? "bg-white/20 text-[#1A1A1A] border border-white/20 shadow-lg" : "text-[#1A1A1A]/60"}`}>회원가입</button>
            <button type="button" onClick={() => setActiveTab("signin")} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "signin" ? "bg-white/20 text-[#1A1A1A] border border-white/20 shadow-lg" : "text-[#1A1A1A]/60"}`}>로그인</button>
          </div>
        </div>

        <h1 className="text-3xl font-normal text-[#1A1A1A] mb-8 text-center">
          {activeTab === "signup" ? "Create account" : "Welcome back"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "signup" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-white/20 border-white/10 rounded-2xl h-14 text-[#1A1A1A]" placeholder="성" />
                <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-white/20 border-white/10 rounded-2xl h-14 text-[#1A1A1A]" placeholder="이름" />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/20 border-white/10 rounded-2xl h-14 text-[#1A1A1A] pl-12" placeholder="이메일" />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10 text-[#1A1A1A]/60">+82</div>
                <Input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="bg-white/20 border-white/10 rounded-2xl h-14 text-[#1A1A1A] pl-16" placeholder="전화번호" />
              </div>

              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
              <Button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-14 rounded-2xl border transition-all ${file ? "border-green-500/50 bg-green-500/10 text-green-400" : "border-blue-500/30 bg-blue-950/20 text-blue-400 hover:bg-blue-950/40"}`}
              >
                {file ? <><CheckCircle2 className="mr-2 w-5 h-5" /> {file.name}</> : <><FileText className="mr-2 w-5 h-5 text-blue-400" /> <span className="text-blue-400">사업자등록증 첨부</span></>}
              </Button>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-[#1A1A1A] font-medium rounded-2xl h-14 mt-4" 
                disabled={isLoading || isUploading}
              >
                {isUploading ? "업로드 중..." : "제출"}
              </Button>
            </>
          ) : (
            <>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/20 border-white/10 rounded-2xl h-14 text-[#1A1A1A] pl-12" placeholder="Enter your email" />
              </div>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white/20 border-white/10 rounded-2xl h-14 text-[#1A1A1A] pr-12" placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 hover:text-[#1A1A1A]/60">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-[#1A1A1A] font-medium rounded-2xl h-14 mt-4"
                disabled={isLoading}
              >
                Sign in
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}