import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../hooks/useAppContext';
import { User, UserRole, UserStatus } from '../types';
import { Button } from './ui/Button';
import { X } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
    const { setUsers, currentUserRole } = useAppContext();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('Partner in progress');
    const [title, setTitle] = useState('Software Engineer');
    const [role, setRole] = useState<UserRole>(UserRole.User);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;

        const newUser: User = {
            user_id: uuidv4(),
            name,
            email,
            role: role,
            status: UserStatus.Active,
            phantom_units: 0,
            vested_units: 0,
            join_date: new Date().toISOString(),
            department,
            title,
        };

        setUsers(prev => [...prev, newUser]);
        onClose();
        // Reset form
        setName('');
        setEmail('');
        setDepartment('Partner in progress');
        setTitle('Software Engineer');
        setRole(UserRole.User);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg border border-gray-700 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <X />
                </button>
                <h2 className="text-2xl font-bold text-white mb-6">Add New User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                    </div>
                    {currentUserRole === UserRole.Admin && (
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">System Role</label>
                            <select id="role" value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                                <option value={UserRole.User}>User</option>
                                <option value={UserRole.Admin}>Admin</option>
                            </select>
                        </div>
                    )}
                     <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-1">Team Role</label>
                        <select id="department" value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                            <option value="Partner in progress">Partner in progress</option>
                            <option value="Partner">Partner</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title (e.g. Software Engineer)</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                    </div>
                    <div className="flex justify-end pt-4 space-x-3">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Add User</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};