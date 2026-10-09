import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, CheckSquare, MessageSquare, Compass, Moon, Sun, Plus, X } from 'lucide-react';
import { searchService } from '../../services';
import { SearchResult } from '../../types';
import { useTheme } from '../../context/ThemeContext';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onQuickCapture: (type: 'note' | 'task' | 'document' | 'message') => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onQuickCapture,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    let active = true;
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const searchResults = await searchService.search(query);
      if (active) {
        setResults(searchResults);
        setSelectedIndex(0);
      }
    }, 150);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  // Quick actions when no query
  const defaultActions = [
    {
      id: 'act-note',
      title: 'Create quick note',
      subtitle: 'Capture idea instantly',
      icon: <Plus className="w-4 h-4 text-primary" />,
      action: () => {
        onClose();
        onQuickCapture('note');
      },
    },
    {
      id: 'act-task',
      title: 'Create new task',
      subtitle: 'Add to today priorities',
      icon: <CheckSquare className="w-4 h-4 text-primary" />,
      action: () => {
        onClose();
        onQuickCapture('task');
      },
    },
    {
      id: 'act-doc',
      title: 'New document',
      subtitle: 'Deep focus writing canvas',
      icon: <FileText className="w-4 h-4 text-primary" />,
      action: () => {
        onClose();
        onQuickCapture('document');
      },
    },
    {
      id: 'act-theme',
      title: theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode',
      subtitle: 'Toggle workspace theme appearance',
      icon: theme === 'light' ? <Moon className="w-4 h-4 text-secondary" /> : <Sun className="w-4 h-4 text-amber-500" />,
      action: () => {
        toggleTheme();
        onClose();
      },
    },
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const max = query.trim() ? results.length : defaultActions.length;
      if (max > 0) setSelectedIndex((prev) => (prev + 1) % max);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const max = query.trim() ? results.length : defaultActions.length;
      if (max > 0) setSelectedIndex((prev) => (prev - 1 + max) % max);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim() && results[selectedIndex]) {
        onNavigate(results[selectedIndex].url);
        onClose();
      } else if (!query.trim() && defaultActions[selectedIndex]) {
        defaultActions[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-surface-container-lowest border border-surface-container rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-surface-container gap-3">
          <Search className="w-5 h-5 text-secondary flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search documents, spaces, tasks, notes, messages..."
            className="w-full bg-transparent text-on-surface placeholder:text-outline text-sm focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-secondary hover:text-on-surface"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="px-1.5 py-0.5 text-[11px] font-mono rounded bg-surface-container text-secondary border border-surface-dim">
              ESC
            </kbd>
          )}
        </div>

        {/* Results / Suggestions */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-surface-container/50">
          {query.trim() === '' ? (
            <div className="py-2">
              <div className="px-3 py-1 text-[11px] font-mono text-outline uppercase tracking-wider">
                Quick Actions
              </div>
              {defaultActions.map((act, idx) => (
                <button
                  key={act.id}
                  onClick={act.action}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    selectedIndex === idx
                      ? 'bg-surface-container text-primary font-medium'
                      : 'text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-surface-container-lowest flex items-center justify-center border border-surface-container">
                    {act.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{act.title}</div>
                    <div className="text-xs text-on-surface-variant truncate">{act.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant text-sm">
              No matches found for <span className="font-semibold text-on-surface">"{query}"</span>
            </div>
          ) : (
            <div className="py-1">
              <div className="px-3 py-1 text-[11px] font-mono text-outline uppercase tracking-wider">
                Results ({results.length})
              </div>
              {results.map((res, idx) => {
                const iconMap = {
                  document: <FileText className="w-4 h-4 text-primary" />,
                  note: <FileText className="w-4 h-4 text-amber-600" />,
                  task: <CheckSquare className="w-4 h-4 text-emerald-600" />,
                  message: <MessageSquare className="w-4 h-4 text-primary-container" />,
                  space: <Compass className="w-4 h-4 text-indigo-600" />,
                  page: <FileText className="w-4 h-4 text-secondary" />,
                  file: <FileText className="w-4 h-4 text-secondary" />,
                };

                return (
                  <button
                    key={res.id}
                    onClick={() => {
                      onNavigate(res.url);
                      onClose();
                    }}
                    className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      selectedIndex === idx
                        ? 'bg-surface-container text-on-surface font-medium'
                        : 'text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-surface-container-lowest flex items-center justify-center border border-surface-container mt-0.5 flex-shrink-0">
                      {iconMap[res.type] || <FileText className="w-4 h-4 text-secondary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-on-surface truncate">
                          {res.title}
                        </span>
                        <span className="text-[10px] font-mono text-outline uppercase px-1.5 py-0.5 rounded bg-surface-container ml-2">
                          {res.type}
                        </span>
                      </div>
                      {res.subtitle && (
                        <div className="text-xs text-on-surface-variant">{res.subtitle}</div>
                      )}
                      {res.snippet && (
                        <div className="text-xs text-outline line-clamp-1 mt-0.5 font-sans">
                          {res.snippet}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-surface-container-low border-t border-surface-container flex items-center justify-between text-[11px] text-outline font-mono">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>Kōan Core Search</span>
        </div>
      </div>
    </div>
  );
};
