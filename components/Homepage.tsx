
import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export const Homepage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <Card className="max-w-md w-full text-center">
                <h1 className="text-4xl font-bold text-white mb-2">Welcome to Infinitra</h1>
                <p className="text-gray-400 mb-8">The Phantom Equity Management Platform</p>
                <p className="text-gray-300 mb-6">
                    This is a demo application. In a real-world scenario, you would be presented with a login screen.
                </p>
                <Button size="lg" className="w-full">
                    Login (Not Implemented)
                </Button>
            </Card>
        </div>
    );
};
