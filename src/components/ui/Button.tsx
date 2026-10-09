import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 active:scale-[0.98] select-none disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  }[size];

  const variantClasses = {
    primary:
      'bg-primary text-on-primary hover:bg-primary-container shadow-sm hover:shadow active:scale-[0.97]',
    secondary:
      'bg-surface-container text-on-surface hover:bg-surface-container-high border border-surface-container-high',
    outline:
      'bg-surface-container-lowest border border-surface-container text-on-surface hover:bg-surface-container hover:border-surface-dim',
    ghost:
      'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container',
    danger:
      'bg-error text-on-error hover:bg-red-700 shadow-sm active:scale-[0.97]',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
