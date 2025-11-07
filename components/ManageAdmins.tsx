import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { User, UserRole, UserStatus } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { AddAdminModal } from './AddAdminModal';
import { Search } from 'lucide-react';

export const ManageAdmins: React.FC = () => {
    const { users, setUsers, hasPermission, currentUser } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');

    if (!hasPermission('manage_admins')) {
        return (
            <Card>
                <p className="text-red-400">Access Denied. You do not have permission to manage admins.</p>
            </Card>
        );
    }
    
    const filteredAdmins = useMemo(() => {
        const admins = users.filter(user => user.role === UserRole.Admin);
        return admins.filter(admin => {
            const matchesSearch = searchTerm === '' ||
                admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                admin.email.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' || admin.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [users, searchTerm, statusFilter]);

    const handleRevokeAdmin = (userId: string) => {
        if (currentUser?.user_id === userId) {
            alert("You cannot revoke your own admin privileges.");
            return;
        }
        if (window.confirm('Are you sure you want to revoke admin privileges for this user? They will be demoted to a regular user.')) {
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.user_id === userId 
                        ? { ...user, role: UserRole.User } 
                        : user
                )
            );
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Manage Admins</h1>
                <Button onClick={() => setIsModalOpen(true)}>Add New Admin</Button>
            </div>

            <Card className="mb-6 p-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-400">Status:</span>
                        <Button size="sm" variant={statusFilter === 'all' ? 'primary' : 'secondary'} onClick={() => setStatusFilter('all')}>All</Button>
                        <Button size="sm" variant={statusFilter === UserStatus.Active ? 'primary' : 'secondary'} onClick={() => setStatusFilter(UserStatus.Active)}>Active</Button>
                        <Button size="sm" variant={statusFilter === UserStatus.Inactive ? 'primary' : 'secondary'} onClick={() => setStatusFilter(UserStatus.Inactive)}>Inactive</Button>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/70">
                            <tr className="text-xs font-semibold text-gray-400 uppercase">
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAdmins.length > 0 ? filteredAdmins.map(admin => (
                                <tr key={admin.user_id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="p-4">
                                        <p className="font-medium text-white">{admin.name}</p>
                                        <p className="text-sm text-gray-400">{admin.department}</p>
                                    </td>
                                    <td className="p-4 text-gray-300">{admin.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            admin.status === 'active' ? 'bg-green-900/50 text-green-300' : 'bg-gray-700 text-gray-300'
                                        }`}>{admin.status}</span>
                                    </td>
                                    <td className="p-4">
                                        <Button variant="danger" size="sm" onClick={() => handleRevokeAdmin(admin.user_id)}>Revoke Admin</Button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-12 text-gray-400">
                                        No admins found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
            <AddAdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};