interface InboopLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'white';
}

export function InboopLogo({ size = 'md', variant = 'default' }: InboopLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-lg',
    lg: 'w-10 h-10 text-xl',
  };

  const bgColor = variant === 'white' ? 'bg-white' : '';
  const textColor = variant === 'white' ? 'text-[#2F5D3E]' : 'text-white';
  const bgStyle = variant === 'default' ? { backgroundColor: '#2F5D3E' } : {};

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg flex items-center justify-center ${bgColor}`}
      style={bgStyle}
    >
      <span className={textColor} style={{ fontWeight: 600 }}>I</span>
    </div>
  );
}
