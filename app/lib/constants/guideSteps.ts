// 인스타 부업 가이드 단계 데이터 상수
import { UserPlus, User, Briefcase, Image as ImageIcon, Upload } from 'lucide-react';
import { Step } from '@/app/components/features/StepCard';

// 5단계 가이드 데이터
export const GUIDE_STEPS: Step[] = [
  {
    id: 1,
    title: '회원가입',
    description: '부업용 새계정 만들기',
    duration: '3분 소요',
    isOptional: false,
    icon: UserPlus,
    gradient: 'from-purple-500 via-purple-600 to-indigo-600',
  },
  {
    id: 2,
    title: '프로필 설정',
    description: '매력적인 첫인상 세팅',
    duration: '7분 소요',
    isOptional: false,
    icon: User,
    gradient: 'from-indigo-500 via-blue-500 to-blue-600',
  },
  {
    id: 3,
    title: '비즈니스 계정 전환',
    description: '인사이트 도구 활성화',
    duration: '1분 소요',
    isOptional: true,
    icon: Briefcase,
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
  },
  {
    id: 4,
    title: '콘텐츠 제작',
    description: '첫 게시물 만들기',
    duration: '8분 소요',
    isOptional: false,
    icon: ImageIcon,
    gradient: 'from-teal-500 via-emerald-500 to-green-500',
  },
  {
    id: 5,
    title: '콘텐츠 업로드',
    description: '세상에 공개하기',
    duration: '1분 소요',
    isOptional: false,
    icon: Upload,
    gradient: 'from-green-500 via-emerald-600 to-teal-600',
  },
];

