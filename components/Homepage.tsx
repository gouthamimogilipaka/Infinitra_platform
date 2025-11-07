
import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';
import { Button } from './ui/Button';

const FeaturePillar: React.FC<{ icon: React.ElementType, title: string, description: string }> = ({ icon: Icon, title, description }) => (
    <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700 text-center flex flex-col items-center">
        <div className="bg-violet-600/20 p-3 rounded-full mb-4 border border-violet-500/50">
            <Icon className="w-6 h-6 text-violet-300" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
);


export const Homepage: React.FC = () => {
    const { setAuthView } = useAppContext();

    return (
        <div className="relative min-h-screen w-full bg-gray-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
            <div className="absolute inset-0 -z-10 h-full w-full bg-gray-950 animation-aurora bg-[length:400%_400%] opacity-40" style={{ backgroundImage: `radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 1) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 1) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(355, 98%, 61%, 1) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 1) 0px, transparent 50%), radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 1) 0px, transparent 50%), radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 1) 0px, transparent 50%), radial-gradient(at 79% 53%, hsla(342, 94%, 65%, 1) 0px, transparent 50%)`}}></div>

            <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 max-w-7xl mx-auto">
                 <div className="text-2xl font-bold text-white flex items-center">
                    <span>
                        Gro<span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-green-600 -mx-0.5">V</span>eda
                    </span>
                </div>
                <Button onClick={() => setAuthView('login')}>Log In</Button>
            </header>

            <main className="container mx-auto max-w-4xl text-center z-10 flex flex-col items-center mt-24">
                <h1 className="text-6xl md:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-violet-500 to-green-600 mb-4 tracking-tighter">
                    GroVeda
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                    Empowering a decentralized ecosystem of partners to build, own, and grow together.
                </p>
                <Button size="lg" onClick={() => setAuthView('login')} className="animate-pulse-neon">
                    Access Your Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </main>

            <section className="mt-24 z-10 max-w-5xl w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeaturePillar 
                        icon={CheckCircle}
                        title="Unified Ecosystem"
                        description="A single source of truth for all partners, projects, and equity distribution."
                    />
                     <FeaturePillar 
                        icon={CheckCircle}
                        title="Phantom Equity"
                        description="Track your contributions and watch your phantom equity grow with every successful project."
                    />
                     <FeaturePillar 
                        icon={CheckCircle}
                        title="Transparent Collaboration"
                        description="Align incentives and foster a culture of ownership and shared success."
                    />
                </div>
            </section>
        </div>
    );
};
