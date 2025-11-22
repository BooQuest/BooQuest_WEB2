// 인스타 부업 가이드 페이지: 인트로 화면과 5단계 가이드 콘텐츠를 제공하는 독립 페이지
'use client';

import { useState, useEffect } from 'react';
import GuideIntro from '@/app/components/features/GuideIntro';
import InstaSideJobGuide from '@/app/components/features/InstaSideJobGuide';

// localStorage 키 상수
const STORAGE_KEY_STARTED = 'insta-guide-started';
const STORAGE_KEY_USER_NAME = 'insta-guide-user-name';
const STORAGE_KEY_CURRENT_STEP = 'insta-guide-current-step';

// 페이지 메타데이터는 layout.tsx나 부모에서 설정 필요 (클라이언트 컴포넌트에서는 불가)

// 인스타 부업 가이드 페이지 컴포넌트
export default function InstaSideJobPage() {
  // 가이드 시작 여부 상태 (초기값: localStorage에서 복원)
  const [started, setStarted] = useState(false);
  // 사용자 이름 상태 (초기값: localStorage에서 복원)
  const [userName, setUserName] = useState('');
  // 현재 단계 상태 (초기값: localStorage에서 복원)
  const [currentStep, setCurrentStep] = useState(0);
  // 클라이언트 사이드 마운트 여부 (hydration 에러 방지)
  const [mounted, setMounted] = useState(false);

  // 컴포넌트 마운트 시 localStorage에서 상태 복원
  useEffect(() => {
    setMounted(true);
    
    // localStorage에서 저장된 상태 불러오기
    const savedStarted = localStorage.getItem(STORAGE_KEY_STARTED);
    const savedUserName = localStorage.getItem(STORAGE_KEY_USER_NAME);
    const savedCurrentStep = localStorage.getItem(STORAGE_KEY_CURRENT_STEP);

    if (savedStarted === 'true' && savedUserName) {
      setStarted(true);
      setUserName(savedUserName);
      
      // 저장된 단계가 있으면 복원 (유효성 검사 포함)
      if (savedCurrentStep !== null) {
        const step = parseInt(savedCurrentStep, 10);
        if (!isNaN(step) && step >= 0) {
          setCurrentStep(step);
        }
      }
    }
  }, []);

  // 가이드 시작 핸들러
  const handleStart = (name: string) => {
    setUserName(name);
    setStarted(true);
    setCurrentStep(0); // 새로 시작할 때는 0단계부터
    
    // localStorage에 상태 저장
    localStorage.setItem(STORAGE_KEY_STARTED, 'true');
    localStorage.setItem(STORAGE_KEY_USER_NAME, name);
    localStorage.setItem(STORAGE_KEY_CURRENT_STEP, '0');
  };

  // hydration 완료 전에는 아무것도 렌더링하지 않음 (선택적)
  if (!mounted) {
    return null;
  }

  // 인트로 화면 (가이드 시작 전)
  if (!started) {
    return <GuideIntro onStart={handleStart} />;
  }

  // 가이드 화면 (가이드 시작 후)
  return (
    <InstaSideJobGuide
      userName={userName}
      initialStep={currentStep}
      onStepChange={setCurrentStep}
    />
  );
}
