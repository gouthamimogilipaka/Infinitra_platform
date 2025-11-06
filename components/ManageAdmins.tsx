import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { User, UserRole } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { AddAdminModal } from './AddAdminModal';

export const ManageAdmins: React.FC = () => {
    const { users, setUsers, currentUserRole, currentUser } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (currentUserRole !== UserRole.Admin) {
        return (
            <Card>
                <p className="text-red-400">Access Denied. You must be an Admin to view this page.</p>
            </Card>
        );
    }
    
    const admins = users.filter(user => user.role === UserRole.Admin);

    const handleRemoveAdmin = (userId: string) => {
        if (currentUser?.user_id === userId) {
            alert("You cannot remove yourself.");
            return;
        }
        if (window.confirm('Are you sure you want to remove this admin? This action cannot be undone.')) {
            setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Manage Admins</h1>
                <Button onClick={() => setIsModalOpen(true)}>Add New Admin</Button>
            </div>
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
                            {admins.map(admin => (
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
                                        <Button variant="danger" size="sm" onClick={() => handleRemoveAdmin(admin.user_id)}>Remove</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <AddAdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};