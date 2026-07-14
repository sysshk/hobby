'use client';

import SessionProvider from '@/components/custom/session-provider';
import AppShell from '@/components/mes/app-shell';
import { usePathname } from 'next/navigation';

// 인증 화면은 셸 없이, 그 외 MES 화면은 사이드바 셸로 감싼다.
const BARE_ROUTES = ['/login', '/join'];

export default function FrontEndLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.includes(pathname);

  if (bare) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <AppShell>{children}</AppShell>
    </SessionProvider>
  );
}
