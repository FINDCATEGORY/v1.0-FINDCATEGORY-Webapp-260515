import type React from "react"
import type { Metadata } from "next"
import { LanguageProvider } from "@/components/detail/context/language-context"
import { CartProvider } from "@/components/detail/ui/cart-context" // 추가
import { CartSidebar } from "@/components/detail/ui/cart-sidebar" // 추가

export const metadata: Metadata = {
  title: "FINDCATEGORY",
  description: "FINDCATEGORY - 시나리오 라이프스타일 스토어",
}

export default function DetailLayout({ children }: { children: React.ReactNode }) {
  return (

        <LanguageProvider>
          <CartProvider>
            <CartSidebar />
            {children}
          </CartProvider>
        </LanguageProvider>

  )
}