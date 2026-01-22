"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, pass: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedAuth = localStorage.getItem('isAdminAuthenticated');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const login = (email: string, pass: string) => {
        if (email === 'admin@gmail.com' && pass === 'admin123') {
            localStorage.setItem('isAdminAuthenticated', 'true');
            setIsAuthenticated(true);
            toast.success('Login Successful ');
            return true;
        } else {
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        setIsAuthenticated(false);
        router.push('/');
        toast.info('Logged out');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
