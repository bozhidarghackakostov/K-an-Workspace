import React from 'react';
import { Search, ChevronDown, Menu } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';

export interface TopBarProps {
  onOpenSearch: () => void;
  onToggleSidebar?: () => void;
  title?: string;
  subtitle?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenSearch,
  onToggleSidebar,
  title,
}) => {
  const { workspace } = useWorkspace();
  const { currentUser } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 w-full bg-surface/90 backdrop-blur-md border-b border-surface-container/60 shadow-xs">
      <div className="flex items-center gap-2">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 -ml-1 text-on-surface-variant hover:bg-surface-container rounded-lg active:scale-95"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer text-on-surface">
          <span className="w-2 h-2 rounded-full bg-primary-container" />
          <span className="font-headline-sm text-sm font-semibold tracking-tight text-on-surface">
            {title || workspace?.name || 'Kōan Workspace'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-secondary" />
        </div>
      </div>

      {/* Quick Search Pill & Avatar */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-high active:scale-95 transition-all"
        >
          <Search className="w-4 h-4 text-on-surface-variant" />
          <span className="font-mono text-[11px] px-1 py-0.2 rounded bg-surface-bright text-secondary border border-surface-dim font-medium">
            ⌘K
          </span>
        </button>

        <Avatar
          src={currentUser?.avatarUrl}
          name={currentUser?.name || 'User'}
          size="sm"
          status={currentUser?.status}
        />
      </div>
    </header>
  );
};
