"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginAction } from "@/app/actions/login"
import { ScanFace, Fingerprint, LogIn, KeyRound } from "lucide-react"
import { startAuthentication } from "@simplewebauthn/browser"

export default function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)

    if (result?.success) {
      router.refresh()
    } else {
      setError(result?.error || "로그인에 실패했습니다.")
      setIsLoading(false)
    }
  }

  async function handleBiometricLogin() {
    try {
      setIsLoading(true);
      setError("");

      const resp = await fetch("/api/webauthn/authenticate");
      if (!resp.ok) throw new Error("Failed to get authentication options");

      const options = await resp.json();

      let asseResp;
      try {
        asseResp = await startAuthentication({ optionsJSON: options });
      } catch (error: any) {
        if (error.name === 'NotAllowedError') {
          setError("생체 인증이 취소되었습니다.");
        } else {
          setError("기기가 생체 인증을 지원하지 않거나 등록된 기기가 아닙니다.");
        }
        setIsLoading(false);
        return;
      }

      const verificationResp = await fetch("/api/webauthn/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asseResp),
      });

      const verificationResult = await verificationResp.json();

      if (verificationResult && verificationResult.verified) {
        router.refresh();
      } else {
        setError("생체 인증 검증에 실패했습니다.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setError("인증 과정에서 오류가 발생했습니다.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-[#1A1A1A]/10">

        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">FINDCATEGORY 파트너 로그인</h1>
          <p className="text-sm text-[#1A1A1A]/60 mt-2">이용하시려면 Talk to AI 를 통해 가입 문의를 접수해주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">아이디</label>
            <input
              name="username"
              type="text"
              required
              className="w-full h-12 px-4 rounded-xl bg-white/50 border border-[#1A1A1A]/20 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
              placeholder="아이디를 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">비밀번호</label>
            <input
              name="password"
              type="password"
              required
              className="w-full h-12 px-4 rounded-xl bg-white/50 border border-[#1A1A1A]/20 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-2 bg-[#1A1A1A] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "인증 중..." : <><LogIn className="w-4 h-4" /> 로그인</>}
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-[#1A1A1A]/10"></div>
          <span className="text-xs text-[#1A1A1A]/40 font-medium uppercase">간편 인증</span>
          <div className="flex-1 h-px bg-[#1A1A1A]/10"></div>
        </div>

        <div className="mt-6 flex md:hidden gap-3">
          <button
            onClick={handleBiometricLogin}
            disabled={isLoading}
            className="flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[#1A1A1A]/10 bg-white/30 hover:bg-white/70 transition-colors text-[#1A1A1A]"
          >
            <ScanFace className="w-8 h-8" strokeWidth={1.5} />
            <span className="text-xs font-bold">Face ID</span>
          </button>

          <button
            onClick={handleBiometricLogin}
            disabled={isLoading}
            className="flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[#1A1A1A]/10 bg-white/30 hover:bg-white/70 transition-colors text-[#1A1A1A]"
          >
            <Fingerprint className="w-8 h-8" strokeWidth={1.5} />
            <span className="text-xs font-bold">지문 인식</span>
          </button>
        </div>

        <div className="mt-6 hidden md:flex">
          <button
            onClick={handleBiometricLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border border-[#1A1A1A]/20 bg-white/30 hover:bg-white/70 transition-colors text-[#1A1A1A]"
          >
            <KeyRound className="w-5 h-5" strokeWidth={2} />
            <span className="text-sm font-bold">패스키로 로그인</span>
          </button>
        </div>

      </div>
    </div>
  )
}
