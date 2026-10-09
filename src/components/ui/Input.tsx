import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="font-label-sm text-xs font-medium text-on-surface-variant">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 text-secondary pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full h-10 rounded-xl bg-surface-container-lowest border ${
              error ? 'border-error ring-1 ring-error' : 'border-surface-container'
            } text-on-surface placeholder:text-outline text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 ${
              leftIcon ? 'pl-9' : 'pl-3.5'
            } ${rightIcon ? 'pr-9' : 'pr-3.5'} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-secondary flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-error font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
