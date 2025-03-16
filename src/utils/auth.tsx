
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

type Role = 'admin' | 'user' | 'questioner' | null;
type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
} | null;

interface AuthContextType {
  user: User;
  role: Role;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAdminAccess: (password: string) => boolean;
  checkQuestionerAccess: (password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_PASSWORD = 'kebumen00';
const QUESTIONER_PASSWORD = 'kebumen00';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call to authenticate
    // For demo purposes, we'll simulate a successful login
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for special admin or questioner logins
    if (email === 'admin@example.com' && password === ADMIN_PASSWORD) {
      const adminUser = {
        id: 'admin-123',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin' as Role,
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return;
    }
    
    if (email === 'questioner@example.com' && password === QUESTIONER_PASSWORD) {
      const questionerUser = {
        id: 'questioner-123',
        name: 'Questioner User',
        email: 'questioner@example.com',
        role: 'questioner' as Role,
      };
      setUser(questionerUser);
      localStorage.setItem('user', JSON.stringify(questionerUser));
      return;
    }

    // Regular user login
    if (email && password) {
      const newUser = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0], // Use part of email as name
        email,
        role: 'user' as Role,
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      throw new Error('Email and password are required');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // In a real app, this would make an API call to register
    // For demo, simulate a successful registration
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'user' as Role,
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  const checkAdminAccess = (password: string) => {
    return password === ADMIN_PASSWORD;
  };

  const checkQuestionerAccess = (password: string) => {
    return password === QUESTIONER_PASSWORD;
  };

  const value = {
    user,
    role: user?.role ?? null,
    login,
    register,
    logout,
    checkAdminAccess,
    checkQuestionerAccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
