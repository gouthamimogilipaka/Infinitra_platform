
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Project, ProjectStatus } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface ProjectApprovalListProps {
  projects: Project[];
}

export const ProjectApprovalList: React.FC<ProjectApprovalListProps> = ({ projects }) => {
    const { setProjects, users, setUsers, currentUser } = useAppContext();

    const handleApproval = (projectId: string, newStatus: ProjectStatus) => {
        setProjects(prevProjects =>
            prevProjects.map(p => {
                if (p.project_id === projectId) {
                    const updatedProject = {
                        ...p,
                        status: newStatus,
                        approved_by_id: newStatus === ProjectStatus.Approved ? currentUser?.user_id || null : null
                    };

                    // If approved, update user's phantom units
                    if (newStatus === ProjectStatus.Approved) {
                        setUsers(prevUsers => prevUsers.map(u => {
                            if (u.user_id === updatedProject.created_by_id) {
                                return { ...u, phantom_units: u.phantom_units + updatedProject.phantom_units };
                            }
                            return u;
                        }));
                    }
                    return updatedProject;
                }
                return p;
            })
        );
    };

    const getUserName = (userId: string) => users.find(u => u.user_id === userId)?.name || 'Unknown User';

    return (
        <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Pending Project Approvals</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-900/70">
                        <tr className="text-xs font-semibold text-gray-400 uppercase">
                            <th className="p-4">Project</th>
                            <th className="p-4">Creator</th>
                            <th className="p-4">Value</th>
                            <th className="p-4">Phantom Units</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(project => (
                            <tr key={project.project_id} className="border-b border-gray-800 last:border-b-0 hover:bg-gray-800/50">
                                <td className="p-4">
                                    <p className="font-semibold text-white">{project.title}</p>
                                    <p className="text-sm text-gray-400 max-w-xs truncate">{project.description}</p>
                                </td>
                                <td className="p-4 text-sm text-gray-300">{getUserName(project.created_by_id)}</td>
                                <td className="p-4 text-sm text-gray-300">${project.value.toLocaleString()}</td>
                                <td className="p-4 text-sm text-gray-300">{project.phantom_units}</td>
                                <td className="p-4">
                                    <div className="flex space-x-2">
                                        <Button size="sm" onClick={() => handleApproval(project.project_id, ProjectStatus.Approved)}>Approve</Button>
                                        <Button size="sm" variant="danger" onClick={() => handleApproval(project.project_id, ProjectStatus.Rejected)}>Reject</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
