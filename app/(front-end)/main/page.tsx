"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import ScrollReveal from "@/components/custom/scroll-reveal"
import { motion, useScroll, useTransform } from "framer-motion"

interface Idea {
  id: string
  text: string
  author: string
  likes: number
  isLiked: boolean
  isMine: boolean
  date: string
}

export default function MainPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [newIdea, setNewIdea] = useState("")
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 800], [0, 200])
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0])

  const fetchIdeas = useCallback(async () => {
    try {
      const res = await fetch("/playground/api/ideas")
      if (res.ok) setIdeas(await res.json())
    } catch (error) {
      console.error("Failed to fetch ideas:", error)
    }
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") fetchIdeas()
  }, [status, fetchIdeas])

  const handleAddIdea = async () => {
    if (!newIdea.trim() || isLoading) return
    setIsLoading(true)
    try {
      const res = await fetch("/playground/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newIdea }),
      })
      if (res.ok) {
        setIdeas([await res.json(), ...ideas])
        setNewIdea("")
      }
    } catch (error) {
      console.error("Failed to add idea:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async (id: string) => {
    try {
      const res = await fetch(`/playground/api/ideas/${id}/like`, { method: "POST" })
      if (res.ok) {
        const { liked } = await res.json()
        setIdeas(ideas.map(idea =>
          idea.id === id
            ? { ...idea, likes: liked ? idea.likes + 1 : idea.likes - 1, isLiked: liked }
            : idea
        ))
      }
    } catch (error) {
      console.error("Failed to toggle like:", error)
    }
  }

  const handleEdit = async (id: string) => {
    if (!editText.trim()) return
    try {
      const res = await fetch(`/playground/api/ideas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText }),
      })
      if (res.ok) {
        const updated = await res.json()
        setIdeas(ideas.map(idea => idea.id === id ? { ...idea, text: updated.text } : idea))
        setEditingId(null)
        setEditText("")
      }
    } catch (error) {
      console.error("Failed to edit idea:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/playground/api/ideas/${id}`, { method: "DELETE" })
      if (res.ok) {
        setIdeas(ideas.filter(idea => idea.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete idea:", error)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="w-10 h-10 border-2 border-[#222] border-t-[#C41E3A] rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return null

  const timeline = [
    { year: "1996", event: "Great Park의 탄생", description: "위대함을 기리는 특별함이 세상에 탄생하다" },
    { year: "어린시절", event: "인생의 첫 시련", description: "독립심과 강인함의 시작점. 모든 위대함에는 시련이 따른다." },
    { year: "학창시절", event: "GMP 경시대회 3관왕", description: "노력과 재능의 완벽한 조화를 세상에 증명하다" },
    { year: "입사 첫날", event: "GMP 문서와의 첫 만남", description: "SOP 한 장이 소설 한 권보다 길다는 사실을 깨닫다. 이것이 진정한 시련이었다." },
    { year: "입사 3개월", event: "일탈 보고서 마스터", description: "일탈(Deviation) 보고서를 너무 많이 써서 Word 자동완성이 '일탈'을 먼저 추천하기 시작하다" },
    { year: "현재", event: "밸리데이션의 신", description: "IQ, OQ, PQ를 눈감고도 쓸 수 있는 경지에 도달. 꿈에서도 프로토콜을 검토하고 있다는 소문이 돌다." },
  ]

  const achievements = [
    { title: "GMP 경시대회 3관왕", category: "학업", description: "경시대회에서 3관왕을 차지하며 탁월한 실력을 입증", icon: "🏆" },
    { title: "영감의 성지", category: "비전", description: "모든 방문자에게 무한한 영감과 동기부여를 제공하는 공간", icon: "💫" },
    { title: "일탈 보고서 속도왕", category: "GMP", description: "일탈 발생부터 보고서 완료까지 팀 최단 기록 보유. 비결은 공포에 의한 집중력.", icon: "📝" },
    { title: "CAPA 해결사", category: "GMP", description: "시정 및 예방 조치(CAPA)를 너무 잘 써서 QA팀에서 스카우트 제의가 들어오다", icon: "🔧" },
    { title: "클린룸 생존왕", category: "GMP", description: "방진복 입고 8시간 근무 후에도 머리카락 단 한 올 빠지지 않은 전설의 기록", icon: "🧪" },
    { title: "끊임없는 도전", category: "성장", description: "멈추지 않는 학습과 도전으로 매일 새로운 기록을 세우다", icon: "🔥" },
  ]

  const quotes = [
    { text: "나는 언제 일해? 난 빨리 일하고 싶단 말이야", author: "Great Park" },
    { text: "위대함은 하루아침에 만들어지지 않는다. 매일의 작은 혁명이 모여 역사가 된다.", author: "Great Park" },
    { text: "오늘도 배웠다", author: "Great Park" },
    { text: "SOP를 안 읽으면 인생이 편해지지만, 감사(Audit)가 오면 인생이 끝난다.", author: "Great Park" },
    { text: "GMP에서 '문서화하지 않으면 하지 않은 것이다'라고 했으니, 나는 야근을 문서화하겠다.", author: "Great Park" },
    { text: "클린룸에 들어가면 시간이 3배 느리게 간다. 이것은 아인슈타인도 몰랐던 상대성이론이다.", author: "Great Park" },
  ]

  return (
    <div className="bg-[#0A0A0A]">
      {/* ═══════════ HERO ═══════════ */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image
            src="/playground/images/cover-hero.webp"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]/30" />
        </motion.div>

        <motion.div className="relative z-10 text-center px-6" style={{ opacity: heroOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <p className="text-[#C41E3A] text-sm font-bold tracking-[6px] uppercase mb-6">
              Atomic Design System
            </p>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter mb-6">
              위대한 전당
            </h1>
            <div className="w-16 h-1 bg-[#C41E3A] mx-auto mb-6" />
            <p className="text-[#777] text-lg md:text-xl max-w-md mx-auto">
              위대함을 기록하는 공간
            </p>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ═══════════ TIMELINE ═══════════ */}
      <section id="timeline" className="min-h-screen py-24 md:py-32 relative">
        <div className="absolute inset-0 opacity-10">
          <Image src="/playground/images/tab-timeline.webp" alt="" fill className="object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-[#C41E3A] text-xs font-bold tracking-[4px] uppercase mb-4">TIMELINE</p>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-16">
              위대한 여정의 기록
            </h2>
          </ScrollReveal>

          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[#222]" />
            {timeline.map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.15}>
                <div className="flex gap-8 mb-12">
                  <div className="w-10 h-10 rounded-full bg-[#C41E3A] flex items-center justify-center shrink-0 z-10 ring-4 ring-[#0A0A0A]">
                    <span className="text-white text-xs font-bold">{idx + 1}</span>
                  </div>
                  <div className="flex-1 bg-[#141414] rounded-2xl p-6 md:p-8 border border-[#1E1E1E] hover:border-[#C41E3A]/30 transition-colors">
                    <span className="inline-block px-4 py-1.5 bg-[#C41E3A] text-white rounded-full font-bold text-xs mb-4">
                      {item.year}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{item.event}</h3>
                    <p className="text-[#777] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ACHIEVEMENTS ═══════════ */}
      <section id="achievements" className="min-h-screen py-24 md:py-32 bg-[#0D0D0D]">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-[#C41E3A] text-xs font-bold tracking-[4px] uppercase mb-4">ACHIEVEMENTS</p>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-16">
              빛나는 순간들
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((a, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="group bg-[#141414] rounded-2xl p-6 md:p-8 border border-[#1E1E1E] hover:border-[#C41E3A]/40 transition-all hover:scale-[1.02] cursor-default h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C41E3A] to-[#8B1425] flex items-center justify-center text-2xl shrink-0">
                      {a.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#C41E3A] uppercase tracking-[2px]">{a.category}</span>
                      <h3 className="text-lg md:text-xl font-bold text-white">{a.title}</h3>
                    </div>
                  </div>
                  <p className="text-[#777] leading-relaxed">{a.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ LEGACY / QUOTES ═══════════ */}
      <section id="legacy" className="min-h-screen py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image src="/playground/images/tab-legacy.webp" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />

        <div className="relative max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-[#C41E3A] text-xs font-bold tracking-[4px] uppercase mb-4">LEGACY</p>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-16">
              시대를 초월하는 지혜
            </h2>
          </ScrollReveal>

          <div className="flex flex-col gap-8">
            {quotes.map((q, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.15}>
                <div className="bg-[#141414]/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-[#1E1E1E] relative overflow-hidden">
                  <div className="absolute top-4 left-6 text-[80px] md:text-[120px] text-[#C41E3A]/10 font-serif leading-none select-none">
                    &ldquo;
                  </div>
                  <p className="text-xl md:text-3xl text-white leading-relaxed mb-6 relative z-10 italic font-light">
                    {q.text}
                  </p>
                  <p className="text-[#C41E3A] font-semibold relative z-10">
                    — {q.author}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ IDEAS / COMMUNITY ═══════════ */}
      <section id="ideas" className="min-h-screen py-24 md:py-32 bg-[#0D0D0D]">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-[#C41E3A] text-xs font-bold tracking-[4px] uppercase mb-4">IDEAS</p>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
              혁명은 여기서 시작된다
            </h2>
            <p className="text-[#777] text-lg mb-12 max-w-xl">
              당신의 아이디어가 세상을 바꿀 수 있습니다
            </p>
          </ScrollReveal>

          {/* Input */}
          <ScrollReveal>
            <div className="bg-[#141414] rounded-2xl p-5 border border-[#1E1E1E] mb-8">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newIdea}
                  onChange={(e) => setNewIdea(e.target.value)}
                  placeholder="당신의 혁명적 아이디어는?"
                  className="flex-1 bg-[#0A0A0A] text-white placeholder-[#444] rounded-xl px-5 py-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#C41E3A]/30 border border-[#222]"
                  onKeyDown={(e) => e.key === "Enter" && handleAddIdea()}
                />
                <button
                  onClick={handleAddIdea}
                  disabled={isLoading}
                  className="px-6 py-4 bg-[#C41E3A] text-white rounded-xl font-bold text-sm hover:bg-[#A01628] transition-colors disabled:opacity-60 shrink-0"
                >
                  등록
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Ideas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ideas.map((idea, idx) => (
              <ScrollReveal key={idea.id} delay={idx * 0.05}>
                <div className="bg-[#141414] rounded-2xl p-5 border border-[#1E1E1E] hover:border-[#C41E3A]/30 transition-colors h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#C41E3A]/20 flex items-center justify-center shrink-0">
                      <span className="text-[#C41E3A] text-[12px] font-bold">
                        {idea.author?.charAt(0) || "?"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-white">{idea.author}</p>
                      <p className="text-[11px] text-[#555]">{idea.date}</p>
                    </div>
                    {idea.isMine && editingId !== idea.id && (
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => { setEditingId(idea.id); setEditText(idea.text) }} className="p-1.5 rounded-lg text-[#555] hover:text-white hover:bg-[#1A1A1A] transition-colors" title="수정">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button onClick={() => handleDelete(idea.id)} className="p-1.5 rounded-lg text-[#555] hover:text-[#C41E3A] hover:bg-[#C41E3A]/10 transition-colors" title="삭제">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>
                    )}
                  </div>
                  {editingId === idea.id ? (
                    <div className="flex flex-col gap-2 mb-4 flex-1">
                      <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full bg-[#0A0A0A] text-white rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#C41E3A]/30 border border-[#222] resize-none min-h-[80px]" />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => { setEditingId(null); setEditText("") }} className="px-3 py-1.5 rounded-lg text-[#555] text-xs font-semibold hover:text-white transition-colors">취소</button>
                        <button onClick={() => handleEdit(idea.id)} className="px-3 py-1.5 rounded-lg bg-[#C41E3A] text-white text-xs font-semibold hover:bg-[#A01628] transition-colors">저장</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[15px] text-[#999] leading-relaxed mb-4 flex-1">{idea.text}</p>
                  )}
                  <button
                    onClick={() => handleLike(idea.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors w-fit ${
                      idea.isLiked
                        ? "bg-[#C41E3A]/20 text-[#C41E3A]"
                        : "bg-[#1A1A1A] text-[#555] hover:text-[#C41E3A]"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={idea.isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    {idea.likes}
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-2 h-2 rounded-full bg-[#C41E3A] mx-auto mb-4" />
          <p className="text-[#555] text-sm">위대한 전당 · Great Park · Est. 1996</p>
        </div>
      </footer>
    </div>
  )
}
