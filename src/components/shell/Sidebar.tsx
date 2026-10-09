import React, { useState } from 'react';
import {
  Home,
  Compass,
  CheckSquare,
  MessageSquare,
  Inbox,
  Search,
  Plus,
  ChevronDown,
  Moon,
  Sun,
  LogOut,
  Palette,
  Briefcase,
  User as UserIcon,
  Lightbulb,
  FileText,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../ui/Avatar';

export interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenCommand: () => void;
  onQuickCapture: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  onOpenCommand,
  onQuickCapture,
  isCollapsed,
}) => {
  const { workspace, spaces, pages, activeSpaceId, setActiveSpaceId, notifications } = useWorkspace();
  const { currentUser, logout, users, switchUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  const spaceIcons: Record<string, React.ReactNode> = {
    palette: <Palette className="w-4 h-4" />,
    work: <Briefcase className="w-4 h-4" />,
    person: <UserIcon className="w-4 h-4" />,
    lightbulb: <Lightbulb className="w-4 h-4" />,
  };

  const navItems = [
    { label: 'Home', path: '/app/home', icon: <Home className="w-4 h-4" /> },
    { label: 'Tasks', path: '/app/tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { label: 'Messages', path: '/app/messages', icon: <MessageSquare className="w-4 h-4" /> },
    {
      label: 'Inbox',
      path: '/app/inbox',
      icon: <Inbox className="w-4 h-4" />,
      badge: unreadNotifs > 0 ? unreadNotifs : undefined,
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col h-screen bg-surface border-r border-surface-container transition-all duration-200 select-none z-30 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Workspace Header */}
      <div className="flex items-center justify-between p-3 border-b border-surface-container">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 px-1">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
            <span className="font-headline-sm text-sm font-semibold text-on-surface truncate">
              {workspace?.name || 'Kōan Workspace'}
            </span>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <span className="w-3 h-3 rounded-full bg-primary-container" />
          </div>
        )}

        <button
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
        </button>
      </div>

      {/* Quick Search & Capture Action */}
      <div className="p-3 space-y-2">
        <button
          onClick={onOpenCommand}
          className={`w-full flex items-center gap-2 bg-surface-container px-3 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Search (⌘K)"
        >
          <Search className="w-4 h-4 text-secondary flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="text-xs flex-1 text-left">Search</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-surface-bright text-secondary border border-surface-dim">
                ⌘K
              </kbd>
            </>
          )}
        </button>

        <button
          onClick={onQuickCapture}
          className={`w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-medium py-2 rounded-xl hover:bg-primary-container active:scale-98 shadow-xs transition-all ${
            isCollapsed ? 'px-0' : 'px-3 text-xs'
          }`}
          title="Quick Capture"
        >
          <Plus className="w-4 h-4" />
          {!isCollapsed && <span>Quick Capture</span>}
        </button>
      </div>

      {/* Main Nav Items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 no-scrollbar">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-primary-fixed text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={item.label}
            >
              {item.icon}
              {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}
              {!isCollapsed && item.badge && (
                <span className="px-1.5 py-0.2 rounded-full bg-primary text-on-primary text-[10px] font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Spaces Section */}
        {!isCollapsed && (
          <div className="pt-4 pb-1">
            <div className="flex items-center justify-between px-3 text-[11px] font-mono uppercase tracking-wider text-outline">
              <span>Your Spaces</span>
              <span className="text-[10px]">{spaces.length}</span>
            </div>
            <div className="mt-1 space-y-0.5">
              {spaces.map((space) => {
                const isSelected = activeSpaceId === space.id;
                const spacePages = pages.filter((p) => p.spaceId === space.id);

                return (
                  <div key={space.id} className="group">
                    <button
                      onClick={() => {
                        setActiveSpaceId(space.id);
                        onNavigate(`/app/spaces/${space.id}`);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs transition-colors ${
                        isSelected
                          ? 'bg-surface-container text-on-surface font-medium'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                      }`}
                    >
                      <div className="text-primary flex-shrink-0">
                        {spaceIcons[space.icon] || <Compass className="w-4 h-4" />}
                      </div>
                      <span className="flex-1 text-left truncate">{space.name}</span>
                      {space.isFavorite && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </button>

                    {/* Nested pages for active space */}
                    {isSelected && spacePages.length > 0 && (
                      <div className="ml-5 pl-2 border-l border-surface-container my-1 space-y-0.5">
                        {spacePages.map((page) => (
                          <button
                            key={page.id}
                            onClick={() => onNavigate(`/app/pages/${page.id}`)}
                            className={`w-full flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] truncate text-left transition-colors ${
                              currentPath.includes(page.id)
                                ? 'text-primary font-medium bg-primary-fixed/40'
                                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                            }`}
                          >
                            <FileText className="w-3 h-3 text-secondary flex-shrink-0" />
                            <span className="truncate">{page.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* User Profile & Account Switcher Footer */}
      <div className="p-3 border-t border-surface-container relative">
        <div
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={`flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-surface-container cursor-pointer transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <Avatar
            src={currentUser?.avatarUrl}
            name={currentUser?.name || 'User'}
            size="sm"
            status={currentUser?.status}
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0 text-left">
              <div className="text-xs font-semibold text-on-surface truncate">
                {currentUser?.name}
              </div>
              <div className="text-[10px] text-on-surface-variant truncate font-mono">
                {currentUser?.email}
              </div>
            </div>
          )}
          {!isCollapsed && <ChevronDown className="w-3.5 h-3.5 text-secondary" />}
        </div>

        {/* User popover menu */}
        {showUserMenu && !isCollapsed && (
          <div className="absolute bottom-16 left-3 right-3 bg-surface-container-lowest border border-surface-container rounded-2xl shadow-xl p-2 z-40 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[10px] font-mono text-outline uppercase tracking-wider">
              Switch Teammate
            </div>
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  switchUser(u.id);
                  setShowUserMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                  currentUser?.id === u.id
                    ? 'bg-primary-fixed text-primary font-medium'
                    : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <Avatar src={u.avatarUrl} name={u.name} size="xs" />
                <span className="truncate flex-1 text-left">{u.name}</span>
                {currentUser?.id === u.id && (
                  <span className="text-[10px] text-primary font-mono">Active</span>
                )}
              </button>
            ))}
            <div className="my-1 border-t border-surface-container" />
            <button
              onClick={() => {
                logout();
                setShowUserMenu(false);
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-error hover:bg-error-container/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
