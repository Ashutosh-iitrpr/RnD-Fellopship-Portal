import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../services/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        // Ideally verify token with backend here
        if (token) {
            // Mock user persistence for now or fetch /me
            if (!user) {
                // Restore hardcoded admin if missing (simulating /me endpoint)
                setUser({
                    id: 'admin-id',
                    name: 'System Admin',
                    email: 'admin@iit.ac.in',
                    role: 'ADMIN' as const,
                    department: { name: 'Administration' }
                });
            }
        }
    }, [token, user]);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
