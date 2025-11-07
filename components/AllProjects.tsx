import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Project, ProjectStatus, ProjectType, ProjectScenario } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PlusCircle } from 'lucide-react';
import { CreateProjectModal } from './CreateProjectModal';

const statusStyles: Record<ProjectStatus, string> = {
    [ProjectStatus.Approved]: 'bg-green-900/50 text-green-300',
    [ProjectStatus.Pending]: 'bg-yellow-900/50 text-yellow-300',
    [ProjectStatus.Rejected]: 'bg-red-900/50 text-red-300',
};

const typeStyles: Record<ProjectType, string> = {
    [ProjectType.External]: 'border-sky-500',
    [ProjectType.Internal]: 'border-violet-500',
    [ProjectType.IP]: 'border-pink-500',
};

const scenarioStyles: Record<ProjectScenario, string> = {
    [ProjectScenario.Opportunity]: 'bg-cyan-900/50 text-cyan-300',
    [ProjectScenario.ProductIdeaSelfFunded]: 'bg-amber-900/50 text-amber-300',
    [ProjectScenario.ProductIdeaCompanyFunded]: 'bg-indigo-900/50 text-indigo-300',
    [ProjectScenario.JointVenture]: 'bg-purple-900/50 text-purple-300',
    [ProjectScenario.InternalInitiative]: 'bg-gray-700 text-gray-300',
};

const scenarioLabels: Record<ProjectScenario, string> = {
    [ProjectScenario.Opportunity]: 'Opportunity',
    [ProjectScenario.ProductIdeaSelfFunded]: 'Product Idea (Self-funded)',
    [ProjectScenario.ProductIdeaCompanyFunded]: 'Product Idea (Company-funded)',
    [ProjectScenario.JointVenture]: 'Joint Venture',
    [ProjectScenario.InternalInitiative]: 'Internal Initiative',
};

export const AllProjects: React.FC = () => {
    const { projects, users, hasPermission, currentUser } = useAppContext();
    const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'all'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const projectsToDisplay = useMemo(() => {
        if (hasPermission('view_all_projects')) {
            return projects;
        }
        return projects.filter(p => p.created_by_id === currentUser?.user_id);
    }, [projects, hasPermission, currentUser]);

    const filteredProjects = useMemo(() => {
        if (filterStatus === 'all') return projectsToDisplay;
        return projectsToDisplay.filter(p => p.status === filterStatus);
    }, [projectsToDisplay, filterStatus]);

    const getUserName = (userId: string) => users.find(u => u.user_id === userId)?.name || 'Unknown';

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">All Projects</h1>
                <div className="flex items-center space-x-2">
                    <Button variant={filterStatus === 'all' ? 'primary' : 'secondary'} onClick={() => setFilterStatus('all')}>All</Button>
                    <Button variant={filterStatus === ProjectStatus.Pending ? 'primary' : 'secondary'} onClick={() => setFilterStatus(ProjectStatus.Pending)}>Pending</Button>
                    <Button variant={filterStatus === ProjectStatus.Approved ? 'primary' : 'secondary'} onClick={() => setFilterStatus(ProjectStatus.Approved)}>Approved</Button>
                    <Button variant={filterStatus === ProjectStatus.Rejected ? 'primary' : 'secondary'} onClick={() => setFilterStatus(ProjectStatus.Rejected)}>Rejected</Button>
                    {hasPermission('create_project') && (
                        <>
                            <div className="h-6 w-px bg-gray-700 mx-2" />
                            <Button onClick={() => setIsModalOpen(true)}>
                                <PlusCircle className="w-5 h-5 mr-2" />
                                Create Project
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/70">
                            <tr className="text-xs font-semibold text-gray-400 uppercase">
                                <th className="p-4">Project</th>
                                <th className="p-4">Scenario</th>
                                <th className="p-4">Creator</th>
                                <th className="p-4">Value / Units</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map(project => (
                                <tr key={project.project_id} className={`border-b border-gray-800 hover:bg-gray-800/50 border-l-4 ${typeStyles[project.type]}`}>
                                    <td className="p-4">
                                        <p className="font-medium text-white">{project.title}</p>
                                        <p className="text-sm text-gray-400 capitalize">{project.type}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${scenarioStyles[project.scenario]}`}>
                                            {scenarioLabels[project.scenario]}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-300">{getUserName(project.created_by_id)}</td>
                                    <td className="p-4">
                                        {project.value > 0 ? (
                                           <p className="font-medium text-white">${project.value.toLocaleString()}</p>
                                        ) : (
                                           <p className="font-medium text-white">-</p>
                                        )}
                                        <p className="text-sm text-violet-300">{project.phantom_units.toLocaleString()} units</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[project.status]}`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400">{new Date(project.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};