import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, ID } from '../types';
import { authService } from '../services';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  switchUser: (userId: ID) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const [allUsers, current] = await Promise.all([
          authService.getAllUsers(),
          authService.getCurrentUser(),
        ]);
        setUsers(allUsers);
        setCurrentUser(current);
      } catch (err) {
        console.error('Failed to load auth data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const user = await authService.login(email);
      setCurrentUser(user);
      const allUsers = await authService.getAllUsers();
      setUsers(allUsers);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const switchUser = async (userId: ID) => {
    const updated = await authService.switchUser(userId);
    setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isLoading,
        isAuthenticated: !!currentUser,
        login,
        logout,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
