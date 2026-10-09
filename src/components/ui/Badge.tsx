import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] font-medium tracking-tight',
    md: 'px-2.5 py-1 text-xs font-medium',
  }[size];

  const variantClasses = {
    primary: 'bg-primary-fixed text-on-primary-fixed',
    secondary: 'bg-surface-container text-on-surface-variant',
    outline: 'bg-transparent border border-surface-container text-on-surface-variant',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
    error: 'bg-error-container text-on-error-container',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-mono whitespace-nowrap ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};
