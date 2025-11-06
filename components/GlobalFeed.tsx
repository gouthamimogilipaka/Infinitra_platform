
import React, { useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Card } from './ui/Card';
import { Briefcase } from 'lucide-react';

export const GlobalFeed: React.FC = () => {
    const { projects, users } = useAppContext();

    const recentProjects = useMemo(() => {
        return [...projects]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);
    }, [projects]);

    const getUserName = (userId: string) => {
        return users.find(u => u.user_id === userId)?.name || 'Unknown User';
    };
    
    const timeSince = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Global Project Feed</h3>
            <div className="space-y-4">
                {recentProjects.length > 0 ? (
                    recentProjects.map(project => (
                        <div key={project.project_id} className="flex items-start space-x-3">
                            <div className="bg-gray-700 p-2 rounded-full mt-1">
                                <Briefcase className="w-4 h-4 text-violet-400" />
                            </div>
                            <div>
                                <p className="text-sm text-white">
                                    <span className="font-bold">{getUserName(project.created_by_id)}</span> created a new project:
                                </p>
                                <p className="text-sm font-semibold text-violet-300">{project.title}</p>
                                <p className="text-xs text-gray-400">{timeSince(new Date(project.created_at))}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No new projects yet.</p>
                )}
            </div>
        </Card>
    );
};