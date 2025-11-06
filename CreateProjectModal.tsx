import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Project, ProjectType, ProjectStatus } from '../types';
import { Button } from './ui/Button';
import { X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { PHANTOM_CONVERSION_RATE } from '../constants';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
    const { setProjects, currentUser } = useAppContext();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [type, setType] = useState<ProjectType>(ProjectType.External);
    const [deadline, setDeadline] = useState('');
    const [duration, setDuration] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !value || !currentUser || !deadline || !duration) return;

        const projectValue = parseFloat(value);
        const newProject: Project = {
            project_id: uuidv4(),
            title,
            description,
            type,
            created_by_id: currentUser.user_id,
            value: projectValue,
            phantom_units: projectValue / PHANTOM_CONVERSION_RATE,
            approved_by_id: null,
            created_at: new Date().toISOString(),
            status: ProjectStatus.Pending,
            deadline,
            estimated_duration_days: parseInt(duration, 10),
        };

        setProjects(prev => [...prev, newProject]);
        onClose();
        // Reset form
        setTitle('');
        setDescription('');
        setValue('');
        setType(ProjectType.External);
        setDeadline('');
        setDuration('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg border border-gray-700 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <X />
                </button>
                <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Project Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required></textarea>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="value" className="block text-sm font-medium text-gray-300 mb-1">Project Value ($)</label>
                            <input type="number" id="value" value={value} onChange={e => setValue(e.target.value)} min="0" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">Project Type</label>
                            <select id="type" value={type} onChange={e => setType(e.target.value as ProjectType)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                                <option value={ProjectType.External}>External (Client-paid)</option>
                                <option value={ProjectType.Internal}>Internal Development</option>
                                <option value={ProjectType.IP}>IP/Product</option>
                            </select>
                        </div>
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
                    <div className="flex justify-end pt-4 space-x-3">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Submit for Approval</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};