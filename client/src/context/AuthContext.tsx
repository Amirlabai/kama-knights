import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

interface User {
    _id: string;
    phoneNumber: string;
    role: 'user' | 'admin';
    isApproved: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (phoneNumber: string) => Promise<any>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Validate token on load (optional: implement /me endpoint)
        // For now, we trust the token existence for UI state, real validation happens on API calls
        if (token) {
            // ideally fetch user details here
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (phoneNumber: string) => {
        const res = await api.post('/auth/login', { phoneNumber });
        if (res.data.token) {
            setToken(res.data.token);
            setUser(res.data.user);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        return res.data;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
