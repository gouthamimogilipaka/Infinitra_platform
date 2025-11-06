import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { User, UserRole, UserStatus } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { AddEmployeeModal } from './AddEmployeeModal';

const getVestingStatus = (joinDate: string): { text: string; className: string } => {
    const startDate = new Date(joinDate);
    const now = new Date();
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    const fourYears = 4 * oneYear;

    const timeElapsed = now.getTime() - startDate.getTime();

    if (timeElapsed < oneYear) {
        return { text: 'On Cliff', className: 'bg-yellow-900/50 text-yellow-300' };
    }
    if (timeElapsed >= oneYear && timeElapsed < fourYears) {
        return { text: 'Vesting', className: 'bg-blue-900/50 text-blue-300' };
    }
    return { text: 'Fully Vested', className: 'bg-purple-900/50 text-purple-300' };
};


export const ManageEmployees: React.FC = () => {
    const { users, setUsers, currentUserRole } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (currentUserRole !== UserRole.Admin) {
        return (
            <Card>
                <p className="text-red-400">Access Denied. You must be an Admin to view this page.</p>
            </Card>
        );
    }
    
    // FIX: Replaced UserRole.Employee with UserRole.User as 'Employee' does not exist in the enum.
    const employees = users.filter(user => user.role === UserRole.User);

    const handleToggleStatus = (userId: string) => {
        setUsers(prevUsers => prevUsers.map(user => {
            if (user.user_id === userId) {
                const newStatus = user.status === UserStatus.Active ? UserStatus.Inactive : UserStatus.Active;
                return { ...user, status: newStatus };
            }
            return user;
        }));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Manage Employees</h1>
                <Button onClick={() => setIsModalOpen(true)}>Add New Employee</Button>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/70">
                            <tr className="text-xs font-semibold text-gray-400 uppercase">
                                <th className="p-4">Name</th>
                                <th className="p-4">Employee ID</th>
                                <th className="p-4">Role/Team</th>
                                <th className="p-4">Join Date</th>
                                <th className="p-4">Vesting Status</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(employee => {
                                const vesting = getVestingStatus(employee.join_date);
                                return (
                                <tr key={employee.user_id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="p-4">
                                        <p className="font-medium text-white">{employee.name}</p>
                                        <p className="text-sm text-gray-400">{employee.title}</p>
                                    </td>
                                    <td className="p-4 text-gray-400 text-xs font-mono">{employee.user_id.split('-')[0]}</td>
                                    <td className="p-4 text-gray-300">{employee.department}</td>
                                    <td className="p-4 text-gray-300">{new Date(employee.join_date).toLocaleDateString()}</td>
                                     <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${vesting.className}`}>
                                            {vesting.text}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            employee.status === 'active' ? 'bg-green-900/50 text-green-300' : 'bg-gray-700 text-gray-300'
                                        }`}>{employee.status}</span>
                                    </td>
                                    <td className="p-4 space-x-2">
                                        <Button variant="secondary" size="sm">Edit</Button>
                                        <Button 
                                            variant={employee.status === 'active' ? 'danger' : 'primary'} 
                                            size="sm"
                                            onClick={() => handleToggleStatus(employee.user_id)}
                                        >
                                            {employee.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </Button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </Card>
            <AddEmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};