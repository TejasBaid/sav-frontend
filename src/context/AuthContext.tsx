import { createContext, useContext, useState, useEffect } from 'react';
import type { FC, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  role: 'superuser' | 'faculty';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, username: string, role: 'superuser' | 'faculty') => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('savra_token'));

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.id, username: payload.username, role: payload.role });
      } catch (e) {
        // Fallback or bad token
        setUser(null);
        setToken(null);
        localStorage.removeItem('savra_token');
      }
    }
  }, [token]);

  const login = (newToken: string, username: string, role: 'superuser' | 'faculty') => {
    localStorage.setItem('savra_token', newToken);
    setToken(newToken);
    setUser({ id: 1, username, role }); // Setting mock ID since backend handles real ID verification
  };

  const logout = () => {
    localStorage.removeItem('savra_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
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
