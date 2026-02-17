import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    FolderKanban,
    Users,
    FileSpreadsheet,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { cn } from '../lib/utils';

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
            isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
    >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
    </NavLink>
);

const Layout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
                <div className="p-6 border-b border-border">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        RnD Portal
                    </h1>
                    <p className="text-xs text-muted-foreground">Fellowship Admin</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem to="/projects" icon={FolderKanban} label="Projects" />
                    <SidebarItem to="/users" icon={Users} label="Users" />
                    <SidebarItem to="/upload" icon={FileSpreadsheet} label="Details Upload" />
                </nav>

                <div className="p-4 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
                    <h1 className="text-lg font-bold">RnD Portal</h1>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </header>

                {/* Mobile Sidebar Overlay */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute inset-0 z-50 bg-background p-4 animate-in slide-in-from-left-1/2">
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-xl">Menu</span>
                            <button onClick={() => setMobileMenuOpen(false)}><X /></button>
                        </div>
                        <nav className="space-y-2">
                            <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
                            <SidebarItem to="/projects" icon={FolderKanban} label="Projects" />
                            <SidebarItem to="/users" icon={Users} label="Users" />
                            <SidebarItem to="/upload" icon={FileSpreadsheet} label="Details Upload" />
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full px-3 py-2 mt-4 text-sm text-destructive bg-destructive/5 rounded-md"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </nav>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6 bg-secondary/20">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
