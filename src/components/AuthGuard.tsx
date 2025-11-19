'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/store/auth';

function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[2]) : null;
}

function getAnyToken() {
  const fromCookie = getCookie('access_token');
  const fromLS = typeof localStorage !== 'undefined'
    ? localStorage.getItem('accessToken') || localStorage.getItem('access_token')
    : null;
  return fromCookie || fromLS;
}

const PUBLIC_PATHS = new Set<string>(['/login', '/register']);

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, setToken, loadMe, logout } = useAuth();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (PUBLIC_PATHS.has(pathname)) {
      setReady(true);
      return;
    }

    let t = token;
    if (!t) {
      t = getAnyToken() || null;
      if (t) setToken(t);
    }

    if (!t) {
      const to = `/login?redirectTo=${encodeURIComponent(pathname)}`;
      router.replace(to);
      setReady(true);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        await loadMe(); 
        if (!cancelled) setReady(true);
      } catch {
        if (cancelled) return;
        logout(); 
        const to = `/login?redirectTo=${encodeURIComponent(pathname)}`;
        router.replace(to);
        setReady(true);
      }
    })();

    return () => { cancelled = true; };
  }, [pathname]); 

  if (!ready) return null;

  return <>{children}</>;
}
