'use client'

import { signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function FrontTopbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -40% 0px' }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const links = [
    { id: 'timeline', label: 'TIMELINE' },
    { id: 'achievements', label: 'ACHIEVEMENTS' },
    { id: 'legacy', label: 'LEGACY' },
    { id: 'ideas', label: 'IDEAS' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#1E1E1E]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden relative">
              <Image src="/playground/images/logo-icon.webp" alt="로고" fill className="object-cover" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight hidden sm:block">
              위대한 전당
            </span>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`text-[11px] font-semibold tracking-[2px] transition-colors relative py-1 ${
                  active === link.id
                    ? 'text-white'
                    : 'text-[#555] hover:text-[#999]'
                }`}
              >
                {link.label}
                {active === link.id && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#C41E3A] rounded-full" />
                )}
              </a>
            ))}
          </div>

          {/* Sign Out */}
          <button
            onClick={() => signOut()}
            className="text-[#555] hover:text-[#C41E3A] transition-colors text-xs font-semibold tracking-wider uppercase"
          >
            EXIT
          </button>
        </div>
      </div>
    </nav>
  )
}
