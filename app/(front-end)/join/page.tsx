"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function JoinPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/playground/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: username, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "회원가입 중 오류가 발생했습니다.")
      } else {
        router.push("/login")
      }
    } catch {
      setError("회원가입 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl bg-white border border-[#E8E8E7] text-[15px] text-[#111111] placeholder:text-[#999999] outline-none focus:border-[#C41E3A] focus:border-2 transition-colors"

  return (
    <div className="min-h-screen bg-[#F5F3F3] flex flex-col">
      {/* Status area + Header */}
      <div className="flex items-center gap-3 px-6 py-4">
        <button onClick={() => router.back()} className="text-[#111111] hover:text-[#C41E3A] transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="text-[18px] font-semibold text-[#111111] tracking-tight">회원가입</h2>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 pb-8">
        <div className="max-w-[402px] mx-auto flex flex-col gap-5">
          {/* Titles */}
          <div className="flex flex-col gap-2">
            <h1 className="text-[26px] font-semibold text-[#111111] tracking-tight leading-[1.3]">
              위대한 전당에<br />오신 것을 환영합니다
            </h1>
            <p className="text-[14px] text-[#666666]">아래 정보를 입력하여 가입하세요</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#111111]">이름</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력하세요" className={inputClass} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#111111]">이메일</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="이메일을 입력하세요" className={inputClass} required />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#111111]">비밀번호</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" className={inputClass} required />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#111111]">비밀번호 확인</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="비밀번호를 다시 입력하세요" className={inputClass} required />
            </div>

            {error && (
              <p className="text-[13px] text-[#C41E3A] text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#C41E3A] text-white text-[15px] font-semibold hover:bg-[#8B1425] transition-colors disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "가입하기"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="flex items-center gap-1 text-[13px] justify-center">
            <span className="text-[#999999]">이미 회원이신가요?</span>
            <Link href="/login" className="text-[#C41E3A] font-semibold hover:underline">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
