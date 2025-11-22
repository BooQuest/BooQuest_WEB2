'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

// CompletionModal 컴포넌트 Props
interface CompletionModalProps {
  isOpen: boolean;
  userName?: string;
  onClose: () => void;
}

// 가이드 완료 축하 모달 컴포넌트
export default function CompletionModal({
  isOpen,
  userName,
  onClose,
}: CompletionModalProps) {
  const router = useRouter();
  const [instagramAccount, setInstagramAccount] = useState('');

  // 제출하기 핸들러
  const handleSubmit = () => {
    if (instagramAccount.trim()) {
      // TODO: 인스타그램 계정 제출 API 호출
      // 예: await submitInstagramAccount(instagramAccount.trim());
      console.log('제출된 인스타그램 계정:', instagramAccount.trim());
      
      // 제출 후 메인 화면으로 이동
      onClose();
      router.push('/');
    }
  };

  // 나중에 하기 핸들러 (제출 없이 메인으로)
  const handleSkip = () => {
    onClose();
    router.push('/');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 모달 컨텐츠 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 sm:p-10 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* 배경 그라데이션 효과 */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10" />

              <div className="relative z-10 text-center space-y-6">
                {/* 축하 아이콘 */}
                <motion.div
                  className="flex justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
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

                {/* 축하 메시지 */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    축하합니다! 🎉
                  </h2>
                  {userName && (
                    <p className="text-lg text-gray-700 font-medium">
                      {userName}님,
                    </p>
                  )}
                  <p className="text-base text-gray-600 leading-relaxed">
                    인스타 업로드까지 완료한거 축하합니다! 🎉
                    <br />
                    첫 업로드 완료한 계정을 알려주시면 추첨을 통해 기프티콘을 드립니다.
                  </p>
                </motion.div>

                {/* 인스타그램 계정 입력 */}
                <motion.div
                  className="space-y-2 pt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <label htmlFor="instagram-account" className="block text-sm font-bold text-gray-700">
                    인스타그램 계정
                  </label>
                  <input
                    type="text"
                    id="instagram-account"
                    value={instagramAccount}
                    onChange={(e) => setInstagramAccount(e.target.value)}
                    placeholder="@username 또는 username"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-900 placeholder-gray-400 font-medium"
                    autoComplete="off"
                  />
                  <p className="text-xs text-gray-500">
                    예: @myaccount 또는 myaccount
                  </p>
                </motion.div>

                {/* 버튼 */}
                <motion.div
                  className="space-y-3 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!instagramAccount.trim()}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                      instagramAccount.trim()
                        ? 'bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 hover:shadow-xl cursor-pointer'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                    whileHover={instagramAccount.trim() ? { scale: 1.02 } : {}}
                    whileTap={instagramAccount.trim() ? { scale: 0.98 } : {}}
                  >
                    제출하기
                    <ArrowRight size={20} strokeWidth={3} />
                  </motion.button>

                  <motion.button
                    onClick={handleSkip}
                    className="w-full py-3 rounded-xl font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    나중에 하기
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

