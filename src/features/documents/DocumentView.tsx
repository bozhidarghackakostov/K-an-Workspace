import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  MessageSquare,
  Share2,
  CheckCircle,
  Lightbulb,
  Send,
  Bold,
  Italic,
  List,
  CheckSquare,
  Code,
  AtSign,
  Plus,
  Mic,
  ChevronDown,
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { documentService } from '../../services';
import { ContentBlock } from '../../types';

export interface DocumentViewProps {
  documentId?: string;
  onNavigate: (path: string) => void;
}

export const DocumentView: React.FC<DocumentViewProps> = ({
  documentId,
  onNavigate,
}) => {
  const { documents, createTask } = useWorkspace();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const currentDoc =
    documents.find((d) => d.id === documentId) || documents[0] || null;

  const [title, setTitle] = useState(currentDoc?.title || 'Design Brief & Visual Identity');
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    currentDoc?.blocks || [
      { id: 'b1', type: 'heading_1', content: '1. Executive Vision' },
      {
        id: 'b2',
        type: 'paragraph',
        content:
          'The interface should evoke quiet confidence. We are fusing deep document composition with real-time conversational channels, removing the artificial divide between discussions and output.',
      },
      {
        id: 'b3',
        type: 'paragraph',
        content:
          'Every screen layout responds to human focus: conversations live organically adjacent to content, allowing teammates to resolve ambiguities without context switching.',
      },
      {
        id: 'b4',
        type: 'callout',
        content:
          'Note: Ensure dark mode maintains 4.5:1 contrast ratio across all muted stone text tokens.',
      },
    ]
  );
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [threadMessages, setThreadMessages] = useState([
    {
      id: 'tm-1',
      senderName: 'Maya Lin',
      text: 'Should we test Inter Variable vs SF Pro for the headings?',
      time: '4m ago',
    },
  ]);
  const [isTaskCreated, setIsTaskCreated] = useState(true);

  // Autosave simulation to persistence layer
  useEffect(() => {
    if (!currentDoc) return;
    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await documentService.updateDocument({
          ...currentDoc,
          title,
          blocks,
        });
        setSaveStatus('saved');
      } catch {
        setSaveStatus('saved');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [title, blocks, currentDoc]);

  const handleBlockChange = (id: string, newContent: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, content: newContent } : b))
    );
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setThreadMessages((prev) => [
      ...prev,
      {
        id: `tm-${Date.now()}`,
        senderName: currentUser?.name || 'You',
        text: replyText,
        time: 'Just now',
      },
    ]);
    setReplyText('');
    showToast('Reply added to document discussion', 'success');
  };

  const handleConvertToTask = async () => {
    await createTask(
      'Test Inter Variable vs SF Pro headings',
      currentDoc?.spaceId,
      currentDoc?.id
    );
    setIsTaskCreated(true);
    showToast('Task created from discussion thread', 'success');
  };

  return (
    <div className="relative flex flex-col min-h-full w-full max-w-3xl mx-auto pb-36 pt-2 px-4 sm:px-6">
      {/* Top Document Bar */}
      <div className="flex items-center justify-between py-2 border-b border-surface-container mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => onNavigate('/app/home')}
            className="p-1 rounded-lg text-secondary hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center text-xs text-on-surface-variant font-mono truncate">
            <span>Website Redesign</span>
            <span className="mx-1 text-outline">/</span>
            <span className="font-semibold text-on-surface truncate">{title}</span>
          </div>
        </div>

        {/* Collaborators & Discussion toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center -space-x-1.5">
            <div className="w-6 h-6 rounded-full ring-2 ring-primary bg-surface-container overflow-hidden">
              <Avatar name="Alex Rivera" size="xs" />
            </div>
            <div className="w-6 h-6 rounded-full ring-2 ring-amber-500 bg-surface-container overflow-hidden">
              <Avatar name="Maya Lin" size="xs" />
            </div>
            <div className="w-6 h-6 rounded-full ring-2 ring-emerald-500 bg-surface-container overflow-hidden">
              <Avatar name="Jordan Diaz" size="xs" />
            </div>
          </div>

          <button
            onClick={() => setIsDiscussionOpen(!isDiscussionOpen)}
            className={`relative p-1.5 rounded-lg transition-colors ${
              isDiscussionOpen
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
            title="Toggle contextual discussion"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 px-1 rounded-full bg-error text-on-error text-[9px] font-bold">
              2
            </span>
          </button>

          <button
            onClick={() => showToast('Link copied to clipboard', 'info')}
            className="p-1.5 text-secondary hover:text-on-surface hover:bg-surface-container rounded-lg"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Document Header & Metadata */}
      <div className="mb-6 space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl sm:text-3xl font-bold text-on-surface bg-transparent focus:outline-none border-b border-transparent focus:border-surface-container pb-1"
        />

        <div className="flex items-center flex-wrap gap-y-1 gap-x-2 text-xs font-mono text-outline">
          <span>Created by Alex Rivera</span>
          <span>·</span>
          <span>
            {saveStatus === 'saving' ? (
              <span className="text-amber-500">Saving...</span>
            ) : (
              <span className="text-emerald-600">Saved</span>
            )}
          </span>
          <span>·</span>
          <span className="text-primary font-medium">3 Collaborators</span>
          <span>·</span>
          <span>Linked to 4 Tasks</span>
        </div>
      </div>

      {/* Document Content Canvas */}
      <article className="space-y-4">
        {blocks.map((b) => {
          if (b.type === 'heading_1') {
            return (
              <input
                key={b.id}
                type="text"
                value={b.content}
                onChange={(e) => handleBlockChange(b.id, e.target.value)}
                className="w-full text-lg sm:text-xl font-semibold text-on-surface bg-transparent focus:outline-none pt-2"
              />
            );
          }
          if (b.type === 'callout') {
            return (
              <div
                key={b.id}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs"
              >
                <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <textarea
                  value={b.content}
                  onChange={(e) => handleBlockChange(b.id, e.target.value)}
                  rows={2}
                  className="w-full text-xs sm:text-sm text-on-surface bg-transparent focus:outline-none resize-none leading-relaxed"
                />
              </div>
            );
          }
          return (
            <textarea
              key={b.id}
              value={b.content}
              onChange={(e) => handleBlockChange(b.id, e.target.value)}
              rows={3}
              className="w-full text-sm sm:text-base text-on-surface bg-transparent focus:outline-none resize-none leading-relaxed"
            />
          );
        })}
      </article>

      {/* Floating Selection Context Toolbar Mockup Pill */}
      <div className="my-4 flex items-center justify-start">
        <div className="inline-flex items-center bg-inverse-surface text-inverse-on-surface rounded-full py-1 px-1.5 shadow-xl text-xs space-x-1">
          <button
            onClick={() => setIsDiscussionOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-container text-on-primary font-medium"
          >
            <MessageSquare className="w-3 h-3" />
            <span>Comment (2)</span>
          </button>
          <button
            onClick={handleConvertToTask}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-inverse-on-surface hover:bg-white/10"
          >
            <CheckCircle className="w-3 h-3" />
            <span>Task</span>
          </button>
          <button
            onClick={() => showToast('Format options available in slash menu', 'info')}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-inverse-on-surface hover:bg-white/10"
          >
            <Italic className="w-3 h-3" />
            <span>Format</span>
          </button>
        </div>
      </div>

      {/* Attached Contextual Conversation Bottom Sheet */}
      {isDiscussionOpen && (
        <section className="fixed bottom-12 inset-x-0 max-w-xl mx-auto z-30 bg-surface-container-lowest rounded-t-3xl shadow-2xl border-t border-surface-container p-4 space-y-3 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex justify-center -mt-1 pb-1">
            <div className="w-8 h-1 rounded-full bg-outline-variant" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-on-surface truncate">
                Thread on §1.2 Homepage Typography
              </span>
              <span className="text-[11px] font-mono text-outline flex-shrink-0">
                (Linked to ¶2)
              </span>
            </div>
            <button
              onClick={() => setIsDiscussionOpen(false)}
              className="p-1 rounded-lg text-secondary hover:text-on-surface"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {threadMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container flex items-start gap-2.5"
              >
                <Avatar name={msg.senderName} size="xs" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold text-on-surface">
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] font-mono text-outline">
                      {msg.time}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface leading-snug">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            {isTaskCreated ? (
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium">Task #104 linked</span>
              </div>
            ) : (
              <button
                onClick={handleConvertToTask}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface text-xs hover:bg-surface-container-high transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Convert to Task</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSendReply} className="relative flex items-center pt-1">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Reply to thread or /slash..."
              className="w-full h-9 pl-3 pr-9 rounded-xl bg-surface-container-low border border-surface-container text-on-surface placeholder:text-outline text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
            <button
              type="submit"
              className="absolute right-1.5 p-1 rounded-lg text-primary hover:bg-primary-fixed/50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>
      )}

      {/* Floating Keyboard Accessory Toolbar */}
      <footer className="fixed bottom-0 inset-x-0 max-w-xl mx-auto z-40 bg-surface/95 backdrop-blur-md border-t border-surface-container px-3 py-1.5 flex items-center justify-between text-secondary">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => showToast('Bold formatted', 'info')}
            className="p-1.5 rounded-lg hover:bg-surface-container hover:text-on-surface"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => showToast('Italic formatted', 'info')}
            className="p-1.5 rounded-lg hover:bg-surface-container hover:text-on-surface"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => showToast('List inserted', 'info')}
            className="p-1.5 rounded-lg hover:bg-surface-container hover:text-on-surface"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => showToast('Checkbox block added', 'info')}
            className="p-1.5 rounded-lg hover:bg-surface-container hover:text-on-surface"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => showToast('Code block created', 'info')}
            className="p-1.5 rounded-lg hover:bg-surface-container hover:text-on-surface"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={() => showToast('Mention teammate', 'info')}
            className="p-1.5 rounded-lg hover:bg-surface-container hover:text-on-surface"
          >
            <AtSign className="w-4 h-4" />
          </button>
          <button
            onClick={() => showToast('Block menu', 'info')}
            className="p-1.5 rounded-lg text-primary hover:bg-primary-fixed/40"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => showToast('Voice memo recording initiated', 'info')}
          className="p-1.5 rounded-lg hover:bg-surface-container hover:text-on-surface"
        >
          <Mic className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
