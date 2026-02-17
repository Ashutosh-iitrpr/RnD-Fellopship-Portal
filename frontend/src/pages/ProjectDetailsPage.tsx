import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../services/api';
import { useState } from 'react';
import { Loader2, UserPlus, CheckCircle, Calendar, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

// MOCK DATA since backend doesn't support these
const MOCK_ROLES = ['JRF', 'SRF', 'Project Assistant', 'Research Associate'];

const ProjectDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: project, isLoading } = useQuery({
        queryKey: ['project', id],
        queryFn: () => projectsApi.getOne(id!),
        enabled: !!id
    });

    // Client-side state for missing backend features
    const [members, setMembers] = useState<any[]>([
        { id: 1, name: 'John Doe', role: 'JRF', joined: '2025-01-01' },
        { id: 2, name: 'Jane Smith', role: 'SRF', joined: '2025-02-15' },
    ]);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberRole, setNewMemberRole] = useState(MOCK_ROLES[0]);
    const [showMemberForm, setShowMemberForm] = useState(false);

    const [attendanceDate, setAttendanceDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [attendance, setAttendance] = useState<Record<number, boolean>>({ 1: true });

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMemberName) return;
        setMembers([...members, {
            id: Date.now(),
            name: newMemberName,
            role: newMemberRole,
            joined: format(new Date(), 'yyyy-MM-dd')
        }]);
        setNewMemberName('');
        setShowMemberForm(false);
    };

    const toggleAttendance = (memberId: number) => {
        setAttendance(prev => ({
            ...prev,
            [memberId]: !prev[memberId]
        }));
    };

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    if (!project) return <div className="p-10">Project not found</div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Project Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl border border-border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold">{project.title}</h1>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider">
                            {project.status}
                        </span>
                        <span>Project No: {project.projectNumber}</span>
                        <span>PI: {project.pi?.name || 'TBD'}</span>
                    </div>
                </div>
                <div className="text-right text-sm">
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">{format(new Date(project.startDate), 'MMM yyyy')} - {format(new Date(project.endDate), 'MMM yyyy')}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* Members Management (Client-Side Only) */}
                <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-blue-500" />
                            Project Members
                        </h2>
                        <button
                            onClick={() => setShowMemberForm(!showMemberForm)}
                            className="text-sm bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-md transition-colors"
                        >
                            {showMemberForm ? 'Cancel' : '+ Add Member'}
                        </button>
                    </div>

                    {showMemberForm && (
                        <form onSubmit={handleAddMember} className="mb-6 p-4 bg-secondary/30 rounded-lg border border-border animate-in slide-in-from-top-2">
                            <div className="grid gap-3">
                                <input
                                    className="bg-background border border-input rounded px-3 py-2 text-sm"
                                    placeholder="Member Name"
                                    value={newMemberName}
                                    onChange={(e) => setNewMemberName(e.target.value)}
                                />
                                <select
                                    className="bg-background border border-input rounded px-3 py-2 text-sm"
                                    value={newMemberRole}
                                    onChange={(e) => setNewMemberRole(e.target.value)}
                                >
                                    {MOCK_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                                </select>
                                <button className="bg-primary text-primary-foreground text-sm py-2 rounded">
                                    Add to Project
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-3">
                        {members.map(member => (
                            <div key={member.id} className="flex justify-between items-center p-3 rounded-lg border border-border hover:bg-secondary/20 transition-colors">
                                <div>
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.role} • Joined {member.joined}</p>
                                </div>
                                <button
                                    onClick={() => setMembers(members.filter(m => m.id !== member.id))}
                                    className="text-destructive hover:bg-destructive/10 p-2 rounded-full"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 italic text-center">
                        * Note: Changes here are local only (Backend limitation)
                    </p>
                </div>

                {/* Attendance Marker (Client-Side Only) */}
                <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-green-500" />
                            Daily Attendance
                        </h2>
                        <input
                            type="date"
                            className="bg-background border border-input rounded px-2 py-1 text-sm"
                            value={attendanceDate}
                            onChange={(e) => setAttendanceDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="grid grid-cols-3 text-xs font-semibold text-muted-foreground px-2 mb-2">
                            <span className="col-span-2">Name</span>
                            <span className="text-right">Status</span>
                        </div>
                        {members.map(member => (
                            <div key={member.id} className="grid grid-cols-3 items-center p-2 rounded-lg hover:bg-secondary/20 transition-colors">
                                <span className="col-span-2 font-medium text-sm">{member.name}</span>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => toggleAttendance(member.id)}
                                        className={cn(
                                            "px-3 py-1 rounded text-xs font-medium transition-all",
                                            attendance[member.id]
                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                : "bg-red-100 text-red-700 hover:bg-red-200"
                                        )}
                                    >
                                        {attendance[member.id] ? 'Present' : 'Absent'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-border">
                        <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90">
                            Save Attendance Sheet
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProjectDetailsPage;
