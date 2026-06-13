"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { getUserProfile } from "@/app/actions/user"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Minus, Plus, CheckCircle } from "lucide-react"

interface Product {
  id: number
  name: string
  price: string
  image: string
  categories: string[]
  description: string
}

interface FormData {
  fullName: string
  email: string
  phone: string
  address: string
  quantity: number
  paymentMethod: string
}

interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  address?: string
  paymentMethod?: string
}

export function CheckoutModal({ product }: { product: Product }) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    quantity: 1,
    paymentMethod: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const price = parseInt(product.price.replace(/[^0-9]/g, ""))
  
  useEffect(() => {
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
  }, []);
  const subtotal = price * formData.quantity
  const totalPrice = subtotal

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

    if (!formData.address.trim()) {
      newErrors.address = "배송 주소를 입력해주세요"
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "결제 방식을 선택해주세요"
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (typeof window !== "undefined") {
      localStorage.setItem("verifiedBuyer", "true")
    }
    setOrderComplete(true)
    setIsSubmitting(false)
  }

  const updateQuantity = (change: number) => {
    setFormData((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + change),
    }))
  }

  if (orderComplete) {
    return (
      <div className="space-y-6 bg-white p-8 rounded-lg">
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-black mb-4">주문이 완료되었습니다!</h1>
          <p className="text-lg text-gray-700 mb-6">
            주문해주셔서 감사합니다!
          </p>

          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-black mb-2">주문 상세정보</h3>
            <p className="text-sm text-gray-700">{product.name}</p>
            <p className="text-sm text-gray-700">수량: {formData.quantity}</p>
            <p className="text-sm text-gray-700">합계: ₩{totalPrice.toLocaleString()}</p>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
            <p className="text-sm text-green-800 font-medium">
              담당자 확인 후, 연락드리겠습니다.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-white p-8 rounded-lg">
      <div>
        <h2 className="text-2xl font-bold text-black text-balance">주문하기</h2>
        <p className="text-gray-700 mt-2">{product.name}의 주문을 완료해주세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Form */}
        <div className="lg:col-span-2">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">배송 및 결제 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <Label htmlFor="fullName" className="text-black">이름 *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    className={`bg-white text-black border-gray-300 ${errors.fullName ? "border-destructive" : ""}`}
                    placeholder="이름"
                  />
                  {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-black">이메일 *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className={`bg-white text-black border-gray-300 ${errors.email ? "border-destructive" : ""}`}
                    placeholder="이메일"
                  />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <Label htmlFor="phone" className="text-black">전화번호 *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className={`bg-white text-black border-gray-300 ${errors.phone ? "border-destructive" : ""}`}
                    placeholder="전화번호"
                  />
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                </div>

                {/* Delivery Address */}
                <div>
                  <Label htmlFor="address" className="text-black">배송 주소 *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    className={`bg-white text-black border-gray-300 ${errors.address ? "border-destructive" : ""}`}
                    placeholder="배송 주소"
                    rows={3}
                  />
                  {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
                </div>

                {/* Quantity */}
                <div>
                  <Label className="text-black">수량</Label>
                  <div className="flex items-center space-x-3 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(-1)}
                      disabled={formData.quantity <= 1}
                      className="text-black border-gray-300"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-medium w-8 text-center text-black">{formData.quantity}</span>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => updateQuantity(1)}
                      className="text-black border-gray-300"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <Label htmlFor="paymentMethod" className="text-black">결제 방식 *</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                  >
                    <SelectTrigger className={`bg-white text-black border-gray-300 ${errors.paymentMethod ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="결제 방식을 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit-card">신용카드</SelectItem>
                      <SelectItem value="transfer">계좌이체</SelectItem>
                      <SelectItem value="cash-on-delivery">현금 배송수령</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && <p className="text-sm text-destructive mt-1">{errors.paymentMethod}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "처리중..." : "주문하기"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-0 bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">주문 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="relative w-16 h-16 overflow-hidden rounded">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-black text-pretty">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-600">{product.price}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-black">
                  <span>소계:</span>
                  <span>₩{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-black">
                  <span>수량:</span>
                  <span>{formData.quantity}</span>
                </div>
                <div className="flex justify-between text-sm text-black">
                  <span>배송료:</span>
                  <span className="text-green-600">무료</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between font-semibold text-lg text-black">
                    <span>합계:</span>
                    <span className="text-accent">₩{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-600 space-y-1">
                <p>• 모든 주문 배송료 무료</p>
                <p>• 30일 반품 정책</p>
                <p>• 1년 제품 보증</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
