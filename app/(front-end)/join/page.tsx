"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function JoinPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
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
      const response = await fetch("/mes/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: email, password, name }),
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
    "w-full rounded-xl border border-border bg-card px-4 py-3.5 text-[15px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-tertiary)] focus:border-primary"

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4">
        <button onClick={() => router.back()} className="text-[var(--text-secondary)] transition-colors hover:text-primary">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="text-[18px] font-semibold tracking-tight text-[var(--text-primary)]">회원가입</h2>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 pb-8">
        <div className="mx-auto flex max-w-[402px] flex-col gap-6 pt-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6M10 3v6l-5.5 9A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 9V3"/><path d="M7 15h10"/></svg>
              </span>
              <h1 className="text-[22px] font-bold tracking-tight text-[var(--text-primary)]">배양공정 MES 계정 만들기</h1>
            </div>
            <p className="text-[14px] text-[var(--text-secondary)]">현장 공정관리 시스템에 사용할 계정을 등록하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[var(--text-primary)]">이름</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력하세요" className={inputClass} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[var(--text-primary)]">이메일</label>
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="operator@example.com" className={inputClass} required />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[var(--text-primary)]">비밀번호</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6자 이상 입력하세요" className={inputClass} required />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[var(--text-primary)]">비밀번호 확인</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="비밀번호를 다시 입력하세요" className={inputClass} required />
            </div>

            {error && <p className="text-center text-[13px] text-danger">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3.5 text-[15px] font-bold text-[#05221E] transition-colors hover:bg-primary-dark disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black/80" />
              ) : (
                "가입하기"
              )}
            </button>
          </form>

          <div className="flex items-center justify-center gap-1 text-[13px]">
            <span className="text-[var(--text-tertiary)]">이미 계정이 있으신가요?</span>
            <Link href="/login" className="font-semibold text-primary hover:underline">로그인</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
