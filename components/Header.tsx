import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Bell, ChevronDown, Gem } from 'lucide-react';

export const Header: React.FC = () => {
    const { currentUser, setCurrentView } = useAppContext();
    
    if (!currentUser) return null;

    return (
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 h-20 flex items-center justify-end px-8 flex-shrink-0">
            <div className="flex items-center space-x-6">
                <button className="text-gray-400 hover:text-white relative">
                    <Bell className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                </button>
                <div className="flex items-center space-x-2 p-2 rounded-full bg-gray-700/50">
                    <Gem className="w-5 h-5 text-violet-400 ml-1" />
                    <span className="font-bold text-white">{currentUser.phantom_units.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 mr-2">Units</span>
                </div>
                <button 
                    className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-gray-800 rounded-full p-1"
                    onClick={() => setCurrentView('profile')}
                >
                    <img 
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                        src={currentUser.profile_picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`} 
                        alt={currentUser.name}
                    />
                    <div>
                        <p className="font-semibold text-white text-sm">{currentUser.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{currentUser.role} View</p>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                </button>
            </div>
        </header>
    );
};
