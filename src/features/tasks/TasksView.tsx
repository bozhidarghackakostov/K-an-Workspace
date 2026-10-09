import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useToast } from '../../context/ToastContext';
import {
  CheckSquare,
  Plus,
  Filter,
  Calendar,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export interface TasksViewProps {
  onNavigate: (path: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ onNavigate }) => {
  const { tasks, toggleTask, createTask, spaces } = useWorkspace();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'todo') return t.status !== 'done';
    if (filter === 'done') return t.status === 'done';
    return true;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await createTask(newTitle.trim(), spaces[0]?.id);
      setNewTitle('');
      setIsAdding(false);
      showToast('Task added to workspace', 'success');
    } catch {
      showToast('Failed to create task', 'error');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface">Tasks & Priorities</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Cross-space action items linked directly to documents and discussions.
          </p>
        </div>
        <Button
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAdding((prev) => !prev)}
        >
          New Task
        </Button>
      </div>

      {/* Inline Add Task Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-4 rounded-2xl bg-surface-container-lowest border border-primary/40 shadow-sm space-y-3 animate-in fade-in"
        >
          <Input
            placeholder="What needs to get done?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
            required
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Task
            </Button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            filter === 'all'
              ? 'bg-on-surface text-surface'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          All ({tasks.length})
        </button>
        <button
          onClick={() => setFilter('todo')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            filter === 'todo'
              ? 'bg-on-surface text-surface'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          To Do ({tasks.filter((t) => t.status !== 'done').length})
        </button>
        <button
          onClick={() => setFilter('done')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            filter === 'done'
              ? 'bg-on-surface text-surface'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          Completed ({tasks.filter((t) => t.status === 'done').length})
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex items-center justify-between gap-3 hover:border-primary/40 transition-colors group"
          >
            <div className="flex items-start gap-3 min-w-0">
              <input
                type="checkbox"
                checked={task.status === 'done'}
                onChange={() => toggleTask(task.id)}
                className="mt-1 w-4 h-4 rounded text-primary border-outline focus:ring-primary cursor-pointer"
              />
              <div className="min-w-0 space-y-1">
                <span
                  className={`text-sm font-medium block ${
                    task.status === 'done'
                      ? 'line-through text-outline'
                      : 'text-on-surface group-hover:text-primary'
                  }`}
                >
                  {task.title}
                </span>

                <div className="flex items-center gap-2 text-xs font-mono text-outline flex-wrap">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.2 rounded bg-surface-container text-secondary"
                    >
                      #{tag}
                    </span>
                  ))}
                  {task.linkedDocumentId && (
                    <button
                      onClick={() => onNavigate(`/app/documents/${task.linkedDocumentId}`)}
                      className="text-primary hover:underline flex items-center gap-1 font-sans"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Linked Document</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
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
                {task.priority}
              </Badge>
              <Avatar name={task.assigneeId || 'Team'} size="xs" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
