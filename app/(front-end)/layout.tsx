'use client';

import SessionProvider from '@/components/custom/session-provider';
import FrontTopbar from '@/components/custom/front-topbar';
import { usePathname } from 'next/navigation';

export default function FrontEndLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideTopbar = pathname === '/login' || pathname === '/join';

  if (hideTopbar) {
    return (
      <SessionProvider>
        {children}
      </SessionProvider>
    )
  }

  return (
    <SessionProvider>
      <FrontTopbar />
      <main className="pt-16">
        {children}
      </main>
    </SessionProvider>
  )
}
