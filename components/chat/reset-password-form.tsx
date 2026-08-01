"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, KeyRound } from "lucide-react";
import { submitResetPassword } from "@/app/actions/reset-password";

export function ResetPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    try {
      const res = await submitResetPassword(formData);

      if (res.error) {
        setErrorMsg(res.error);
        return;
      }
      
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Reset password error:", err);
      setErrorMsg("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md bg-white border border-[#1A1A1A]/10 rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center text-center mt-2">
        <KeyRound className="w-12 h-12 text-[#1A1A1A] mb-4" />
        <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">발송 완료!</h3>
        <p className="text-sm text-[#1A1A1A]/70">
          입력하신 이메일로 임시 비밀번호가 발송되었습니다.<br />
          메일함을 확인해 주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 shadow-xl mt-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">비밀번호 찾기</h1>
        <p className="text-sm text-[#1A1A1A]/70">가입하신 아이디와 이메일을 입력하시면, 이메일로 임시 비밀번호를 보내드립니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-[#1A1A1A]">아이디</Label>
            <Input id="username" name="username" required placeholder="아이디를 입력해주세요" className="border-[#1A1A1A]/20 focus-visible:ring-[#1A1A1A]/30 text-[#1A1A1A]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#1A1A1A]">가입 이메일</Label>
            <Input id="email" name="email" type="email" required placeholder="가입시 입력한 이메일 주소" className="border-[#1A1A1A]/20 focus-visible:ring-[#1A1A1A]/30 text-[#1A1A1A]" />
          </div>
        </div>

        {errorMsg && (
          <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
        )}

        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white h-12 rounded-xl text-base font-medium transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              발송 중...
            </>
          ) : (
            "임시 비밀번호 발송"
          )}
        </Button>
      </form>
    </div>
  );
}
