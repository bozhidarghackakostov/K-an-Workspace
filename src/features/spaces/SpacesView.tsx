import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  FileText,
  CheckSquare,
  MessageSquare,
  Link,
  ChevronRight,
  Pin,
  Calendar,
  Sparkles,
  Plus,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

export interface SpacesViewProps {
  spaceId?: string;
  onNavigate: (path: string) => void;
  onOpenQuickCapture: (type?: 'note' | 'task' | 'document' | 'message') => void;
}

export const SpacesView: React.FC<SpacesViewProps> = ({
  spaceId,
  onNavigate,
  onOpenQuickCapture,
}) => {
  const { spaces, documents, tasks, toggleTask, conversations } = useWorkspace();
  const [filter, setFilter] = useState<'all' | 'docs' | 'tasks' | 'discussions'>('all');

  const currentSpace =
    spaces.find((s) => s.id === spaceId) || spaces[0] || null;

  const spaceDocs = documents.filter(
    (d) => !currentSpace || d.spaceId === currentSpace.id
  );
  const spaceTasks = tasks.filter(
    (t) => !currentSpace || t.spaceId === currentSpace.id
  );
  const spaceConvs = conversations.filter(
    (c) => !currentSpace || c.spaceId === currentSpace.id || c.type === 'document_thread'
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold">
            Active Space
          </span>
          <span className="text-[11px] font-mono text-outline flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Kōan Pro
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface">
            {currentSpace?.name || 'Website Redesign'}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-1">
            {currentSpace?.description ||
              'End-to-end overhaul of public web experience and product onboarding. Target ship: Oct 2026.'}
          </p>
        </div>

        {/* Connection Map pill */}
        <div className="pt-1 flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-container-low text-on-surface border border-surface-container text-xs font-mono">
            <span className="flex items-center gap-1 text-primary">
              <FileText className="w-3.5 h-3.5" />
              <span>{spaceDocs.length} Docs</span>
            </span>
            <span className="text-outline">↔</span>
            <span className="flex items-center gap-1 text-primary">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{spaceTasks.length} Tasks</span>
            </span>
            <span className="text-outline">↔</span>
            <span className="flex items-center gap-1 text-primary">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{spaceConvs.length} Chats</span>
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
            filter === 'all'
              ? 'bg-on-surface text-surface'
              : 'bg-surface-container-lowest border border-surface-container text-on-surface hover:bg-surface-container'
          }`}
        >
          All ({spaceDocs.length + spaceTasks.length + spaceConvs.length})
        </button>
        <button
          onClick={() => setFilter('docs')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
            filter === 'docs'
              ? 'bg-on-surface text-surface'
              : 'bg-surface-container-lowest border border-surface-container text-on-surface hover:bg-surface-container'
          }`}
        >
          Documents ({spaceDocs.length})
        </button>
        <button
          onClick={() => setFilter('tasks')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
            filter === 'tasks'
              ? 'bg-on-surface text-surface'
              : 'bg-surface-container-lowest border border-surface-container text-on-surface hover:bg-surface-container'
          }`}
        >
          Tasks ({spaceTasks.length})
        </button>
        <button
          onClick={() => setFilter('discussions')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
            filter === 'discussions'
              ? 'bg-on-surface text-surface'
              : 'bg-surface-container-lowest border border-surface-container text-on-surface hover:bg-surface-container'
          }`}
        >
          Discussions ({spaceConvs.length})
        </button>
      </div>

      {/* SECTION 1: Pinned Documents & Briefs */}
      {(filter === 'all' || filter === 'docs') && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pin className="w-4 h-4 text-outline" />
              <h2 className="text-sm font-semibold text-on-surface">
                Pinned Documents & Briefs
              </h2>
            </div>
            <button
              onClick={() => onOpenQuickCapture('document')}
              className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>New Doc</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {spaceDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onNavigate(`/app/documents/${doc.id}`)}
                className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container hover:border-primary/40 transition-colors shadow-xs flex items-start justify-between cursor-pointer group active:scale-[0.99]"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <h3 className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-outline font-mono">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active now
                      </span>
                      <span>•</span>
                      <span>{doc.tags.join(', ')}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-outline group-hover:text-on-surface transition-colors flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: Connected Task Board */}
      {(filter === 'all' || filter === 'tasks') && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-outline" />
              <h2 className="text-sm font-semibold text-on-surface">
                Interactive Task Board
              </h2>
            </div>
            <button
              onClick={() => onOpenQuickCapture('task')}
              className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="space-y-2">
            {spaceTasks.map((task) => (
              <div
                key={task.id}
                className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-container shadow-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={task.status === 'done'}
                      onChange={() => toggleTask(task.id)}
                      className="mt-0.5 w-4 h-4 rounded text-primary border-outline focus:ring-primary cursor-pointer"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <span
                        className={`text-sm font-semibold block ${
                          task.status === 'done'
                            ? 'line-through text-outline'
                            : 'text-on-surface'
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.linkedDocumentId && (
                        <div className="flex items-center gap-1 text-xs text-primary font-mono">
                          <Link className="w-3 h-3" />
                          <button
                            onClick={() => onNavigate(`/app/documents/${task.linkedDocumentId}`)}
                            className="hover:underline"
                          >
                            Design Brief §1.2
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={
                      task.status === 'done'
                        ? 'secondary'
                        : task.priority === 'high'
                        ? 'warning'
                        : 'primary'
                    }
                    size="sm"
                  >
                    {task.status === 'done' ? 'Done' : 'In Progress'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-surface-container text-xs font-mono text-outline">
                  <div className="flex items-center gap-1.5">
                    <Avatar name={task.assigneeId || 'Maya'} size="xs" />
                    <span>Maya</span>
                  </div>
                  <div className="flex items-center gap-1 text-secondary">
                    <Calendar className="w-3 h-3" />
                    <span>Due Friday</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: Active Space Discussions */}
      {(filter === 'all' || filter === 'discussions') && (
        <section className="space-y-2.5 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-outline" />
              <h2 className="text-sm font-semibold text-on-surface">
                Active Space Discussions
              </h2>
            </div>
            <button
              onClick={() => onOpenQuickCapture('message')}
              className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Start Thread</span>
            </button>
          </div>

          <div className="space-y-2">
            {spaceConvs.map((conv) => (
              <div
                key={conv.id}
                onClick={() => onNavigate('/app/messages')}
                className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container shadow-xs space-y-1 hover:border-primary/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface">
                    <span className="text-primary font-mono">#</span>
                    <span>{conv.title}</span>
                  </div>
                  <span className="text-[11px] font-mono text-outline">Recent</span>
                </div>
                <p className="text-xs text-on-surface-variant line-clamp-2">
                  Maya: "Shared updated font pairings. The neo-grotesque typography feels much sharper on mobile viewports."
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-outline">
                  <span>7 replies</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">1 resolution pending</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
