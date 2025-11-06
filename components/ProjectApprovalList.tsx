
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Project, ProjectStatus } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Check, X } from 'lucide-react';

export const ProjectApprovalList: React.FC = () => {
    const { projects, setProjects, users, currentUser } = useAppContext();

    const pendingProjects = projects.filter(p => p.status === ProjectStatus.Pending);

    const handleApproval = (projectId: string, newStatus: ProjectStatus) => {
        if (!currentUser) return;

        setProjects(prevProjects =>
            prevProjects.map(project => {
                if (project.project_id === projectId) {
                    return {
                        ...project,
                        status: newStatus,
                        approved_by_id: newStatus === ProjectStatus.Approved ? currentUser.user_id : null,
                    };
                }
                return project;
            })
        );
    };
    
    const getUserName = (userId: string) => {
        return users.find(u => u.user_id === userId)?.name || 'Unknown';
    }

    return (
        <Card>
            <h2 className="text-xl font-bold text-white mb-4">Pending Project Approvals</h2>
            {pendingProjects.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/70">
                            <tr className="text-xs font-semibold text-gray-400 uppercase">
                                <th className="p-4">Project Title</th>
                                <th className="p-4">Submitted By</th>
                                <th className="p-4">Value</th>
                                <th className="p-4">Phantom Units</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingProjects.map(project => (
                                <tr key={project.project_id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="p-4 font-medium text-white">{project.title}</td>
                                    <td className="p-4 text-gray-300">{getUserName(project.created_by_id)}</td>
                                    <td className="p-4 text-gray-300">${project.value.toLocaleString()}</td>
                                    <td className="p-4 text-violet-300">{project.phantom_units.toLocaleString()}</td>
                                    <td className="p-4 flex space-x-2">
                                        <Button size="sm" onClick={() => handleApproval(project.project_id, ProjectStatus.Approved)}>
                                            <Check className="w-4 h-4 mr-1" /> Approve
                                        </Button>
                                        <Button size="sm" variant="danger" onClick={() => handleApproval(project.project_id, ProjectStatus.Rejected)}>
                                            <X className="w-4 h-4 mr-1" /> Reject
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-400 text-center py-8">No projects are currently pending approval.</p>
            )}
        </Card>
    );
};
