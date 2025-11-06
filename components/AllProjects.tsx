import React, { useMemo, useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Project, ProjectStatus, ProjectType } from '../types';
import { Card } from './ui/Card';
import { Search } from 'lucide-react';

const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
        case ProjectStatus.Approved:
            return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900/50 rounded-full">Approved</span>;
        case ProjectStatus.Pending:
            return <span className="px-2 py-1 text-xs font-medium text-yellow-300 bg-yellow-900/50 rounded-full">Pending</span>;
        case ProjectStatus.Rejected:
            return <span className="px-2 py-1 text-xs font-medium text-red-300 bg-red-900/50 rounded-full">Rejected</span>;
    }
}

const DeadlineDisplay: React.FC<{ deadline: string }> = ({ deadline }) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    // Adjust for timezone differences and compare dates only
    now.setHours(0, 0, 0, 0);
    const deadlineUTC = new Date(Date.UTC(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate()));

    const diffTime = deadlineUTC.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let statusText = '';
    let statusColor = 'text-gray-400';

    if (diffDays < 0) {
        statusText = `Overdue by ${Math.abs(diffDays)} day(s)`;
        statusColor = 'text-red-400';
    } else if (diffDays === 0) {
        statusText = 'Due today';
        statusColor = 'text-yellow-300';
    } else if (diffDays <= 7) {
        statusText = `${diffDays} day(s) left`;
        statusColor = 'text-yellow-400';
    } else {
        statusText = `${diffDays} day(s) left`;
    }
    
    return (
        <div>
            <p className="font-medium text-white">{deadlineDate.toLocaleDateString()}</p>
            <p className={`text-xs ${statusColor}`}>{statusText}</p>
        </div>
    );
};


const ProjectRow: React.FC<{ project: Project; creatorName: string }> = ({ project, creatorName }) => (
    <tr className="border-b border-gray-800 hover:bg-gray-800/50">
        <td className="p-4">
            <p className="font-semibold text-white">{project.title}</p>
            <p className="text-sm text-gray-400 max-w-xs truncate">{project.description}</p>
        </td>
        <td className="p-4 text-sm text-gray-300">${project.value.toLocaleString()}</td>
        <td className="p-4 text-sm text-gray-300">{creatorName}</td>
        <td className="p-4 text-sm text-gray-300">{new Date(project.created_at).toLocaleDateString()}</td>
        <td className="p-4 text-sm text-gray-300">
            <DeadlineDisplay deadline={project.deadline} />
        </td>
        <td className="p-4 text-sm text-center text-gray-300">{project.estimated_duration_days}</td>
        <td className="p-4">{getStatusBadge(project.status)}</td>
    </tr>
);

export const AllProjects: React.FC = () => {
    const { projects, users } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');

    const getUserName = (userId: string) => users.find(u => u.user_id === userId)?.name || 'Unknown';

    const filteredProjects = useMemo(() => {
        return projects
            .filter(p => statusFilter === 'all' || p.status === statusFilter)
            .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [projects, searchTerm, statusFilter]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">All Projects</h1>
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="status-filter" className="text-sm text-gray-400">Status:</label>
                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value as ProjectStatus | 'all')}
                            className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                            <option value="all">All</option>
                            <option value={ProjectStatus.Approved}>Approved</option>
                            <option value={ProjectStatus.Pending}>Pending</option>
                            <option value={ProjectStatus.Rejected}>Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/70">
                            <tr className="text-xs font-semibold text-gray-400 uppercase">
                                <th className="p-4">Project</th>
                                <th className="p-4">Value</th>
                                <th className="p-4">Creator</th>
                                <th className="p-4">Created Date</th>
                                <th className="p-4">Deadline</th>
                                <th className="p-4 text-center">Est. Duration (Days)</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map(p => (
                                <ProjectRow key={p.project_id} project={p} creatorName={getUserName(p.created_by_id)} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};