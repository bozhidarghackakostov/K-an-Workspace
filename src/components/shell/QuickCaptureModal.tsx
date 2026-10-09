import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useToast } from '../../context/ToastContext';
import { CheckSquare, FileText, Send, Sparkles } from 'lucide-react';

export interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'note' | 'task' | 'document' | 'message';
  onNavigate?: (path: string) => void;
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'note',
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'note' | 'task' | 'document' | 'message'>(initialTab);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { spaces, activeSpaceId, createTask, createNote, createDocument, createMessage, conversations } = useWorkspace();
  const { showToast } = useToast();

  const handleReset = () => {
    setTitle('');
    setContent('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    setIsSubmitting(true);
    try {
      if (activeTab === 'task') {
        const t = await createTask(title || content, activeSpaceId || spaces[0]?.id);
        showToast(`Task "${t.title}" created`, 'success');
      } else if (activeTab === 'note') {
        await createNote(title || 'Untitled Note', content, activeSpaceId || spaces[0]?.id);
        showToast('Quick note saved', 'success');
      } else if (activeTab === 'document') {
        const doc = await createDocument(title || 'Untitled Document', activeSpaceId || spaces[0]?.id);
        showToast(`Document "${doc.title}" created`, 'success');
        if (onNavigate) {
          onNavigate(`/app/documents/${doc.id}`);
        }
      } else if (activeTab === 'message') {
        const targetConv = conversations[0];
        if (targetConv) {
          await createMessage(targetConv.id, content || title);
          showToast(`Message sent to ${targetConv.title}`, 'success');
        }
      }
      handleClose();
    } catch (err) {
      console.error('Quick capture error:', err);
      showToast('Failed to save item', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Quick Capture" maxWidth="md">
      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-xl mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('note')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'note'
              ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Note</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('task')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'task'
              ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Task</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('document')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'document'
              ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Doc</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('message')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'message'
              ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Message</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {activeTab !== 'message' ? (
          <>
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                activeTab === 'task'
                  ? 'e.g., Audit typography scale...'
                  : activeTab === 'note'
                  ? 'Note headline'
                  : 'Document title'
              }
              autoFocus
              required
            />
            {activeTab !== 'document' && (
              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-label-sm text-xs font-medium text-on-surface-variant">
                  Details / Body
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Additional context or notes..."
                  rows={3}
                  className="w-full rounded-xl p-3 bg-surface-container-lowest border border-surface-container text-on-surface placeholder:text-outline text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-1.5 text-left">
            <label className="font-label-sm text-xs font-medium text-on-surface-variant">
              Message to {conversations[0]?.title || 'Team'}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message..."
              rows={3}
              className="w-full rounded-xl p-3 bg-surface-container-lowest border border-surface-container text-on-surface placeholder:text-outline text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
              autoFocus
              required
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            {activeTab === 'task'
              ? 'Save Task'
              : activeTab === 'note'
              ? 'Save Note'
              : activeTab === 'document'
              ? 'Create & Open'
              : 'Send Message'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
