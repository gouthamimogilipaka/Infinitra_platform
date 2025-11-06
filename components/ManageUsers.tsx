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
    
    if (currentUserRole !== UserRole.Admin) {
        return (
            <Card>
                <p className="text-red-400">Access Denied. You must be an Admin to view this page.</p>
            </Card>
        );
    }

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setEditModalOpen(true);
    };

    const handleToggleStatus = (userId: string) => {
        setUsers(prevUsers => prevUsers.map(user => {
            if (user.user_id === userId) {
                if (user.user_id === currentUser?.user_id) {
                    alert("You cannot change your own status.");
                    return user;
                }
                const newStatus = user.status === UserStatus.Active ? UserStatus.Inactive : UserStatus.Active;
                return { ...user, status: newStatus };
            }
            return user;
        }));
    };
    
    const handleRemoveUser = (userId: string) => {
        if (currentUser?.user_id === userId) {
            alert("You cannot remove yourself.");
            return;
        }
        const userToRemove = users.find(u => u.user_id === userId);
        if (userToRemove?.role === UserRole.Admin && users.filter(u => u.role === UserRole.Admin).length === 1) {
            alert("You cannot remove the last admin.");
            return;
        }
        if (window.confirm(`Are you sure you want to permanently remove ${userToRemove?.name}? This action cannot be undone.`)) {
            setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
        }
    };


    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Manage All Users</h1>
                 <Button onClick={() => setAddModalOpen(true)}>Add New User</Button>
            </div>

            <Card>
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/70">
                            <tr className="text-xs font-semibold text-gray-400 uppercase">
                                <th className="p-4">User</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Phantom Units</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.user_id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="p-4 font-medium text-white">
                                        <div className="flex items-center space-x-3">
                                            <img 
                                                className="w-10 h-10 rounded-full object-cover"
                                                src={user.profile_picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`} 
                                                alt={user.name}
                                            />
                                            <div>
                                                <p>{user.name}</p>
                                                <p className="text-xs text-gray-400">{user.title}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-300">{user.email}</td>
                                    <td className="p-4 text-gray-300 capitalize">{user.role}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === 'active' ? 'bg-green-900/50 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-300">{user.phantom_units.toLocaleString()}</td>
                                    <td className="p-4 space-x-2">
                                        <Button variant="secondary" size="sm" onClick={() => handleEdit(user)}>Edit</Button>
                                        <Button 
                                            variant={user.status === 'active' ? 'secondary' : 'primary'} 
                                            size="sm"
                                            onClick={() => handleToggleStatus(user.user_id)}
                                        >
                                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => handleRemoveUser(user.user_id)}>Remove</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <AddUserModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} />
            {selectedUser && <EditUserModal isOpen={isEditModalOpen} onClose={() => { setEditModalOpen(false); setSelectedUser(null); }} user={selectedUser} />}
        </div>
    );
};
