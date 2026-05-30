"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isMounted) {
    return <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl h-14 bg-transparent" />;
  }

  return (
    <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md rounded-full" : "bg-transparent"}`}>
      <div className="flex items-center justify-between px-5 py-2">
        <Link href="/" className="text-lg font-medium tracking-tight">FINDCATEGORYⓇ</Link>

        <nav className="hidden md:flex items-center gap-10">
          <Link href="/category" className="text-sm text-muted-foreground hover:text-foreground">제품과소식</Link>
          <Link href="/project" className="text-sm text-muted-foreground hover:text-foreground">프로젝트</Link>       
        </nav>

        <div className="hidden md:flex items-center">
          {/* 모달 대신 페이지 이동으로 변경 */}
          <button 
            onClick={() => router.push('/chat')} 
            className="px-4 py-2 text-sm font-medium rounded-full bg-foreground text-background hover:opacity-80 transition-opacity"
          >
            Talk to us
          </button>
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/90 backdrop-blur-md px-6 py-8 rounded-b-2xl">
          <nav className="flex flex-col gap-6">
            <Link href="/category" onClick={() => setIsMenuOpen(false)}>제품과소식</Link>
            <Link href="/project" onClick={() => setIsMenuOpen(false)}>프로젝트</Link>
          </nav>
        </div>
      )}
    </header>
  );
}