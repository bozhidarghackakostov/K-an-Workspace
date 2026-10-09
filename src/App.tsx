import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { useRouter, matchRoute } from './routes/router';
import { AppShell } from './components/shell/AppShell';
import { LoginView } from './features/auth/LoginView';
import { HomeView } from './features/home/HomeView';
import { SpacesView } from './features/spaces/SpacesView';
import { DocumentView } from './features/documents/DocumentView';
import { MessagesView } from './features/messages/MessagesView';
import { TasksView } from './features/tasks/TasksView';
import { InboxView } from './features/inbox/InboxView';
import { LoadingState } from './components/ui/States';

function MainApp() {
  const { isAuthenticated, isLoading } = useAuth();
  const { path, navigate } = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <LoadingState message="Loading Kōan..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginView
        onSuccess={() => navigate('/app/home')}
        isSignUpMode={isSignUp}
        onToggleMode={() => setIsSignUp((prev) => !prev)}
      />
    );
  }

  // Route matching
  const renderCurrentView = () => {
    // Spaces Route: /app/spaces/:spaceId
    const spaceMatch = matchRoute('/app/spaces/:spaceId', path);
    if (spaceMatch) {
      return (
        <SpacesView
          spaceId={spaceMatch.spaceId}
          onNavigate={navigate}
          onOpenQuickCapture={() => {}}
        />
      );
    }

    // Document Route: /app/documents/:documentId
    const docMatch = matchRoute('/app/documents/:documentId', path);
    if (docMatch) {
      return (
        <DocumentView
          documentId={docMatch.documentId}
          onNavigate={navigate}
        />
      );
    }

    // Messages Route: /app/messages
    if (path.startsWith('/app/messages')) {
      return <MessagesView onNavigate={navigate} />;
    }

    // Tasks Route: /app/tasks
    if (path.startsWith('/app/tasks')) {
      return <TasksView onNavigate={navigate} />;
    }

    // Inbox Route: /app/inbox
    if (path.startsWith('/app/inbox')) {
      return <InboxView onNavigate={navigate} />;
    }

    // Default Home View
    return (
      <HomeView
        onNavigate={navigate}
        onOpenQuickCapture={() => {}}
      />
    );
  };

  return (
    <AppShell currentPath={path} onNavigate={navigate}>
      {renderCurrentView()}
    </AppShell>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <WorkspaceProvider>
            <MainApp />
          </WorkspaceProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
