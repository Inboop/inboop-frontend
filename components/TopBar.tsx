'use client';

import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/useAuthStore';

interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
  const { user } = useAuthStore();

  return (
    <div className="flex h-16 items-center justify-between border-b bg-card px-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>

      <div className="flex items-center gap-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
