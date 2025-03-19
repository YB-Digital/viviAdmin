'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthGuard = () => {
  const router = useRouter();

  useEffect(() => {
    const adminId = localStorage.getItem('adminId');
    
    // If adminId is missing and the route starts with /admin, redirect to login
    if (!adminId && window.location.pathname.startsWith('/admin')) {
      router.push('/login');
    }
  }, [router]);

  return null; // This component does not render anything, it only handles the redirection.
};

export default AuthGuard;
