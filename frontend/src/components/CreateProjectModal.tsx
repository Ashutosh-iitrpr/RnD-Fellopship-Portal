import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { projectsApi, usersApi, departmentsApi, fundingAgenciesApi } from '../services/api';
import type { CreateProjectDto } from '../services/api';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<CreateProjectDto>({
        title: '',
        projectNumber: '',
        deptId: '',
        piUserId: '',
        fundingAgencyId: '',
        startDate: '',
        endDate: ''
    });
    const [error, setError] = useState('');

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: '',
                projectNumber: '',
                deptId: '',
                piUserId: '',
                fundingAgencyId: '',
                startDate: '',
                endDate: ''
            });
            setError('');
        }
    }, [isOpen]);

    // Fetch dependencies
    const { data: users } = useQuery({ queryKey: ['users'], queryFn: usersApi.getAll });
    const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: departmentsApi.getAll });
    const { data: fundingAgencies } = useQuery({ queryKey: ['fundingAgencies'], queryFn: fundingAgenciesApi.getAll });

    const createProjectMutation = useMutation({
        mutationFn: projectsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            onClose();
        },
        onError: (err: any) => {
            console.error(err);
            setError('Failed to create project. Please list all fields correctly.');
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!formData.title || !formData.projectNumber || !formData.deptId || !formData.piUserId || !formData.fundingAgencyId || !formData.startDate || !formData.endDate) {
            setError('All fields are required.');
            return;
        }

        createProjectMutation.mutate({
            ...formData,
            startDate: new Date(formData.startDate).toISOString(),
            endDate: new Date(formData.endDate).toISOString()
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-background w-full max-w-2xl rounded-xl shadow-xl border border-border flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">Create New Project</h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
                            {error}
                        </div>
                    )}

                    <form id="create-project-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Project Title</label>
                                <input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="e.g. AI Research"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Project Number</label>
                                <input
                                    required
                                    value={formData.projectNumber}
                                    onChange={e => setFormData({ ...formData, projectNumber: e.target.value })}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="e.g. P101"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Department</label>
                                <select
                                    required
                                    value={formData.deptId}
                                    onChange={e => setFormData({ ...formData, deptId: e.target.value })}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                >
                                    <option value="">Select Department</option>
                                    {(departments as any[])?.map((dept: any) => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Principal Investigator (PI)</label>
                                <select
                                    required
                                    value={formData.piUserId}
                                    onChange={e => setFormData({ ...formData, piUserId: e.target.value })}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                >
                                    <option value="">Select PI</option>
                                    {(users as any[])?.map((user: any) => (
                                        <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Funding Agency</label>
                            <select
                                required
                                value={formData.fundingAgencyId}
                                onChange={e => setFormData({ ...formData, fundingAgencyId: e.target.value })}
                                className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                                <option value="">Select Agency</option>
                                {(fundingAgencies as any[])?.map((agency: any) => (
                                    <option key={agency.id} value={agency.id}>{agency.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Start Date</label>
                                <input
                                    required
                                    type="date"
                                    value={formData.startDate}
                                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">End Date</label>
                                <input
                                    required
                                    type="date"
                                    value={formData.endDate}
                                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-border flex justify-end gap-3 bg-secondary/10 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="create-project-form"
                        disabled={createProjectMutation.isPending}
                        className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        {createProjectMutation.isPending && <Loader2 className="animate-spin h-4 w-4" />}
                        Create Project
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;
