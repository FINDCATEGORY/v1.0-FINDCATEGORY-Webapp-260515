"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ArrowUpRight } from "lucide-react"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "HOME", href: "#home" },
    { name: "ABOUT", href: "#about" },
    { name: "WORKS", href: "#works" },
    { name: "SERVICES", href: "#services" },
    { name: "BLOG", href: "#blog" },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div
        className={`mx-auto max-w-7xl transition-all duration-300 ${
          scrolled
            ? "mt-4 mx-4 px-6 py-2 shadow-lg bg-background/95 backdrop-blur-md rounded-lg"
            : "px-6 py-4 bg-background/90 backdrop-blur-md mx-4"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`font-bold text-foreground transition-all duration-300 ${scrolled ? "text-xl" : "text-2xl"}`}
          >
            Genai
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors cursor-pointer"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="hidden md:flex items-center gap-2 rounded-full border border-foreground px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors cursor-pointer"
          >
            Let&apos;s talk
            <ArrowUpRight className="h-4 w-4" />
          </a>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-6">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors cursor-pointer"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="flex items-center gap-2 rounded-full border border-foreground px-5 py-2.5 text-sm font-medium text-foreground w-fit cursor-pointer"
              >
                Let&apos;s talk
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
