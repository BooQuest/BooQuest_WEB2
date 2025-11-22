// 인스타 부업 가이드 컴포넌트: 5단계 가이드 콘텐츠를 인터랙티브한 카드 형태로 제공
// 사용자 친화적이고 자연스러운 애니메이션으로 정보 전달
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from '@/app/lib/utils/clsx';
import ProgressBar from '@/app/components/ui/ProgressBar';
import StepCard from '@/app/components/features/StepCard';
import GuideHeader from '@/app/components/features/GuideHeader';
import StepIndicator from '@/app/components/features/StepIndicator';
import GuideBackground from '@/app/components/features/GuideBackground';
import { GUIDE_STEPS } from '@/app/lib/constants/guideSteps';

// 컴포넌트 Props 인터페이스
interface InstaSideJobGuideProps {
  userName?: string;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  className?: string;
}

// localStorage 키 상수
const STORAGE_KEY_CURRENT_STEP = 'insta-guide-current-step';

// 인스타 부업 가이드 메인 컴포넌트
export default function InstaSideJobGuide({
  userName,
  initialStep = 0,
  onStepChange,
  className,
}: InstaSideJobGuideProps) {
  const router = useRouter();
  // 현재 활성화된 단계
  const [currentStep, setCurrentStep] = useState(initialStep);
  // 슬라이드 방향 (-1: 이전, 1: 다음)
  const [direction, setDirection] = useState(0);

  // 가이드 단계 데이터
  const steps = GUIDE_STEPS;

  // 단계 변경 핸들러 (localStorage 저장 + 콜백 호출)
  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    // localStorage에 현재 단계 저장
    localStorage.setItem(STORAGE_KEY_CURRENT_STEP, newStep.toString());
    // 부모 컴포넌트에 변경 알림
    if (onStepChange) {
      onStepChange(newStep);
    }
  };

  // 다음 단계로 이동
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  // 이전 단계로 이동
  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  // 카드 슬라이드 애니메이션 설정 (Spring 물리 엔진 사용)
  const cardVariants = {
    enter: (direction: number) => {
      // 첫 렌더링 시 (direction === 0) 아래에서 위로 나타남
      if (direction === 0) {
        return {
          y: 50,
          opacity: 0,
          scale: 0.9,
        };
      }
      // 다음/이전 단계 이동 시
      return {
        x: direction > 0 ? 400 : -400,
        opacity: 0,
        scale: 0.85,
        rotateY: direction > 0 ? 15 : -15,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 400 : -400,
      opacity: 0,
      scale: 0.85,
      rotateY: direction < 0 ? -15 : 15,
    }),
  };

  // 시간 계산 헬퍼 함수: "3분 소요" -> 3
  const extractMinutes = (duration: string): number => {
    const match = duration.match(/(\d+)분/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // 전체 시간 계산 (모든 단계의 시간 합)
  const totalMinutes = steps.reduce((sum, step) => sum + extractMinutes(step.duration), 0);

  // 현재까지 완료한 시간 계산 (현재 단계 이전까지의 시간 합)
  const completedMinutes = steps
    .slice(0, currentStep)
    .reduce((sum, step) => sum + extractMinutes(step.duration), 0);

  // 남은 시간 계산
  const remainingMinutes = totalMinutes - completedMinutes;

  // 시간 기반 진행률 계산
  const progress = (completedMinutes / totalMinutes) * 100;

  return (
    <div className={clsx('min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden', className)}>
      
      {/* 배경 그라데이션 (오로라 효과) */}
      <GuideBackground />

      {/* 메인 콘텐츠 컨테이너 */}
      <div className="w-full max-w-lg z-10 space-y-8">
        
        {/* 헤더 */}
        <GuideHeader
          title="인스타 부업 시작하기"
          description="회원가입부터 첫 업로드까지"
        />

        {/* 진행 상태바 컴포넌트 (배지 + 시간 정보 포함) */}
        <ProgressBar
          currentStep={currentStep}
          totalSteps={steps.length}
          stepTitle={steps[currentStep].title}
          currentGradient={steps[currentStep].gradient}
          steps={steps.map(step => ({ gradient: step.gradient }))}
          completedMinutes={completedMinutes}
          remainingMinutes={remainingMinutes}
          totalMinutes={totalMinutes}
        />

        {/* 카드 슬라이더 영역 */}
        <div className="relative overflow-visible">
          <AnimatePresence initial={true} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 150, damping: 20, mass: 0.8 },
                y: { type: "spring", stiffness: 150, damping: 20, mass: 0.8 },
                opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                scale: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                rotateY: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
              }}
              className="relative w-full"
              style={{ perspective: 1000 }}
            >
                  <StepCard
                    step={steps[currentStep]}
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onComplete={() => router.push('/contents/insta-side-job/complete')}
                  />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 하단 인디케이터 */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={steps.length}
          currentGradient={steps[currentStep].gradient}
          direction={direction}
        />
      </div>

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

