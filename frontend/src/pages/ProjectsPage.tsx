import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../services/api';
import { Loader2, Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import CreateProjectModal from '../components/CreateProjectModal';

const ProjectsPage = () => {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: projects, isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: projectsApi.getAll
    });

    const filteredProjects = (projects || [])?.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.projectNumber.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <h1 className="text-2xl font-bold">All Projects</h1>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            placeholder="Search projects..."
                            className="pl-9 pr-4 py-2 rounded-md border border-input bg-card w-full sm:w-64 focus:ring-2 focus:ring-primary/20 outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">New Project</span>
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredProjects?.map(project => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="group block p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded font-medium">
                                    {project.projectNumber}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded font-medium ${project.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {project.title}
                            </h3>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>PI: {project.pi?.name || 'Unknown'}</p>
                                <p>Ends: {format(new Date(project.endDate), 'MMM d, yyyy')}</p>
                            </div>
                        </Link>
                    ))}
                    {!filteredProjects?.length && (
                        <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
                            <p>No projects found matching your search.</p>
                            <button onClick={() => setIsModalOpen(true)} className="text-primary hover:underline mt-2">Create one instead?</button>
                        </div>
                    )}
                </div>
            )}

            <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default ProjectsPage;
