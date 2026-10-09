import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { CommandPalette } from './CommandPalette';
import { QuickCaptureModal } from './QuickCaptureModal';
import { Plus } from 'lucide-react';

export interface AppShellProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentPath,
  onNavigate,
  children,
}) => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [captureTab, setCaptureTab] = useState<'note' | 'task' | 'document' | 'message'>('note');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K -> Search / Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
      // Cmd/Ctrl + N -> Quick Capture
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n' && !e.shiftKey) {
        e.preventDefault();
        setCaptureTab('note');
        setIsQuickCaptureOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenCapture = (type: 'note' | 'task' | 'document' | 'message' = 'note') => {
    setCaptureTab(type);
    setIsQuickCaptureOpen(true);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-on-surface">
      {/* Desktop Left Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        onOpenCommand={() => setIsCommandOpen(true)}
        onQuickCapture={() => handleOpenCapture('note')}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Workspace Stage */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden relative">
        <TopBar
          onOpenSearch={() => setIsCommandOpen(true)}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Scrollable Content Viewport */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-8">
          {children}
        </main>

        {/* Floating Mobile Quick Capture Pill */}
        <div className="md:hidden fixed bottom-18 right-4 z-40">
          <button
            onClick={() => handleOpenCapture('note')}
            className="flex items-center gap-1.5 bg-primary text-on-primary py-2.5 px-4 rounded-full shadow-lg hover:bg-primary-container active:scale-95 transition-all"
            aria-label="Capture item"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wide">Capture</span>
          </button>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav
          currentPath={currentPath}
          onNavigate={onNavigate}
          onOpenSearch={() => setIsCommandOpen(true)}
        />
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigate={onNavigate}
        onQuickCapture={handleOpenCapture}
      />

      {/* Quick Capture Modal */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        initialTab={captureTab}
        onNavigate={onNavigate}
      />
    </div>
  );
};
