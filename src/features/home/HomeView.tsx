import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import {
  History,
  CheckSquare,
  MessageSquare,
  Compass,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';

export interface HomeViewProps {
  onNavigate: (path: string) => void;
  onOpenQuickCapture: (type?: 'note' | 'task' | 'document' | 'message') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenQuickCapture }) => {
  const { workspace, spaces, tasks, toggleTask, documents, conversations } = useWorkspace();
  const { currentUser } = useAuth();

  const todayTasks = tasks.slice(0, 5);
  const activeSpaces = spaces;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6 sm:space-y-8">
      {/* Hero Greeting */}
      <section className="space-y-1">
        <div className="flex items-center gap-2 text-secondary text-xs">
          <span className="font-mono uppercase tracking-wider">
            Wednesday, October 16
          </span>
          <span className="inline-block w-1 h-1 rounded-full bg-surface-container-high" />
          <span className="text-primary font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Synced
          </span>
        </div>
        <h1 className="font-headline-lg-mobile sm:font-headline-lg text-2xl sm:text-3xl text-on-surface font-semibold tracking-tight">
          Good morning, {currentUser?.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-sm text-on-surface-variant">
          Here is your focus today in {workspace?.name || 'Acme Labs'}.
        </p>
      </section>

      {/* Continue Where You Left Off (Horizontal snap scroll) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-on-surface">
              Continue where you left off
            </h2>
          </div>
          <span className="text-xs font-mono text-outline">
            {documents.length} active
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 snap-x snap-mandatory">
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onNavigate(`/app/documents/${doc.id}`)}
              className="min-w-[260px] sm:min-w-[280px] max-w-[290px] bg-surface-container-lowest p-4 rounded-2xl border border-surface-container shadow-xs flex flex-col justify-between snap-start hover:border-primary/40 cursor-pointer transition-all duration-150 active:scale-[0.98]"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="sm">
                    {doc.tags[0] || 'Doc'}
                  </Badge>
                  <span className="text-[11px] font-mono text-outline">Recent</span>
                </div>
                <h3 className="text-sm font-semibold text-on-surface leading-snug line-clamp-1">
                  {doc.title}
                </h3>
                <p className="text-xs text-on-surface-variant line-clamp-2">
                  {doc.blocks[1]?.content || doc.blocks[0]?.content || 'Empty document'}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-surface-container flex items-center justify-between">
                <div className="flex items-center -space-x-1.5">
                  {doc.collaboratorIds.map((cid, i) => (
                    <div
                      key={cid || i}
                      className="w-5 h-5 rounded-full ring-2 ring-surface-container-lowest bg-surface-container text-[9px] font-medium flex items-center justify-center text-on-surface overflow-hidden"
                    >
                      <Avatar name={cid} size="xs" />
                    </div>
                  ))}
                  <span className="ml-2 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-surface-container-lowest" />
                </div>
                <div className="flex items-center gap-1 text-secondary text-xs">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                  <span>{doc.linkedConversationIds.length} open</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Today's Priorities */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-on-surface">
              Today's Priorities
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/app/tasks')}
            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
          >
            <span>View all {tasks.length}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container p-2 shadow-xs flex flex-col divide-y divide-surface-container/60">
          {todayTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-2 hover:bg-surface-container-low/60 rounded-xl transition-colors group"
            >
              <input
                type="checkbox"
                checked={task.status === 'done'}
                onChange={() => toggleTask(task.id)}
                className="mt-0.5 w-4 h-4 rounded border-outline text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                id={`task-check-${task.id}`}
              />
              <label
                htmlFor={`task-check-${task.id}`}
                className="flex-1 flex flex-col cursor-pointer min-w-0"
              >
                <span
                  className={`text-sm font-medium transition-colors ${
                    task.status === 'done'
                      ? 'line-through text-outline'
                      : 'text-on-surface group-hover:text-primary'
                  }`}
                >
                  {task.title}
                </span>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {task.tags[0] && (
                    <span className="text-[10px] font-mono text-secondary bg-surface-container px-1.5 py-0.5 rounded">
                      [{task.tags[0]}]
                    </span>
                  )}
                  {task.priority === 'high' && (
                    <span className="flex items-center gap-1 text-[11px] text-error font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-error" /> High Priority
                    </span>
                  )}
                  {task.dueDate && (
                    <span className="text-[11px] text-outline font-mono">
                      Due Today
                    </span>
                  )}
                </div>
              </label>

              {task.linkedDocumentId && (
                <button
                  onClick={() => onNavigate(`/app/documents/${task.linkedDocumentId}`)}
                  className="text-secondary hover:text-primary p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Open linked document"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Recent Contextual Messages */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-on-surface">
              Recent Contextual Messages
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/app/messages')}
            className="text-xs text-secondary hover:text-on-surface"
          >
            All messages
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {conversations.slice(0, 2).map((conv) => (
            <div
              key={conv.id}
              onClick={() => onNavigate('/app/messages')}
              className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-container shadow-xs flex items-start gap-3 hover:border-primary/40 cursor-pointer transition-all active:scale-[0.99]"
            >
              <div className="w-9 h-9 rounded-xl bg-surface-container text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                {conv.type === 'channel' ? (
                  <Terminal className="w-4 h-4" />
                ) : (
                  <Avatar name={conv.title} size="sm" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-on-surface truncate">
                    {conv.title}
                  </span>
                  <span className="text-[11px] font-mono text-outline">Recent</span>
                </div>
                <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                  {conv.linkedDocumentId ? 'Left a note regarding document typography weights' : 'Active conversation thread'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Your Spaces (Bento Grid) */}
      <section className="space-y-2.5 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-on-surface">Your Spaces</h2>
          </div>
          <button
            onClick={() => onOpenQuickCapture('document')}
            className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>New Space Page</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activeSpaces.map((space) => (
            <div
              key={space.id}
              onClick={() => onNavigate(`/app/spaces/${space.id}`)}
              className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container hover:border-surface-dim hover:shadow-xs transition-all shadow-2xs flex flex-col justify-between cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <Compass className="w-4 h-4" />
                </div>
                {space.isFavorite && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                  {space.name}
                </h3>
                <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                  {space.description || 'Dedicated space for documents and discussions'}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-[11px] text-outline font-mono">
                <span>{space.memberIds.length} members</span>
                <ChevronRight className="w-3.5 h-3.5 text-secondary group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
