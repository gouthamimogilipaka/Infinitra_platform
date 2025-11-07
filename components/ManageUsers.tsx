import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { User, UserRole, UserStatus } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { AddUserModal } from './AddUserModal';
import { EditUserModal } from './EditUserModal';
import { Search } from 'lucide-react';

export const ManageUsers: React.FC = () => {
    const { users, setUsers, currentUserRole, currentUser } = useAppContext();
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

    if (currentUserRole !== UserRole.Admin) {
        return (
            <Card>
                <p className="text-red-400">Access Denied. You must be an Admin to view this page.</p>
            </Card>
        );
    }

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = searchTerm === '' ||
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;

            return matchesSearch && matchesStatus && matchesRole;
        });
    }, [users, searchTerm, statusFilter, roleFilter]);


    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setEditModalOpen(true);
    };

    const handleToggleStatus = (userId: string) => {
        setUsers(prevUsers => prevUsers.map(user => {
            if (user.user_id === userId) {
                return { ...user, status: user.status === UserStatus.Active ? UserStatus.Inactive : UserStatus.Active };
            }
            return user;
        }));
    };

    const handleRemoveUser = (userId: string) => {
        if (currentUser?.user_id === userId) {
            alert("You cannot remove yourself.");
            return;
        }
        if (window.confirm('Are you sure you want to permanently remove this user? This action cannot be undone.')) {
            setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Manage All Users</h1>
                <Button onClick={() => setAddModalOpen(true)}>Add New User</Button>
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
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                         <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-400">Status:</span>
                            <Button size="sm" variant={statusFilter === 'all' ? 'primary' : 'secondary'} onClick={() => setStatusFilter('all')}>All</Button>
                            <Button size="sm" variant={statusFilter === UserStatus.Active ? 'primary' : 'secondary'} onClick={() => setStatusFilter(UserStatus.Active)}>Active</Button>
                            <Button size="sm" variant={statusFilter === UserStatus.Inactive ? 'primary' : 'secondary'} onClick={() => setStatusFilter(UserStatus.Inactive)}>Inactive</Button>
                        </div>
                        <div className="flex items-center space-x-2">
                             <span className="text-sm font-medium text-gray-400">Role:</span>
                            <Button size="sm" variant={roleFilter === 'all' ? 'primary' : 'secondary'} onClick={() => setRoleFilter('all')}>All</Button>
                            <Button size="sm" variant={roleFilter === UserRole.Admin ? 'primary' : 'secondary'} onClick={() => setRoleFilter(UserRole.Admin)}>Admin</Button>
                            <Button size="sm" variant={roleFilter === UserRole.User ? 'primary' : 'secondary'} onClick={() => setRoleFilter(UserRole.User)}>User</Button>
                        </div>
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
                                <th className="p-4">System Role</th>
                                <th className="p-4">Phantom Units</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? filteredUsers.map(user => (
                                <tr key={user.user_id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="p-4">
                                        <p className="font-medium text-white">{user.name}</p>
                                        <p className="text-sm text-gray-400">{user.title}</p>
                                    </td>
                                    <td className="p-4 text-gray-300">{user.email}</td>
                                    <td className="p-4">
                                         <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            user.role === UserRole.Admin ? 'bg-violet-900/50 text-violet-300' : 'bg-gray-700 text-gray-300'
                                        }`}>{user.role}</span>
                                    </td>
                                    <td className="p-4 font-medium text-white">{user.phantom_units.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            user.status === 'active' ? 'bg-green-900/50 text-green-300' : 'bg-gray-700 text-gray-300'
                                        }`}>{user.status}</span>
                                    </td>
                                    <td className="p-4 space-x-2 whitespace-nowrap">
                                        <Button variant="secondary" size="sm" onClick={() => handleEditClick(user)}>Edit</Button>
                                        <Button 
                                            variant={user.status === 'active' ? 'secondary' : 'primary'} 
                                            size="sm"
                                            onClick={() => handleToggleStatus(user.user_id)}
                                        >
                                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </Button>
                                         <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => handleRemoveUser(user.user_id)}
                                        >
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-400">
                                        No users found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
            <AddUserModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} />
            {selectedUser && <EditUserModal user={selectedUser} isOpen={isEditModalOpen} onClose={() => { setEditModalOpen(false); setSelectedUser(null); }} />}
        </div>
    );
};