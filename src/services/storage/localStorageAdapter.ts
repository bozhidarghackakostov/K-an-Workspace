import {
  IStorageAdapter,
  StorageData,
} from './storageAdapter';
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
  ID,
} from '../../types';
import {
  SEED_USERS,
  SEED_WORKSPACE,
  SEED_SPACES,
  SEED_PAGES,
  SEED_DOCUMENTS,
  SEED_TASKS,
  SEED_NOTES,
  SEED_CONVERSATIONS,
  SEED_MESSAGES,
  SEED_NOTIFICATIONS,
} from './seedData';

const STORAGE_KEY = 'koan_workspace_v1';
const CURRENT_VERSION = 1;

function createDefaultData(): StorageData {
  return {
    version: CURRENT_VERSION,
    users: [...SEED_USERS],
    currentUserId: 'user-alex',
    workspaces: [{ ...SEED_WORKSPACE }],
    activeWorkspaceId: 'workspace-acme',
    spaces: [...SEED_SPACES],
    pages: [...SEED_PAGES],
    documents: [...SEED_DOCUMENTS],
    tasks: [...SEED_TASKS],
    notes: [...SEED_NOTES],
    conversations: [...SEED_CONVERSATIONS],
    messages: [...SEED_MESSAGES],
    notifications: [...SEED_NOTIFICATIONS],
    files: [],
  };
}

export class LocalStorageAdapter implements IStorageAdapter {
  private cache: StorageData | null = null;
  private isInitialized = false;

  async init(): Promise<void> {
    if (this.isInitialized && this.cache) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StorageData;
        if (parsed && parsed.version === CURRENT_VERSION) {
          this.cache = parsed;
          this.isInitialized = true;
          return;
        }
      }
    } catch {
      // In case of parsing error or storage quota issues, fall back to seed
    }

    // Default initialization
    this.cache = createDefaultData();
    await this.persist();
    this.isInitialized = true;
  }

  private async persist(): Promise<void> {
    if (!this.cache) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
    } catch (e) {
      console.warn('[Storage] Failed to write to localStorage:', e);
    }
  }

  async getData(): Promise<StorageData> {
    await this.init();
    return JSON.parse(JSON.stringify(this.cache!));
  }

  async saveData(data: StorageData): Promise<void> {
    this.cache = { ...data };
    await this.persist();
  }

  async resetToDefaults(): Promise<StorageData> {
    this.cache = createDefaultData();
    await this.persist();
    return this.getData();
  }

  // Users & Auth
  async getUsers(): Promise<User[]> {
    await this.init();
    return [...this.cache!.users];
  }

  async getCurrentUser(): Promise<User | null> {
    await this.init();
    const currentId = this.cache!.currentUserId;
    if (!currentId) return null;
    return this.cache!.users.find((u) => u.id === currentId) || null;
  }

  async setCurrentUser(userId: ID | null): Promise<void> {
    await this.init();
    this.cache!.currentUserId = userId;
    await this.persist();
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    await this.init();
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    this.cache!.users.push(newUser);
    await this.persist();
    return newUser;
  }

  // Workspaces
  async getWorkspaces(): Promise<Workspace[]> {
    await this.init();
    return [...this.cache!.workspaces];
  }

  async getWorkspace(id: ID): Promise<Workspace | null> {
    await this.init();
    return this.cache!.workspaces.find((w) => w.id === id) || null;
  }

  async saveWorkspace(workspace: Workspace): Promise<Workspace> {
    await this.init();
    const idx = this.cache!.workspaces.findIndex((w) => w.id === workspace.id);
    if (idx >= 0) {
      this.cache!.workspaces[idx] = { ...workspace, updatedAt: new Date().toISOString() };
    } else {
      this.cache!.workspaces.push({ ...workspace, updatedAt: new Date().toISOString() });
    }
    await this.persist();
    return workspace;
  }

  async getActiveWorkspaceId(): Promise<ID | null> {
    await this.init();
    return this.cache!.activeWorkspaceId;
  }

  async setActiveWorkspaceId(id: ID): Promise<void> {
    await this.init();
    this.cache!.activeWorkspaceId = id;
    await this.persist();
  }

  // Spaces
  async getSpaces(workspaceId: ID): Promise<Space[]> {
    await this.init();
    return this.cache!.spaces
      .filter((s) => s.workspaceId === workspaceId)
      .sort((a, b) => a.order - b.order);
  }

  async getSpace(id: ID): Promise<Space | null> {
    await this.init();
    return this.cache!.spaces.find((s) => s.id === id) || null;
  }

  async saveSpace(space: Space): Promise<Space> {
    await this.init();
    const idx = this.cache!.spaces.findIndex((s) => s.id === space.id);
    const updated = { ...space, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      this.cache!.spaces[idx] = updated;
    } else {
      this.cache!.spaces.push(updated);
    }
    await this.persist();
    return updated;
  }

  async deleteSpace(id: ID): Promise<void> {
    await this.init();
    this.cache!.spaces = this.cache!.spaces.filter((s) => s.id !== id);
    await this.persist();
  }

  // Pages
  async getPages(spaceId?: ID): Promise<Page[]> {
    await this.init();
    let list = this.cache!.pages;
    if (spaceId) {
      list = list.filter((p) => p.spaceId === spaceId);
    }
    return list.sort((a, b) => a.order - b.order);
  }

  async getPage(id: ID): Promise<Page | null> {
    await this.init();
    return this.cache!.pages.find((p) => p.id === id) || null;
  }

  async savePage(page: Page): Promise<Page> {
    await this.init();
    const idx = this.cache!.pages.findIndex((p) => p.id === page.id);
    const updated = { ...page, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      this.cache!.pages[idx] = updated;
    } else {
      this.cache!.pages.push(updated);
    }
    await this.persist();
    return updated;
  }

  async deletePage(id: ID): Promise<void> {
    await this.init();
    this.cache!.pages = this.cache!.pages.filter((p) => p.id !== id && p.parentId !== id);
    await this.persist();
  }

  // Documents
  async getDocuments(spaceId?: ID): Promise<Document[]> {
    await this.init();
    if (!spaceId) return [...this.cache!.documents];
    return this.cache!.documents.filter((d) => d.spaceId === spaceId);
  }

  async getDocument(id: ID): Promise<Document | null> {
    await this.init();
    return this.cache!.documents.find((d) => d.id === id) || null;
  }

  async saveDocument(doc: Document): Promise<Document> {
    await this.init();
    const idx = this.cache!.documents.findIndex((d) => d.id === doc.id);
    const updated = { ...doc, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      this.cache!.documents[idx] = updated;
    } else {
      this.cache!.documents.push(updated);
    }
    await this.persist();
    return updated;
  }

  async deleteDocument(id: ID): Promise<void> {
    await this.init();
    this.cache!.documents = this.cache!.documents.filter((d) => d.id !== id);
    await this.persist();
  }

  // Tasks
  async getTasks(workspaceId?: ID, spaceId?: ID): Promise<Task[]> {
    await this.init();
    let list = this.cache!.tasks;
    if (workspaceId) {
      list = list.filter((t) => t.workspaceId === workspaceId);
    }
    if (spaceId) {
      list = list.filter((t) => t.spaceId === spaceId);
    }
    return [...list];
  }

  async getTask(id: ID): Promise<Task | null> {
    await this.init();
    return this.cache!.tasks.find((t) => t.id === id) || null;
  }

  async saveTask(task: Task): Promise<Task> {
    await this.init();
    const idx = this.cache!.tasks.findIndex((t) => t.id === task.id);
    const updated = { ...task, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      this.cache!.tasks[idx] = updated;
    } else {
      this.cache!.tasks.push(updated);
    }
    await this.persist();
    return updated;
  }

  async deleteTask(id: ID): Promise<void> {
    await this.init();
    this.cache!.tasks = this.cache!.tasks.filter((t) => t.id !== id);
    await this.persist();
  }

  // Notes
  async getNotes(workspaceId?: ID, spaceId?: ID): Promise<Note[]> {
    await this.init();
    let list = this.cache!.notes;
    if (workspaceId) {
      list = list.filter((n) => n.workspaceId === workspaceId);
    }
    if (spaceId) {
      list = list.filter((n) => n.spaceId === spaceId);
    }
    return [...list];
  }

  async getNote(id: ID): Promise<Note | null> {
    await this.init();
    return this.cache!.notes.find((n) => n.id === id) || null;
  }

  async saveNote(note: Note): Promise<Note> {
    await this.init();
    const idx = this.cache!.notes.findIndex((n) => n.id === note.id);
    const updated = { ...note, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      this.cache!.notes[idx] = updated;
    } else {
      this.cache!.notes.push(updated);
    }
    await this.persist();
    return updated;
  }

  async deleteNote(id: ID): Promise<void> {
    await this.init();
    this.cache!.notes = this.cache!.notes.filter((n) => n.id !== id);
    await this.persist();
  }

  // Conversations & Messages
  async getConversations(workspaceId?: ID): Promise<Conversation[]> {
    await this.init();
    let list = this.cache!.conversations;
    if (workspaceId) {
      list = list.filter((c) => c.workspaceId === workspaceId);
    }
    return [...list].sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }

  async getConversation(id: ID): Promise<Conversation | null> {
    await this.init();
    return this.cache!.conversations.find((c) => c.id === id) || null;
  }

  async saveConversation(conv: Conversation): Promise<Conversation> {
    await this.init();
    const idx = this.cache!.conversations.findIndex((c) => c.id === conv.id);
    const updated = { ...conv, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      this.cache!.conversations[idx] = updated;
    } else {
      this.cache!.conversations.push(updated);
    }
    await this.persist();
    return updated;
  }

  async getMessages(conversationId: ID): Promise<Message[]> {
    await this.init();
    return this.cache!.messages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async saveMessage(msg: Message): Promise<Message> {
    await this.init();
    const idx = this.cache!.messages.findIndex((m) => m.id === msg.id);
    if (idx >= 0) {
      this.cache!.messages[idx] = { ...msg };
    } else {
      this.cache!.messages.push({ ...msg });
    }

    // Also update parent conversation lastMessageAt
    const convIdx = this.cache!.conversations.findIndex((c) => c.id === msg.conversationId);
    if (convIdx >= 0) {
      this.cache!.conversations[convIdx].lastMessageAt = msg.createdAt;
      this.cache!.conversations[convIdx].updatedAt = new Date().toISOString();
    }

    await this.persist();
    return msg;
  }

  // Notifications
  async getNotifications(userId: ID): Promise<Notification[]> {
    await this.init();
    return this.cache!.notifications
      .filter((n) => n.recipientId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async markNotificationAsRead(id: ID): Promise<void> {
    await this.init();
    const notif = this.cache!.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      await this.persist();
    }
  }

  async markAllNotificationsAsRead(userId: ID): Promise<void> {
    await this.init();
    this.cache!.notifications.forEach((n) => {
      if (n.recipientId === userId) {
        n.isRead = true;
      }
    });
    await this.persist();
  }
}

// Singleton storage instance
export const storage = new LocalStorageAdapter();
