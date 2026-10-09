import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';

export interface LoginViewProps {
  onSuccess: () => void;
  isSignUpMode?: boolean;
  onToggleMode: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onSuccess,
  isSignUpMode = false,
  onToggleMode,
}) => {
  const { login, users, switchUser } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError('');
    try {
      await login(email.trim());
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (userId: string) => {
    setIsLoading(true);
    try {
      await switchUser(userId);
      onSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background text-on-surface">
      <div className="w-full max-w-md bg-surface-container-lowest border border-surface-container rounded-3xl p-6 sm:p-8 shadow-xl">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-primary text-on-primary mb-3 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="font-headline-md text-xl font-bold tracking-tight text-on-surface">
            {isSignUpMode ? 'Join Kōan Workspace' : 'Welcome back to Kōan'}
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            A calm, unified workspace for thinking, writing, and collaborating.
          </p>
        </div>

        {/* Quick select teammates */}
        {!isSignUpMode && users.length > 0 && (
          <div className="mb-6 p-3 rounded-2xl bg-surface-container-low/60 border border-surface-container">
            <span className="text-[11px] font-mono uppercase tracking-wider text-outline block mb-2 text-center">
              Quick Sign In As
            </span>
            <div className="grid grid-cols-2 gap-2">
              {users.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u.id)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-surface-container-lowest border border-surface-container hover:border-primary transition-all text-left group active:scale-95"
                >
                  <Avatar src={u.avatarUrl} name={u.name} size="xs" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-on-surface group-hover:text-primary truncate">
                      {u.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-outline truncate">{u.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUpMode && (
            <Input
              label="Full Name"
              placeholder="e.g. Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <Input
            type="email"
            label="Work Email"
            placeholder="alex@acmelabs.io"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            required
          />

          <Button
            type="submit"
            size="md"
            className="w-full mt-2"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isSignUpMode ? 'Create Workspace Account' : 'Continue with Email'}
          </Button>
        </form>

        {/* Mode Toggle */}
        <div className="mt-6 text-center pt-4 border-t border-surface-container text-xs text-on-surface-variant">
          {isSignUpMode ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Need a new workspace?{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Sign Up
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
