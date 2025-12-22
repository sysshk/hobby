"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Snowfall from "react-snowfall"

export default function MainPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"timeline" | "achievements" | "legacy">("timeline")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-t-yellow-400 border-r-yellow-400 border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-bold text-yellow-300 animate-pulse">Great Park에 입장하는 중...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Great Park 정보
  const greatFigure = {
    name: "Great Park",
    title: "위대함의 성지",
    fullDescription: "Great Park는 위대함을 꿈꾸는 모든 이들의 성지이자, 시간과 공간을 초월하여",
    timeline: [
      { year: "5살", event: "동생 탄생으로 인한 인생에서의 소외", icon: "👶", description: "인생의 첫 시련, 그러나 이것이 독립심과 강인함의 시작이 되다" },
      { year: "1996", event: "Great Park의 탄생", icon: "🌟", description: "위대함을 기리는 특별함이 세상에 탄생하다" },
    ],
    achievements: [
      {
        title: "GMP 경시대회 3관왕",
        category: "학업",
        icon: "🏆",
        description: "경시대회에서 3관왕을 차지하며 탁월한 실력을 입증하다",
        impact: "노력과 재능의 완벽한 조화"
      },
      {
        title: "영감의 성지",
        category: "비전",
        icon: "💫",
        description: "모든 방문자에게 무한한 영감과 동기부여를 제공하는 특별한 공간",
        impact: "수많은 꿈이 시작되는 곳"
      },
    ],
    quotes: [
      "나는 언제 일해? 난 빨리 일하고 싶단 말이야",
      "오늘도 배웠다 - Great Park",
      "Great Park에서는 모든 꿈이 현실이 됩니다.",
      "과거의 영웅을 기억하고, 미래의 전설을 만듭니다.",
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black relative overflow-hidden">

      {/* Tabs - Top Navigation */}
      <div className="pb-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center gap-1 sm:gap-4 rounded-lg p-1.5 sm:p-2">
            <button
              onClick={() => setActiveTab("timeline")}
              className={`flex-1 px-2 sm:px-6 py-1.5 sm:py-3 rounded-lg font-semibold transition-all text-xs sm:text-base whitespace-nowrap ${
                activeTab === "timeline"
                  ? "bg-orange-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              📜 타임라인
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`flex-1 px-2 sm:px-6 py-1.5 sm:py-3 rounded-lg font-semibold transition-all text-xs sm:text-base whitespace-nowrap ${
                activeTab === "achievements"
                  ? "bg-orange-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🏆 업적
            </button>
            <button
              onClick={() => setActiveTab("legacy")}
              className={`flex-1 px-2 sm:px-6 py-1.5 sm:py-3 rounded-lg font-semibold transition-all text-xs sm:text-base whitespace-nowrap ${
                activeTab === "legacy"
                  ? "bg-orange-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              💭 명언
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Hero */}
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-5xl sm:text-6xl md:text-8xl font-black mb-4 sm:mb-6 text-orange-500">
              {greatFigure.name}
            </h2>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-300 mb-4 sm:mb-6">
              {greatFigure.title}
            </p>
          </div>

          {/* Description */}
          <div className="max-w-5xl mx-auto mb-12 sm:mb-16">
            <div className="bg-gray-800 rounded-2xl p-6 sm:p-10 border border-gray-700">
              <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed text-center">
                {greatFigure.fullDescription}
              </p>
            </div>
          </div>

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 animate-fade-in">
              {greatFigure.timeline.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative"
                  style={{
                    animation: `slideInUp 0.6s ease-out ${idx * 0.1}s both`,
                  }}
                >
                  <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-orange-500 transition-colors">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-lg flex items-center justify-center text-2xl sm:text-3xl">
                        {item.icon}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2">
                          <span className="px-2 sm:px-4 py-0.5 sm:py-1 bg-orange-500 text-white rounded-full font-bold text-xs sm:text-sm">
                            {item.year}
                          </span>
                          <h3 className="text-base sm:text-xl font-bold text-white">{item.event}</h3>
                        </div>
                        <p className="text-xs sm:text-base text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-fade-in">
              {greatFigure.achievements.map((achievement, idx) => (
                <div
                  key={idx}
                  className="group relative"
                  style={{
                    animation: `slideInUp 0.6s ease-out ${idx * 0.1}s both`,
                  }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-red-500 to-green-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-green-900/30 to-red-900/30 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-green-500/30 shadow-xl hover:scale-105 transition-transform h-full">
                    <div className="text-5xl sm:text-6xl mb-4 text-center">{achievement.icon}</div>
                    <div className="mb-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-red-500 text-white rounded-full text-xs font-bold">
                        {achievement.category}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{achievement.title}</h3>
                    <p className="text-sm sm:text-base text-green-100 mb-4">{achievement.description}</p>
                    <div className="pt-4 border-t border-white/20">
                      <p className="text-xs sm:text-sm text-red-300 font-semibold">💫 {achievement.impact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Legacy Tab */}
          {activeTab === "legacy" && (
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
              {greatFigure.quotes.map((quote, idx) => (
                <div
                  key={idx}
                  className="group relative"
                  style={{
                    animation: `slideInUp 0.6s ease-out ${idx * 0.15}s both`,
                  }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-red-500 to-green-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-green-900/40 to-red-900/40 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-green-500/30 shadow-2xl">
                    <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 text-green-400">&ldquo;</div>
                    <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white leading-relaxed mb-4 sm:mb-6">
                      {quote}
                    </p>
                    <div className="text-right text-green-300 font-semibold text-sm sm:text-base">
                      — {greatFigure.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Message */}
          <div className="mt-16 sm:mt-20 text-center">
            <div className="bg-gradient-to-r from-green-900/50 to-red-900/50 backdrop-blur-lg rounded-3xl p-8 sm:p-12 border border-green-500/30">
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🎄</div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-red-400 mb-4 sm:mb-6">
                Great Park
              </h3>
              <p className="text-base sm:text-xl text-white max-w-2xl mx-auto">
                {greatFigure.name}의 위대한 업적과 유산을 기리며,<br className="hidden sm:block" />
                우리 모두가 더 나은 미래를 만들어갈 수 있기를 바랍니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .star-particle {
          font-size: 20px;
          animation: sparkle 2s ease-in-out infinite;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
          }
        }
      `}</style>
    </div>
  )
}
