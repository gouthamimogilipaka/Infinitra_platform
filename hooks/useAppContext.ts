import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { User, Project, View, UserRole } from '../types';
import { initialUsers, initialProjects } from '../constants';

interface AppContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  view: View;
  setView: (view: View) => void;
  currentUser: User | null;
  currentUserRole: UserRole | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [view, setView] = useState<View>('dashboard');
  
  // In a real app, this would be determined by an auth system.
  // For this example, we'll just pick the first user.
  const currentUser = users.length > 0 ? users[0] : null;
  const currentUserRole = currentUser ? currentUser.role : null;

  const contextValue = {
    users,
    setUsers,
    projects,
    setProjects,
    view,
    setView,
    currentUser,
    currentUserRole,
  };

  // FIX: Replaced JSX with React.createElement to be compatible with the .ts file extension.
  // The original JSX was causing a parse error because the file is not a .tsx file.
  return React.createElement(AppContext.Provider, { value: contextValue }, children);
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
