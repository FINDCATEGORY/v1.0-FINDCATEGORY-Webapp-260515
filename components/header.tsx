"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 50);

      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isMounted) {
    return <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl h-14 bg-transparent" />;
  }

  const headerBgClass = isMenuOpen
    ? "bg-[#EBEBDF]/95 backdrop-blur-md rounded-2xl shadow-lg"
    : isScrolled
      ? "bg-[#EBEBDF]/80 backdrop-blur-md rounded-full shadow-md"
      : "bg-transparent rounded-full";

  return (
    <header className={`fixed left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl transition-all duration-300 ease-in-out flex flex-col ${headerBgClass} ${isVisible ? "top-4 opacity-100" : "top-0 opacity-0 pointer-events-none"}`}>
      <div className="flex items-center justify-between px-5 py-3">
        <Link href="/" className="text-lg font-medium tracking-tight text-[#4C050C]">FINDCATEGORYⓇ</Link>

        <nav className="hidden md:flex items-center gap-10">
          <Link href="/category" className="text-sm text-[#4C050C]/70 hover:text-[#4C050C]">제품과소식</Link>
          <Link href="/project" className="text-sm text-[#4C050C]/70 hover:text-[#4C050C]">프로젝트</Link>
        </nav>

        <div className="hidden md:flex items-center">
          {/* 모달 대신 페이지 이동으로 변경 */}
          <button
            onClick={() => router.push('/chat')}
            className="px-4 py-2 text-sm rounded-full bg-[#4C050C] text-[#EBEBDF] hover:opacity-80 transition-opacity"
          >
            Talk to AI
          </button>
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-[#4C050C]">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-[#4C050C]/10 px-6 py-6">
          <nav className="flex flex-col gap-6 text-[#4C050C]">
            <Link href="/category" onClick={() => setIsMenuOpen(false)} className="font-medium">제품과소식</Link>
            <Link href="/project" onClick={() => setIsMenuOpen(false)} className="font-medium">프로젝트</Link>

            <div className="w-full h-px bg-[#4C050C]/10 my-2" />

            <button
              onClick={() => {
                setIsMenuOpen(false);
                router.push('/chat');
              }}
              className="w-full py-3 text-sm font-medium rounded-full bg-[#4C050C] text-[#EBEBDF] hover:opacity-80 transition-opacity"
            >
              Talk to AI
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}