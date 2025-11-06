
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { User, UserRole } from '../types';
import { Button } from './ui/Button';
import { X } from 'lucide-react';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user }) => {
    const { setUsers, currentUserRole } = useAppContext();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [title, setTitle] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.User);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setDepartment(user.department);
            setTitle(user.title);
            setRole(user.role);
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !name || !email) return;

        const updatedUser: User = {
            ...user,
            name,
            email,
            department,
            title,
            role,
        };

        setUsers(prev => prev.map(u => (u.user_id === user.user_id ? updatedUser : u)));
        onClose();
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg border border-gray-700 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <X />
                </button>
                <h2 className="text-2xl font-bold text-white mb-6">Edit User: {user.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="edit-name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input type="text" id="edit-name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                    </div>
                    <div>
                        <label htmlFor="edit-email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input type="email" id="edit-email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                    </div>
                    <div>
                        <label htmlFor="edit-department" className="block text-sm font-medium text-gray-300 mb-1">Department</label>
                        <input type="text" id="edit-department" value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                    </div>
                    <div>
                        <label htmlFor="edit-title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                        <input type="text" id="edit-title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                    </div>
                    {currentUserRole === UserRole.Admin && (
                        <div>
                            <label htmlFor="edit-role" className="block text-sm font-medium text-gray-300 mb-1">System Role</label>
                            <select id="edit-role" value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                                <option value={UserRole.User}>User</option>
                                <option value={UserRole.Admin}>Admin</option>
                            </select>
                        </div>
                    )}
                    <div className="flex justify-end pt-4 space-x-3">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
