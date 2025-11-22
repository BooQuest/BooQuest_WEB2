'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, Instagram, Bell, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GuideBackground from '@/app/components/features/GuideBackground';

// localStorage 키 상수
const STORAGE_KEY_USER_NAME = 'insta-guide-user-name';

// 가이드 완료 페이지 컴포넌트
export default function GuideCompletePage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  // localStorage에서 사용자 이름 가져오기
  useEffect(() => {
    const savedUserName = localStorage.getItem(STORAGE_KEY_USER_NAME);
    if (savedUserName) {
      setUserName(savedUserName);
      // 이름을 가져온 후 localStorage 정리 (선택적 - 필요하면 주석 처리)
      // localStorage.removeItem(STORAGE_KEY_USER_NAME);
    }
  }, []);
  
  // 인스타그램 계정 상태
  const [instagramAccount, setInstagramAccount] = useState('');
  const [instagramSubmitted, setInstagramSubmitted] = useState(false);
  
  // 핸드폰 번호 상태
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);

  // 인스타그램 계정 제출 핸들러
  const handleInstagramSubmit = () => {
    if (instagramAccount.trim() && !instagramSubmitted) {
      // TODO: 인스타그램 계정 제출 API 호출
      // 예: await submitInstagramAccount(instagramAccount.trim());
      console.log('제출된 인스타그램 계정:', instagramAccount.trim());
      setInstagramSubmitted(true);
    }
  };

  // 핸드폰 번호 제출 핸들러
  const handlePhoneSubmit = () => {
    if (phoneNumber.trim() && !phoneSubmitted) {
      // TODO: 핸드폰 번호 알림 신청 API 호출
      // 예: await subscribeNotification(phoneNumber.trim());
      console.log('알림 신청 핸드폰 번호:', phoneNumber.trim());
      setPhoneSubmitted(true);
    }
  };

  // 메인 화면으로 이동
  const handleGoToMain = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* 배경 그라데이션 */}
      <GuideBackground />

      {/* 메인 콘텐츠 */}
      <motion.div
        className="w-full max-w-2xl z-10 space-y-6"
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
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-lg">
                <CheckCircle2 size={48} className="text-white" strokeWidth={2.5} />
              </div>
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <Sparkles size={32} className="text-yellow-400" fill="currentColor" />
              </motion.div>
            </div>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            {userName ? `${userName}님,` : ''} 축하합니다! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            첫 게시물 업로드를 완료하셨네요!
          </p>
        </motion.div>

        {/* 제출 섹션들 */}
        <div className="space-y-4">
          
          {/* 인스타그램 계정 제출 */}
          <motion.div
            className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Instagram size={24} className="text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    인스타그램 계정 제출
                  </h2>
                  <p className="text-sm text-gray-600">
                    첫 업로드 완료한 계정을 알려주시면 추첨을 통해 기프티콘을 드립니다.
                  </p>
                </div>
                
                {!instagramSubmitted ? (
                  <>
                    <input
                      type="text"
                      value={instagramAccount}
                      onChange={(e) => setInstagramAccount(e.target.value)}
                      placeholder="@username 또는 username"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-900 placeholder-gray-400 font-medium"
                      autoComplete="off"
                      disabled={instagramSubmitted}
                    />
                    <motion.button
                      onClick={handleInstagramSubmit}
                      disabled={!instagramAccount.trim()}
                      className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                        instagramAccount.trim()
                          ? 'bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 hover:shadow-xl cursor-pointer'
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                      whileHover={instagramAccount.trim() ? { scale: 1.02 } : {}}
                      whileTap={instagramAccount.trim() ? { scale: 0.98 } : {}}
                    >
                      제출하기
                    </motion.button>
                  </>
                ) : (
                  <motion.div
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-green-50 border-2 border-green-200"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle2 size={20} className="text-green-600" />
                    <span className="text-green-700 font-bold">제출 완료</span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* 핸드폰 번호 알림 신청 */}
          <motion.div
            className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Bell size={24} className="text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    새로운 컨텐츠 알림 받기
                  </h2>
                  <p className="text-sm text-gray-600">
                    새로운 컨텐츠가 생겼을 때 핸드폰으로 알림을 받고 싶으시면 번호를 입력해주세요.
                  </p>
                </div>
                
                {!phoneSubmitted ? (
                  <>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="010-1234-5678"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder-gray-400 font-medium"
                      autoComplete="tel"
                      disabled={phoneSubmitted}
                    />
                    <motion.button
                      onClick={handlePhoneSubmit}
                      disabled={!phoneNumber.trim()}
                      className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                        phoneNumber.trim()
                          ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:shadow-xl cursor-pointer'
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                      whileHover={phoneNumber.trim() ? { scale: 1.02 } : {}}
                      whileTap={phoneNumber.trim() ? { scale: 0.98 } : {}}
                    >
                      알림 신청하기
                    </motion.button>
                  </>
                ) : (
                  <motion.div
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-green-50 border-2 border-green-200"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle2 size={20} className="text-green-600" />
                    <span className="text-green-700 font-bold">신청 완료</span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* 메인 화면으로 돌아가기 버튼 */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <motion.button
            onClick={handleGoToMain}
            className="flex-1 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            메인 화면으로 돌아가기
            <ArrowLeft size={20} strokeWidth={3} />
          </motion.button>
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

