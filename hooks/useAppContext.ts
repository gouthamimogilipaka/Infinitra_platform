
import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { User, Project, View, UserRole } from '../types';
import { initialUsers, initialProjects } from '../constants';

export type Permission = 
  | 'manage_admins'
  | 'manage_users'
  | 'approve_projects'
  | 'create_project'
  | 'view_all_projects';

type AuthView = 'homepage' | 'login';

const permissionsByRole: Record<UserRole, Permission[] | ['all']> = {
    [UserRole.Admin]: ['all'],
    [UserRole.Manager]: ['manage_users', 'approve_projects', 'create_project', 'view_all_projects'],
    [UserRole.User]: ['create_project'],
};

interface AppContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  view: View;
  setView: (view: View) => void;
  currentUser: User | null;
  currentUserRole: UserRole | null;
  hasPermission: (permission: Permission) => boolean;
  login: (email: string) => boolean;
  logout: () => void;
  authView: AuthView;
  setAuthView: (view: AuthView) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [view, setView] = useState<View>('dashboard');
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [authView, setAuthView] = useState<AuthView>('homepage');
  
  const currentUser = useMemo(() => {
    return users.find(u => u.user_id === activeUserId) || null;
  }, [users, activeUserId]);
  
  const currentUserRole = currentUser ? currentUser.role : null;

  const hasPermission = (permission: Permission): boolean => {
      if (!currentUser) return false;
      const userPermissions = permissionsByRole[currentUser.role];
      if (userPermissions.includes('all')) return true;
      return userPermissions.includes(permission);
  };

  const login = (email: string): boolean => {
    const userToLogin = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (userToLogin) {
      setActiveUserId(userToLogin.user_id);
      setView('dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setActiveUserId(null);
    setAuthView('homepage');
  };

  const contextValue = {
    users,
    setUsers,
    projects,
    setProjects,
    view,
    setView,
    currentUser,
    currentUserRole,
    hasPermission,
    login,
    logout,
    authView,
    setAuthView,
  };

  return React.createElement(AppContext.Provider, { value: contextValue }, children);
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
