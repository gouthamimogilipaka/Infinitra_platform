
import React from 'react';
import { AppContextProvider, useAppContext } from './hooks/useAppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AllProjects } from './components/AllProjects';
import { ManageAdmins } from './components/ManageAdmins';
import { ProfilePage } from './components/ProfilePage';
import { ManageUsers } from './components/ManageUsers';
import { Login } from './components/Login';
import { Homepage } from './components/Homepage';


const AppContent: React.FC = () => {
  const { view, currentUser, authView } = useAppContext();

  if (!currentUser) {
      switch (authView) {
        case 'homepage':
          return <Homepage />;
        case 'login':
          return <Login />;
        default:
          return <Homepage />;
      }
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <AllProjects />;
      case 'manage-admins':
        return <ManageAdmins />;
      case 'manage-users':
         return <ManageUsers />;
      case 'profile':
        return <ProfilePage />;
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
