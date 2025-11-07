
import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useAppContext } from '../../hooks/useAppContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProjectStatus, User } from '../../types';
import { Award, Briefcase, Calendar, PlusCircle } from 'lucide-react';
import { CreateProjectModal } from '../CreateProjectModal';
import { GlobalFeed } from '../GlobalFeed';

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, subtext: string }> = ({ icon: Icon, title, value, subtext }) => (
    <Card>
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">{title}</h3>
            <Icon className="w-5 h-5 text-gray-500" />
        </div>
        <div className="mt-2">
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500">{subtext}</p>
        </div>
    </Card>
);

const VestingProgress: React.FC<{ user: User }> = ({ user }) => {
    const vestingStart = new Date(user.join_date);
    const now = new Date();
    const totalVestingPeriod = 4 * 365 * 24 * 60 * 60 * 1000; // 4 years in ms
    const cliffPeriod = 1 * 365 * 24 * 60 * 60 * 1000; // 1 year in ms
    const timeElapsed = now.getTime() - vestingStart.getTime();

    const isCliffMet = timeElapsed >= cliffPeriod;
    const progressPercentage = Math.min((timeElapsed / totalVestingPeriod) * 100, 100);

    const getVestingDate = (years: number) => {
        const date = new Date(vestingStart);
        date.setFullYear(date.getFullYear() + years);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    return (
        <Card className="h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Vesting Progress</h3>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                <div className="bg-violet-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
                <span>{getVestingDate(0)}</span>
                <span>{getVestingDate(4)}</span>
            </div>
            <div className="mt-4 text-sm">
                {isCliffMet ? (
                    <p className="text-green-400">Cliff of 1 year met. You are currently vesting.</p>
                ) : (
                    <p