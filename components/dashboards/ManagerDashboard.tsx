import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAppContext } from '../../hooks/useAppContext';
import { Card } from '../ui/Card';
import { DollarSign, Briefcase, Users } from 'lucide-react';
import { GlobalFeed } from '../GlobalFeed';

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, subtext: string }> = ({ icon: Icon, title, value, subtext }) => (
    <Card className="flex flex-col">
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

export const ManagerDashboard: React.FC = () => {
    const { users, projects } = useAppContext();

    const totalPhantomUnits = useMemo(() => users.reduce((acc, user) => acc + user.phantom_units, 0), [users]);
    const totalProjects = projects.length;
    const totalEmployees = users.filter(u => u.status === 'active').length;

    const chartData = useMemo(() => {
        const contributions: { [key: string]: number } = {};
        users.forEach(user => {
            contributions[user.name] = user.phantom_units;
        });
        return Object.entries(contributions)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, units]) => ({ name: name.split(' ')[0], units }));
    }, [users]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={Briefcase} title="Total Phantom Units" value={totalPhantomUnits.toLocaleString()} subtext="Across all partners" />
                <StatCard icon={DollarSign} title="Total Project Value" value={`$${(projects.reduce((acc, p) => acc + p.value, 0) / 1000000).toFixed(2)}M`} subtext="Approved projects" />
                <StatCard icon={Users} title="Active Partners" value={totalEmployees.toString()} subtext="In the ecosystem" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <h3 className="text-lg font-semibold text-white mb-4">Top Partner Contributions</h3>
                         <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                    <YAxis stroke="#9ca3af" fontSize={12} />
                                    <Tooltip
                                        // FIX: Changed cursor fill color for UI consistency with AdminDashboard.
                                        cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }}
                                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                                        labelStyle={{ color: '#f3f4f6' }}
                                    />
                                    {/* FIX: Changed bar fill color to violet for UI consistency with AdminDashboard. */}
                                    <Bar dataKey="units" fill="#7c3aed" name="Phantom Units" radius={[4, 4, 0, 0]} />
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
