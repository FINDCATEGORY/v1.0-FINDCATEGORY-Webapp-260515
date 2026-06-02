import React from "react"
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/components/detail/ui/cart-context'
import { CartSidebar } from '@/components/detail/ui/cart-sidebar'
import { CartCheckoutModal } from '@/components/detail/ui/cart-checkout-modal'
import './globals.css'

export const metadata: Metadata = {
  title: 'FINDACETGORYⓇ',
  description: 'High-performance outdoor gear engineered for the modern explorer. Lightweight, durable, adventure-ready.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <CartProvider>
          <CartSidebar />
          <CartCheckoutModal />
          {children}
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}