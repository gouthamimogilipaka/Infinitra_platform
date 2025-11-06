// FIX: Import Dispatch and SetStateAction to resolve "Cannot find namespace 'React'" errors.
import { createContext, useContext, Dispatch, SetStateAction } from 'react';
import { User, Project, UserRole, View } from '../types';

interface AppContextType {
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
  projects: Project[];
  setProjects: Dispatch<SetStateAction<Project[]>>;
  currentUser: User | null;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  currentView: View;
  setCurrentView: (view: View) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};