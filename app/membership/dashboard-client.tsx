"use client";

import html2canvas from "html2canvas";
import { useRef, useState, useEffect } from "react";
import { ArrowUpToLine, Share2, ShoppingBag, Clock, KeyRound, Mail, Bot } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/login";
import { changePasswordAction, checkCurrentPasswordAction } from "@/app/actions/change-password";
import { withdrawAction } from "@/app/actions/withdraw";
import { addPoints } from "@/app/actions/points";
import { startRegistration } from "@simplewebauthn/browser";

export default function MembershipPage({
  username = "회원",
  email = "",
  grade = "SOCIAL",
  points = 4592
}: {
  username?: string,
  email?: string,
  grade?: "SOCIAL" | "EDITION" | "PRESTIGE",
  points?: number
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [inquiryText, setInquiryText] = useState("");
  const [inquiries, setInquiries] = useState<{ id: string, text: string, date: string }[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [currentPoints, setCurrentPoints] = useState(points);

  // Modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState<boolean | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
  const [chargeAmount, setChargeAmount] = useState<number | "">("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const router = useRouter();

  const handleChargePayment = async () => {
    if (!chargeAmount || chargeAmount < 1000) {
      alert("최소 1,000 포인트 이상 충전 가능합니다.");
      return;
    }
    setIsProcessingPayment(true);

    try {
      const result = await addPoints(username, Number(chargeAmount));
      if (result.success && result.points !== undefined) {
        setIsChargeModalOpen(false);
        setCurrentPoints(result.points);
        const chargedAmount = chargeAmount;
        setChargeAmount("");
        alert(`${chargedAmount.toLocaleString()} P가 성공적으로 결제되었습니다.`);
      } else {
        alert(result.error || "포인트 충전 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("포인트 충전 중 서버 오류가 발생했습니다.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSendInquiry = async () => {
    if (!inquiryText.trim()) {
      alert("문의 내용을 입력해주세요.");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, text: inquiryText }),
      });

      if (response.ok) {
        const newInquiry = {
          id: Date.now().toString(),
          text: inquiryText,
          date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        };

        setInquiries([newInquiry, ...inquiries]);
        setInquiryText("");
        alert("문의가 성공적으로 등록되고 이메일로 전송되었습니다.");
      } else {
        alert("메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch (error) {
      console.error(error);
      alert("메일 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = async () => {
    await logoutAction();
    router.refresh();
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("새로운 비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsChangingPassword(true);
    const result = await changePasswordAction(username, currentPassword, newPassword);
    setIsChangingPassword(false);

    if (result.success) {
      alert("비밀번호가 성공적으로 변경되었습니다.");
      setIsPasswordModalOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      alert(result.error || "비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    const result = await withdrawAction(username);
    setIsWithdrawing(false);

    if (result.success) {
      alert("회원탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
      router.refresh(); // This will redirect to login page because session is deleted
    } else {
      alert(result.error || "탈퇴 처리 중 오류가 발생했습니다.");
    }
  };

  const handleRegisterPasskey = async () => {
    try {
      setIsRegistering(true);
      const resp = await fetch("/api/webauthn/register");
      if (!resp.ok) throw new Error("Failed to get registration options");

      const options = await resp.json();

      let attResp;
      try {
        attResp = await startRegistration({ optionsJSON: options });
      } catch (error: any) {
        if (error.name === 'NotAllowedError') {
          alert("생체 인증 등록이 취소되었습니다.");
        } else {
          alert("기기가 생체 인증을 지원하지 않거나 오류가 발생했습니다.");
        }
        setIsRegistering(false);
        return;
      }

      const verificationResp = await fetch("/api/webauthn/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attResp),
      });

      const verificationResult = await verificationResp.json();
      if (verificationResult && verificationResult.verified) {
        alert("기기(생체 인증) 등록이 완료되었습니다. 이제 간편하게 로그인할 수 있습니다.");
      } else {
        alert("기기 등록 검증에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("생체 인증 등록 중 오류가 발생했습니다.");
    } finally {
      setIsRegistering(false);
    }
  };

  useEffect(() => {
    if (!currentPassword) {
      setIsCurrentPasswordValid(null);
      return;
    }
    const timeoutId = setTimeout(async () => {
      const result = await checkCurrentPasswordAction(username, currentPassword);
      setIsCurrentPasswordValid(result.isMatch);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [currentPassword, username]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const captureScreenshot = async () => {
    if (!contentRef.current) return null;
    setIsCapturing(true);

    try {
      const element = contentRef.current;
      const clone = element.cloneNode(true) as HTMLElement;

      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        backgroundColor: "#EBEBDF",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: clone.scrollWidth,
        height: clone.scrollHeight,
      });

      document.body.removeChild(clone);
      return new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/png");
      });
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownloadImage = async () => {
    const blob = await captureScreenshot();
    if (!blob) {
      alert("이미지 저장에 실패했습니다. 다시 시도해 주세요.");
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "findcategory-membership-2025.png";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const blob = await captureScreenshot();
    if (!blob) {
      alert("이미지 캡처에 실패했습니다.");
      return;
    }

    if (navigator.share && navigator.canShare) {
      try {
        const file = new File([blob], "findcategory-membership-2025.png", {
          type: "image/png",
        });

        const shareData = {
          title: "나의 FINDCATEGORY 멤버십 리포트",
          text: "올해 저의 파인드카테고리 구매 및 활동 리포트를 확인해 보세요!",
          files: [file],
        };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      } catch (error) {
        console.error("Share error:", error);
      }
    }

    // Fallback if sharing is not supported
    handleDownloadImage();
  };

  const GRADE_INFO: Record<string, { title: string, description: string, bgColor: string, textColor: string, highlight: string }> = {
    SOCIAL: {
      title: "SOCIAL",
      description: "파인드카테고리의 멤버십 안내",
      bgColor: "bg-[#4C050C]",
      textColor: "text-white",
      highlight: "text-white/80"
    },
    EDITION: {
      title: "EDITION",
      description: "카달로그 구입 회원 전용 멤버십입니다. 더 특별한 에디션 혜택을 경험하세요.",
      bgColor: "bg-slate-800",
      textColor: "text-white",
      highlight: "text-white/80"
    },
    PRESTIGE: {
      title: "PRESTIGE",
      description: "자체심사를 통과한 최상위 프레스티지 멤버십입니다. 파인드카테고리의 모든 프리미엄 혜택이 제공됩니다.",
      bgColor: "bg-amber-900",
      textColor: "text-amber-50",
      highlight: "text-amber-200/80"
    }
  };

  const currentGrade = GRADE_INFO[grade] || GRADE_INFO.SOCIAL;

  return (
    <div className="min-h-screen bg-[#EBEBDF] text-[#4C050C] font-sans pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 border-b border-[#4C050C]/10 bg-[#EBEBDF]/80 backdrop-blur-md">
        <Link href="/">
          <span className="text-[#4C050C] font-medium tracking-tight text-xl font-sans">FINDCATEGORYⓇ</span>
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="text-sm font-medium text-[#4C050C]/60 hover:text-[#4C050C] transition-colors font-sans underline underline-offset-4">
            로그아웃
          </button>
          <Link href="/">
            <button className="h-10 px-5 rounded-xl bg-[#4C050C]/5 border border-[#4C050C]/20 hover:bg-[#4C050C]/10 text-[#4C050C] text-sm font-medium transition-colors font-sans">
              돌아가기
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div ref={contentRef} className="w-full max-w-[1000px] flex flex-col gap-6 bg-[#EBEBDF] p-4 sm:p-8 rounded-3xl">

          <header className="flex justify-between items-center mb-4 sm:mb-8">
            <div className="flex items-center gap-2">

              <div className="font-bold text-2xl sm:text-3xl tracking-tight font-sans">
                MEMBERSHIP <span className="opacity-50 font-sans">REPORT</span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto gap-4 sm:gap-6">
            {/* Hero Tile */}
            <div
              onClick={() => setIsGradeModalOpen(true)}
              className={`md:col-span-2 lg:col-span-2 ${currentGrade.bgColor} ${currentGrade.textColor} rounded-[24px] p-8 relative overflow-hidden flex flex-col justify-end min-h-[380px] shadow-lg transition-transform hover:-translate-y-1 cursor-pointer group`}
            >
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity">
              </div>
              <div className="relative z-10">
                <div className={`text-xl ${currentGrade.highlight} mb-2 font-medium font-sans`}>Your Membership Grade</div>
                <div className="text-7xl sm:text-8xl lg:text-[100px] font-black leading-[0.9] tracking-tighter mb-4 font-sans">
                  {currentGrade.title}
                </div>
                <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                  <p className="text-sm sm:text-base font-medium opacity-90 font-sans">
                    {currentGrade.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Member Settings Tile */}
            <div className="md:col-span-2 lg:col-span-1 bg-white rounded-[24px] p-8 border border-[#4C050C]/10 shadow-sm transition-transform hover:-translate-y-1 flex flex-col justify-between min-h-[380px]">
              <div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#4C050C]/60 uppercase tracking-wider font-bold mb-4 font-sans">
                  Member Profile
                </div>
                <div className="text-2xl font-black text-[#4C050C] mb-1 font-sans truncate">{username}</div>
                <div className="text-sm text-[#4C050C]/60 font-medium font-sans mb-6 truncate">{email || "이메일 정보 없음"}</div>
              </div>

              <div className="space-y-3 mt-auto">
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full text-left px-5 py-4 bg-[#4C050C]/5 hover:bg-[#4C050C]/10 text-[#4C050C] rounded-xl font-bold font-sans transition-colors flex items-center justify-between"
                >
                  <span>비밀번호 변경</span>
                  <span className="text-[#4C050C]/40">→</span>
                </button>
                <button
                  onClick={handleRegisterPasskey}
                  disabled={isRegistering}
                  className="w-full text-left px-5 py-4 bg-[#4C050C]/5 hover:bg-[#4C050C]/10 text-[#4C050C] rounded-xl font-bold font-sans transition-colors flex items-center justify-between disabled:opacity-50"
                >
                  <span>{isRegistering ? "등록 중..." : "얼굴인식 / 패스키 등록"}</span>
                  <span className="text-[#4C050C]/40">→</span>
                </button>
                <button
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="w-full text-left px-5 py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold font-sans transition-colors flex items-center justify-between mt-2"
                >
                  <span>회원탈퇴</span>
                  <span className="text-red-300">→</span>
                </button>
              </div>
            </div>

            {/* Total Spent Tile */}
            <div className="bg-white rounded-[24px] p-8 flex flex-col justify-between min-h-[380px] border border-[#4C050C]/10 shadow-sm transition-transform hover:-translate-y-1">
              <div>
                <div className="text-xs sm:text-sm text-[#4C050C]/60 uppercase tracking-wider font-bold mb-2 font-sans">
                  보유포인트
                </div>
                <div className="text-4xl sm:text-5xl font-black text-[#4C050C] leading-none mb-0 font-sans">
                  {currentPoints.toLocaleString()} P
                </div>
              </div>


              <div className="mt-6 pt-6 border-t border-[#4C050C]/10">
                <button
                  onClick={() => setIsChargeModalOpen(true)}
                  className="w-full py-3 bg-[#4C050C] hover:bg-[#4C050C]/90 text-white rounded-xl font-bold font-sans transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  포인트 충전
                </button>
              </div>
            </div>

            {/* 1:1 Inquiry Tile */}
            <div className="md:col-span-1 lg:col-span-1 bg-white rounded-[24px] p-8 border border-[#4C050C]/10 shadow-sm transition-transform hover:-translate-y-1 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#4C050C]/5 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#4C050C]" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#4C050C] font-sans">
                      1:1 문의
                    </h3>
                    <span className="text-sm text-[#4C050C]/60 font-medium font-sans">고객센터</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <textarea
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                  placeholder="도움이 필요하신 부분을 남겨주세요."
                  className="w-full h-32 p-4 bg-[#EBEBDF] border-none rounded-xl text-sm sm:text-base font-medium text-[#4C050C] focus:ring-2 focus:ring-[#4C050C]/20 focus:outline-none resize-none font-sans"
                />
              </div>

              <div className="mt-4">
                <button
                  onClick={handleSendInquiry}
                  disabled={isSending}
                  className="bg-[#4C050C] text-white px-6 py-4 rounded-xl font-bold w-full hover:bg-[#4C050C]/90 transition-colors shadow-md text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSending ? "전송 중..." : "문의 등록하기"}
                </button>
              </div>
            </div>

            {/* Talk to AI Tile */}
            <div className="md:col-span-2 lg:col-span-1 bg-[#4C050C] rounded-[24px] p-8 border border-[#4C050C]/10 shadow-sm transition-transform hover:-translate-y-1 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
                      Talk to AI
                    </h3>
                    <span className="text-sm text-white/60 font-medium font-sans">AI 어시스턴트</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <p className="text-white/80 font-medium font-sans text-sm sm:text-base">
                  AI 어시스턴트가 실시간으로 답변해 드립니다.
                </p>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => router.push('/chat')}
                  className="bg-white text-[#4C050C] px-6 py-4 rounded-xl font-bold w-full hover:bg-white/90 transition-colors shadow-md text-lg"
                >
                  AI 상담 시작하기
                </button>
              </div>
            </div>

            {/* Inquiry List Tile */}
            <div className="md:col-span-2 lg:col-span-3 bg-white rounded-[24px] p-8 sm:p-10 min-h-[180px] border border-[#4C050C]/10 shadow-sm transition-transform hover:-translate-y-1">
              <div className="mb-6">
                <h3 className="text-2xl sm:text-3xl font-black text-[#4C050C] mb-2 font-sans">
                  나의 문의 내역
                </h3>
                <p className="text-[#4C050C]/70 text-sm sm:text-base font-medium font-sans">남겨주신 1:1 문의와 답변을 확인하실 수 있습니다.</p>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {inquiries.length === 0 ? (
                  <div className="text-center py-10 text-[#4C050C]/50 font-medium bg-[#4C050C]/5 rounded-xl">
                    등록된 문의 내역이 없습니다.
                  </div>
                ) : (
                  inquiries.map((inq) => (
                    <div key={inq.id} className="bg-[#EBEBDF] p-5 rounded-xl text-[#4C050C]">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold bg-[#4C050C]/10 px-2 py-1 rounded-md">답변 대기중</span>
                        <span className="text-xs font-medium opacity-60 font-sans">{inq.date}</span>
                      </div>
                      <p className="text-sm sm:text-base font-medium whitespace-pre-wrap leading-relaxed font-sans">{inq.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-[#4C050C] text-white shadow-xl transition-transform hover:scale-110 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <ArrowUpToLine className="w-5 h-5" />
        </button>
      )}

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-[#4C050C] mb-2 font-sans">비밀번호 변경</h3>
            <p className="text-[#4C050C]/70 mb-6 font-sans">새로운 비밀번호를 입력해주세요.</p>
            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호"
                className="w-full px-4 py-3 rounded-xl border border-[#4C050C]/20 bg-[#EBEBDF]/50 focus:outline-none focus:ring-2 focus:ring-[#4C050C] mb-2 font-sans"
              />
              {currentPassword.length > 0 && isCurrentPasswordValid === false && (
                <p className="text-sm text-red-500 font-medium mb-4 ml-1 font-sans">현재 비밀번호가 일치하지 않습니다.</p>
              )}
              {currentPassword.length > 0 && isCurrentPasswordValid === true && (
                <p className="text-sm text-green-600 font-medium mb-4 ml-1 font-sans">현재 비밀번호가 일치합니다.</p>
              )}
              {!currentPassword && <div className="mb-6"></div>}
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새로운 비밀번호"
                className="w-full px-4 py-3 rounded-xl border border-[#4C050C]/20 bg-[#EBEBDF]/50 focus:outline-none focus:ring-2 focus:ring-[#4C050C] mb-3 font-sans"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호 확인"
                className="w-full px-4 py-3 rounded-xl border border-[#4C050C]/20 bg-[#EBEBDF]/50 focus:outline-none focus:ring-2 focus:ring-[#4C050C] mb-2 font-sans"
              />
              {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                <p className="text-sm text-red-500 font-medium mb-4 ml-1 font-sans">새로운 비밀번호가 일치하지 않습니다.</p>
              )}
              {confirmPassword.length > 0 && newPassword === confirmPassword && (
                <p className="text-sm text-green-600 font-medium mb-4 ml-1 font-sans">새로운 비밀번호가 일치합니다.</p>
              )}
              {!confirmPassword && <div className="mb-6"></div>}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setIsPasswordModalOpen(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }}
                  className="flex-1 py-3 rounded-xl font-bold text-[#4C050C] bg-[#EBEBDF] hover:bg-[#EBEBDF]/80 transition-colors font-sans"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-[#4C050C] hover:bg-[#4C050C]/90 transition-colors disabled:opacity-50 font-sans"
                >
                  {isChangingPassword ? "변경 중..." : "변경하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-red-600 mb-2 font-sans">정말로 탈퇴하시겠습니까?</h3>
            <p className="text-[#4C050C]/70 mb-6 font-sans">
              탈퇴하시면 회원님의 모든 구매 내역과 리포트, 1:1 문의 내역이 영구적으로 삭제되며, 복구할 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="flex-1 py-3 rounded-xl font-bold text-[#4C050C] bg-[#EBEBDF] hover:bg-[#EBEBDF]/80 transition-colors font-sans"
              >
                취소
              </button>
              <button
                onClick={handleWithdraw}
                disabled={isWithdrawing}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 font-sans"
              >
                {isWithdrawing ? "탈퇴 처리 중..." : "탈퇴하기"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grade Info Modal */}
      {isGradeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-5xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#4C050C] font-sans">FINDCATEGORY 멤버십 안내</h3>
              <button onClick={() => setIsGradeModalOpen(false)} className="text-[#4C050C]/50 hover:text-[#4C050C] transition-colors text-xl">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* SOCIAL */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col">
                <div className="text-[#4C050C] font-black text-3xl mb-4 font-sans tracking-tight">SOCIAL</div>
                <div className="text-sm text-gray-700 font-sans space-y-3 leading-relaxed flex-1">
                  <p className="font-medium text-gray-900">일반 고객 멤버십입니다.</p>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p>일주일에 <span className="font-bold text-[#4C050C]">10만 포인트 초과 구매가 불가</span>합니다.</p>
                    <p className="text-xs text-gray-500 mt-2">* 초과 구매 필요 시, 1:1 문의를 통해 별도 신청해 주시기 바랍니다.</p>
                  </div>
                </div>
              </div>

              {/* EDITION */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col">
                <div className="text-slate-800 font-black text-3xl mb-4 font-sans tracking-tight">EDITION</div>
                <div className="text-sm text-gray-700 font-sans space-y-3 leading-relaxed flex-1">
                  <p className="font-medium text-slate-900">카달로그 구입 회원 전용 멤버십입니다.</p>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p>카달로그를 통한 <span className="font-bold text-slate-800">특별 할인가</span>로 구매가 가능합니다.</p>
                    <p className="text-xs text-slate-500 mt-2">* 카달로그 신청 시 가입하실 수 있습니다.</p>
                  </div>
                </div>
              </div>

              {/* PRESTIGE */}
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex flex-col">
                <div className="text-amber-900 font-black text-3xl mb-4 font-sans tracking-tight">PRESTIGE</div>
                <div className="text-sm text-gray-700 font-sans space-y-4 leading-relaxed flex-1">
                  <p className="font-medium text-amber-900">정기구독 신청 시 가입 가능한 최상위 멤버십입니다.</p>

                  <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm">
                    <div className="font-black text-amber-900 mb-2 flex items-center gap-2">
                      특별 케어 서비스
                    </div>
                    <p className="text-xs mb-4 text-gray-600">
                      일반 회원과 달리, '프레스티지 멤버십' 등급 회원에게는 B2B 구매대행의 리스크를 최소화할 수 있는 파인드카테고리만의 독점적인 서비스가 제공됩니다.
                    </p>

                    <div className="space-y-4">
                      <div className="bg-amber-50/50 p-3 rounded-lg">
                        <div className="font-bold text-sm text-amber-900 mb-1">① 핏인 (FIT-IN) 서비스</div>
                        <div className="text-xs font-medium text-amber-700 mb-2">무료 스타일링 체험</div>
                        <ul className="text-[11px] list-disc pl-4 space-y-1 text-gray-600">
                          <li><span className="font-semibold text-gray-800">내용:</span> 구매 결정 전, 원하는 제품을 한 달(30일)간 무료로 공간에 스타일링 및 배치해 볼 수 있는 사전 체험 서비스</li>
                          <li><span className="font-semibold text-gray-800">안내:</span> 기간 종료 후 구매 확정 또는 반납 선택 (반납 시 원형 유지 필수)</li>
                        </ul>
                      </div>

                      <div className="bg-amber-50/50 p-3 rounded-lg">
                        <div className="font-bold text-sm text-amber-900 mb-1">② 핏아웃 (FIT-OUT) 서비스</div>
                        <div className="text-xs font-medium text-amber-700 mb-2">유연한 교환 혜택</div>
                        <ul className="text-[11px] list-disc pl-4 space-y-1 text-gray-600">
                          <li><span className="font-semibold text-gray-800">내용:</span> 구매(대행 완료) 후에도 스토어 내 다른 제품으로 교환 가능</li>
                          <li><span className="font-semibold text-gray-800">안내:</span> 지정된 기간 내 신청, 차액 정산 및 왕복 물류 비용 발생 가능</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charge Modal */}
      {isChargeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-[#4C050C] mb-2 font-sans">포인트 충전</h3>
            <p className="text-[#4C050C]/70 mb-6 font-sans">충전하실 포인트 금액을 입력해주세요.</p>

            <div className="mb-6">
              <div className="relative">
                <input
                  type="number"
                  value={chargeAmount}
                  onChange={(e) => setChargeAmount(e.target.value ? Number(e.target.value) : "")}
                  placeholder="0"
                  className="w-full px-4 py-4 rounded-xl border border-[#4C050C]/20 bg-[#EBEBDF]/50 focus:outline-none focus:ring-2 focus:ring-[#4C050C] font-sans text-right text-2xl font-bold text-[#4C050C]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4C050C]/50 font-bold text-xl pointer-events-none">P</span>
              </div>
              <div className="flex gap-2 mt-3">
                {[10000, 50000, 100000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setChargeAmount(prev => (Number(prev) || 0) + amount)}
                    className="flex-1 py-2 bg-[#4C050C]/5 hover:bg-[#4C050C]/10 text-[#4C050C] rounded-lg text-sm font-bold font-sans transition-colors"
                  >
                    +{amount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setIsChargeModalOpen(false); setChargeAmount(""); }}
                className="flex-1 py-4 rounded-xl font-bold text-[#4C050C] bg-[#EBEBDF] hover:bg-[#EBEBDF]/80 transition-colors font-sans"
              >
                취소
              </button>
              <button
                onClick={handleChargePayment}
                disabled={isProcessingPayment || !chargeAmount}
                className="flex-1 py-4 rounded-xl font-bold text-white bg-[#4C050C] hover:bg-[#4C050C]/90 transition-colors disabled:opacity-50 font-sans"
              >
                {isProcessingPayment ? "결제 중..." : "결제하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
