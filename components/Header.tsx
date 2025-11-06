
import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';

export const Header: React.FC = () => {
    const { currentUser } = useAppContext();

    if (!currentUser) {
        return null;
    }

    return (
        <header className="h-16 flex-shrink-0 bg-gray-800/30 border-b border-gray-700 flex items-center justify-end px-8">
            <div className="flex items-center space-x-6">
                <button className="text-gray-400 hover:text-white relative">
                    <Bell className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
                    </span>
                </button>
                <div className="flex items-center space-x-3">
                    <img
                        className="w-9 h-9 rounded-full object-cover"
                        src={currentUser.profile_picture || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${currentUser.name}`}
                        alt={currentUser.name}
                    />
                    <div>
                        <h4 className="font-semibold text-white text-sm">{currentUser.name}</h4>
                        <p className="text-xs text-gray-400">{currentUser.title}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
            </div>
        </header>
    );
};
