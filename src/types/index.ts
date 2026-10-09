export type ID = string;

export interface User {
  id: ID;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  status?: 'active' | 'offline' | 'away';
  title?: string;
  color?: string;
}

export interface Workspace {
  id: ID;
  name: string;
  slug: string;
  icon: string;
  accentColor: string;
  ownerId: ID;
  createdAt: string;
  updatedAt: string;
  settings: WorkspaceSettings;
}

export interface WorkspaceSettings {
  defaultSpaceId?: ID;
  allowGuests: boolean;
  theme: 'system' | 'light' | 'dark';
}

export interface Space {
  id: ID;
  workspaceId: ID;
  name: string;
  slug: string;
  icon: string;
  accentColor: string;
  description?: string;
  memberIds: ID[];
  isFavorite: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: ID;
  workspaceId: ID;
  spaceId: ID;
  parentId?: ID | null; // For hierarchical nesting
  title: string;
  icon: string;
  isFavorite: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  type: 'document' | 'note' | 'database';
  documentId?: ID;
  noteId?: ID;
  databaseId?: ID;
}

export type ContentBlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bullet_list'
  | 'check_list'
  | 'quote'
  | 'code_block'
  | 'callout'
  | 'divider'
  | 'table';

export interface ContentBlock {
  id: ID;
  type: ContentBlockType;
  content: string; // Plain text or markdown
  checked?: boolean; // For check_list
  metadata?: Record<string, unknown>;
}

export interface Document {
  id: ID;
  workspaceId: ID;
  spaceId: ID;
  pageId?: ID;
  title: string;
  icon?: string;
  coverImage?: string;
  blocks: ContentBlock[];
  createdById: ID;
  lastEditedById: ID;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  collaboratorIds: ID[];
  linkedTaskIds: ID[];
  linkedConversationIds: ID[];
  isArchived?: boolean;
}

export interface Note {
  id: ID;
  workspaceId: ID;
  spaceId: ID;
  title: string;
  content: string;
  createdById: ID;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  tags: string[];
  attachedFileIds: ID[];
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: ID;
  workspaceId: ID;
  spaceId: ID;
  pageId?: ID;
  linkedDocumentId?: ID;
  linkedConversationId?: ID;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: ID;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export type MessageStatus = 'sending' | 'sent' | 'failed';

export interface MessageReaction {
  emoji: string;
  userIds: ID[];
}

export interface Message {
  id: ID;
  conversationId: ID;
  senderId: ID;
  content: string;
  replyToMessageId?: ID;
  reactions: MessageReaction[];
  attachments?: {
    id: ID;
    name: string;
    type: string;
    url: string;
    size?: number;
  }[];
  status: MessageStatus;
  createdAt: string;
  updatedAt?: string;
  // Linkages to documents or tasks
  linkedDocumentId?: ID;
  linkedTaskId?: ID;
  contextSnippet?: string; // E.g., quote or section link
}

export interface Conversation {
  id: ID;
  workspaceId: ID;
  spaceId?: ID;
  type: 'direct' | 'group' | 'channel' | 'document_thread';
  title: string;
  participantIds: ID[];
  linkedDocumentId?: ID;
  linkedSectionId?: string;
  lastMessageAt: string;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FileItem {
  id: ID;
  workspaceId: ID;
  spaceId?: ID;
  name: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedById: ID;
  createdAt: string;
  linkedDocumentIds: ID[];
  linkedTaskIds: ID[];
  linkedMessageIds: ID[];
}

export interface Notification {
  id: ID;
  workspaceId: ID;
  recipientId: ID;
  senderId: ID;
  type: 'mention' | 'task_assigned' | 'comment' | 'reply' | 'document_update';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  targetUrl: string; // Internal app route
  metadata?: {
    documentId?: ID;
    taskId?: ID;
    conversationId?: ID;
  };
}

export interface SearchResult {
  id: ID;
  type: 'document' | 'note' | 'task' | 'message' | 'page' | 'space' | 'file';
  title: string;
  subtitle?: string;
  snippet?: string;
  url: string;
  updatedAt: string;
  spaceName?: string;
}
