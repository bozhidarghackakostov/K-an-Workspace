import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  MessageSquare,
  FileText,
  Search,
  ExternalLink,
  Paperclip,
  Mic,
  Send,
  Play,
  CheckCircle,
  Hash,
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';

export interface MessagesViewProps {
  onNavigate: (path: string) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({ onNavigate }) => {
  const { conversations, createMessage } = useWorkspace();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [activeConvId, setActiveConvId] = useState<string>(
    conversations[0]?.id || 'conv-website'
  );
  const [inputText, setInputText] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const activeConv =
    conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    try {
      await createMessage(activeConv.id, inputText);
      setInputText('');
      showToast('Message sent', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to send message', 'error');
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto px-4 sm:px-6 pt-2 pb-24">
      {/* Top Channel Header */}
      <div className="flex items-center justify-between py-3 border-b border-surface-container mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center flex-shrink-0">
            <Hash className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-on-surface truncate">
                {activeConv?.title || 'website-redesign'}
              </h1>
              <span className="text-[10px] font-mono text-outline px-1.5 py-0.2 rounded bg-surface-container">
                Space Channel
              </span>
            </div>
            {activeConv?.linkedDocumentId && (
              <div
                onClick={() => onNavigate(`/app/documents/${activeConv.linkedDocumentId}`)}
                className="flex items-center gap-1 text-xs text-primary font-mono cursor-pointer hover:underline truncate"
              >
                <FileText className="w-3 h-3" />
                <span>Attached to: Design Brief & Visual Identity</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => showToast('Search channel history', 'info')}
            className="p-1.5 text-secondary hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Feed Timeline */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* Message 1: Maya with embedded doc link */}
        <div className="flex items-start gap-3">
          <Avatar name="Maya Lin" size="sm" />
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface">Maya Lin</span>
              <span className="text-[10px] font-mono text-outline">10:42 AM</span>
            </div>
            <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
              Uploaded the latest design tokens for review. Take a look at the revised typography scale in the brief:
            </p>

            {/* Embedded Document Reference Card */}
            <div
              onClick={() => onNavigate('/app/documents/doc-brief')}
              className="p-3 rounded-2xl bg-surface-container-lowest border border-surface-container hover:border-primary/50 transition-colors shadow-xs flex items-center justify-between cursor-pointer group max-w-md"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                    Design Brief & Visual Identity
                  </div>
                  <div className="text-[11px] text-outline font-mono">
                    Section 2.1: Typography Hierarchy
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-primary font-medium ml-2 flex-shrink-0">
                <span>Open</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Message 2: Alex with linked task */}
        <div className="flex items-start gap-3">
          <Avatar name={currentUser?.name || 'Alex Rivera'} size="sm" />
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface">
                {currentUser?.name || 'Alex Rivera'}
              </span>
              <span className="text-[10px] font-mono text-outline">10:45 AM</span>
            </div>
            <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
              Love the contrast adjustments on the subheadings. Moving this to our sprint board.
            </p>

            {/* Connected Action Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-200 dark:border-emerald-800">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium">Task #104 auto-created from this discussion</span>
            </div>
          </div>
        </div>

        {/* Message 3: Voice memo audio pill */}
        <div className="flex items-start gap-3">
          <Avatar name="Jordan Diaz" size="sm" />
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface">Jordan Diaz</span>
              <span className="text-[10px] font-mono text-outline">11:02 AM</span>
            </div>

            {/* Voice Memo Player */}
            <div className="inline-flex items-center gap-3 p-2.5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-transform active:scale-95"
              >
                <Play className={`w-4 h-4 ml-0.5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
              </button>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  {[40, 70, 90, 45, 80, 100, 60, 30, 85, 50, 75, 40, 95, 60, 30, 70].map(
                    (height, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full ${
                          isPlayingAudio && i < 8 ? 'bg-primary' : 'bg-surface-container-high'
                        }`}
                        style={{ height: `${height * 0.2}px` }}
                      />
                    )
                  )}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-outline">
                  <span>Voice Note</span>
                  <span>0:42</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Input Footer */}
      <form onSubmit={handleSend} className="mt-4 pt-2 border-t border-surface-container">
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-surface-container-lowest border border-surface-container focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 shadow-xs">
          <button
            type="button"
            onClick={() => showToast('Attachment options', 'info')}
            className="p-1.5 text-secondary hover:text-on-surface rounded-lg"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => showToast('Link document', 'info')}
            className="p-1.5 text-secondary hover:text-on-surface rounded-lg"
            title="Link document"
          >
            <FileText className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message #${activeConv?.title || 'channel'}...`}
            className="flex-1 bg-transparent text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none"
          />

          <button
            type="button"
            onClick={() => showToast('Hold to record voice memo', 'info')}
            className="p-1.5 text-secondary hover:text-on-surface rounded-lg"
            title="Voice Memo"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
