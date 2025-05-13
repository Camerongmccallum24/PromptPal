import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('promptme_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login function
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to authenticate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, accept any email/password with basic validation
      if (!email.includes('@') || password.length < 6) {
        throw new Error('Invalid credentials');
      }
      
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0],
      };
      
      setUser(newUser);
      localStorage.setItem('promptme_user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock registration function
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to register
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, basic validation
      if (!email.includes('@') || password.length < 6) {
        throw new Error('Invalid input');
      }
      
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        name,
      };
      
      setUser(newUser);
      localStorage.setItem('promptme_user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('promptme_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
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
