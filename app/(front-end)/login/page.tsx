"use client"

import { signIn } from "next-auth/react"
import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email: username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.")
      } else {
        router.push("/main")
        router.refresh()
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Left - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/playground/images/login-bg.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="text-[#C41E3A] text-sm font-bold tracking-[4px] uppercase mb-3">Est. 1996</p>
          <h2 className="text-white text-4xl font-bold leading-tight">
            위대함은<br />여기서 시작된다
          </h2>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-[400px] flex flex-col gap-10">
          {/* Logo */}
          <div className="flex flex-col gap-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden relative ring-2 ring-[#C41E3A]/30">
              <Image
                src="/playground/images/logo-icon.webp"
                alt="위대한 전당"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                위대한 전당
              </h1>
              <p className="text-[#666666] text-sm">
                함께 만들어가는 더 나은 세상
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">아이디</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디를 입력하세요"
                className="w-full px-4 py-4 rounded-xl bg-[#141414] border border-[#222222] text-[15px] text-white placeholder:text-[#444444] outline-none focus:border-[#C41E3A] transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-4 rounded-xl bg-[#141414] border border-[#222222] text-[15px] text-white placeholder:text-[#444444] outline-none focus:border-[#C41E3A] transition-colors"
                required
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-[#C41E3A]/10 border border-[#C41E3A]/20">
                <p className="text-[13px] text-[#C41E3A]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#C41E3A] text-white text-[15px] font-bold hover:bg-[#A01628] transition-all disabled:opacity-60 cursor-pointer active:scale-[0.98]"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "입장하기"
              )}
            </button>
          </form>

          <div className="h-px bg-[#222222]" />
          <p className="text-[#444444] text-xs text-center">
            역사를 빛낸 위인들의 업적을 탐험하세요
          </p>
        </div>
      </div>
    </div>
  )
}
