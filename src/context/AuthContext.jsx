import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in (localStorage)
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    
    try {
      // Query admin user from database
      const { data: adminUser, error } = await supabase
        .from('admin_users_ig_directory')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .single();

      if (error || !adminUser) {
        setLoading(false);
        throw new Error('Invalid username or password');
      }

      // For demo purposes, we'll use simple password comparison
      // In production, you would hash the password and compare with bcrypt
      const isValidPassword = password === adminUser.password_hash;

      if (!isValidPassword) {
        setLoading(false);
        throw new Error('Invalid username or password');
      }

      const userData = {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('adminUser', JSON.stringify(userData));
      setLoading(false);
      
      return userData;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('adminUser');
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};