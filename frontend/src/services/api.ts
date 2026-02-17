import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:3000', // Assuming backend runs on port 3000
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API types
interface RequestOtpDto {
    email: string;
}

interface VerifyOtpDto {
    email: string;
    code: string;
}

interface LoginResponse {
    accessToken: string;
    user: any; // Define User type properly if needed
}

// Project API types
export interface Project {
    id: string;
    projectNumber: string;
    title: string;
    deptId: string;
    piUserId: string;
    fundingAgencyId: string;
    startDate: string;
    endDate: string;
    status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
    department?: { name: string };
    pi?: { name: string };
    fundingAgency?: { name: string };
}

export interface CreateProjectDto {
    projectNumber: string;
    title: string;
    deptId: string;
    piUserId: string;
    fundingAgencyId: string;
    startDate: string;
    endDate: string;
}

// User API types
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'RND_CELL' | 'PI' | 'VIEWER';
    department?: { name: string };
}

// API Functions
export const authApi = {
    requestOtp: (data: RequestOtpDto) => api.post('/auth/request-otp', data),
    verifyOtp: (data: VerifyOtpDto) => api.post<LoginResponse>('/auth/verify-otp', data),
};

export const projectsApi = {
    getAll: async () => (await api.get<Project[]>('/projects')).data,
    getOne: async (id: string) => (await api.get<Project>(`/projects/${id}`)).data,
    create: async (data: CreateProjectDto) => (await api.post<Project>('/projects', data)).data,
};

export const usersApi = {
    getAll: async () => (await api.get<User[]>('/users')).data,
    // Since we don't have a create user endpoint exposed publicly or strictly defined in previous view, assume minimal necessary
    // If needed we can add create
};

export const designationsApi = {
    getAll: async () => (await api.get('/designations')).data,
};

export const fundingAgenciesApi = {
    getAll: async () => (await api.get('/funding-agencies')).data,
}

export const departmentsApi = {
    getAll: async () => (await api.get('/departments')).data,
}


export default api;
