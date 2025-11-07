
import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Card } from '../ui/Card';
import { ProjectApprovalList } from '../ProjectApprovalList';
import { GlobalFeed } from '../GlobalFeed';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, FolderKanban, Users, PlusCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { CreateProjectModal } from '../CreateProjectModal';

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, subtext: string }> = ({ icon: Icon, title, value, subtext }) => (
    <Card>
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">{title}</h3>
            <Icon className="w-5 h-5 text-gray-500" />
        </div>
        <div className="mt-2">
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500">{subtext}</p>
        </div>
    </Card>
);

export const AdminDashboard: React.FC = () => {
    const { users, projects, hasPermission } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totalPhantomUnits = useMemo(() => users.reduce((acc, user) => acc + user.phantom_units, 0), [users]);
    const totalProjects = projects.length;
    const activeUsers = users.filter(u => u.status === 'active').length;

    const chartData = useMemo(() => {
        const userContributions = users.map(user => ({
            name: user.name.split(' ')[0],
            projects: projects.filter(p => p.created_by_id === user.user_id).length
        })).filter(u => u.projects > 0).sort((a,b) => b.projects - a.projects).slice(0, 7);

        return userContributions;
    }, [users, projects]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>{/* Placeholder for title moved to Dashboard.tsx */}</div>
                {hasPermission('create_project') && (
                    <Button onClick={() => setIsModalOpen(true)}>
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Create New Project
                    </Button>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={Users} title="Active Users" value={activeUsers.toString()} subtext="Admins and Employees" />
                <StatCard icon={FolderKanban} title="Total Projects" value={totalProjects.toLocaleString()} subtext="Across the company" />
                <StatCard icon={DollarSign} title="Total Phantom Units" value={totalPhantomUnits.toLocaleString()} subtext="Issued to all users" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                   <Card>
                       <h3 className="text-lg font-semibold text-white mb-4">Project Contributions</h3>
                       <div style={{ width: '100%', height: 300 }}>
                           <ResponsiveContainer>
                               <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                   <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                   <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                   <YAxis stroke="#9ca3af" fontSize={12} />
                                   <Tooltip 
                                        cursor={{fill: 'rgba(124, 58, 237, 0.1)'}}
                                        contentStyle={{backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem'}}
                                        labelStyle={{color: '#f3f4f6'}}
                                    />
                                   <Legend wrapperStyle={{fontSize: "14px"}} />
                                   <Bar dataKey="projects" fill="#8b5cf6" name="Projects Created" radius={[4, 4, 0, 0]} />
                               </BarChart>
                           </ResponsiveContainer>
                       </div>
                   </Card>
                </div>
                 <div className="lg:col-span-1">
                    <GlobalFeed />
                </div>
            </div>

            {hasPermission('approve_projects') && (
                <div>
                    <ProjectApprovalList />
                </div>
            )}
            <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};