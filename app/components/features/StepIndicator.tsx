// 단계 인디케이터 컴포넌트: 하단 단계 표시 점들
'use client';

import { motion } from 'framer-motion';

// StepIndicator 컴포넌트 Props
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  currentGradient: string;
  direction: number; // -1: 이전, 1: 다음
}

// 카드와 동일한 애니메이션 variants (스케일 조정)
const indicatorVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 20 : -20,
    opacity: 0,
    scale: 0.8,
  }),
};

// 단계 인디케이터 컴포넌트
export default function StepIndicator({
  currentStep,
  totalSteps,
  currentGradient,
  direction,
}: StepIndicatorProps) {
  return (
    <div className="flex justify-center items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index === currentStep;
        
        if (isActive) {
          return (
            <motion.div
              key={index}
              custom={direction}
              variants={indicatorVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 200, damping: 25 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
              }}
              className={`h-2 rounded-full w-8 bg-gradient-to-r ${currentGradient}`}
              layout
            />
          );
        }
        
        return (
          <motion.div
            key={index}
            className="h-2 w-2 rounded-full bg-gray-300"
            layout
            transition={{ duration: 0.2 }}
          />
        );
      })}
    </div>
  );
}

