'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the shape of the User object
interface User {
  id: number;
  email: string;
}

// --- THIS IS THE INTERFACE THAT NEEDS TO BE UPDATED ---
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  theme: 'light' | 'dark'; // ADDED: to hold the current theme
  toggleTheme: () => void; // ADDED: the function to switch themes
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // ADDED: New state for the theme

  // This effect runs once to load user and theme from localStorage
  useEffect(() => {
    // Load user data
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    // Load theme preference from localStorage
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
        setTheme(storedTheme);
    }

    setIsLoading(false);
  }, []);

  // --- THIS NEW EFFECT APPLIES THE THEME ---
  // It runs whenever the 'theme' state changes
  useEffect(() => {
    if (theme === 'dark') {
      // If theme is dark, add the 'dark' class to the main <html> tag
      document.documentElement.classList.add('dark');
    } else {
      // Otherwise, remove it
      document.documentElement.classList.remove('dark');
    }
    // Save the user's preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // The function to switch the theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const login = (userData: User, token: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Provide the new theme state and toggle function to the rest of the app
  return (
    <AuthContext.Provider value={{ user, token, isLoading, theme, toggleTheme, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};