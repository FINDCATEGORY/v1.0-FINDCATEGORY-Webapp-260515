"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { X, Minus, Plus, CheckCircle } from "lucide-react"
import { useCart } from "@/components/detail/ui/cart-context"
import Image from "next/image"
import { getUserPointsAndName, deductPoints } from "@/app/actions/points"
import { getUserProfile } from "@/app/actions/user"
import { useEffect } from "react"
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

export function CartCheckoutModal() {
  const { items, isCheckoutOpen, setIsCheckoutOpen, removeFromCart } = useCart()
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
    if (isCheckoutOpen) {
      getUserPointsAndName().then(res => {
        if (res.username) {
          setUsername(res.username);
        }
      });
      getUserProfile().then(res => {
        if (res.user) {
          setFormData(prev => ({
            ...prev,
            fullName: prev.fullName || res.user.name || "",
            email: prev.email || res.user.email || "",
            phone: prev.phone || res.user.phone || "",
          }));
        }
      });
    }
  }, [isCheckoutOpen]);

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

  const handleClose = () => {
    setIsCheckoutOpen(false)
    setOrderComplete(false)
  }

  if (!isCheckoutOpen) return null

  if (orderComplete) {
    return (
      <>
        {isCheckoutOpen && (
          <div
            className="fixed inset-0 bg-[#EBEBDF]/50 backdrop-blur-sm z-[55]"
            onClick={handleClose}
          />
        )}

        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="bg-[#EBEBDF]/95 border border-[#4C050C]/20 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center space-y-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <h1 className="text-3xl font-bold text-[#4C050C] mb-4">주문이 완료되었습니다!</h1>
                <p className="text-[#4C050C]/80">
                  주문해주셔서 감사합니다! 총 {totalQuantity}개 상품이 2-3 업무일 내에 배송됩니다.
                </p>
              </div>

              <div className="bg-white/50 p-6 rounded-lg border border-[#4C050C]/20">
                <h3 className="font-semibold text-[#4C050C] mb-4">주문 상세정보</h3>
                <div className="space-y-2 mb-4">
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-[#4C050C]/80">
                      <span>{item.name}</span>
                      <span>{item.quantity || 1}개</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#4C050C]/20 pt-4 flex justify-between font-bold text-[#4C050C]">
                  <span>총 수량:</span>
                  <span>{totalQuantity}개</span>
                </div>
              </div>

              <div className="bg-green-100 border border-green-300 p-4 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  🎉 확인된 구매자가 되셨습니다! 다른 고객들을 위해 리뷰를 남겨주세요.
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-[#4C050C] text-white font-bold rounded-lg hover:opacity-80 transition-opacity"
              >
                계속 쇼핑하기
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {isCheckoutOpen && (
        <div
          className="fixed inset-0 bg-[#EBEBDF]/50 backdrop-blur-sm z-[55]"
          onClick={handleClose}
        />
      )}

      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="bg-[#EBEBDF]/95 border border-[#4C050C]/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-[#4C050C]/20 sticky top-0 bg-[#EBEBDF]/95">
            <h2 className="text-[#4C050C] font-bold text-lg">주문하기</h2>
            <button
              onClick={handleClose}
              className="text-[#4C050C] hover:text-[#4C050C]/70 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Form */}
              <div className="lg:col-span-2 lg:order-2">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <Label htmlFor="fullName" className="text-[#4C050C]">이름 *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                      className={`bg-white/50 text-[#4C050C] border-[#4C050C]/20 placeholder:!text-[#4C050C] ${errors.fullName ? "border-red-500" : ""}`}
                      placeholder="이름"
                    />
                    {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-[#4C050C]">이메일 *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      className={`bg-white/50 text-[#4C050C] border-[#4C050C]/20 placeholder:!text-[#4C050C] ${errors.email ? "border-red-500" : ""}`}
                      placeholder="이메일"
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <Label htmlFor="phone" className="text-[#4C050C]">전화번호 *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      className={`bg-white/50 text-[#4C050C] border-[#4C050C]/20 placeholder:!text-[#4C050C] ${errors.phone ? "border-red-500" : ""}`}
                      placeholder="전화번호"
                    />
                    {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-3">
                    <Label className="text-[#4C050C]">배송 주소 *</Label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.zipcode}
                        readOnly
                        placeholder="우편번호"
                        className={`bg-white/50 text-[#4C050C] border-[#4C050C]/20 placeholder:!text-[#4C050C]/50 w-32 ${errors.address ? "border-red-500" : ""}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsPostcodeOpen(true)}
                        className="border-[#4C050C]/20 text-[#4C050C] hover:bg-[#4C050C]/5"
                      >
                        주소 찾기
                      </Button>
                    </div>
                    <Input
                      value={formData.address}
                      readOnly
                      placeholder="기본 주소"
                      className={`bg-white/50 text-[#4C050C] border-[#4C050C]/20 placeholder:!text-[#4C050C]/50 ${errors.address ? "border-red-500" : ""}`}
                    />
                    <Input
                      value={formData.detailAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, detailAddress: e.target.value }))}
                      placeholder="상세 주소를 입력해주세요"
                      className={`bg-white/50 text-[#4C050C] border-[#4C050C]/20 placeholder:!text-[#4C050C]/50 ${errors.detailAddress ? "border-red-500" : ""}`}
                    />
                    {(errors.address || errors.detailAddress) && (
                      <p className="text-sm text-red-500 mt-1">{errors.address || errors.detailAddress}</p>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div className="pt-2">
                    <Label className="text-[#4C050C] mb-3 block">결제 수단 *</Label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="payMethod"
                          value="CARD"
                          checked={payMethod === "CARD"}
                          onChange={() => setPayMethod("CARD")}
                          className="w-4 h-4 accent-[#4C050C]"
                        />
                        <span className="text-sm text-[#4C050C] font-medium">신용카드</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="payMethod"
                          value="TRANSFER"
                          checked={payMethod === "TRANSFER"}
                          onChange={() => setPayMethod("TRANSFER")}
                          className="w-4 h-4 accent-[#4C050C]"
                        />
                        <span className="text-sm text-[#4C050C] font-medium">계좌이체</span>
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-3 bg-[#4C050C] text-white font-bold rounded-lg hover:opacity-80 transition-opacity mt-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "처리중..." : "주문하기"}
                  </Button>
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1 lg:order-1">
                <div className="bg-white/50 border border-[#4C050C]/20 rounded-lg p-4 sticky top-20">
                  <h3 className="font-bold text-[#4C050C] mb-4">주문 요약</h3>

                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
                    {items.map((item, i) => (
                      <div key={i} className="flex gap-3 border-b border-[#4C050C]/20 pb-3">
                        <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <p className="text-xs text-[#4C050C] font-medium line-clamp-2">{item.name}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-[#4C050C]/70">x {item.quantity || 1}</p>
                            <p className="text-xs text-[#4C050C] font-bold">{item.price}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#4C050C]/50 hover:text-[#4C050C] transition-colors p-1 flex-shrink-0 self-start"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 space-y-3">
                    <div className="flex justify-between font-medium text-[#4C050C] text-sm">
                      <span>총 상품 개수:</span>
                      <span>{totalQuantity}개</span>
                    </div>
                    <div className="flex justify-between font-medium text-[#4C050C] text-sm">
                      <span>상품 총액:</span>
                      <span>{totalPrice.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between font-medium text-[#4C050C] text-sm">
                      <span>부가세 (10%):</span>
                      <span>{vat.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#4C050C] text-lg border-t border-[#4C050C]/10 pt-3">
                      <span>총 결제 금액:</span>
                      <span>{totalAmountWithVat.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isPostcodeOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsPostcodeOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-lg overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg">주소 찾기</h3>
              <button onClick={() => setIsPostcodeOpen(false)}><X size={20} /></button>
            </div>
            <div className="p-0 h-[400px]">
              <DaumPostcode onComplete={handleCompletePostcode} style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
