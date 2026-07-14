"use client"

import { signIn } from "next-auth/react"
import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between border-r border-border p-12">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(var(--primary) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="relative flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6M10 3v6l-5.5 9A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 9V3"/><path d="M7 15h10"/></svg>
          </span>
          <span className="font-bold tracking-tight">Penicillin MES</span>
        </div>
        <div className="relative">
          <p className="mb-3 text-xs font-bold uppercase tracking-[4px] text-primary">Manufacturing Execution System</p>
          <h2 className="text-4xl font-bold leading-tight text-[var(--text-primary)]">
            페니실린 배양 공정을<br />한 화면에서 관리하세요
          </h2>
          <p className="mt-4 max-w-sm text-sm text-[var(--text-secondary)]">
            발효조 실시간 모니터링부터 배치 이력·수율·품질까지, 현장 공정 데이터를 통합 관리합니다.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex w-full items-center justify-center px-8 lg:w-1/2">
        <div className="flex w-full max-w-[400px] flex-col gap-9">
          <div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-[var(--text-primary)]">로그인</h1>
            <p className="text-sm text-[var(--text-secondary)]">계정 정보를 입력해 접속하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">이메일</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@example.com"
                className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-[15px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-tertiary)] focus:border-primary"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-[15px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-tertiary)] focus:border-primary"
                required
              />
            </div>

            {error && (
              <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3">
                <p className="text-[13px] text-danger">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3.5 text-[15px] font-bold text-[#05221E] transition-all hover:bg-primary-dark disabled:opacity-60 active:scale-[0.98]"
            >
              {loading ? (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black/80" />
              ) : (
                "접속하기"
              )}
            </button>
          </form>

          <div className="h-px bg-border" />
          <p className="text-center text-[13px] text-[var(--text-secondary)]">
            계정이 없으신가요?{" "}
            <Link href="/join" className="font-semibold text-primary hover:underline">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
