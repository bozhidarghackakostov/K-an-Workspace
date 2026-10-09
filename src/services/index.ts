import { storage } from './storage/localStorageAdapter';
import {
  User,
  Workspace,
  Space,
  Page,
  Document,
  Task,
  Note,
  Conversation,
  Message,
  Notification,
  SearchResult,
  ID,
} from '../types';

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    return storage.getCurrentUser();
  },

  async getAllUsers(): Promise<User[]> {
    return storage.getUsers();
  },

  async switchUser(userId: ID): Promise<User | null> {
    await storage.setCurrentUser(userId);
    return storage.getCurrentUser();
  },

  async login(email: string): Promise<User> {
    const users = await storage.getUsers();
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Auto-register in dev environment
      const name = email.split('@')[0];
      user = await storage.createUser({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        role: 'member',
        status: 'active',
      });
    }
    await storage.setCurrentUser(user.id);
    return user;
  },

  async logout(): Promise<void> {
    await storage.setCurrentUser(null);
  },
};

export const workspaceService = {
  async getActiveWorkspace(): Promise<Workspace | null> {
    const id = await storage.getActiveWorkspaceId();
    if (!id) return null;
    return storage.getWorkspace(id);
  },

  async getAllWorkspaces(): Promise<Workspace[]> {
    return storage.getWorkspaces();
  },

  async setActiveWorkspace(id: ID): Promise<void> {
    await storage.setActiveWorkspaceId(id);
  },

  async getSpaces(workspaceId: ID): Promise<Space[]> {
    return storage.getSpaces(workspaceId);
  },

  async getSpace(id: ID): Promise<Space | null> {
    return storage.getSpace(id);
  },

  async createSpace(space: Omit<Space, 'id' | 'createdAt' | 'updatedAt'>): Promise<Space> {
    const newSpace: Space = {
      ...space,
      id: `space-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return storage.saveSpace(newSpace);
  },

  async updateSpace(space: Space): Promise<Space> {
    return storage.saveSpace(space);
  },

  async deleteSpace(id: ID): Promise<void> {
    return storage.deleteSpace(id);
  },
};

export const pageService = {
  async getPages(spaceId?: ID): Promise<Page[]> {
    return storage.getPages(spaceId);
  },

  async getPage(id: ID): Promise<Page | null> {
    return storage.getPage(id);
  },

  async createPage(page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Promise<Page> {
    const newPage: Page = {
      ...page,
      id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return storage.savePage(newPage);
  },

  async updatePage(page: Page): Promise<Page> {
    return storage.savePage(page);
  },

  async deletePage(id: ID): Promise<void> {
    return storage.deletePage(id);
  },
};

export const documentService = {
  async getDocuments(spaceId?: ID): Promise<Document[]> {
    return storage.getDocuments(spaceId);
  },

  async getDocument(id: ID): Promise<Document | null> {
    return storage.getDocument(id);
  },

  async createDocument(doc: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> {
    const newDoc: Document = {
      ...doc,
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return storage.saveDocument(newDoc);
  },

  async updateDocument(doc: Document): Promise<Document> {
    return storage.saveDocument(doc);
  },

  async deleteDocument(id: ID): Promise<void> {
    return storage.deleteDocument(id);
  },
};

export const taskService = {
  async getTasks(workspaceId?: ID, spaceId?: ID): Promise<Task[]> {
    return storage.getTasks(workspaceId, spaceId);
  },

  async getTask(id: ID): Promise<Task | null> {
    return storage.getTask(id);
  },

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return storage.saveTask(newTask);
  },

  async updateTask(task: Task): Promise<Task> {
    return storage.saveTask(task);
  },

  async toggleTaskStatus(id: ID): Promise<Task | null> {
    const task = await storage.getTask(id);
    if (!task) return null;
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    task.status = newStatus;
    return storage.saveTask(task);
  },

  async deleteTask(id: ID): Promise<void> {
    return storage.deleteTask(id);
  },
};

export const noteService = {
  async getNotes(workspaceId?: ID, spaceId?: ID): Promise<Note[]> {
    return storage.getNotes(workspaceId, spaceId);
  },

  async getNote(id: ID): Promise<Note | null> {
    return storage.getNote(id);
  },

  async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    const newNote: Note = {
      ...note,
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return storage.saveNote(newNote);
  },

  async updateNote(note: Note): Promise<Note> {
    return storage.saveNote(note);
  },

  async deleteNote(id: ID): Promise<void> {
    return storage.deleteNote(id);
  },
};

export const messageService = {
  async getConversations(workspaceId?: ID): Promise<Conversation[]> {
    return storage.getConversations(workspaceId);
  },

  async getConversation(id: ID): Promise<Conversation | null> {
    return storage.getConversation(id);
  },

  async getMessages(conversationId: ID): Promise<Message[]> {
    return storage.getMessages(conversationId);
  },

  async sendMessage(msg: Omit<Message, 'id' | 'createdAt'>): Promise<Message> {
    const newMsg: Message = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    return storage.saveMessage(newMsg);
  },

  async createConversation(conv: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt' | 'lastMessageAt'>): Promise<Conversation> {
    const now = new Date().toISOString();
    const newConv: Conversation = {
      ...conv,
      id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
    };
    return storage.saveConversation(newConv);
  },
};

export const notificationService = {
  async getNotifications(userId: ID): Promise<Notification[]> {
    return storage.getNotifications(userId);
  },

  async markAsRead(id: ID): Promise<void> {
    return storage.markNotificationAsRead(id);
  },

  async markAllAsRead(userId: ID): Promise<void> {
    return storage.markAllNotificationsAsRead(userId);
  },
};

export const searchService = {
  async search(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) return [];
    const q = query.toLowerCase().trim();
    const data = await storage.getData();
    const results: SearchResult[] = [];

    // Documents
    for (const doc of data.documents) {
      if (
        doc.title.toLowerCase().includes(q) ||
        doc.tags.some((t) => t.toLowerCase().includes(q)) ||
        doc.blocks.some((b) => b.content.toLowerCase().includes(q))
      ) {
        const space = data.spaces.find((s) => s.id === doc.spaceId);
        results.push({
          id: doc.id,
          type: 'document',
          title: doc.title,
          subtitle: `In ${space?.name || 'Workspace'} · Document`,
          snippet: doc.blocks[0]?.content.slice(0, 90) + '...',
          url: `/app/documents/${doc.id}`,
          updatedAt: doc.updatedAt,
          spaceName: space?.name,
        });
      }
    }

    // Notes
    for (const note of data.notes) {
      if (note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q)) {
        const space = data.spaces.find((s) => s.id === note.spaceId);
        results.push({
          id: note.id,
          type: 'note',
          title: note.title,
          subtitle: `In ${space?.name || 'Workspace'} · Note`,
          snippet: note.content.slice(0, 90) + '...',
          url: `/app/notes/${note.id}`,
          updatedAt: note.updatedAt,
          spaceName: space?.name,
        });
      }
    }

    // Tasks
    for (const task of data.tasks) {
      if (task.title.toLowerCase().includes(q) || (task.description && task.description.toLowerCase().includes(q))) {
        const space = data.spaces.find((s) => s.id === task.spaceId);
        results.push({
          id: task.id,
          type: 'task',
          title: task.title,
          subtitle: `Task [${task.status}] · ${space?.name || 'Workspace'}`,
          snippet: task.description || undefined,
          url: `/app/tasks`,
          updatedAt: task.updatedAt,
          spaceName: space?.name,
        });
      }
    }

    // Messages
    for (const msg of data.messages) {
      if (msg.content.toLowerCase().includes(q)) {
        const conv = data.conversations.find((c) => c.id === msg.conversationId);
        results.push({
          id: msg.id,
          type: 'message',
          title: conv ? conv.title : 'Conversation message',
          subtitle: 'Contextual Message',
          snippet: `"${msg.content}"`,
          url: `/app/messages`,
          updatedAt: msg.createdAt,
        });
      }
    }

    // Spaces
    for (const space of data.spaces) {
      if (space.name.toLowerCase().includes(q) || (space.description && space.description.toLowerCase().includes(q))) {
        results.push({
          id: space.id,
          type: 'space',
          title: space.name,
          subtitle: 'Space',
          snippet: space.description,
          url: `/app/spaces/${space.id}`,
          updatedAt: space.updatedAt,
        });
      }
    }

    return results;
  },
};
