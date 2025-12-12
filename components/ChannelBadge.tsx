import { ChannelType } from '@/types';
import { getChannelConfig } from '@/lib/channels';
import { cn } from '@/lib/utils';

interface ChannelBadgeProps {
  channel: ChannelType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ChannelBadge({ channel, size = 'md', showLabel = false, className }: ChannelBadgeProps) {
  const config = getChannelConfig(channel);

  const sizeClasses = {
    sm: 'h-5 w-5 text-xs',
    md: 'h-6 w-6 text-sm',
    lg: 'h-8 w-8 text-base',
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full text-white shadow-sm',
          sizeClasses[size],
          config.bgColor
        )}
        title={config.description}
      >
        <span>{config.icon}</span>
      </div>
      {showLabel && (
        <span className={cn('text-sm font-medium', config.color)}>
          {config.name}
        </span>
      )}
    </div>
  );
}
