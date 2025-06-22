import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../api/apiService'; // Assuming User type is exported from apiService

// --- 1. Define the Context Shape ---
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

// --- 2. Create the Context ---
// We provide a default value that matches the context shape.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 3. Create the Provider Component ---
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true to check for stored user

  useEffect(() => {
    // Check localStorage for a stored user when the app loads
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false); // Finished checking
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Here you might also want to call a backend logout endpoint
    // to invalidate the session/token on the server side.
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// --- 4. Create a Custom Hook for easy consumption ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
