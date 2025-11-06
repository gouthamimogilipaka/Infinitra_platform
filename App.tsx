
import React from 'react';
import { AppContextProvider, useAppContext } from './hooks/useAppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AllProjects } from './components/AllProjects';
import { ManageAdmins } from './components/ManageAdmins';
import { ManageEmployees } from './components/ManageEmployees';
import { ProfilePage } from './components/ProfilePage';
import { ManageUsers } from './components/ManageUsers';
import { Homepage } from './components/Homepage';


const AppContent: React.FC = () => {
  const { view, currentUser } = useAppContext();

  if (!currentUser) {
      // In a real app, this might be a login page or public homepage
      return <Homepage />;
  }

  const renderView = () => {
    switch (view) {
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
        return <Dashboard />;
    }
  };

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
};

export default App;
