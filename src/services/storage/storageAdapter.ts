import {
  Workspace,
  Space,
  Page,
  Document,
  Task,
  Note,
  Conversation,
  Message,
  User,
  Notification,
  FileItem,
  ID,
} from '../../types';

export interface StorageData {
  version: number;
  users: User[];
  currentUserId: ID | null;
  workspaces: Workspace[];
  activeWorkspaceId: ID | null;
  spaces: Space[];
  pages: Page[];
  documents: Document[];
  tasks: Task[];
  notes: Note[];
  conversations: Conversation[];
  messages: Message[];
  notifications: Notification[];
  files: FileItem[];
}

export interface IStorageAdapter {
  init(): Promise<void>;
  getData(): Promise<StorageData>;
  saveData(data: StorageData): Promise<void>;
  resetToDefaults(): Promise<StorageData>;

  // Users & Auth
  getUsers(): Promise<User[]>;
  getCurrentUser(): Promise<User | null>;
  setCurrentUser(userId: ID | null): Promise<void>;
  createUser(user: Omit<User, 'id'>): Promise<User>;

  // Workspaces
  getWorkspaces(): Promise<Workspace[]>;
  getWorkspace(id: ID): Promise<Workspace | null>;
  saveWorkspace(workspace: Workspace): Promise<Workspace>;
  getActiveWorkspaceId(): Promise<ID | null>;
  setActiveWorkspaceId(id: ID): Promise<void>;

  // Spaces
  getSpaces(workspaceId: ID): Promise<Space[]>;
  getSpace(id: ID): Promise<Space | null>;
  saveSpace(space: Space): Promise<Space>;
  deleteSpace(id: ID): Promise<void>;

  // Pages
  getPages(spaceId?: ID): Promise<Page[]>;
  getPage(id: ID): Promise<Page | null>;
  savePage(page: Page): Promise<Page>;
  deletePage(id: ID): Promise<void>;

  // Documents
  getDocuments(spaceId?: ID): Promise<Document[]>;
  getDocument(id: ID): Promise<Document | null>;
  saveDocument(doc: Document): Promise<Document>;
  deleteDocument(id: ID): Promise<void>;

  // Tasks
  getTasks(workspaceId?: ID, spaceId?: ID): Promise<Task[]>;
  getTask(id: ID): Promise<Task | null>;
  saveTask(task: Task): Promise<Task>;
  deleteTask(id: ID): Promise<void>;

  // Notes
  getNotes(workspaceId?: ID, spaceId?: ID): Promise<Note[]>;
  getNote(id: ID): Promise<Note | null>;
  saveNote(note: Note): Promise<Note>;
  deleteNote(id: ID): Promise<void>;

  // Conversations & Messages
  getConversations(workspaceId?: ID): Promise<Conversation[]>;
  getConversation(id: ID): Promise<Conversation | null>;
  saveConversation(conv: Conversation): Promise<Conversation>;
  getMessages(conversationId: ID): Promise<Message[]>;
  saveMessage(msg: Message): Promise<Message>;

  // Notifications
  getNotifications(userId: ID): Promise<Notification[]>;
  markNotificationAsRead(id: ID): Promise<void>;
  markAllNotificationsAsRead(userId: ID): Promise<void>;
}
