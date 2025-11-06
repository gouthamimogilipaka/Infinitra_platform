
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { User, UserRole, UserStatus } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { AddUserModal } from './AddUserModal';
import { EditUserModal } from './EditUserModal';

export const ManageUsers: React.FC = () => {
    const { users, setUsers, currentUserRole } = useAppContext();
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    if (currentUserRole !== UserRole.Admin) {
        return (
            <Card>
                <p className="text-red-400">Access Denied. You must be an Admin to view this page.</p>
            </Card>
        );
    }

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

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Manage All Users</h1>
                <Button onClick={() => setAddModalOpen(true)}>Add New User</Button>
            </div>
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
                            {users.map(user => (
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
                                    <td className="p-4 space-x-2">
                                        <Button variant="secondary" size="sm" onClick={() => handleEditClick(user)}>Edit</Button>
                                        <Button 
                                            variant={user.status === 'active' ? 'danger' : 'primary'} 
                                            size="sm"
                                            onClick={() => handleToggleStatus(user.user_id)}
                                        >
                                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <AddUserModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} />
            {selectedUser && <EditUserModal user={selectedUser} isOpen={isEditModalOpen} onClose={() => { setEditModalOpen(false); setSelectedUser(null); }} />}
        </div>
    );
};
