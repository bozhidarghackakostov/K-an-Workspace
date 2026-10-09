import React from 'react';
import { Home, Compass, Search, MessageSquare, Inbox } from 'lucide-react';

export interface BottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
}) => {
  const isHome = currentPath === '/' || currentPath.startsWith('/app/home');
  const isSpaces = currentPath.startsWith('/app/spaces');
  const isMessages = currentPath.startsWith('/app/messages');
  const isInbox = currentPath.startsWith('/app/inbox');

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex items-center justify-around px-2 py-2 bg-surface/90 backdrop-blur-md shadow-lg border-t border-surface-container">
      {/* Home */}
      <button
        onClick={() => onNavigate('/app/home')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-95 ${
          isHome
            ? 'text-primary bg-primary-fixed font-semibold'
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      {/* Spaces */}
      <button
        onClick={() => onNavigate('/app/spaces/space-website')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-95 ${
          isSpaces
            ? 'text-primary bg-primary-fixed font-semibold'
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Spaces</span>
      </button>

      {/* Search */}
      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-on-surface-variant hover:text-primary transition-all active:scale-95"
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Search</span>
      </button>

      {/* Messages */}
      <button
        onClick={() => onNavigate('/app/messages')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-95 ${
          isMessages
            ? 'text-primary bg-primary-fixed font-semibold'
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Messages</span>
      </button>

      {/* Inbox */}
      <button
        onClick={() => onNavigate('/app/inbox')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-95 ${
          isInbox
            ? 'text-primary bg-primary-fixed font-semibold'
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        <Inbox className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Inbox</span>
      </button>
    </nav>
  );
};
