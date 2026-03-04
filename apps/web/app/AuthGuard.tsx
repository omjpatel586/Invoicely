'use client'; // This MUST be a client component

import ScreenLoader from '@/views/components/loader';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Read from local storage (only runs in the browser)
    const token = localStorage.getItem('invoicelyAppAuthToken');

    if (token === 'undefined') {
      router.replace('/auth/signin');
    }

    const isPublicRoute = pathname === '/signin';

    // 2. Logic: No token + trying to access dashboard -> Redirect to signin
    if (!token && !isPublicRoute) {
      router.replace('/auth/signin');
    }
    // 3. Logic: Has token + trying to access signin -> Redirect to dashboard
    else if (token && isPublicRoute) {
      router.replace('/companies');
    }
    // 4. Otherwise, allow them to see the page
    else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  // Show a blank screen (or a loading spinner) while checking
  // This prevents the protected page from flashing briefly before redirecting
  if (!isAuthorized) {
    return <ScreenLoader />;
  }

  return <>{children}</>;
}
