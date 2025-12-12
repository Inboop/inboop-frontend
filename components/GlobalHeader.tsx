'use client';

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
    <header className="h-14 bg-white border-b flex items-center justify-between px-6" style={{ borderBottomColor: '#F2F2F2' }}>
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center">
          <span className="text-white">I</span>
        </div>
        <span className="text-gray-900">Inboop</span>
      </div>

      {/* Right: Icon buttons */}
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-600">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-600 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="w-9 h-9 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors flex items-center justify-center">
          <span className="text-white text-sm">{getInitials(user?.name)}</span>
        </button>
      </div>
    </header>
  );
}
