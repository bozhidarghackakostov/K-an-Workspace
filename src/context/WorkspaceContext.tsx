import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Workspace, Space, Page, Document, Task, Conversation, Notification, ID } from '../types';
import {
  workspaceService,
  pageService,
  documentService,
  taskService,
  messageService,
  notificationService,
} from '../services';

interface WorkspaceContextType {
  workspace: Workspace | null;
  spaces: Space[];
  pages: Page[];
  documents: Document[];
  tasks: Task[];
  conversations: Conversation[];
  notifications: Notification[];
  activeSpaceId: ID | null;
  setActiveSpaceId: (id: ID | null) => void;
  isLoading: boolean;
  refresh: () => Promise<void>;
  createTask: (title: string, spaceId?: ID, linkedDocId?: ID) => Promise<Task>;
  toggleTask: (id: ID) => Promise<void>;
  createNote: (title: string, content: string, spaceId?: ID) => Promise<void>;
  createDocument: (title: string, spaceId?: ID) => Promise<Document>;
  createMessage: (convId: ID, text: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeSpaceId, setActiveSpaceId] = useState<ID | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const ws = await workspaceService.getActiveWorkspace();
      if (ws) {
        setWorkspace(ws);
        const [sp, pg, docs, ts, convs, notifs] = await Promise.all([
          workspaceService.getSpaces(ws.id),
          pageService.getPages(),
          documentService.getDocuments(),
          taskService.getTasks(ws.id),
          messageService.getConversations(ws.id),
          notificationService.getNotifications(ws.ownerId),
        ]);
        setSpaces(sp);
        setPages(pg);
        setDocuments(docs);
        setTasks(ts);
        setConversations(convs);
        setNotifications(notifs);
        if (!activeSpaceId && sp.length > 0) {
          setActiveSpaceId(sp[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load workspace data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeSpaceId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createTask = async (title: string, spaceId?: ID, linkedDocId?: ID): Promise<Task> => {
    const targetSpace = spaceId || activeSpaceId || spaces[0]?.id || 'space-website';
    const newTask = await taskService.createTask({
      workspaceId: workspace?.id || 'workspace-acme',
      spaceId: targetSpace,
      linkedDocumentId: linkedDocId,
      title,
      status: 'todo',
      priority: 'medium',
      tags: [],
    });
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const toggleTask = async (id: ID) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t))
    );
    await taskService.toggleTaskStatus(id);
  };

  const createNote = async (title: string, content: string, spaceId?: ID) => {
    const targetSpace = spaceId || activeSpaceId || spaces[0]?.id || 'space-website';
    const { noteService } = await import('../services');
    await noteService.createNote({
      workspaceId: workspace?.id || 'workspace-acme',
      spaceId: targetSpace,
      title,
      content,
      createdById: workspace?.ownerId || 'user-alex',
      isPinned: false,
      tags: ['Quick Note'],
      attachedFileIds: [],
    });
    await refresh();
  };

  const createDocument = async (title: string, spaceId?: ID): Promise<Document> => {
    const targetSpace = spaceId || activeSpaceId || spaces[0]?.id || 'space-website';
    const newDoc = await documentService.createDocument({
      workspaceId: workspace?.id || 'workspace-acme',
      spaceId: targetSpace,
      title,
      blocks: [
        {
          id: `blk-${Date.now()}`,
          type: 'paragraph',
          content: 'Start typing or press / for slash commands...',
        },
      ],
      createdById: workspace?.ownerId || 'user-alex',
      lastEditedById: workspace?.ownerId || 'user-alex',
      tags: [],
      collaboratorIds: [workspace?.ownerId || 'user-alex'],
      linkedTaskIds: [],
      linkedConversationIds: [],
    });
    setDocuments((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  const createMessage = async (convId: ID, text: string) => {
    await messageService.sendMessage({
      conversationId: convId,
      senderId: workspace?.ownerId || 'user-alex',
      content: text,
      reactions: [],
      status: 'sent',
    });
    await refresh();
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        spaces,
        pages,
        documents,
        tasks,
        conversations,
        notifications,
        activeSpaceId,
        setActiveSpaceId,
        isLoading,
        refresh,
        createTask,
        toggleTask,
        createNote,
        createDocument,
        createMessage,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextType {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
