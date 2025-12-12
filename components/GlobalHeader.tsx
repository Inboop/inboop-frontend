'use client';

import Image from 'next/image';
import { Search, Bell } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

export function GlobalHeader() {
  const { user } = useAuthStore();

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-16 bg-[#212121] flex items-center justify-between pr-8">
      {/* Left: Brand */}
      <div className="flex items-center">
        <div className="w-20 flex items-center justify-center">
          <Image
            src="/images/SimpleLogo.png"
            alt="Inboop"
            width={32}
            height={32}
            className="rounded-lg"
          />
        </div>
        <span className="text-[#2F5D3E] font-semibold text-xl -ml-4">Inboop</span>
      </div>

      {/* Right: Icon buttons */}
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-lg hover:bg-[#2d2d2d] transition-colors flex items-center justify-center text-[#CCCCCC]">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-lg hover:bg-[#2d2d2d] transition-colors flex items-center justify-center text-[#CCCCCC] relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="w-9 h-9 rounded-full bg-[#2F5D3E] hover:bg-[#234430] transition-colors flex items-center justify-center">
          <span className="text-white text-sm">{getInitials(user?.name)}</span>
        </button>
      </div>
    </header>
  );
}
