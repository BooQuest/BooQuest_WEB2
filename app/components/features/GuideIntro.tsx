'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { clsx } from '@/app/lib/utils/clsx';
import GuideBackground from './GuideBackground';
import { GUIDE_STEPS } from '@/app/lib/constants/guideSteps';

// GuideIntro 컴포넌트 Props
interface GuideIntroProps {
  onStart: (name: string) => void;
  className?: string;
}

// 가이드 시작 인트로 컴포넌트
export default function GuideIntro({ onStart, className }: GuideIntroProps) {
  const [name, setName] = useState('');

  // 시작하기 버튼 클릭 핸들러
  const handleStart = () => {
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  // Enter 키 입력 핸들러
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      handleStart();
    }
  };

  return (
    <div className={clsx('min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden', className)}>
      
      {/* 배경 그라데이션 */}
      <GuideBackground />

      {/* 메인 콘텐츠 */}
      <motion.div
        className="w-full max-w-2xl z-10 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        
        {/* 헤더 */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.span
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            ⚡ 20분 완성 가이드
          </motion.span>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            인스타 부업 시작하기
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-500 font-normal leading-relaxed">
            고민만 하셨나요? 이제 시작하세요.
            <br />
            AI 도움으로{' '}
            <span className="font-bold text-gray-700">
              20분만에 회원 가입부터 첫 게시물 업로드까지
            </span>{' '}
            완성
          </p>
        </motion.div>

        {/* 메인 카드 */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl p-8 sm:p-10 space-y-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          
          {/* 5단계 목차 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              🚀 5단계만 따라하면 끝! 어려운 건 AI가 도와줄게요
            </h2>
            
            <div className="space-y-3">
              {GUIDE_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white shadow-md`}>
                      <Icon size={20} strokeWidth={2.5} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">
                          {step.title}
                        </span>
                        {step.isOptional && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-md font-semibold">
                            선택
                          </span>
                        )}
                      </div>
                      {/* <span className="text-xs text-gray-500">
                        {step.description}
                      </span> */}
                    </div>
                    
                    <span className="text-xs font-semibold text-gray-400">
                      {step.duration.replace(' 소요', '')}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t border-gray-200" />

          {/* 이름 입력 및 시작 버튼 */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            <div className="space-y-2">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="이름 또는 닉네임"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-900 placeholder-gray-400 font-medium"
                autoComplete="off"
              />
            </div>

            <motion.button
              onClick={handleStart}
              disabled={!name.trim()}
              className={clsx(
                'w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2',
                name.trim()
                  ? 'bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 hover:shadow-xl hover:scale-[1.02]'
                  : 'bg-gray-300 cursor-not-allowed'
              )}
              whileHover={name.trim() ? { scale: 1.02 } : {}}
              whileTap={name.trim() ? { scale: 0.98 } : {}}
            >
              시작하기
              <ChevronRight size={20} strokeWidth={3} />
            </motion.button>
          </motion.div>

        </motion.div>

      </motion.div>

      {/* 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

