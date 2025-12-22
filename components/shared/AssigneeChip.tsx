'use client';

import { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, UserMinus, Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export interface TeamMember {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
}

interface AssigneeChipProps {
  /** Current assigned user ID */
  assignedToUserId?: number | string | null;
  /** Current assigned user name (for display) */
  assignedToName?: string | null;
  /** List of available team members */
  teamMembers?: TeamMember[];
  /** Called when assignment changes */
  onAssign?: (userId: number | null) => Promise<void>;
  /** Whether the chip is in read-only mode */
  readOnly?: boolean;
  /** Whether an assignment update is in progress */
  isLoading?: boolean;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Show label "Assigned to" before the chip */
  showLabel?: boolean;
}

// Helper to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Mock team members - in production, this would come from an API
const defaultTeamMembers: TeamMember[] = [
  { id: 1, name: 'Sarah Wilson', email: 'sarah@example.com' },
  { id: 2, name: 'Mike Chen', email: 'mike@example.com' },
  { id: 3, name: 'Emma Davis', email: 'emma@example.com' },
];

export function AssigneeChip({
  assignedToUserId,
  assignedToName,
  teamMembers = defaultTeamMembers,
  onAssign,
  readOnly = false,
  isLoading = false,
  size = 'md',
  showLabel = false,
}: AssigneeChipProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const loading = isLoading || localLoading;
  const isAssigned = assignedToUserId != null && assignedToName;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleAssign = async (userId: number | null) => {
    if (!onAssign) return;

    setLocalLoading(true);
    setShowDropdown(false);
    try {
      await onAssign(userId);
    } finally {
      setLocalLoading(false);
    }
  };

  const sizeClasses = {
    sm: {
      button: 'p-2',
      avatar: 'w-6 h-6 text-[10px]',
      text: 'text-xs',
      icon: 'w-3 h-3',
      dropdown: 'py-2',
      dropdownItem: 'px-3 py-2 text-xs',
    },
    md: {
      button: 'p-3',
      avatar: 'w-8 h-8 text-xs',
      text: 'text-sm',
      icon: 'w-4 h-4',
      dropdown: 'py-2',
      dropdownItem: 'px-4 py-3 text-sm',
    },
  };

  const styles = sizeClasses[size];

  // Read-only display
  if (readOnly) {
    return (
      <div className="flex flex-col gap-1.5">
        {showLabel && (
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Assigned to
          </label>
        )}
        <div className={cn('flex items-center gap-2', styles.button, 'bg-gray-50 border border-gray-100 rounded-xl')}>
          {isAssigned ? (
            <>
              <div className={cn(
                'rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center font-semibold text-white flex-shrink-0',
                styles.avatar
              )}>
                {getInitials(assignedToName)}
              </div>
              <span className={cn('text-gray-700 font-medium truncate', styles.text)}>
                {assignedToName}
              </span>
            </>
          ) : (
            <>
              <div className={cn(
                'rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0',
                styles.avatar
              )}>
                <User className={cn('text-gray-400', styles.icon)} />
              </div>
              <span className={cn('text-gray-500 font-medium', styles.text)}>Unassigned</span>
            </>
          )}
        </div>
      </div>
    );
  }

  // Interactive display with dropdown
  return (
    <div className="flex flex-col gap-1.5" ref={dropdownRef}>
      {showLabel && (
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Assigned to
          </label>
          <div className="group relative">
            <Info className="w-3 h-3 text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
              Assignment helps organize work. It does not restrict access.
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        </div>
      )}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
          disabled={loading}
          className={cn(
            'w-full flex items-center gap-2 rounded-xl transition-all',
            styles.button,
            isAssigned
              ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
              : 'bg-amber-50 border border-dashed border-amber-200 hover:bg-amber-100',
            loading && 'opacity-70 cursor-not-allowed'
          )}
        >
          {isAssigned ? (
            <>
              <div className={cn(
                'rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center font-semibold text-white flex-shrink-0',
                styles.avatar
              )}>
                {getInitials(assignedToName)}
              </div>
              <span className={cn('text-gray-900 font-medium truncate flex-1 text-left', styles.text)}>
                {assignedToName}
              </span>
            </>
          ) : (
            <>
              <div className={cn(
                'rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0',
                styles.avatar
              )}>
                <User className={cn('text-amber-600', styles.icon)} />
              </div>
              <span className={cn('text-amber-700 font-medium flex-1 text-left', styles.text)}>
                Unassigned
              </span>
            </>
          )}
          {loading ? (
            <Loader2 className={cn('animate-spin text-gray-400 flex-shrink-0', styles.icon)} />
          ) : (
            <ChevronDown className={cn('text-gray-400 flex-shrink-0', styles.icon)} />
          )}
        </button>

        {showDropdown && (
          <div className={cn(
            'absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden',
            styles.dropdown
          )}>
            {/* Unassign option */}
            <button
              onClick={() => handleAssign(null)}
              className={cn(
                'w-full text-left flex items-center gap-3 hover:bg-gray-50 transition-colors',
                styles.dropdownItem,
                !isAssigned && 'bg-gray-50'
              )}
            >
              <UserMinus className={cn('text-gray-400', styles.icon)} />
              <span>Unassigned</span>
            </button>

            {/* Divider */}
            <div className="border-t border-gray-100 my-1" />

            {/* Assign to me option (if current user exists) */}
            {user && (
              <button
                onClick={() => handleAssign(user.id)}
                className={cn(
                  'w-full text-left flex items-center gap-3 hover:bg-gray-50 transition-colors',
                  styles.dropdownItem,
                  assignedToUserId === user.id && 'bg-gray-50'
                )}
              >
                <div className={cn(
                  'rounded-full bg-[#2F5D3E] flex items-center justify-center font-semibold text-white flex-shrink-0',
                  size === 'sm' ? 'w-5 h-5 text-[9px]' : 'w-6 h-6 text-[10px]'
                )}>
                  {getInitials(user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium">Assign to me</span>
                  {user.email && (
                    <span className="text-gray-400 ml-1 text-xs">({user.email})</span>
                  )}
                </div>
              </button>
            )}

            {/* Other team members */}
            {teamMembers
              .filter((member) => member.id !== user?.id)
              .map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleAssign(member.id)}
                  className={cn(
                    'w-full text-left flex items-center gap-3 hover:bg-gray-50 transition-colors',
                    styles.dropdownItem,
                    assignedToUserId === member.id && 'bg-gray-50'
                  )}
                >
                  <div className={cn(
                    'rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center font-semibold text-white flex-shrink-0',
                    size === 'sm' ? 'w-5 h-5 text-[9px]' : 'w-6 h-6 text-[10px]'
                  )}>
                    {getInitials(member.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="truncate">{member.name}</span>
                    {member.email && (
                      <span className="text-gray-400 ml-1 text-xs truncate">({member.email})</span>
                    )}
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
