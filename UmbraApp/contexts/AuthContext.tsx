import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SignIn as apiLogin, SignUp as apiSignup } from '../services/api';

type AuthContextType = {
    isLoggedIn: boolean;
    user: { email: string; name: string } | null;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (email: string, password: string, name: string) => Promise<boolean>;
    logout: () => void;
};

// Simple auth context
const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    user: null,
    login: async() => false,
    signup: async() => false,
    logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ email: string; name: string } | null>(null);

    const login = async (email: string, password: string) => {
        try {
            const response = await apiLogin({ email, password });
            console.log('Login response:', response);
            
            if (response.Valid) {
                setIsLoggedIn(true);
                setUser({ email, name: response.data?.name || '' });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const signup = async (email: string, password: string, name: string) => {
        try {
            const response = await apiSignup({ email, password, name });
            console.log('Signup response:', response);
            
            if (response.Valid) {
                setIsLoggedIn(true);
                setUser({ email, name });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Signup error:', error);
            return false;
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}; 
