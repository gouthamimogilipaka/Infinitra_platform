
import React, { useState, useEffect } from 'react';
import { User, Project, UserRole, View } from './types';
import { AppContext } from './hooks/useAppContext';
import { initialUsers, initialProjects } from './constants';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AllProjects } from './components/AllProjects';
import { ManageAdmins } from './components/ManageAdmins';
import { ManageEmployees } from './components/ManageEmployees';
import { ProfilePage } from './components/ProfilePage';
import { Homepage } from './components/Homepage';
import { ManageUsers } from './components/ManageUsers';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : initialProjects;
  });

  // Default to Admin for demo purposes to show all features
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.Admin);
  const [currentView, setCurrentView] = useState<View>('homepage');

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const currentUser = users.find(u => u.role === currentUserRole) || users[0];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <AllProjects />;
      case 'manage-admins':
        return <ManageAdmins />;
      case 'manage-employees':
        return <ManageEmployees />;
      case 'manage-users':
        return <ManageUsers />;
      case 'profile':
        return <ProfilePage />;
      case 'homepage':
      default:
        return <Homepage />;
    }
  };

  if (currentView === 'homepage') {
    return (
       <AppContext.Provider value={{ users, setUsers, projects, setProjects, currentUser, currentUserRole, setCurrentUserRole, currentView, setCurrentView }}>
          <Homepage />
       </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={{ users, setUsers, projects, setProjects, currentUser, currentUserRole, setCurrentUserRole, currentView, setCurrentView }}>
      <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-950 p-8">
            {renderView()}
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;
