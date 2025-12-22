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
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return (
      <SessionProvider>
        {children}
      </SessionProvider>
    )
  }

  return (
    <SessionProvider>
      <div className='flex flex-col overflow-hidden'>
        <FrontTopbar />
        <div className='flex-1'>
          {children}
        </div>
      </div>
    </SessionProvider>
  )
}
