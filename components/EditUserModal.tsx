import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { User, UserRole } from '../types';
import { Button } from './ui/Button';
import { X, Camera } from 'lucide-react';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user }) => {
    const { setUsers, currentUserRole, currentUser } = useAppContext();
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [department, setDepartment] = useState(user.department);
    const [title, setTitle] = useState(user.title);
    const [role, setRole] = useState<UserRole>(user.role);
    const [photo, setPhoto] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setDepartment(user.department);
            setTitle(user.title);
            setRole(user.role);
            setPhoto(user.profile_picture || null);
        }
    }, [user]);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        setUsers(prev => prev.map(u => 
            u.user_id === user.user_id 
            ? { ...u, name, email, department, title, role, profile_picture: photo || undefined }
            : u
        ));
        
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
                    <div className="flex items-center space-x-4">
                        <div className="relative group flex-shrink-0">
                             <img
                                className="w-24 h-24 rounded-full object-cover border-4 border-gray-700"
                                src={photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`}
                                alt={name}
                            />
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Camera className="w-8 h-8 text-white" />
                            </button>
                            {photo && (
                                <button
                                    type="button"
                                    onClick={() => setPhoto(null)}
                                    className="absolute -top-1 -right-1 bg-red-600 rounded-full p-1 text-white hover:bg-red-700"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                <input type="text" id="edit-name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                            </div>
                            <div>
                                <label htmlFor="edit-email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                <input type="email" id="edit-email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentUser?.user_id !== user.user_id && currentUserRole === UserRole.Admin && (
                            <div>
                                <label htmlFor="edit-role" className="block text-sm font-medium text-gray-300 mb-1">System Role</label>
                                <select id="edit-role" value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                                    <option value={UserRole.User}>User</option>
                                    <option value={UserRole.Admin}>Admin</option>
                                </select>
                            </div>
                        )}
                        <div>
                            <label htmlFor="edit-department" className="block text-sm font-medium text-gray-300 mb-1">Team Role</label>
                            <select id="edit-department" value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                               <option value="Partner in progress">Partner in progress</option>
                               <option value="Partner">Partner</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="edit-title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                        <input type="text" id="edit-title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                    </div>
                    <div className="flex justify-end pt-4 space-x-3">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
