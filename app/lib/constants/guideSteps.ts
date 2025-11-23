// 인스타 부업 가이드 단계 데이터 상수
import { UserPlus, User, Briefcase, Image as ImageIcon, Upload } from 'lucide-react';
import { Step, SubStep, ImageData, Purpose } from '@/app/components/features/StepCard';

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
    subSteps: [
      {
        id: 1,
        title: '앱 설치',
        description: '인스타그램 앱을 설치하세요',
        links: {
          android: 'https://play.google.com/store/apps/details?id=com.instagram.android',
          ios: 'https://apps.apple.com/app/instagram/id389801252',
        },
      },
      {
        id: 2,
        title: '계정 등록',
        description: '새 계정 만들기',
        images: [
          {
            src: '/images/start_1_1.PNG',
            title: '로그인 화면 : 새 계정 만들기',
          },
          {
            src: '/images/start_1_2.PNG',
            title: '휴대폰 or 이메일 입력',
          },
          {
            src: '/images/start_1_3.PNG',
            title: '이름 입력',
          },
          {
            src: '/images/start_1_4.PNG',
            title: '가입 후 메인 화면',
          },
        ],
        video: '/videos/start_1.MP4',
      },
    ],
  },
  {
    id: 2,
    title: '프로필 설정',
    description: '매력적인 첫인상 세팅',
    duration: '7분 소요',
    isOptional: false,
    icon: User,
    gradient: 'from-indigo-500 via-blue-500 to-blue-600',
    purposeSelection: true,
    purposes: [
      {
        id: 'business',
        title: '업체 홍보용',
        description: '카페, 식당, 샵 등 오프라인 업체를 홍보하고 싶어요',
        icon: '🏪',
      },
      {
        id: 'content',
        title: '콘텐츠 제작용',
        description: '개인 브랜드나 콘텐츠를 만들고 싶어요',
        icon: '✨',
      },
    ],
    purposeSubSteps: {
      business: [
        {
          id: 1,
          title: '이름',
          description: '브랜드명과 키워드로 검색 노출률을 높이세요',
          inputFields: [
            {
              type: 'text',
              label: '브랜드명',
              placeholder: '예: OO카페',
              key: 'business-brand',
            },
            {
              type: 'textarea',
              label: '어떤 서비스를 하시나요?',
              placeholder: '예: 강남역 근처 브런치 카페입니다',
              key: 'business-service',
            },
          ],
          aiRecommendation: {
            enabled: true,
            description: '키워드를 포함하면 검색에서 상단 노출될 확률이 높아집니다',
            exampleData: 'OO카페 | 브런치맛집, 디저트카페, 강남카페',
          },
        },
        {
          id: 2,
          title: '소개글',
          description: 'AI가 업체 강점을 최적화된 소개글로 변환합니다',
          inputFields: [
            {
              type: 'textarea',
              label: '업체의 강점을 자유롭게 적어주세요',
              placeholder: '예:\n- 5년 경력 바리스타\n- 매일 새벽 구운 수제 베이커리\n- 인스타그래머블한 인테리어',
              key: 'business-strengths',
            },
          ],
          aiRecommendation: {
            enabled: true,
            description: '업체 강점들을 자유롭게 적어주시면 AI가 최적화해서 정리해드립니다',
            exampleData: '5년 경력 바리스타의 핸드드립 커피 ☕\n매일 새벽 구운 수제 베이커리 🥐\n인스타그래머블한 감성 공간 📸',
          },
        },
        {
          id: 3,
          title: '프로필 이미지',
          description: '업체를 대표하는 이미지를 선택하세요',
          canvaLink: 'https://www.canva.com/ko_kr/create/profile-pictures/',
        },
        {
          id: 4,
          title: '외부링크 | 링크트리',
          description: '선택 사항: 외부 링크를 추가하세요',
          // 이미지/영상 안내는 나중에 추가
        },
      ],
      content: [
        {
          id: 1,
          title: '준비 중',
          description: '콘텐츠 제작용 가이드는 준비 중입니다',
        },
      ],
    },
  },
  {
    id: 3,
    title: '비즈니스 계정 전환',
    description: '인사이트 조회하고 활용해서 조회수 늘릴 수 있어요!',
    duration: '1분 소요',
    isOptional: true,
    icon: Briefcase,
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    subSteps: [
      {
        id: 1,
        title: '비즈니스 계정 전환',
        description: '인사이트 도구를 활성화하세요',
        images: [
          {
            src: '/images/start_3_1.PNG',
            title: '프로필 -> 설정',
          },
          {
            src: '/images/start_3_2.PNG',
            title: '설정 화면',
          },
          {
            src: '/images/start_3_3.PNG',
            title: '계정 전환 검색',
          },
          {
            src: '/images/start_3_4.PNG',
            title: '비즈니스 선택',
          },
          {
            src: '/images/start_3_5.PNG',
            title: '비즈니스 계정으로 전환된 화면',
          },
        ],
        video: '/videos/start_3.MP4',
      },
    ],
  },
  {
    id: 4,
    title: '콘텐츠 제작',
    description: '첫 게시물 만들기',
    duration: '8분 소요',
    isOptional: false,
    icon: ImageIcon,
    gradient: 'from-teal-500 via-emerald-500 to-green-500',
    // 4단계 공통 정보
    decorationMethods: [
      { title: '📝 자막', description: '핵심 메시지 텍스트로' },
      { title: '🎵 음악', description: '어울리는 배경음 추가' },
      { title: '📸 슬라이드', description: '사진 여러 장 → 영상' },
      { title: '🎤 내레이션', description: '자신 or AI 목소리 녹음' }
    ],
    aiTools: [
      { name: '나노바나나', description: '실사 이미지 AI', link: 'https://artlist.io/text-to-image-ai', isFree: true, category: '이미지' },
      { name: '미드져니', description: '예술 이미지 AI', link: 'https://www.midjourney.com/', isFree: false, category: '이미지' },
      { name: 'Veo3', description: '고품질 영상', link: 'https://deevid.ai/ko/model/veo-3', isFree: true, category: '영상' },
      { name: '소라', description: '사실적 영상', link: 'https://openart.ai/video/i2v/sora-v2/', isFree: true, category: '영상' }
    ],
    purposeSubSteps: {
      business: [
        {
          id: 1,
          title: '게시글',
          description: '첫 업로드 추천! 브랜드 이미지 만들 때',
          difficulty: '쉬움',
          initialRecommendations: [
            '업체 사진이나 업체 관련 이미지',
            '리뷰가 있다면 리뷰를 캡처해서 올리기'
          ],
          contentRecommendations: [
            { 
              title: '제품/서비스 소개',
              examples: [
                '대표 메뉴/제품 사진 + 가격/특징 설명',
                '예: "시그니처 메뉴 3종 소개"'
              ]
            },
            { 
              title: '공간/분위기 사진',
              examples: [
                '매장 인테리어, 작업 환경 등',
                '예: "우리 카페의 특별한 포토존"'
              ]
            },
            { 
              title: '고객 리뷰 캡처',
              examples: [
                '리뷰 이미지 + 감사 멘트',
                '예: "고객님들의 따뜻한 후기 💕"'
              ]
            }
          ]
        },
        {
          id: 2,
          title: '스토리',
          description: '일상 소통하며 친밀도 높일 때',
          difficulty: '중간',
          contentRecommendations: [
            { 
              title: '실시간 현황 공유',
              examples: [
                '지금 막 나온 빵 🍞 (sold out 되기 전에)',
                '오늘 예약 마감됐어요 ㅠㅠ 내일 오세요',
                '→ 실시간 소통'
              ]
            },
            { 
              title: '일상 브이로그 컷',
              examples: [
                '오늘 재료 받았어요 (박스 뜯는 사진)',
                '점심시간 폭탄 맞는 중... (주문 쌓인 화면)',
                '→ 친근함'
              ]
            },
            { 
              title: '투표/질문으로 참여 유도',
              examples: [
                '다음 시즌 메뉴 뭐 할까요? (투표 스티커)',
                '여러분은 어느 쪽? (밸런스 게임)',
                '→ 인터랙션'
              ]
            }
          ]
        },
        {
          id: 3,
          title: '릴스',
          description: '바이럴 노려볼 때 도전!',
          difficulty: '어려움',
          contentRecommendations: [
            { 
              title: '일상 브이로그 스타일',
              examples: [
                '카페 오픈 준비하는 아침 루틴',
                '오늘 매장에 이런 손님 오셨어요',
                '→ 친근함'
              ]
            },
            { 
              title: '제품 디테일 영상',
              examples: [
                '빵 자르는 소리 ASMR',
                '네일 바르는 클로즈업',
                '커피 내리는 장면',
                '→ 계속 보게 됨, 바이럴 쉬움'
              ]
            },
            { 
              title: '정보성 콘텐츠',
              examples: [
                '네일 오래 유지하는 방법 3가지',
                '이거 모르고 주문하면 손해보는 것',
                '→ 유용함, 전문성'
              ]
            }
          ]
        }
      ],
    },
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

