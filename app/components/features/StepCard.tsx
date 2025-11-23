// 단계 카드 컴포넌트: 개별 단계 정보를 표시하는 카드 UI
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, Image as ImageIcon, Video, Maximize2, X, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
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

// 이미지 데이터 타입
export interface ImageData {
  src: string; // 이미지 경로
  title: string; // 이미지 제목
}

// 입력 필드 타입
export interface InputField {
  type: 'text' | 'textarea';
  label: string;
  placeholder: string;
  key: string; // localStorage 키
}

// 하위 단계 데이터 타입
export interface SubStep {
  id: number;
  title: string;
  description: string;
  images?: ImageData[] | string[]; // 이미지 데이터 배열 또는 경로 배열 (하위 호환성)
  video?: string; // 영상 경로
  links?: {
    android?: string;
    ios?: string;
  };
  inputFields?: InputField[]; // 입력 폼 필드
  canvaLink?: string; // Canva 링크
  aiRecommendation?: {
    enabled: boolean;
    exampleData: string; // 예시 데이터
    description: string; // 설명 텍스트
  };
  // 4단계 콘텐츠 제작 관련 필드
  difficulty?: string; // 난이도 ("쉬움", "중간", "어려움")
  initialRecommendations?: string[]; // 먼저 추천하는 방법들 (첫 번째 탭에만)
  contentRecommendations?: Array<{
    title: string;
    examples: string[];
  }>; // 추천 콘텐츠 목록
}

// 목적 선택지 타입
export interface Purpose {
  id: string;
  title: string;
  description: string;
  icon: string; // 이모지 또는 아이콘
}

// 단계 데이터 타입
export interface Step {
  id: number;
  title: string;
  description: string;
  duration: string;
  isOptional: boolean;
  icon: React.ElementType;
  gradient: string;
  images?: string[]; // 이미지 경로 배열 (하위 단계가 없을 때 사용)
  video?: string; // 영상 경로 (하위 단계가 없을 때 사용)
  subSteps?: SubStep[]; // 하위 단계 배열
  purposeSelection?: boolean; // 목적 선택 화면 표시 여부
  purposes?: Purpose[]; // 목적 선택지 배열
  purposeSubSteps?: {
    [purposeId: string]: SubStep[]; // 각 목적별 하위 단계
  };
  // 4단계 콘텐츠 제작 공통 정보
  decorationMethods?: Array<{
    title: string;
    description: string;
  }>; // 콘텐츠 꾸미는 방법 (공통)
  aiTools?: Array<{
    name: string;
    description: string;
    link: string;
    isFree?: boolean;
    category?: '이미지' | '영상';
  }>; // AI 도구 추천 (공통)
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
  
  // 목적 선택 상태 (2단계용)
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  // 하위 단계 인덱스 (하위 단계가 있는 경우)
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState(0);
  // 입력 필드 값 상태 (key: value 형태)
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  // 이미지/영상 탭 상태
  const [activeTab, setActiveTab] = useState<'images' | 'video'>('images');
  // 현재 이미지 인덱스
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // 전체 화면 모드 (이미지용)
  const [isFullscreen, setIsFullscreen] = useState(false);
  // 영상 전체 화면 모드
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  // 클라이언트 사이드 마운트 여부
  const [mounted, setMounted] = useState(false);
  // 4단계 공통 정보 접기/펼치기 상태
  const [isDecorationMethodsOpen, setIsDecorationMethodsOpen] = useState(false);
  const [isAiToolsOpen, setIsAiToolsOpen] = useState(false);

  // 클라이언트 사이드 마운트 확인 및 localStorage에서 목적 복원
  useEffect(() => {
    setMounted(true);
    
    // 목적 선택 단계인 경우, localStorage에서 저장된 목적 불러오기
    if (step.purposeSelection) {
      const savedPurpose = localStorage.getItem(`insta-guide-step${step.id}-purpose`);
      if (savedPurpose) {
        setSelectedPurpose(savedPurpose);
      }
    }
    
    // 4단계(콘텐츠 제작)일 때 2단계에서 선택한 목적 불러오기
    if (step.id === 4 && step.purposeSubSteps) {
      const savedPurpose = localStorage.getItem('insta-guide-step2-purpose');
      if (savedPurpose) {
        setSelectedPurpose(savedPurpose);
      }
    }
  }, [step.id, step.purposeSelection, step.purposeSubSteps]);

  // 입력 필드 값 복원 (하위 단계 인덱스가 변경될 때마다)
  useEffect(() => {
    // activeSubSteps 계산
    const activeSubSteps = step.purposeSelection && selectedPurpose && step.purposeSubSteps
      ? step.purposeSubSteps[selectedPurpose]
      : step.subSteps;
    
    // currentSubStep 계산
    const currentSubStep = activeSubSteps?.[currentSubStepIndex];
    
    if (currentSubStep?.inputFields) {
      const loadedValues: { [key: string]: string } = {};
      currentSubStep.inputFields.forEach((field) => {
        const savedValue = localStorage.getItem(`insta-guide-step${step.id}-${field.key}`);
        if (savedValue) {
          loadedValues[field.key] = savedValue;
        }
      });
      setInputValues(loadedValues);
    }
  }, [currentSubStepIndex, selectedPurpose, step.id, step.purposeSelection, step.purposeSubSteps, step.subSteps]);

  // 입력 필드 값 변경 핸들러
  const handleInputChange = (key: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [key]: value }));
    // localStorage에 저장
    localStorage.setItem(`insta-guide-step${step.id}-${key}`, value);
  };

  // 목적 선택 핸들러
  const handlePurposeSelect = (purposeId: string) => {
    setSelectedPurpose(purposeId);
    setCurrentSubStepIndex(0); // 하위 단계 인덱스 초기화
    // localStorage에 저장
    localStorage.setItem(`insta-guide-step${step.id}-purpose`, purposeId);
  };

  // 가이드 완료 핸들러
  const handleComplete = () => {
    // 완료 페이지로 이동 (이름은 완료 페이지에서 사용 후 정리)
    if (onComplete) {
      onComplete();
    }
    
    // 완료 페이지로 이동한 후 localStorage 정리
    // 이름은 완료 페이지에서 먼저 가져온 후에 지워야 함
    setTimeout(() => {
      // insta-guide-로 시작하는 모든 키 삭제
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('insta-guide-')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }, 100);
  };

  // 다음 이미지로 이동
  const handleNextImage = () => {
    if (displayImages && currentImageIndex < displayImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // 이전 이미지로 이동
  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // 전체 화면 토글
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // 탭 변경 시 이미지 인덱스 리셋
  const handleTabChange = (tab: 'images' | 'video') => {
    setActiveTab(tab);
    setCurrentImageIndex(0);
  };

  // 영상 전체 화면 토글
  const toggleVideoFullscreen = () => {
    setIsVideoFullscreen(!isVideoFullscreen);
  };

  // 이미지 데이터를 정규화하는 함수 (문자열 배열 또는 ImageData 배열 모두 처리)
  const normalizeImages = (images?: (string | ImageData)[]): ImageData[] | undefined => {
    if (!images) return undefined;
    return images.map((img) => {
      if (typeof img === 'string') {
        return { src: img, title: '' };
      }
      return img;
    });
  };

  // 현재 표시할 하위 단계 결정
  // 목적 선택이 있는 경우 또는 4단계처럼 purposeSubSteps만 있는 경우, 선택된 목적의 하위 단계 사용
  const activeSubSteps = (step.purposeSelection || (step.purposeSubSteps && selectedPurpose)) && selectedPurpose && step.purposeSubSteps
    ? step.purposeSubSteps[selectedPurpose]
    : step.subSteps;
  
  // 현재 표시할 하위 단계 또는 메인 단계 데이터
  const currentSubStep = activeSubSteps?.[currentSubStepIndex];
  const displayImages = normalizeImages(currentSubStep?.images || step.images);
  const displayVideo = currentSubStep?.video || step.video;
  const hasSubSteps = activeSubSteps && activeSubSteps.length > 0;
  
  // 현재 이미지 데이터
  const currentImage = displayImages?.[currentImageIndex];
  
  // 목적 선택 화면 표시 여부
  const showPurposeSelection = step.purposeSelection && !selectedPurpose;

  return (
    <>
      {/* 브라우저 전체 화면 뷰어 */}
      <AnimatePresence>
        {isFullscreen && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              className="fixed inset-0 z-[9999] bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleFullscreen}
            />
            
            {/* 전체 화면 콘텐츠 */}
            <motion.div
              className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors z-[100001]"
              style={{ zIndex: 100001 }}
            >
              <X size={24} className="text-white" />
            </button>

              {activeTab === 'images' && displayImages && displayImages.length > 0 && (
                <>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={currentImage?.src || ''}
                      alt={currentImage?.title || `${step.title} ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain"
                      style={{ maxWidth: '100vw', maxHeight: '100vh' }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>
                  
                  {displayImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevImage();
                        }}
                        disabled={currentImageIndex === 0}
                        className={clsx(
                          'absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors',
                          currentImageIndex === 0 && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <ChevronLeft size={28} className="text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextImage();
                        }}
                        disabled={currentImageIndex === (displayImages?.length || 0) - 1}
                        className={clsx(
                          'absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors',
                          currentImageIndex === (displayImages?.length || 0) - 1 && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <ChevronRight size={28} className="text-white" />
                      </button>
                      {/* 상단 이미지 개수 표시 */}
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-base font-semibold">
                        {currentImageIndex + 1} / {displayImages.length}
                      </div>
                      {/* 하단 이미지 개수 표시 */}
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-base font-semibold">
                        {currentImageIndex + 1} / {displayImages.length}
                      </div>
                    </>
                  )}
                </>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 브라우저 전체 화면 뷰어 (영상용) */}
      <AnimatePresence>
        {isVideoFullscreen && displayVideo && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              className="fixed inset-0 z-[9999] bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleVideoFullscreen}
            />
            
            {/* 전체 화면 콘텐츠 */}
            <motion.div
              className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
            <button
              onClick={toggleVideoFullscreen}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors z-[100001]"
              style={{ zIndex: 100001 }}
            >
              <X size={24} className="text-white" />
            </button>

            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <video
                src={displayVideo}
                controls
                className="w-full h-full object-contain"
                style={{ maxWidth: '100vw', maxHeight: '100vh' }}
                autoPlay
                playsInline
              >
                브라우저가 비디오 태그를 지원하지 않습니다.
              </video>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="min-h-full bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col relative group">
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
              className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {step.title}
              {step.isOptional && (
                <motion.span
                  className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-md font-semibold"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  선택
                </motion.span>
              )}
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
      </motion.div>

          {/* 콘텐츠 영역 */}
          <motion.div
            className="flex-1 flex flex-col my-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            {/* 목적 선택 화면 (2단계 전용) */}
            {showPurposeSelection && step.purposes && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  어떤 목적으로 인스타를 시작하시나요?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {step.purposes.map((purpose) => (
                    <motion.button
                      key={purpose.id}
                      onClick={() => handlePurposeSelect(purpose.id)}
                      className="p-6 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + parseInt(purpose.id) * 0.1, duration: 0.3 }}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-4xl">{purpose.icon}</span>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-1">
                            {purpose.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {purpose.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 공통 정보: 꾸미는 방법 (4단계, 탭 위에 표시) */}
            {!showPurposeSelection && step.id === 4 && step.decorationMethods && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.3 }}
              >
                <button
                  onClick={() => setIsDecorationMethodsOpen(!isDecorationMethodsOpen)}
                  className="w-full flex items-center justify-between text-base font-bold text-gray-900 mb-3 hover:text-gray-700 transition-colors"
                >
                  <span>🎨 콘텐츠 꾸미는 방법</span>
                  {isDecorationMethodsOpen ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </button>
                <AnimatePresence>
                  {isDecorationMethodsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {step.decorationMethods.map((method, index) => (
                          <div
                            key={index}
                            className="p-3 bg-purple-50 border border-purple-200 rounded-lg"
                          >
                            <h5 className="text-sm font-bold text-gray-900 mb-1">
                              {method.title}
                            </h5>
                            <p className="text-xs text-gray-600">
                              {method.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* 공통 정보: AI 도구 추천 (4단계, 탭 위에 표시) */}
            {!showPurposeSelection && step.id === 4 && step.aiTools && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                <button
                  onClick={() => setIsAiToolsOpen(!isAiToolsOpen)}
                  className="w-full flex items-center justify-between text-base font-bold text-gray-900 mb-3 hover:text-gray-700 transition-colors"
                >
                  <span>🤖 AI로 이미지/영상 만들기</span>
                  {isAiToolsOpen ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </button>
                <AnimatePresence>
                  {isAiToolsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden space-y-4"
                    >
                      {/* 이미지 AI 도구 */}
                      {step.aiTools?.filter(tool => tool.category === '이미지').length > 0 && (
                        <div>
                          <h5 className="text-sm font-bold text-gray-700 mb-2">📷 이미지</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {step.aiTools
                              .filter(tool => tool.category === '이미지')
                              .map((tool, index) => (
                                <motion.a
                                  key={index}
                                  href={tool.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg hover:shadow-md transition-all"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div className="flex items-start justify-between mb-1">
                                    <h5 className="text-sm font-bold text-gray-900">
                                      {tool.name}
                                    </h5>
                                    <ExternalLink size={14} className="text-gray-400" />
                                  </div>
                                  <p className="text-xs text-gray-600 mb-2">
                                    {tool.description}
                                  </p>
                                  {tool.isFree !== undefined && (
                                    <span className={clsx(
                                      'inline-block text-xs px-2 py-0.5 rounded-full font-semibold',
                                      tool.isFree
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-orange-100 text-orange-700'
                                    )}>
                                      {tool.isFree ? '무료 체험 가능' : '유료'}
                                    </span>
                                  )}
                                </motion.a>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* 영상 AI 도구 */}
                      {step.aiTools?.filter(tool => tool.category === '영상').length > 0 && (
                        <div>
                          <h5 className="text-sm font-bold text-gray-700 mb-2">🎬 영상</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {step.aiTools
                              .filter(tool => tool.category === '영상')
                              .map((tool, index) => (
                                <motion.a
                                  key={index}
                                  href={tool.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg hover:shadow-md transition-all"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div className="flex items-start justify-between mb-1">
                                    <h5 className="text-sm font-bold text-gray-900">
                                      {tool.name}
                                    </h5>
                                    <ExternalLink size={14} className="text-gray-400" />
                                  </div>
                                  <p className="text-xs text-gray-600 mb-2">
                                    {tool.description}
                                  </p>
                                  {tool.isFree !== undefined && (
                                    <span className={clsx(
                                      'inline-block text-xs px-2 py-0.5 rounded-full font-semibold',
                                      tool.isFree
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-orange-100 text-orange-700'
                                    )}>
                                      {tool.isFree ? '무료 체험 가능' : '유료'}
                                    </span>
                                  )}
                                </motion.a>
                              ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}


            {/* 하위 단계 네비게이션 (목적 선택 후 표시, 2개 이상일 때만) */}
            {!showPurposeSelection && hasSubSteps && activeSubSteps && activeSubSteps.length > 1 && (
              <motion.div
                className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.3 }}
              >
                {activeSubSteps.map((subStep, index) => (
                  <button
                    key={subStep.id}
                    onClick={() => {
                      setCurrentSubStepIndex(index);
                      setCurrentImageIndex(0);
                      setActiveTab('images');
                    }}
                    className={clsx(
                      'flex-shrink-0 px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap flex items-center gap-1.5',
                      currentSubStepIndex === index
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    {subStep.id}. {subStep.title}
                    {subStep.difficulty && (
                      <span className="text-xs font-medium ml-1 opacity-80">
                        ({subStep.difficulty})
                      </span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}

            {/* 하위 단계 제목 및 설명 (목적 선택 후 표시) */}
            {!showPurposeSelection && currentSubStep && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                {/* 이미지가 있고 제목이 있는 경우에만 설명 표시 (이미지 제목으로 대체) */}
                {(!displayImages || displayImages.length === 0 || !currentImage?.title) && (
                  <p className="text-base text-gray-600">
                    {currentSubStep.description}
                  </p>
                )}
              </motion.div>
            )}
            {/* 영상 버튼 (영상이 있는 경우) - 타이틀 위로 이동 */}
            {!showPurposeSelection && displayVideo && displayImages && displayImages.length > 0 && (
              <motion.div
                className="mb-2 flex justify-end"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                <button
                  onClick={toggleVideoFullscreen}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg"
                >
                  <Video size={16} />
                  영상
                </button>
              </motion.div>
            )}

            {/* 현재 이미지 제목 표시 (이미지가 있고 제목이 있는 경우) */}
            {!showPurposeSelection && displayImages && displayImages.length > 0 && currentImage?.title && (
              <motion.div
                className="mb-4 relative flex items-center justify-center gap-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.3 }}
                key={currentImageIndex} // 이미지 변경 시 애니메이션 재생
              >
                {/* 왼쪽 네비게이션 아이콘 */}
                <button
                  onClick={handlePrevImage}
                  disabled={currentImageIndex === 0}
                  className={clsx(
                    'flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors',
                    currentImageIndex === 0 && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <ChevronLeft size={20} className="text-gray-700" />
                </button>

                {/* 가운데 타이틀 및 페이지 정보 */}
                <div className="flex-1 text-center">
                  <p className="text-lg font-semibold text-gray-800">
                    {currentImage.title}
                  </p>
                  {displayImages.length > 1 && (
                    <p className="text-sm text-gray-500 mt-1">
                      ({currentImageIndex + 1} / {displayImages.length})
                    </p>
                  )}
                </div>

                {/* 오른쪽 네비게이션 아이콘 */}
                <button
                  onClick={handleNextImage}
                  disabled={currentImageIndex === (displayImages?.length || 0) - 1}
                  className={clsx(
                    'flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors',
                    currentImageIndex === (displayImages?.length || 0) - 1 && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <ChevronRight size={20} className="text-gray-700" />
                </button>
              </motion.div>
            )}

            {/* 영상 버튼만 표시 (이미지가 없고 영상만 있는 경우) */}
            {!showPurposeSelection && (!displayImages || displayImages.length === 0) && displayVideo && (
              <motion.div
                className="mb-4 flex justify-end"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.3 }}
              >
                <button
                  onClick={toggleVideoFullscreen}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg"
                >
                  <Video size={16} />
                  영상
                </button>
              </motion.div>
            )}

            {/* 앱 설치 링크 (하위 단계 1: 앱 설치) */}
            {!showPurposeSelection && currentSubStep?.links && (
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.4 }}
              >
                {currentSubStep.links.android && (
                  <motion.a
                    href={currentSubStep.links.android}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-center shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Android 다운로드
                  </motion.a>
                )}
                {currentSubStep.links.ios && (
                  <motion.a
                    href={currentSubStep.links.ios}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold text-center shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    iOS 다운로드
                  </motion.a>
                )}
              </motion.div>
            )}

            {/* 이미지 슬라이더 (기본 표시, 영상 탭이 아닐 때) */}
            {!showPurposeSelection && activeTab !== 'video' && displayImages && displayImages.length > 0 && (
              <motion.div
                className="relative w-full flex-1 min-h-[300px] sm:min-h-[400px] flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.4, ease: 'easeOut' }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    className="relative w-full h-full flex items-center justify-center"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={currentImage?.src || ''}
                      alt={currentImage?.title || `${step.title} ${currentImageIndex + 1}`}
                      className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
                    />
                    <button
                      onClick={toggleFullscreen}
                      className="absolute top-2 right-2 w-10 h-10 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <Maximize2 size={20} className="text-white" />
                    </button>
                  </motion.div>
                </AnimatePresence>

                {/* 이미지 네비게이션 */}
                {displayImages && displayImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      disabled={currentImageIndex === 0}
                      className={clsx(
                        'absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors',
                        currentImageIndex === 0 && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <ChevronLeft size={20} className="text-gray-700" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      disabled={currentImageIndex === (displayImages?.length || 0) - 1}
                      className={clsx(
                        'absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors',
                        currentImageIndex === (displayImages?.length || 0) - 1 && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <ChevronRight size={20} className="text-gray-700" />
                    </button>
                    {/* 상단 이미지 개수 표시 */}
                    {displayImages && displayImages.length > 1 && (
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-semibold">
                        {currentImageIndex + 1} / {displayImages.length}
                      </div>
                    )}
                    {/* 하단 이미지 개수 표시 */}
                    {displayImages && displayImages.length > 1 && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-semibold">
                        {currentImageIndex + 1} / {displayImages.length}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* 영상 재생 */}
            {/* 영상은 fullscreen으로만 표시되므로 여기서는 제거 */}
            {false && displayVideo && (
              <motion.div
                className="relative w-full flex-1 min-h-[300px] sm:min-h-[400px] flex items-center justify-center rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-black"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.4, ease: 'easeOut' }}
              >
                <video
                  src={displayVideo}
                  controls
                  className="w-full h-full object-contain"
                  playsInline
                >
                  브라우저가 비디오 태그를 지원하지 않습니다.
                </video>
                <button
                  onClick={toggleFullscreen}
                  className="absolute top-2 right-2 w-10 h-10 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors z-10"
                >
                  <Maximize2 size={20} className="text-white" />
                </button>
              </motion.div>
            )}

            {/* 입력 폼 (inputFields가 있는 경우) */}
            {!showPurposeSelection && currentSubStep?.inputFields && (
              <motion.div
                className="space-y-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                {currentSubStep.inputFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label htmlFor={field.key} className="block text-sm font-semibold text-gray-700">
                      {field.label}
                    </label>
                    {field.type === 'text' ? (
                      <input
                        type="text"
                        id={field.key}
                        placeholder={field.placeholder}
                        value={inputValues[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                      />
                    ) : (
                      <textarea
                        id={field.key}
                        placeholder={field.placeholder}
                        rows={4}
                        value={inputValues[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 placeholder-gray-400 resize-none"
                      />
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {/* AI 추천 결과 (aiRecommendation이 있는 경우) */}
            {!showPurposeSelection && currentSubStep?.aiRecommendation?.enabled && (
              <motion.div
                className="space-y-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <div className="flex items-start gap-2 text-sm text-gray-600 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                  <span className="text-indigo-600 font-bold">💡</span>
                  <p>{currentSubStep.aiRecommendation.description}</p>
                </div>
                <div className="p-4 bg-white border-2 border-indigo-200 rounded-xl">
                  <h4 className="text-sm font-bold text-gray-700 mb-2">✨ AI 추천 결과</h4>
                  <p className="text-gray-900 whitespace-pre-line">{currentSubStep.aiRecommendation.exampleData}</p>
                </div>
              </motion.div>
            )}

            {/* Canva 링크 (canvaLink가 있는 경우) */}
            {!showPurposeSelection && currentSubStep?.canvaLink && (
              <motion.div
                className="space-y-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl space-y-3">
                  <p className="text-gray-700 font-medium">
                    업체를 대표하는 <span className="font-bold text-gray-900">음식/공간 또는 서비스 이미지</span>를 사용하세요
                  </p>
                  <div className="flex items-start gap-2 text-sm text-orange-700 bg-orange-100 p-3 rounded-lg">
                    <span className="font-bold">⚠️</span>
                    <p className="font-semibold">로고는 신생 업체에게 이탈률이 높습니다!</p>
                  </div>
                  <motion.a
                    href={currentSubStep.canvaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-center shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🎨 Canva에서 프로필 사진 만들기
                  </motion.a>
                </div>
              </motion.div>
            )}

            {/* 추천 콘텐츠 목록 (모든 탭 동일 구조) */}
            {!showPurposeSelection && currentSubStep?.contentRecommendations && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                <h4 className="text-base font-bold text-gray-900 mb-3">
                  ✅ 추천 콘텐츠
                </h4>
                <div className="space-y-4">
                  {currentSubStep.contentRecommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <h5 className="text-sm font-bold text-gray-900 mb-2">
                        {index + 1}. {rec.title}
                      </h5>
                      {rec.examples && rec.examples.length > 0 && (
                        <ul className="space-y-1">
                          {rec.examples.map((example, exIdx) => (
                            <li key={exIdx} className="text-xs text-gray-600 flex items-start gap-2">
                              <span className="text-green-600">-</span>
                              {example}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}


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
    </>
  );
}

