'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GlobalHeader } from "@/components/GlobalHeader";
import { Sidebar } from "@/components/Sidebar";
import { ToastContainer } from "@/components/ui/toast";
import { useAuth } from '@/contexts/AuthContext';

const MARKETING_URL = process.env.NEXT_PUBLIC_MARKETING_URL || 'https://inboop.com';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const isProduction = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
      if (isProduction) {
        window.location.href = `${MARKETING_URL}/login`;
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#212121]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-white" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#212121]">
      <GlobalHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
