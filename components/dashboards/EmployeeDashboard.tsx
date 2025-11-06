

import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useAppContext } from '../../hooks/useAppContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProjectStatus, User } from '../../types';
import { Award, Briefcase, Calendar, PlusCircle } from 'lucide-react';
import { CreateProjectModal } from '../CreateProjectModal';
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

const VestingProgress: React.FC<{ user: User }> = ({ user }) => {
    const vestingStart = new Date(user.join_date);
    const now = new Date();
    const totalVestingPeriod = 4 * 365 * 24 * 60 * 60 * 1000; // 4 years in ms
    const cliffPeriod = 1 * 365 * 24 * 60 * 60 * 1000; // 1 year in ms
    const timeElapsed = now.getTime() - vestingStart.getTime();

    const isCliffMet = timeElapsed >= cliffPeriod;
    const progressPercentage = Math.min((timeElapsed / totalVestingPeriod) * 100, 100);

    const getVestingDate = (years: number) => {
        const date = new Date(vestingStart);
        date.setFullYear(date.getFullYear() + years);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    return (
        <Card className="h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Vesting Progress</h3>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                {/* FIX: Replaced non-existent 'bg-brand-600' with 'bg-violet-600' for UI consistency. */}
                <div className="bg-violet-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
                <span>{getVestingDate(0)}</span>
                <span>{getVestingDate(4)}</span>
            </div>
            <div className="mt-4 text-sm">
                {isCliffMet ? (
                    <p className="text-green-400">Cliff of 1 year met. You are currently vesting.</p>
                ) : (
                    <p className="text-yellow-400">You have not met the 1-year cliff yet.</p>
                )}
                <p className="text-gray-300 mt-2">Estimated Vested Units: <span className="font-bold text-white">{((progressPercentage / 100) * user.phantom_units).toFixed(0)}</span></p>
            </div>
        </Card>
    );
};

export const EmployeeDashboard: React.FC = () => {
    const { currentUser, projects } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const myProjects = useMemo(() => {
        if (!currentUser) return [];
        return projects.filter(p => p.created_by_id === currentUser.user_id);
    }, [currentUser, projects]);

    const projectStatusData = useMemo(() => [
        { name: 'Approved', value: myProjects.filter(p => p.status === ProjectStatus.Approved).length },
        { name: 'Pending', value: myProjects.filter(p => p.status === ProjectStatus.Pending).length },
        { name: 'Rejected', value: myProjects.filter(p => p.status === ProjectStatus.Rejected).length },
    ], [myProjects]);

    // FIX: Updated pie chart colors to align with UserDashboard for consistency.
    const COLORS = ['#22c55e', '#facc15', '#ef4444'];

    if (!currentUser) return null;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>{/* Placeholder for title moved to Dashboard.tsx */}</div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Create New Project
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={Award} title="My Phantom Units" value={currentUser.phantom_units.toLocaleString()} subtext="Total accumulated" />
                <StatCard icon={Briefcase} title="My Projects" value={myProjects.length.toString()} subtext="Created and contributing" />
                <StatCard icon={Calendar} title="Joined" value={new Date(currentUser.join_date).toLocaleDateString()} subtext="Vesting start date" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <VestingProgress user={currentUser} />
                </div>
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <h3 className="text-lg font-semibold text-white mb-4">My Project Status</h3>
                        <div style={{ width: '100%', height: 200 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    {/* FIX: Updated Pie fill color and tooltip style for consistency. */}
                                    <Pie data={projectStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} fill="#8b5cf6" paddingAngle={5} dataKey="value" nameKey="name">
                                        {projectStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                    <Legend iconSize={10} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>
             <GlobalFeed />

            <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};
