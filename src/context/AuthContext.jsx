import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('erp_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      setUser(response.user);
      localStorage.setItem('erp_auth_user', JSON.stringify(response.user));
      localStorage.setItem('erp_auth_token', response.access_token);
      toast.success(`Logged in successfully`);
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('erp_auth_user');
    localStorage.removeItem('erp_auth_token');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
