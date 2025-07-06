import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'nurse' | 'staff';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: User['role']) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    console.log('Logging in:', email, password);

    // Simulate API response
    const mockUser: User = {
      id: '1',
      email,
      name: 'John Doe',
      role: 'admin',
    };

    setUser(mockUser);
  };

  const register = async (email: string, password: string, name: string, role: User['role']) => {
    console.log('Registering:', email, password, name, role);

    // Simulate API response
    const mockUser: User = {
      id: '2',
      email,
      name,
      role,
    };

    setUser(mockUser);
  };

  const logout = () => {
    console.log('Logging out...');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
