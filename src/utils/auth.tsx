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
  const [user, setUser] = useState<User>(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    return null;
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email dan password harus diisi');
    }

    if (password.length < 6) {
      throw new Error('Password harus minimal 6 karakter');
    }

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
      toast.success('Berhasil login sebagai Admin');
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
      toast.success('Berhasil login sebagai Questioner');
      return;
    }

    // Regular user login
    const newUser = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0], // Use part of email as name
      email,
      role: 'user' as Role,
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    toast.success('Berhasil login');
  };

  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      throw new Error('Semua field harus diisi');
    }

    if (password.length < 6) {
      throw new Error('Password harus minimal 6 karakter');
    }

    if (!email.includes('@')) {
      throw new Error('Email tidak valid');
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'user' as Role,
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    toast.success('Registrasi berhasil');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Berhasil logout');
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
