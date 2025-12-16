'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const refresh = searchParams.get('refresh');
    const error = searchParams.get('error');

    if (error) {
      // Redirect to login with error
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (token && refresh) {
      // Store tokens
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refresh);

      // Redirect to app
      router.replace('/home');
    } else {
      // No tokens, redirect to login
      router.replace('/login');
    }
  }, [searchParams, router]);

  return null;
}

function LoadingUI() {
  return (
    <div className="min-h-screen bg-[#212121] flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <Image
          src="/images/SimpleLogo.png"
          alt="Inboop"
          width={48}
          height={48}
          className="rounded-xl"
        />
        <span className="text-[#2F5D3E] font-semibold text-2xl">Inboop</span>
      </div>

      {/* Loading spinner */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-[#2F5D3E]/20 border-t-[#2F5D3E] animate-spin" />
        </div>
        <p className="text-gray-400 text-sm">Signing you in...</p>
      </div>

      {/* Subtle animation dots */}
      <div className="mt-8 flex gap-1">
        <div className="w-2 h-2 rounded-full bg-[#2F5D3E] animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-[#2F5D3E] animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-[#2F5D3E] animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <>
      <LoadingUI />
      <Suspense fallback={null}>
        <AuthCallbackContent />
      </Suspense>
    </>
  );
}