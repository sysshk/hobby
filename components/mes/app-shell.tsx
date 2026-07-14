"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ReactNode } from "react";

const NAV = [
  { href: "/dashboard", label: "대시보드", icon: IconGrid },
  { href: "/batches", label: "배치 관리", icon: IconBatch },
  { href: "/monitoring", label: "실시간 모니터링", icon: IconPulse },
  { href: "/equipment", label: "설비/발효조", icon: IconTank },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const name = session?.user?.name || session?.user?.email?.split("@")[0] || "운영자";

  return (
    <div className="flex min-h-screen bg-background text-[var(--text-primary)]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-surface md:flex">
        <div className="flex h-16 items-center gap-2.5 px-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary">
            <IconFlask />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight">배양공정 MES</p>
            <p className="text-[10px] text-[var(--text-tertiary)]">배양 공정관리</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                  active
                    ? "bg-primary/12 text-primary"
                    : "text-[var(--text-secondary)] hover:bg-card-hover hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-card text-[12px] font-bold text-primary">
              {name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[13px] font-semibold">{name}</p>
              <p className="text-[10px] text-[var(--text-tertiary)]">현장 운영자</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="로그아웃"
              className="rounded-lg p-1.5 text-[var(--text-tertiary)] transition-colors hover:bg-card-hover hover:text-danger"
            >
              <IconLogout />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col md:pl-60">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/85 px-5 backdrop-blur-md md:px-8">
          <MobileNav pathname={pathname} />
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-ok/12 px-2.5 py-1 text-[11px] font-semibold text-ok sm:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />
              시스템 정상
            </span>
            <span className="text-[12px] text-[var(--text-tertiary)]">v0.1 · Frame</span>
          </div>
        </header>

        <main className="flex-1 px-5 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto md:hidden">
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[12px] font-medium ${
              active ? "bg-primary/12 text-primary" : "text-[var(--text-secondary)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

// ── icons ─────────────────────────────────────
function IconFlask() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6M10 3v6l-5.5 9A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 9V3" />
      <path d="M7 15h10" />
    </svg>
  );
}
function IconGrid() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function IconBatch() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h18M3 12h18M3 17h18" />
    </svg>
  );
}
function IconPulse() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l3 8 4-16 3 8h4" />
    </svg>
  );
}
function IconTank() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="3" width="12" height="18" rx="4" /><path d="M6 14c3 2 9 2 12 0" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}
