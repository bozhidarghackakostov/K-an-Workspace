import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Loading workspace...',
}) => (
  <div className="flex flex-col items-center justify-center min-h-[220px] p-8 text-center animate-in fade-in">
    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3" />
    <p className="text-xs font-mono uppercase tracking-wider text-secondary">
      {message}
    </p>
  </div>
);

export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ icon, title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-surface-container-high bg-surface-container-low/40 max-w-md mx-auto my-6">
    {icon && <div className="text-secondary mb-3">{icon}</div>}
    <h4 className="text-sm font-semibold text-on-surface mb-1">{title}</h4>
    {description && (
      <p className="text-xs text-on-surface-variant max-w-xs mb-4 leading-relaxed">
        {description}
      </p>
    )}
    {actionLabel && onAction && (
      <Button size="sm" variant="outline" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export const ErrorState: React.FC<{
  title?: string;
  error?: string;
  onRetry?: () => void;
}> = ({ title = 'Something went wrong', error, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-error-container/30 border border-error-container max-w-md mx-auto my-6">
    <AlertCircle className="w-8 h-8 text-error mb-2" />
    <h4 className="text-sm font-semibold text-error mb-1">{title}</h4>
    {error && <p className="text-xs text-on-surface-variant mb-4">{error}</p>}
    {onRetry && (
      <Button
        size="sm"
        variant="outline"
        leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        onClick={onRetry}
      >
        Retry
      </Button>
    )}
  </div>
);
