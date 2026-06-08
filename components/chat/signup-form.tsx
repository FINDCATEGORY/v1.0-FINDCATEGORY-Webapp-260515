"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { submitSignup, checkUsername } from "@/app/actions/signup";

export function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "duplicate" | "error">("idle");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!username.trim()) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");
    const handler = setTimeout(async () => {
      const res = await checkUsername(username.trim());
      if (res.error) {
        setUsernameStatus("error");
      } else if (res.isDuplicate) {
        setUsernameStatus("duplicate");
      } else {
        setUsernameStatus("available");
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      setIsSubmitting(false);
      return;
    }

    if (usernameStatus === "duplicate") {
      setErrorMsg("이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await submitSignup(formData);

      if (res.error) {
        setErrorMsg(res.error);
        return;
      }
      
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Signup error:", err);
      setErrorMsg("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md bg-white border border-[#4C050C]/10 rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center text-center mt-2">
        <CheckCircle2 className="w-12 h-12 text-[#4C050C] mb-4" />
        <h3 className="text-xl font-bold text-[#4C050C] mb-2">접수 완료!</h3>
        <p className="text-sm text-[#4C050C]/70">
          입력하신 정보가 성공적으로 제출되었습니다.<br />
          담당자가 확인 후 빠르게 연락드리겠습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white border border-[#4C050C]/10 rounded-2xl p-6 shadow-xl mt-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#4C050C] mb-2">FINDACTEGORY <span className="font-light">Be a Member</span></h1>
        <p className="text-sm text-[#4C050C]/70">B2B 회원 등록 절차에 따라 정보를 입력해주세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#4C050C] border-b border-[#4C050C]/10 pb-2">담당자 정보</h2>
          
          <div className="space-y-2">
            <Label htmlFor="username" className="text-[#4C050C]">아이디 <span className="text-red-500">*</span></Label>
            <Input 
              id="username" 
              name="username" 
              required 
              placeholder="아이디" 
              className={`border-[#4C050C]/20 focus-visible:ring-[#4C050C]/30 text-[#4C050C] ${usernameStatus === 'duplicate' ? 'border-red-500 focus-visible:ring-red-500/30' : ''}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameStatus === "checking" && <p className="text-xs text-[#4C050C]/60">중복 확인 중...</p>}
            {usernameStatus === "available" && <p className="text-xs text-green-600">사용 가능한 아이디입니다.</p>}
            {usernameStatus === "duplicate" && <p className="text-xs text-red-500">이미 사용 중인 아이디입니다.</p>}
            {usernameStatus === "error" && <p className="text-xs text-red-500">중복 확인 중 오류가 발생했습니다.</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#4C050C]">비밀번호 <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input id="password" name="password" type={showPassword ? "text" : "password"} required placeholder="비밀번호" className="border-[#4C050C]/20 focus-visible:ring-[#4C050C]/30 text-[#4C050C] pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4C050C]/50 hover:text-[#4C050C]">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[#4C050C]">비밀번호 확인 <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required placeholder="비밀번호 재입력" className="border-[#4C050C]/20 focus-visible:ring-[#4C050C]/30 text-[#4C050C] pr-10" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4C050C]/50 hover:text-[#4C050C]">
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#4C050C]">성함 <span className="text-red-500">*</span></Label>
            <Input id="name" name="name" required placeholder="성함" className="border-[#4C050C]/20 focus-visible:ring-[#4C050C]/30 text-[#4C050C]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#4C050C]">이메일 <span className="text-red-500">*</span></Label>
            <Input id="email" name="email" type="email" required placeholder="이메일" className="border-[#4C050C]/20 focus-visible:ring-[#4C050C]/30 text-[#4C050C]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#4C050C]">연락처 <span className="text-red-500">*</span></Label>
            <Input id="phone" name="phone" type="tel" required placeholder="연락처" className="border-[#4C050C]/20 focus-visible:ring-[#4C050C]/30 text-[#4C050C]" />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-semibold text-[#4C050C] border-b border-[#4C050C]/10 pb-2">회사 정보</h2>
          
          <div className="space-y-2">
            <Label htmlFor="company_name" className="text-[#4C050C]">회사명 <span className="text-red-500">*</span></Label>
            <Input id="company_name" name="company_name" required placeholder="회사명" className="border-[#4C050C]/20 focus-visible:ring-[#4C050C]/30 text-[#4C050C]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-[#4C050C]">부서 <span className="text-red-500">*</span></Label>
            <Input id="department" name="department" required placeholder="부서" className="border-[#4C050C]/20 focus-visible:ring-[#4C050C]/30 text-[#4C050C]" />
          </div>
        </div>

        {errorMsg && (
          <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
        )}

        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-[#4C050C] hover:bg-[#4C050C]/90 text-white h-12 rounded-xl text-base font-medium transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              제출 중...
            </>
          ) : (
            "제출"
          )}
        </Button>
      </form>
    </div>
  );
}
