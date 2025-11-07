
import React, { useRef, useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Card } from './ui/Card';
import { Upload, Edit } from 'lucide-react';
import { Button } from './ui/Button';
import { EditProfileModal } from './EditProfileModal';


const ProfileDetail: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
    </div>
);


export const ProfilePage: React.FC = () => {
    const { currentUser, setUsers } = useAppContext();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    if (!currentUser) {
        return <div>Loading profile...</div>;
    }
    
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && currentUser) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newProfilePicture = reader.result as string;
                setUsers(prevUsers => 
                    prevUsers.map(u => 
                        u.user_id === currentUser.user_id 
                            ? { ...u, profile_picture: newProfilePicture } 
                            : u
                    )
                );
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>
            <Card>
                <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                    <div className="relative group cursor-pointer" onClick={handleImageClick}>
                        <img
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 group-hover:opacity-75 transition-opacity duration-200"
                            src={currentUser.profile_picture || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${currentUser.name}`}
                            alt={currentUser.name}
                        />
                         <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <Upload className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/png, image/jpeg, image/gif"
                    />

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-white">{currentUser.name}</h2>
                                <p className="text-violet-300">{currentUser.title}</p>
                            </div>
                            <Button variant="secondary" size="sm" onClick={() => setEditModalOpen(true)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                           <ProfileDetail label="Email" value={currentUser.email} />
                           <ProfileDetail label="Department" value={currentUser.department} />
                           <ProfileDetail label="Status" value={currentUser.status} />
                           <ProfileDetail label="Role" value={currentUser.role} />
                           <ProfileDetail label="Join Date" value={new Date(currentUser.join_date).toLocaleDateString()} />
                           <ProfileDetail label="Phantom Units" value={currentUser.phantom_units.toLocaleString()} />
                           <ProfileDetail label="Vested Units" value={currentUser.vested_units.toLocaleString()} />
                        </div>
                    </div>
                </div>
            </Card>
            {currentUser && <EditProfileModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} user={currentUser} />}
        </div>
    );
};