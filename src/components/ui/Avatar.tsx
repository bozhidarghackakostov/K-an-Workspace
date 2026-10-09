import React from 'react';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  status?: 'active' | 'away' | 'offline';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  }[size];

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={`relative inline-block flex-shrink-0 select-none ${className}`}>
      <div
        className={`${sizeClasses} rounded-full ring-1 ring-surface-dim overflow-hidden bg-surface-container flex items-center justify-center font-medium text-on-surface`}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide broken image
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {status && (
        <span
          className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-2 ring-surface-container-lowest ${
            status === 'active'
              ? 'bg-emerald-500'
              : status === 'away'
              ? 'bg-amber-500'
              : 'bg-outline'
          }`}
          title={status}
        />
      )}
    </div>
  );
};
