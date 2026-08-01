"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Minus, Plus, CheckCircle, ArrowLeft, ShieldCheck, ShoppingBag, CreditCard, Building2 } from "lucide-react"
import { useCart } from "@/components/detail/ui/cart-context"
import { getUserProfile } from "@/app/actions/user"
import * as PortOne from "@portone/browser-sdk/v2"
import DaumPostcode from "react-daum-postcode"

interface FormData {
  fullName: string
  email: string
  phone: string
  zipcode: string
  address: string
  detailAddress: string
}

interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  zipcode?: string
  address?: string
  detailAddress?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, removeFromCart, updateQuantity } = useCart()
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    zipcode: "",
    address: "",
    detailAddress: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [payMethod, setPayMethod] = useState<"CARD" | "TRANSFER">("CARD")
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false)

  const handleCompletePostcode = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') extraAddress += data.bname;
      if (data.buildingName !== '') extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setFormData(prev => ({
      ...prev,
      zipcode: data.zonecode,
      address: fullAddress,
    }));
    setIsPostcodeOpen(false);
  }

  useEffect(() => {
    getUserProfile().then(res => {
      if (res.user) {
        setUsername(res.user.id || res.user.name || null);
        setFormData(prev => ({
          ...prev,
          fullName: prev.fullName || res.user.name || "",
          email: prev.email || res.user.email || "",
          phone: prev.phone || res.user.phone || "",
        }));
      }
    });
  }, []);

  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0)
  const totalPrice = items.reduce((sum, item) => {
    const priceNum = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
    return sum + (priceNum * (item.quantity || 1));
  }, 0)
  const vat = Math.floor(totalPrice * 0.1);
  const totalAmountWithVat = totalPrice + vat;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "이름을 입력해주세요"
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "유효한 이메일을 입력해주세요"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "전화번호를 입력해주세요"
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "유효한 전화번호를 입력해주세요"
    }

    if (!formData.zipcode.trim() || !formData.address.trim()) {
      newErrors.address = "배송 주소를 검색해주세요"
    }

    if (!formData.detailAddress.trim()) {
      newErrors.detailAddress = "상세 주소를 입력해주세요"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const paymentId = `order${Date.now()}${Math.floor(Math.random() * 10000)}`;
      
      const response = await PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID || "store-e5c27730-d4e6-4cc6-9456-32a3e917e3ba",
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || "channel-key-f623f5e6-30e7-4aaf-bc40-47101737e951",
        paymentId: paymentId,
        orderName: `파인드카테고리 상품 ${totalQuantity}개 주문`,
        totalAmount: totalAmountWithVat,
        currency: "CURRENCY_KRW",
        payMethod: payMethod,
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phone.replace(/[^0-9]/g, ''),
          address: {
            addressLine1: formData.address,
            addressLine2: formData.detailAddress,
            zipcode: formData.zipcode
          }
        }
      });

      if (response && response.code != null) {
        alert(`결제 실패/취소: ${response.message}`);
        setIsSubmitting(false);
        return;
      }

      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          items,
          totalQuantity,
        }),
      })

      if (!res.ok) {
        throw new Error("주문 처리 실패")
      }
    } catch (error) {
      console.error(error)
      alert("주문 처리 중 오류가 발생했습니다.")
      setIsSubmitting(false)
      return
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("verifiedBuyer", "true")
    }
    setOrderComplete(true)
    setIsSubmitting(false)
  }

  if (orderComplete) {
    return (
      <main className="min-h-screen bg-white text-[#1A1A1A] font-sans antialiased">
        <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-md border border-[#1A1A1A]/15 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-inner">
              <CheckCircle className="w-12 h-12" />
            </div>
            
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1A1A] mb-3">주문이 완료되었습니다!</h1>
              <p className="text-base sm:text-lg text-[#1A1A1A]/70">
                고객님의 소중한 주문이 정상적으로 접수되었습니다.<br />담당자 확인 후 신속하게 배송해 드리겠습니다.
              </p>
            </div>

            <div className="bg-white/50 p-6 sm:p-8 rounded-2xl border border-[#1A1A1A]/15 text-left space-y-4">
              <h3 className="font-bold text-lg text-[#1A1A1A] border-b border-[#1A1A1A]/15 pb-3">주문 내역 요약</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm sm:text-base text-[#1A1A1A]/90 py-1">
                    <span className="font-medium truncate max-w-[70%]">{item.name}</span>
                    <span className="font-bold text-[#1A1A1A]">{item.quantity || 1}개 / {item.price}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#1A1A1A]/20 pt-4 flex justify-between items-center font-black text-lg sm:text-xl text-[#1A1A1A]">
                <span>최종 결제 금액</span>
                <span>{totalAmountWithVat.toLocaleString()}원</span>
              </div>
            </div>

            <div className="bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 p-4 rounded-xl text-xs sm:text-sm text-[#1A1A1A]/80 font-medium">
              💡 주문 관련 안내나 배송 알림은 입력하신 이메일과 연락처로 발송됩니다.
            </div>

            <Button
              onClick={() => router.push("/shop")}
              className="w-full py-6 bg-[#1A1A1A] text-white font-extrabold text-lg rounded-2xl hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-[0.99]"
            >
              쇼룸으로 돌아가기
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A] font-sans antialiased">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="mb-10">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-medium text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> 쇼룸으로 돌아가기
          </Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A1A1A] tracking-tight">주문 / 결제</h1>
          <p className="text-sm sm:text-base text-[#1A1A1A]/70 mt-2">안전하고 빠르게 상품을 받아보실 배송지 및 결제 정보를 입력해주세요.</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-md border border-[#1A1A1A]/15 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-6 shadow-md">
            <div className="w-20 h-20 bg-[#1A1A1A]/5 rounded-full flex items-center justify-center mx-auto text-[#1A1A1A]/40">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[#1A1A1A]">장바구니가 비어 있습니다</h2>
              <p className="text-[#1A1A1A]/60 text-sm mt-2">쇼룸에서 마음에 드는 상품을 담은 후 다시 방문해주세요.</p>
            </div>
            <Button
              onClick={() => router.push("/shop")}
              className="px-8 py-5 bg-[#1A1A1A] text-white font-bold text-base rounded-xl hover:bg-black transition-all shadow-md"
            >
              상품 둘러보기
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Order Form (7 columns on large screens) */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="bg-white/75 backdrop-blur-md border border-[#1A1A1A]/15 rounded-3xl p-6 sm:p-10 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A] tracking-tight mb-6 border-b border-[#1A1A1A]/10 pb-4">
                  배송지 및 주문자 정보
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-bold text-[#1A1A1A]">이름 *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                      className={`h-12 px-4 bg-white/60 text-[#1A1A1A] border-[#1A1A1A]/20 rounded-xl focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] placeholder:text-[#1A1A1A]/40 ${errors.fullName ? "border-red-500" : ""}`}
                      placeholder="수령인 성함을 입력해주세요"
                    />
                    {errors.fullName && <p className="text-xs text-red-500 font-medium">{errors.fullName}</p>}
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-bold text-[#1A1A1A]">이메일 *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        className={`h-12 px-4 bg-white/60 text-[#1A1A1A] border-[#1A1A1A]/20 rounded-xl focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] placeholder:text-[#1A1A1A]/40 ${errors.email ? "border-red-500" : ""}`}
                        placeholder="example@domain.com"
                      />
                      {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-bold text-[#1A1A1A]">전화번호 *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        className={`h-12 px-4 bg-white/60 text-[#1A1A1A] border-[#1A1A1A]/20 rounded-xl focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] placeholder:text-[#1A1A1A]/40 ${errors.phone ? "border-red-500" : ""}`}
                        placeholder="010-0000-0000"
                      />
                      {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-3 pt-2">
                    <Label className="text-sm font-bold text-[#1A1A1A]">배송 주소 *</Label>
                    <div className="flex gap-3">
                      <Input
                        value={formData.zipcode}
                        readOnly
                        placeholder="우편번호"
                        className={`h-12 px-4 bg-white/60 text-[#1A1A1A] border-[#1A1A1A]/20 rounded-xl placeholder:text-[#1A1A1A]/40 w-36 font-medium ${errors.address ? "border-red-500" : ""}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsPostcodeOpen(true)}
                        className="h-12 px-6 border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-black font-bold rounded-xl transition-all shadow-sm shrink-0"
                      >
                        주소 찾기
                      </Button>
                    </div>
                    <Input
                      value={formData.address}
                      readOnly
                      placeholder="기본 주소 (주소 찾기 버튼을 이용해주세요)"
                      className={`h-12 px-4 bg-white/60 text-[#1A1A1A] border-[#1A1A1A]/20 rounded-xl placeholder:text-[#1A1A1A]/40 font-medium ${errors.address ? "border-red-500" : ""}`}
                    />
                    <Input
                      value={formData.detailAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, detailAddress: e.target.value }))}
                      placeholder="상세 주소(동·호수 등)를 입력해주세요"
                      className={`h-12 px-4 bg-white/60 text-[#1A1A1A] border-[#1A1A1A]/20 rounded-xl focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] placeholder:text-[#1A1A1A]/40 ${errors.detailAddress ? "border-red-500" : ""}`}
                    />
                    {(errors.address || errors.detailAddress) && (
                      <p className="text-xs text-red-500 font-medium">{errors.address || errors.detailAddress}</p>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div className="pt-6 border-t border-[#1A1A1A]/10">
                    <Label className="text-sm font-bold text-[#1A1A1A] mb-4 block">결제 수단 선택 *</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${payMethod === "CARD" ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md" : "bg-white/50 text-[#1A1A1A] border-[#1A1A1A]/20 hover:bg-white/80"}`}>
                        <input
                          type="radio"
                          name="payMethod"
                          value="CARD"
                          checked={payMethod === "CARD"}
                          onChange={() => setPayMethod("CARD")}
                          className="sr-only"
                        />
                        <CreditCard className="w-5 h-5 shrink-0" />
                        <span className="text-sm sm:text-base font-bold">신용카드 / 간편결제</span>
                      </label>
                      
                      <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${payMethod === "TRANSFER" ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md" : "bg-white/50 text-[#1A1A1A] border-[#1A1A1A]/20 hover:bg-white/80"}`}>
                        <input
                          type="radio"
                          name="payMethod"
                          value="TRANSFER"
                          checked={payMethod === "TRANSFER"}
                          onChange={() => setPayMethod("TRANSFER")}
                          className="sr-only"
                        />
                        <Building2 className="w-5 h-5 shrink-0" />
                        <span className="text-sm sm:text-base font-bold">계좌이체 / 무통장</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-6 bg-[#1A1A1A] hover:bg-black text-white font-black text-lg sm:text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-[0.99] flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? "결제 처리 중..." : `${totalAmountWithVat.toLocaleString()}원 결제하기`}
                    </Button>
                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#1A1A1A]/60 font-medium">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      <span>안전한 256-bit SSL 암호화 결제 및 개인정보 보호</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Order Summary (5 columns on large screens, sticky) */}
            <div className="lg:col-span-5 order-1 lg:order-2 sticky top-12">
              <div className="bg-white/85 backdrop-blur-md border border-[#1A1A1A]/15 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
                <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-4">
                  <h3 className="font-extrabold text-xl text-[#1A1A1A]">주문 요약</h3>
                  <span className="px-3 py-1 bg-[#1A1A1A] text-white rounded-full text-xs font-bold">
                    {totalQuantity}개 상품
                  </span>
                </div>

                {/* Items list */}
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 divide-y divide-[#1A1A1A]/10">
                  {items.map((item, i) => (
                    <div key={i} className={`flex gap-4 ${i > 0 ? "pt-4" : ""}`}>
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white/50 border border-[#1A1A1A]/10 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-sm font-bold text-[#1A1A1A] line-clamp-2 leading-snug">{item.name}</p>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#1A1A1A]/40 hover:text-red-500 transition-colors p-1 shrink-0"
                            title="삭제"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <div className="flex items-center border border-[#1A1A1A]/20 rounded-lg overflow-hidden bg-white/60">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                              className="px-2 py-1 text-xs hover:bg-[#1A1A1A]/10 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-2 py-1 text-xs font-bold text-[#1A1A1A] border-x border-[#1A1A1A]/10 min-w-[28px] text-center">
                              {item.quantity || 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                              className="px-2 py-1 text-xs hover:bg-[#1A1A1A]/10 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="text-sm font-black text-[#1A1A1A]">{item.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-[#1A1A1A]/15 pt-5 space-y-3">
                  <div className="flex justify-between font-medium text-sm text-[#1A1A1A]/80">
                    <span>상품 총액</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between font-medium text-sm text-[#1A1A1A]/80">
                    <span>부가세 (10%)</span>
                    <span>{vat.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between font-medium text-sm text-[#1A1A1A]/80">
                    <span>배송비</span>
                    <span className="text-green-600 font-bold">무료배송</span>
                  </div>
                  <div className="flex justify-between items-center font-black text-xl text-[#1A1A1A] border-t border-[#1A1A1A]/15 pt-4">
                    <span>총 결제 금액</span>
                    <span className="text-2xl tracking-tight text-[#1A1A1A]">{totalAmountWithVat.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DaumPostcode Modal Overlay */}
      {isPostcodeOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-[#1A1A1A]/20">
            <div className="flex justify-between items-center px-6 py-5 border-b border-[#1A1A1A]/10 bg-white">
              <h3 className="font-extrabold text-lg text-[#1A1A1A]">우편번호 및 주소 찾기</h3>
              <button 
                onClick={() => setIsPostcodeOpen(false)}
                className="p-1 text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors"
              >
                <X size={22} />
              </button>
            </div>
            <div className="p-0 h-[450px] w-full">
              <DaumPostcode onComplete={handleCompletePostcode} style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
