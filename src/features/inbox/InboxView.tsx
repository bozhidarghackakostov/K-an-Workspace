import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useToast } from '../../context/ToastContext';
import { Inbox, CheckCircle2, MessageSquare, CheckSquare, Bell } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export interface InboxViewProps {
  onNavigate: (path: string) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({ onNavigate }) => {
  const { notifications, refresh } = useWorkspace();
  const { showToast } = useToast();

  const handleMarkAllRead = async () => {
    const { notificationService } = await import('../../services');
    for (const n of notifications) {
      if (!n.isRead) {
        await notificationService.markAsRead(n.id);
      }
    }
    await refresh();
    showToast('All notifications marked as read', 'success');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-primary" />;
      case 'task_assigned':
        return <CheckSquare className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface">Inbox & Updates</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Contextual mentions, assigned tasks, and document threads.
          </p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <Button
            size="sm"
            variant="outline"
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            onClick={handleMarkAllRead}
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications list */}
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-surface-container text-on-surface-variant">
            <Inbox className="w-8 h-8 mx-auto mb-2 text-outline" />
            <p className="text-sm font-semibold text-on-surface">All caught up</p>
            <p className="text-xs">No pending notifications in your inbox.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (n.targetUrl) onNavigate(n.targetUrl);
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                n.isRead
                  ? 'bg-surface-container-lowest/50 border-surface-container/60 opacity-80'
                  : 'bg-surface-container-lowest border-surface-container shadow-xs hover:border-primary/40'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center flex-shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-on-surface">{n.title}</span>
                  <span className="text-[10px] font-mono text-outline">Recent</span>
                </div>
                <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                  {n.body}
                </p>
              </div>
              {!n.isRead && (
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
