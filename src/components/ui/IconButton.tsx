import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  ariaLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'ghost',
  size = 'md',
  ariaLabel,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-8 h-8 text-base',
    lg: 'w-10 h-10 text-lg',
  }[size];

  const variantClasses = {
    primary: 'bg-primary text-on-primary hover:bg-primary-container shadow-sm',
    secondary: 'bg-surface-container text-on-surface hover:bg-surface-container-high',
    ghost: 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container',
    outline: 'bg-surface-container-lowest border border-surface-container text-on-surface hover:bg-surface-container',
  }[variant];

  return (
    <button
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center rounded-lg transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
