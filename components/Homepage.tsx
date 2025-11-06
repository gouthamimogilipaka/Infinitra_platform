import React, { useMemo } from 'react';
import { TrendingUp, Zap, Gem, Rocket, BarChart2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useAppContext } from '../hooks/useAppContext';
import { ProjectStatus } from '../types';

// FIX: Changed `children` prop to `description` to resolve typing errors.
const FeatureCard = ({ icon: Icon, title, description, hasNotification = false }: { icon: React.ElementType, title: string, description: React.ReactNode, hasNotification?: boolean }) => (
  <div className="bg-gray-800/30 backdrop-blur-lg border border-violet-500/20 rounded-2xl p-6 text-center transform hover:scale-105 hover:border-violet-500/50 transition-all duration-300 shadow-lg">
    <div className="w-16 h-16 bg-gray-900/50 border border-violet-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon className="w-8 h-8 text-neon" />
    </div>
    <div className="relative inline-block">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        {hasNotification && (
            <div className="absolute bottom-1 left-0 w-full h-0.5 bg-red-500 rounded-full animate-pulse"></div>
        )}
    </div>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);


export const Homepage: React.FC = () => {
  const { setCurrentView, projects } = useAppContext();

  const handleEnterDashboard = () => {
    setCurrentView('dashboard');
  };

  const hasPendingProjects = useMemo(() => {
      return projects.some(p => p.status === ProjectStatus.Pending);
  }, [projects]);


  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-gray-950 text-white overflow-hidden p-4">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_rgba(109,40,217,0.4)_0%,_transparent_40%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_rgba(52,211,153,0.3)_0%,_transparent_40%)]"></div>
        <div 
          className="absolute inset-0 bg-[linear-gradient(45deg,rgba(109,40,217,0.1)_0%,rgba(52,211,153,0.1)_100%)] animate-aurora"
          style={{ backgroundSize: '400% 400%' }}
        ></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full flex-grow">
        {/* Hero Section */}
        <div className="mb-12">
            <TrendingUp className="w-12 h-12 text-neon mx-auto mb-4 animate-pulse" style={{ filter: 'drop-shadow(0 0 10px #34d399)' }}/>
            <h1 
              className="text-7xl md:text-8xl font-black tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-neon to-violet-400"
              style={{ textShadow: '0 0 20px rgba(52, 211, 153, 0.4), 0 0 30px rgba(167, 139, 250, 0.3)' }}
            >
              GroVeda
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-300 mb-4">
              Grow with us.
            </p>
            <p className="max-w-2xl mx-auto text-gray-400">
              Enter an infinite realm of innovation. Where your contributions forge the future and you own your impact.
            </p>
        </div>

        {/* Call to Action Button */}
        <Button 
          size="lg" 
          onClick={handleEnterDashboard}
          className={`relative overflow-hidden transition-all duration-300 transform hover:scale-105 ${hasPendingProjects ? 'animate-pulse-neon' : ''}`}
        >
          Enter Dashboard
          {hasPendingProjects && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 animate-pulse"></span>
          )}
        </Button>
      </div>

      {/* Feature Cards Section */}
      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-auto mb-8">
        {/* FIX: Updated component calls to use the `description` prop. */}
        <FeatureCard icon={Zap} title="Forge the Future" description="Contribute to cutting-edge projects and bring innovative ideas to life." hasNotification={hasPendingProjects} />
        {/* FIX: Updated component calls to use the `description` prop. */}
        <FeatureCard icon={Gem} title="Own Your Impact" description="Earn phantom equity for your work and share in the success you help create." />
        {/* FIX: Updated component calls to use the `description` prop. */}
        <FeatureCard icon={Rocket} title="Launch What's Next" description="Propose new ventures, lead initiatives, and drive the direction of our growth." />
        {/* FIX: Updated component calls to use the `description` prop. */}
        <FeatureCard icon={BarChart2} title="Achieve New Heights" description="Track your contributions and watch your value grow in a transparent ecosystem." />
      </div>
    </div>
  );
};