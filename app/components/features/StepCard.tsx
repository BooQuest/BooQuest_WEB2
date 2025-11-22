// 단계 카드 컴포넌트: 개별 단계 정보를 표시하는 카드 UI
'use client';

import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { clsx } from '@/app/lib/utils/clsx';

// localStorage 키 상수
const STORAGE_KEY_STARTED = 'insta-guide-started';
const STORAGE_KEY_USER_NAME = 'insta-guide-user-name';
const STORAGE_KEY_CURRENT_STEP = 'insta-guide-current-step';

// 카드 내부 요소 애니메이션 variants
const cardContentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as const,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

// 단계 데이터 타입
export interface Step {
  id: number;
  title: string;
  description: string;
  duration: string;
  isOptional: boolean;
  icon: React.ElementType;
  gradient: string;
}

// StepCard 컴포넌트 Props
interface StepCardProps {
  step: Step;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onComplete?: () => void;
}

// 단계 카드 컴포넌트
export default function StepCard({
  step,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onComplete,
}: StepCardProps) {
  const Icon = step.icon;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  // 가이드 완료 핸들러
  const handleComplete = () => {
    // localStorage에서 가이드 관련 데이터 모두 삭제
    localStorage.removeItem(STORAGE_KEY_STARTED);
    localStorage.removeItem(STORAGE_KEY_USER_NAME);
    localStorage.removeItem(STORAGE_KEY_CURRENT_STEP);
    
    // 완료 콜백 호출 (팝업 표시)
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="h-full bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
      {/* 상단 그라데이션 바 */}
      <motion.div
        className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${step.gradient}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      {/* 카드 헤더 */}
      <motion.div
        className="space-y-5"
        variants={cardContentVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex justify-between items-start" variants={itemVariants}>
          <div className="flex-1">
            <motion.span
              className={`inline-block text-xs font-black tracking-wider bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent mb-2`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              STEP {step.id}
            </motion.span>
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {step.title}
            </motion.h2>
          </div>
          <motion.div
            className={`flex-shrink-0 p-4 rounded-2xl bg-gradient-to-br ${step.gradient} text-white shadow-lg`}
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Icon size={28} strokeWidth={2.5} />
          </motion.div>
        </motion.div>

        <motion.p
          className="text-lg sm:text-xl text-gray-700 font-medium leading-relaxed"
          variants={itemVariants}
        >
          {step.description}
        </motion.p>

        {step.isOptional && (
          <motion.div variants={itemVariants}>
            <motion.span
              className="inline-block px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-lg font-bold border border-blue-200"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              선택 사항
            </motion.span>
          </motion.div>
        )}
      </motion.div>

      {/* 콘텐츠 영역 (플레이스홀더) */}
      <motion.div
        className="flex-1 flex items-center justify-center my-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <motion.div
          className="w-full h-32 sm:h-40 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50/50"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4, ease: 'easeOut' }}
        >
          <p className="text-gray-400 text-sm font-medium">단계별 상세 내용 영역</p>
        </motion.div>
      </motion.div>

      {/* 네비게이션 버튼 */}
      <motion.div
        className="flex gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <motion.button
          whileHover={{ scale: isFirstStep ? 1 : 1.02 }}
          whileTap={{ scale: isFirstStep ? 1 : 0.98 }}
          onClick={onPrev}
          disabled={isFirstStep}
          className={clsx(
            'flex-1 py-4 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 border-2',
            isFirstStep
              ? 'text-gray-300 border-gray-200 cursor-not-allowed bg-gray-50'
              : 'text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          )}
        >
          <ChevronLeft size={18} />
          이전
        </motion.button>

            <motion.button
              whileHover={{ scale: isLastStep ? 1.02 : 1.03 }}
              whileTap={{ scale: isLastStep ? 0.98 : 0.97 }}
              onClick={isLastStep ? handleComplete : onNext}
              className={clsx(
                'flex-[2] py-4 rounded-2xl font-bold text-sm text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2',
                isLastStep
                  ? `bg-gradient-to-r ${step.gradient} hover:shadow-xl cursor-pointer`
                  : `bg-gradient-to-r ${step.gradient} hover:shadow-xl`
              )}
            >
              {isLastStep ? (
                <>
                  <CheckCircle2 size={18} />
                  완료!
                </>
              ) : (
                <>
                  다음 단계
                  <ChevronRight size={18} />
                </>
              )}
            </motion.button>
      </motion.div>
    </div>
  );
}

