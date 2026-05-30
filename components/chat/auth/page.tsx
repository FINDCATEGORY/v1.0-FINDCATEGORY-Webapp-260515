"use client";

import { useState } from "react";
import { AuthCard } from "@/components/chat/auth/auth-card";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  // AuthCard Props에 맞춰 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <AuthCard 
        isLoading={isLoading}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        onSignIn={handleAuth}
        onSignUp={handleAuth}
        onSocialLogin={(p) => console.log(p)}
        onForgotPassword={() => {}}
      />
    </main>
  );
}