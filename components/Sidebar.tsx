import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { UserRole, View } from '../types';
import { LayoutDashboard, FolderKanban, Users, UserCog, UserCircle, LogOut, TrendingUp } from 'lucide-react';

export const Sidebar: React.FC = () => {
    const { currentView, setCurrentView, currentUserRole, setCurrentUserRole, currentUser } = useAppContext();

    const NavItem = ({ icon: Icon, label, view }: { icon: React.ElementType, label: string, view: View }) => (
        <button
            onClick={() => setCurrentView(view)}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                currentView === view
                    ? 'bg-violet-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
        >
            <Icon className="w-5 h-5 mr-3" />
            <span>{label}</span>
        </button>
    );

    return (
        <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col p-4">
            <div className="flex items-center mb-8 pl-2">
                <TrendingUp className="w-8 h-8 text-neon mr-2" />
                <h1 className="text-xl font-bold text-white tracking-tighter">GroVeda</h1>
            </div>

            <nav className="flex-1 space-y-2">
                <NavItem icon={LayoutDashboard} label="Dashboard" view="dashboard" />
                <NavItem icon={FolderKanban} label="All Projects" view="projects" />
                {currentUser?.role === UserRole.Admin && (
                    <>
                        <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase">Admin</p>
                        <NavItem icon={Users} label="Manage Users" view="manage-users" />
                    </>
                )}
            </nav>

            <div className="mt-auto space-y-4">
                <div className="p-3 bg-gray-900/50 rounded-lg">
                     <label htmlFor="role-switcher" className="block text-xs text-gray-400 mb-2">Switch View</label>
                     <select
                        id="role-switcher"
                        value={currentUserRole}
                        onChange={e => setCurrentUserRole(e.target.value as UserRole)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                        <option value={UserRole.Admin}>Admin View</option>
                        <option value={UserRole.User}>User View</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <NavItem icon={UserCircle} label="My Profile" view="profile" />
                    <button
                        onClick={() => setCurrentView('homepage')}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                       <LogOut className="w-5 h-5 mr-3" />
                       <span>Exit to Homepage</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};
