import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { UserRole } from '../types';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { UserDashboard } from './dashboards/EmployeeDashboard';
import { ManagerDashboard } from './dashboards/ManagerDashboard';

export const Dashboard: React.FC = () => {
  const { currentUserRole, currentUser } = useAppContext();

  if (!currentUser) {
    return <div>Loading user data...</div>;
  }

  const renderDashboard = () => {
    switch (currentUserRole) {
      case UserRole.Admin:
        return <AdminDashboard />;
      case UserRole.Manager:
        return <ManagerDashboard />;
      case UserRole.User:
        return <UserDashboard />;
      default:
        return <div>Invalid user role.</div>;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">
        Welcome back, {currentUser.name.split(' ')[0]}!
      </h1>
      <p className="text-gray-400 mb-8">Here's what's happening at GroVeda today.</p>
      {renderDashboard()}
    </div>
  );
};
