import React from 'react';
import { Header } from '@/components/header';

export default function ProjectPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#4C050C]">
      <Header />
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center pt-24">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">프로젝트</h1>
        <p className="text-lg md:text-xl text-[#4C050C]/70 max-w-2xl">
          파인드카테고리가 전개하는 다양한 프로젝트를 준비 중입니다.<br />
          곧 찾아뵙겠습니다.
        </p>
      </main>
    </div>
  );
}
