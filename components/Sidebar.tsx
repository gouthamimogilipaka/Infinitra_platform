
import React from 'react';
import { Home, FolderKanban, Shield, Users, UserCircle, LogOut } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';
import { UserRole, View } from '../types';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  view: View;
  currentView: View;
  onClick: (view: View) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, view, currentView, onClick }) => {
  const isActive = view === currentView;
  return (
    <button
      onClick={() => onClick(view)}
      className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-violet-600 text-white shadow-lg'
          : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
};


export const Sidebar: React.FC = () => {
  const { view, setView, hasPermission, logout } = useAppContext();

  const handleNavClick = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <aside className="w-64 bg-gray-800/50 border-r border-gray-700 p-4 flex flex-col">
      <div className="text-2xl font-bold text-white mb-10 px-2 flex items-center">
        <span>
            Gro<span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-green-600 -mx-0.5">V</span>eda
        </span>
      </div>
      <nav className="flex-1 space-y-2">
        <NavItem icon={Home} label="Dashboard" view="dashboard" currentView={view} onClick={handleNavClick} />
        <NavItem icon={FolderKanban} label="Projects" view="projects" currentView={view} onClick={handleNavClick} />
        {(hasPermission('manage_admins') || hasPermission('manage_users')) && (
          <>
            <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</div>
            {hasPermission('manage_admins') && 
              <NavItem icon={Shield} label="Manage Admins" view="manage-admins" currentView={view} onClick={handleNavClick} />
            }
            {hasPermission('manage_users') && 
              <NavItem icon={Users} label="Manage Users" view="manage-users" currentView={view} onClick={handleNavClick} />
            }
          </>
        )}
      </nav>
      <div className="mt-auto">
         <NavItem icon={UserCircle} label="Profile" view="profile" currentView={view} onClick={handleNavClick} />
         <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-red-800/50 hover:text-white transition-colors duration-200">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
