import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { Loader2, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authApi.requestOtp({ email });
            setStep('otp');
        } catch (err) {
            setError('Failed to request OTP. Please check your email.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await authApi.verifyOtp({ email, code: otp });
            // HOTFIX: Backend returns access_token, Frontend expects accessToken
            // HOTFIX: Backend doesn't return user, so we mock it to unblock navigation
            const token = data.accessToken || (data as any).access_token;
            const user = data.user || {
                id: '1',
                name: 'System User',
                email: email,
                role: 'ADMIN', // Assume Admin for now
                department: { name: 'R&D' }
            };

            if (token) {
                login(token, user);
                navigate('/');
            } else {
                setError('Login failed: No access token received');
            }
        } catch (err) {
            console.error(err);
            setError('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        RnD Fellowship Portal
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2">Login to manage projects</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
                        {error}
                    </div>
                )}

                {step === 'email' ? (
                    <form onSubmit={handleRequestOtp} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="admin@iit.ac.in"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity flex justify-center items-center"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Get OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Enter OTP sent to {email}</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="123456"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setStep('email')}
                                className="w-full py-2 bg-muted text-muted-foreground hover:text-foreground rounded-md transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity flex justify-center items-center"
                            >
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Login'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Quick Login Button for Dev/Demo */}
            <div className="mt-8 text-center">
                <button
                    onClick={async () => {
                        setLoading(true);
                        try {
                            const demoEmail = 'admin@iit.ac.in';
                            const demoOtp = '123456';
                            await authApi.requestOtp({ email: demoEmail });
                            const { data } = await authApi.verifyOtp({ email: demoEmail, code: demoOtp });

                            const token = data.accessToken || (data as any).access_token;
                            // Mock Admin User
                            const user = {
                                id: 'admin-id',
                                name: 'System Admin',
                                email: demoEmail,
                                role: 'ADMIN' as const,
                                department: { name: 'Administration' }
                            };

                            login(token, user);
                            navigate('/');
                        } catch (e) {
                            console.error(e);
                            setError('Quick login failed. Ensure backend is running.');
                            setLoading(false);
                        }
                    }}
                    className="text-sm text-blue-600 hover:underline font-medium"
                >
                    ⚡ Quick Login as Admin (Dev Mode)
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
