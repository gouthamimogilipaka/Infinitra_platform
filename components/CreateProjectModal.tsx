import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Project, ProjectType, ProjectStatus, ProjectScenario, Contributor } from '../types';
import { Button } from './ui/Button';
import { X, ArrowRight, DollarSign, Lightbulb, Users, Award } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { PHANTOM_CONVERSION_RATE } from '../constants';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const scenarioDetails = {
    [ProjectScenario.Opportunity]: {
        icon: DollarSign,
        title: 'Bring an Opportunity',
        description: 'A project paid for by an external client. A percentage of profits are contributed to the phantom pool.'
    },
    [ProjectScenario.ProductIdeaCompanyFunded]: {
        icon: Lightbulb,
        title: 'Product Idea (Company-Funded)',
        description: 'Pitch a new IP/product idea to be built with company resources. The ideator receives a royalty.'
    },
    [ProjectScenario.ProductIdeaSelfFunded]: {
        icon: Lightbulb,
        title: 'Product Idea (Self-Funded)',
        description: 'Develop a new IP/product with your own resources and pay a royalty to the GroVeda ecosystem.'
    },
    [ProjectScenario.JointVenture]: {
      icon: Users,
      title: 'Joint Venture',
      description: 'Collaborate with other partners on a self-funded product idea, sharing costs and equity.'
    },
    [ProjectScenario.InternalInitiative]: {
        icon: Award,
        title: 'Internal Initiative',
        description: 'Propose a non-revenue project to improve the ecosystem. Awarded a fixed amount of phantom units.'
    }
};

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
    const { setProjects, currentUser, users } = useAppContext();
    const [step, setStep] = useState(1);
    const [scenario, setScenario] = useState<ProjectScenario | null>(null);

    // Form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [type, setType] = useState<ProjectType>(ProjectType.External);
    const [deadline, setDeadline] = useState('');
    const [duration, setDuration] = useState('');
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [awardedPhantomUnits, setAwardedPhantomUnits] = useState('');
    
    // Scenario specific fields
    const [phantomPoolContribution, setPhantomPoolContribution] = useState('20');
    const [royaltyToIdeator, setRoyaltyToIdeator] = useState('10');
    const [royaltyToCompany, setRoyaltyToCompany] = useState('10');

    const resetForm = () => {
        setStep(1);
        setScenario(null);
        setTitle('');
        setDescription('');
        setValue('');
        setType(ProjectType.External);
        setDeadline('');
        setDuration('');
        setContributors([]);
        setAwardedPhantomUnits('');
        setPhantomPoolContribution('20');
        setRoyaltyToIdeator('10');
        setRoyaltyToCompany('10');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSelectScenario = (selectedScenario: ProjectScenario) => {
        setScenario(selectedScenario);
        if (currentUser) {
            // Automatically add the creator as a contributor
            setContributors([{ user_id: currentUser.user_id, role_in_project: 'Creator', share_percentage: 0 }]);
        }
        setStep(2);
    };
    
    const handleAddContributor = () => {
        const firstUser = users.find(u => !contributors.some(c => c.user_id === u.user_id));
        if (firstUser) {
            setContributors([...contributors, { user_id: firstUser.user_id, role_in_project: '', share_percentage: 0 }]);
        }
    };

    const handleContributorChange = (index: number, field: keyof Contributor, value: string | number) => {
        const newContributors = [...contributors];
        if (field === 'share_percentage') {
            newContributors[index][field] = Number(value);
        } else {
            (newContributors[index] as any)[field] = value;
        }
        setContributors(newContributors);
    };

    const handleRemoveContributor = (index: number) => {
        if (contributors[index].role_in_project === 'Creator') {
            alert("Cannot remove the project creator.");
            return;
        }
        setContributors(contributors.filter((_, i) => i !== index));
    };

    const remainingUsers = useMemo(() => {
        return users.filter(u => !contributors.some(c => c.user_id === u.user_id));
    }, [users, contributors]);

    const totalShare = useMemo(() => {
        return contributors.reduce((acc, curr) => acc + curr.share_percentage, 0);
    }, [contributors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !deadline || !duration || !scenario) return;

        const isInternalInitiative = scenario === ProjectScenario.InternalInitiative;
        if (isInternalInitiative) {
            if (!title || !description || !awardedPhantomUnits) return;
        } else {
            if (!title || !description || !value) return;
        }

        if (totalShare > 100) {
            alert("Total share percentage cannot exceed 100%.");
            return;
        }

        const projectValue = isInternalInitiative ? 0 : parseFloat(value);
        const phantomUnits = isInternalInitiative 
            ? parseFloat(awardedPhantomUnits) 
            : projectValue / PHANTOM_CONVERSION_RATE;

        const newProject: Project = {
            project_id: uuidv4(),
            title,
            description,
            type: isInternalInitiative ? ProjectType.Internal : type,
            scenario,
            contributors,
            created_by_id: currentUser.user_id,
            value: projectValue,
            phantom_units: phantomUnits,
            approved_by_id: null,
            created_at: new Date().toISOString(),
            status: ProjectStatus.Pending,
            deadline,
            estimated_duration_days: parseInt(duration, 10),
            ...(scenario === ProjectScenario.Opportunity && { phantom_pool_contribution_percentage: parseFloat(phantomPoolContribution) }),
            ...(scenario === ProjectScenario.ProductIdeaCompanyFunded && { royalty_to_ideator_percentage: parseFloat(royaltyToIdeator) }),
            ...(scenario === ProjectScenario.ProductIdeaSelfFunded && { royalty_to_company_percentage: parseFloat(royaltyToCompany) }),
        };

        setProjects(prev => [...prev, newProject]);
        handleClose();
    };

    if (!isOpen) return null;

    const renderStepOne = () => (
        <>
            <h2 className="text-2xl font-bold text-white mb-2">Choose a Project Scenario</h2>
            <p className="text-gray-400 mb-6">Select the type of project you want to create.</p>
            <div className="space-y-4">
                {Object.entries(scenarioDetails).map(([key, { icon: Icon, title, description }]) => (
                    <button key={key} onClick={() => handleSelectScenario(key as ProjectScenario)} className="w-full text-left p-4 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg flex items-center space-x-4 transition-all duration-200">
                        <div className="bg-gray-800 p-3 rounded-lg"><Icon className="w-6 h-6 text-violet-400" /></div>
                        <div>
                            <h3 className="font-bold text-white">{title}</h3>
                            <p className="text-sm text-gray-400">{description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-500 ml-auto" />
                    </button>
                ))}
            </div>
        </>
    );

    const renderStepTwo = () => {
        const details = scenario ? scenarioDetails[scenario] : null;
        const isInternalInitiative = scenario === ProjectScenario.InternalInitiative;
        return (
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                <div className="flex items-center gap-3">
                    {details && <div className="bg-gray-700 p-2 rounded-lg"><details.icon className="w-5 h-5 text-violet-400" /></div>}
                    <div>
                        <h2 className="text-2xl font-bold text-white">{details?.title}</h2>
                        <button type="button" onClick={() => setStep(1)} className="text-sm text-violet-400 hover:underline">Change scenario</button>
                    </div>
                </div>

                {/* Common Fields */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Project Title</label>
                    <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isInternalInitiative ? (
                        <div>
                            <label htmlFor="awardedUnits" className="block text-sm font-medium text-gray-300 mb-1">Awarded Phantom Units</label>
                            <input type="number" id="awardedUnits" value={awardedPhantomUnits} onChange={e => setAwardedPhantomUnits(e.target.value)} min="0" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="value" className="block text-sm font-medium text-gray-300 mb-1">Project Value ($)</label>
                            <input type="number" id="value" value={value} onChange={e => setValue(e.target.value)} min="0" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                        </div>
                    )}
                    
                    {!isInternalInitiative && (
                      <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">Project Type</label>
                          <select id="type" value={type} onChange={e => setType(e.target.value as ProjectType)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                              <option value={ProjectType.External}>External (Client-paid)</option>
                              <option value={ProjectType.Internal}>Internal Development</option>
                              <option value={ProjectType.IP}>IP/Product</option>
                          </select>
                      </div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-300 mb-1">Deadline</label>
                        <input type="date" id="deadline" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">Est. Duration (days)</label>
                        <input type="number" id="duration" value={duration} onChange={e => setDuration(e.target.value)} min="1" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                    </div>
                </div>

                {/* Scenario-Specific Fields */}
                {scenario === ProjectScenario.Opportunity && (
                    <div>
                        <label htmlFor="phantomPool" className="block text-sm font-medium text-gray-300 mb-1">Phantom Pool Contribution (%)</label>
                        <input type="number" id="phantomPool" value={phantomPoolContribution} onChange={e => setPhantomPoolContribution(e.target.value)} min="0" max="100" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                    </div>
                )}
                {scenario === ProjectScenario.ProductIdeaCompanyFunded && (
                     <div>
                        <label htmlFor="royaltyIdeator" className="block text-sm font-medium text-gray-300 mb-1">Royalty to Ideator (%)</label>
                        <input type="number" id="royaltyIdeator" value={royaltyToIdeator} onChange={e => setRoyaltyToIdeator(e.target.value)} min="0" max="100" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                    </div>
                )}
                {scenario === ProjectScenario.ProductIdeaSelfFunded && (
                     <div>
                        <label htmlFor="royaltyCompany" className="block text-sm font-medium text-gray-300 mb-1">Royalty to GroVeda (%)</label>
                        <input type="number" id="royaltyCompany" value={royaltyToCompany} onChange={e => setRoyaltyToCompany(e.target.value)} min="0" max="100" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                    </div>
                )}

                {/* Contributors Section */}
                <div className="space-y-3 pt-4">
                    <div className="flex justify-between items-center">
                         <h3 className="text-lg font-semibold text-white">Contributors & Shares</h3>
                         <div className={`text-sm font-bold ${totalShare > 100 ? 'text-red-400' : 'text-gray-300'}`}>Total: {totalShare}%</div>
                    </div>
                    {contributors.map((c, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-900/50 rounded-md">
                            <div className="col-span-4">
                                <select value={c.user_id} onChange={e => handleContributorChange(index, 'user_id', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500">
                                    <option value={c.user_id}>{users.find(u => u.user_id === c.user_id)?.name}</option>
                                    {remainingUsers.map(u => <option key={u.user_id} value={u.user_id}>{u.name}</option>)}
                                </select>
                            </div>
                             <div className="col-span-4">
                                <input type="text" placeholder="Role (e.g. Developer)" value={c.role_in_project} onChange={e => handleContributorChange(index, 'role_in_project', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500" required />
                            </div>
                            <div className="col-span-3">
                                <div className="relative">
                                    <input type="number" placeholder="Share" value={c.share_percentage} onChange={e => handleContributorChange(index, 'share_percentage', e.target.value)} min="0" max="100" className="w-full bg-gray-700 border border-gray-600 rounded-md pl-2 pr-5 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500" required />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                                </div>
                            </div>
                            <div className="col-span-1 text-right">
                                <button type="button" onClick={() => handleRemoveContributor(index)} className="text-gray-500 hover:text-red-400 disabled:opacity-50" disabled={c.role_in_project === 'Creator'}>
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="secondary" size="sm" onClick={handleAddContributor} className="w-full">Add Contributor</Button>
                </div>
                

                <div className="flex justify-end pt-4 space-x-3">
                    <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Submit for Approval</Button>
                </div>
            </form>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm" onClick={handleClose}>
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl border border-gray-700 relative" onClick={e => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <X />
                </button>
                {step === 1 ? renderStepOne() : renderStepTwo()}
            </div>
        </div>
    );
};