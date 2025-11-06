import React, { useState, useRef } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Mail, Briefcase, Building, Calendar, Hash, Gem, Camera, X } from 'lucide-react';
import { UserDashboard } from './dashboards/UserDashboard';

const ProfileInfo: React.FC<{ icon: React.ElementType, label: string, value: string }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-center text-sm">
        <Icon className="w-4 h-4 text-gray-500 mr-3" />
        <span className="text-gray-400 w-24">{label}:</span>
        <span className="text-white font-medium">{value}</span>
    </div>
);

export const ProfilePage: React.FC = () => {
    const { currentUser, setUsers } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState(currentUser?.name || '');
    const [title, setTitle] = useState(currentUser?.title || '');
    const [photo, setPhoto] = useState<string | null>(currentUser?.profile_picture || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!currentUser) {
        return <div>Loading profile...</div>;
    }

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

    const handleSaveChanges = () => {
        setUsers(prevUsers => 
            prevUsers.map(u => 
                u.user_id === currentUser.user_id 
                ? { ...u, name, title, profile_picture: photo || undefined } 
                : u
            )
        );
        setIsEditing(false);
    };

    const handleCancel = () => {
        setName(currentUser.name);
        setTitle(currentUser.title);
        setPhoto(currentUser.profile_picture || null);
        setIsEditing(false);
    };

    return (
        <div className="space-y-8">
            <Card>
                <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
                    <div className="relative group">
                        <img
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
                            src={isEditing ? photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}` : currentUser.profile_picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
                            alt={currentUser.name}
                        />
                        {isEditing && (
                            <>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full transition-opacity"
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
                            </>
                        )}
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                        {isEditing ? (
                             <div className="space-y-2">
                                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full text-3xl font-bold bg-gray-700 border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full text-lg bg-gray-700 border-gray-600 rounded-md p-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                            </div>
                        ) : (
                            <div>
                                <h1 className="text-3xl font-bold text-white">{currentUser.name}</h1>
                                <p className="text-lg text-gray-400">{currentUser.title}</p>
                            </div>
                        )}
                    </div>

                    <div className="md:ml-auto">
                        {isEditing ? (
                            <div className="flex space-x-2">
                                <Button onClick={handleSaveChanges}>Save Changes</Button>
                                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                            </div>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        )}
                    </div>
                </div>

                {!isEditing && (
                     <div className="border-t border-gray-700 mt-6 pt-6">
                        <h2 className="text-xl font-semibold text-white mb-4">User Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProfileInfo icon={Mail} label="Email" value={currentUser.email} />
                            <ProfileInfo icon={Briefcase} label="Title" value={currentUser.title} />
                            <ProfileInfo icon={Building} label="Department" value={currentUser.department} />
                            <ProfileInfo icon={Calendar} label="Join Date" value={new Date(currentUser.join_date).toLocaleDateString()} />
                            <ProfileInfo icon={Hash} label="User ID" value={currentUser.user_id.split('-')[0]} />
                            <ProfileInfo icon={Gem} label="Total Units" value={currentUser.phantom_units.toLocaleString()} />
                        </div>
                    </div>
                )}
            </Card>

            {!isEditing && (
                 <div>
                    <h2 className="text-2xl font-bold text-white mb-4">My Dashboard Overview</h2>
                    <UserDashboard />
                </div>
            )}
        </div>
    );
};