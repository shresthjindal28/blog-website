import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface UserPreferences {
  darkMode: boolean;
  emailNotifications: boolean;
  language: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  preferences?: UserPreferences;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { username?: string; avatarUrl?: string; email?: string; phoneNumber?: string }) => Promise<void>;
  updateSettings: (data: { darkMode?: boolean; emailNotifications?: boolean; language?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // You might want to add a verify token endpoint to check if the token is still valid
      // and get the user data
      const fetchUser = async () => {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          logout();
        }
      };
      
      fetchUser();
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      const { token, user } = response;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await authService.register(username, email, password);
      const { token, user } = response;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const updateProfile = async (data: { username?: string; avatarUrl?: string; email?: string; phoneNumber?: string }) => {
    try {
      const response = await authService.updateProfile(data);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const updateSettings = async (data: { darkMode?: boolean; emailNotifications?: boolean; language?: string }) => {
    try {
      const response = await authService.updateSettings(data);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Settings update failed:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      return response;
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        updateProfile,
        updateSettings,
        changePassword,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 