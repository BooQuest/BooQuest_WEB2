// 가이드 배경 컴포넌트: 오로라 효과 배경
'use client';

// GuideBackground 컴포넌트
export default function GuideBackground() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
    </div>
  );
}

