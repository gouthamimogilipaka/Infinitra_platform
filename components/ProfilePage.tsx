
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const ProfileDetail: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
    </div>
);


export const ProfilePage: React.FC = () => {
    const { currentUser } = useAppContext();

    if (!currentUser) {
        return <div>Loading profile...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>
            <Card>
                <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                    <img
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
                        src={currentUser.profile_picture || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${currentUser.name}`}
                        alt={currentUser.name}
                    />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                             <div>
                                <h2 className="text-3xl font-bold text-white">{currentUser.name}</h2>
                                <p className="text-violet-300">{currentUser.title}</p>
                            </div>
                            <Button variant="secondary">Edit Profile</Button>
                        </div>
                        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
    );
};
