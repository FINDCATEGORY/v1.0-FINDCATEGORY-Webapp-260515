"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AuthCard } from "@/components/auth/auth-card";
import { useToast } from "@/components/ui/use-toast";

export function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(!isLoggedIn);
      toast({ title: isLoggedIn ? "로그아웃 되었습니다." : "로그인 되었습니다!" });
    }, 1500);
  };

  // Hydration 오류 방지를 위한 마운트 체크
  if (!isMounted) {
    return (
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl h-14 bg-transparent" />
    );
  }

  return (
    <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md rounded-full" : "bg-transparent"}`}>
      <div className="flex items-center justify-between px-5 py-2">
        <Link href="/" className="text-lg font-medium tracking-tight">FINDCATEGORYⓇ</Link>

        {/* 페이지 이동 메뉴 */}
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/product" className="text-sm text-muted-foreground hover:text-foreground">product</Link>
          <Link href="/shopping" className="text-sm text-muted-foreground hover:text-foreground">Shopping</Link>
          <Link href="/spaceplanning" className="text-sm text-muted-foreground hover:text-foreground">Space Planning</Link>       
        </nav>

        {/* 로그인/로그아웃 버튼 */}
        <div className="hidden md:flex items-center">
          {isLoggedIn ? (
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="px-4 py-2 text-sm font-medium rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <button className="px-4 py-2 text-sm font-medium rounded-full bg-foreground text-background hover:opacity-80 transition-opacity">
                  Join
                </button>
              </DialogTrigger>
              <DialogContent className="p-0 border-none bg-transparent shadow-none flex items-center justify-center outline-none">
                <DialogTitle className="sr-only">Auth</DialogTitle>
                <DialogDescription className="sr-only">Sign in or Join</DialogDescription>
                <DialogClose className="absolute -top-4 -right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white z-[60]">
                  <X size={20} />
                </DialogClose>
                <AuthCard onSignIn={handleAuth} onSignUp={handleAuth} isLoading={isLoading} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/90 backdrop-blur-md px-6 py-8 rounded-b-2xl">
          <nav className="flex flex-col gap-6">
            <Link href="/product" onClick={() => setIsMenuOpen(false)}>Product</Link>
            <Link href="/shopping" onClick={() => setIsMenuOpen(false)}>Shopping</Link>
            <Link href="/spaceplanning" onClick={() => setIsMenuOpen(false)}>Space Planning</Link>
          </nav>
        </div>
      )}
    </header>
  );
}