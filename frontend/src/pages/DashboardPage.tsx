import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectsApi, usersApi } from '../services/api';
import { Loader2, FolderOpen, Users, AlertCircle } from 'lucide-react';
import CreateProjectModal from '../components/CreateProjectModal';

const StatCard = ({ title, value, icon: Icon, loading }: any) => (
    <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <h3 className="text-2xl font-bold mt-2">
                    {loading ? <div className="h-8 w-16 bg-muted animate-pulse rounded" /> : value}
                </h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Icon className="h-5 w-5" />
            </div>
        </div>
    </div>
);

const DashboardPage = () => {
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

    const { data: projects, isLoading: pLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: projectsApi.getAll
    });

    const { data: users, isLoading: uLoading } = useQuery({
        queryKey: ['users'],
        queryFn: usersApi.getAll
    });

    if (pLoading && uLoading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Projects"
                    value={projects?.length || 0}
                    icon={FolderOpen}
                    loading={pLoading}
                />
                <StatCard
                    title="Active Users"
                    value={users?.length || 0}
                    icon={Users}
                    loading={uLoading}
                />
                <StatCard
                    title="Pending Requests"
                    value="3"
                    icon={AlertCircle}
                    loading={false}
                />
                <StatCard
                    title="Total Grants"
                    value="₹ 1.2 Cr"
                    icon={FolderOpen}
                    loading={false}
                />
            </div>

            {/* Recent Activity Demo */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border border-border bg-card p-6">
                    <h3 className="font-semibold mb-4">Recent Projects</h3>
                    <div className="space-y-4">
                        {projects?.slice(0, 5).map((project: any) => (
                            <div key={project.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                                <div>
                                    <p className="text-sm font-medium">{project.title}</p>
                                    <p className="text-xs text-muted-foreground">{project.projectNumber}</p>
                                </div>
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">{project.status}</span>
                            </div>
                        ))}
                        {!projects?.length && <p className="text-sm text-muted-foreground">No projects found.</p>}
                    </div>
                </div>
                <div className="col-span-3 rounded-xl border border-border bg-card p-6">
                    <h3 className="font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => setIsProjectModalOpen(true)}
                            className="w-full text-left px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm"
                        >
                            + Add New Project
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm">
                            + Invite User
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm">
                            Download Reports
                        </button>
                    </div>
                </div>
            </div>

            <CreateProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} />
        </div>
    );
};

export default DashboardPage;
