import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAppContext } from '../../hooks/useAppContext';
import { Card } from '../ui/Card';
import { ProjectStatus } from '../../types';
import { Users, FolderKanban, AlertTriangle, Gem, DollarSign } from 'lucide-react';
import { ProjectApprovalList } from '../ProjectApprovalList';
import { GlobalFeed } from '../GlobalFeed';

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
    const { users, projects } = useAppContext();

    const stats = useMemo(() => {
        const activeUsers = users.filter(u => u.status === 'active').length;
        const totalProjects = projects.length;
        const pendingProjects = projects.filter(p => p.status === ProjectStatus.Pending);
        const totalPhantomUnits = users.reduce((acc, user) => acc + user.phantom_units, 0);
        const totalProjectValue = projects
            .filter(p => p.status === ProjectStatus.Approved)
            .reduce((acc, p) => acc + p.value, 0);

        return {
            activeUsers,
            totalProjects,
            pendingProjects,
            totalPhantomUnits,
            totalProjectValue
        };
    }, [users, projects]);

    const userContributionData = useMemo(() => {
        return [...users]
            .filter(u => u.phantom_units > 0)
            .sort((a, b) => b.phantom_units - a.phantom_units)
            .slice(0, 10)
            .map(user => ({
                name: user.name.split(' ')[0],
                units: user.phantom_units
            }));
    }, [users]);
    
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard icon={Users} title="Active Users" value={stats.activeUsers.toString()} subtext="Admins & Users" />
                <StatCard icon={FolderKanban} title="Total Projects" value={stats.totalProjects.toString()} subtext="Across all statuses" />
                <StatCard icon={AlertTriangle} title="Pending Approvals" value={stats.pendingProjects.length.toString()} subtext="Projects needing review" />
                <StatCard icon={Gem} title="Total Units Issued" value={stats.totalPhantomUnits.toLocaleString()} subtext="Across all users" />
                <StatCard icon={DollarSign} title="Total Project Value" value={`$${(stats.totalProjectValue / 1_000_000).toFixed(2)}M`} subtext="From approved projects" />
            </div>

            {stats.pendingProjects.length > 0 && (
                <div>
                    <ProjectApprovalList projects={stats.pendingProjects} />
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                 <div className="lg:col-span-2">
                    <Card>
                        <h3 className="text-lg font-semibold text-white mb-4">Top User Contributions (by Units)</h3>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={userContributionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                    <YAxis stroke="#9ca3af" fontSize={12} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }}
                                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                                        labelStyle={{ color: '#f3f4f6' }}
                                    />
                                    <Bar dataKey="units" fill="#8b5cf6" name="Phantom Units" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                   <GlobalFeed />
                </div>
            </div>
        </div>
    );
};
