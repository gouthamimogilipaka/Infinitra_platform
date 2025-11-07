
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';
import { Button } from './ui/Button';

export const Login: React.FC = () => {
    const { login, setAuthView } = useAppContext();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = login(email);
        if (!success) {
            setError('User not found. Please contact an administrator to get access.');
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-gray-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-gray-950">
                <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(124,58,237,0.8),rgba(255,255,255,0))]"></div>
                <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(52,211,153,0.5),rgba(255,255,255,0))]"></div>
            </div>

            <main className="container mx-auto max-w-md text-center z-10">
                <button 
                    onClick={() => setAuthView('homepage')} 
                    className="absolute top-6 left-6 inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </button>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg p-8 backdrop-blur-sm">
                    <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-violet-500 to-green-600 mb-4 tracking-tighter">
                        GroVeda
                    </h1>
                    <p className="text-gray-400 mb-8">Log in to access your ecosystem dashboard.</p>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                required
                            />
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <Button size="lg" type="submit" className="w-full py-3 text-base">
                            Log In
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
};
