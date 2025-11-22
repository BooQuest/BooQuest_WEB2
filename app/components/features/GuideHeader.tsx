// 가이드 헤더 컴포넌트: 페이지 상단 타이틀 영역
'use client';

import { motion } from 'framer-motion';

// GuideHeader 컴포넌트 Props
interface GuideHeaderProps {
  badge?: string;
  title: string;
  description?: string;
}

// GuideHeader 컴포넌트
export default function GuideHeader({ badge, title, description }: GuideHeaderProps) {
  return (
    <motion.div
      className="text-center space-y-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {badge && (
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-white/80 text-xs font-bold text-purple-700 shadow-sm">
          {badge}
        </span>
      )}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="text-gray-600 text-base sm:text-lg font-medium">
          {description}
        </p>
      )}
    </motion.div>
  );
}

