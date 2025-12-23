'use client';

import { useState } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/stores/useToastStore';

interface AssignToMeButtonProps {
  onAssign: () => Promise<void>;
  className?: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function AssignToMeButton({
  onAssign,
  className,
  size = 'sm',
  showLabel = false,
}: AssignToMeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click

    if (isLoading) return;

    setIsLoading(true);
    try {
      await onAssign();
      toast.success('Assigned to you');
    } catch (error) {
      console.error('Failed to assign:', error);
      toast.error('Failed to assign', error instanceof Error ? error.message : 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      title="Assign to me"
      className={cn(
        'flex items-center gap-1 rounded-lg font-medium transition-all',
        'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' ? 'p-1.5' : 'px-2.5 py-1.5',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className={cn('animate-spin', size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
      ) : (
        <UserPlus className={cn(size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
      )}
      {showLabel && <span className="text-xs">Assign to me</span>}
    </button>
  );
}
