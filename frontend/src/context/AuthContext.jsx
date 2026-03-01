import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('qh_user');
        const token = localStorage.getItem('qh_token');
        if (stored && token) setUser(JSON.parse(stored));
        setLoading(false);
    }, []);

    const register = async ({ fullName, email, password }) => {
        const { data } = await api.post('/auth/register', {
            full_name: fullName,
            email,
            password,
            password_confirmation: password,
        });
        return data;
    };

    const login = async ({ email, password }) => {
        const { data } = await api.post('/auth/login', { email, password });
        const { user: userData, token } = data.data;
        localStorage.setItem('qh_token', token);
        localStorage.setItem('qh_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const logout = async () => {
        try { await api.post('/auth/logout'); } catch { }
        localStorage.removeItem('qh_token');
        localStorage.removeItem('qh_user');
        setUser(null);
    };

    const isAdmin = () => user?.role === 'admin' || user?.is_admin === true;

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
};