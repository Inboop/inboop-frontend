'use client';

import { User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AssignmentFilter = 'any' | 'me' | 'unassigned';

interface AssignmentFilterChipsProps {
  value: AssignmentFilter;
  onChange: (value: AssignmentFilter) => void;
  className?: string;
  size?: 'sm' | 'md';
}

const ASSIGNMENT_OPTIONS: { value: AssignmentFilter; label: string; icon: React.ReactNode }[] = [
  { value: 'any', label: 'All', icon: <Users className="w-3.5 h-3.5" /> },
  { value: 'me', label: 'Mine', icon: <User className="w-3.5 h-3.5" /> },
  { value: 'unassigned', label: 'Unassigned', icon: <User className="w-3.5 h-3.5 opacity-50" /> },
];

export function AssignmentFilterChips({
  value,
  onChange,
  className,
  size = 'md',
}: AssignmentFilterChipsProps) {
  return (
    <div className={cn('flex items-center gap-1 bg-gray-100 rounded-xl p-1', className)}>
      {ASSIGNMENT_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'flex items-center gap-1.5 rounded-lg font-medium transition-all',
            size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm',
            value === option.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}
