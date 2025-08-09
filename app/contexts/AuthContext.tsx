import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";


type User = { id: number; username: string; email?: string | null } | null;

type AuthContextType = {
  user: User;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  register: (data: { username: string; email?: string; password: string }) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const API_BASE_URL = 'http://localhost:4000/api';

  useEffect(() => {
    // Try to restore session
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {}
    })();
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ usernameOrEmail, password })
      });
      if (!res.ok) return false;
      const data = await res.json();
      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  };

  const register = async (data: { username: string; email?: string; password: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!res.ok) return false;
      const payload = await res.json();
      setUser(payload.user);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' }).finally(() => setUser(null));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
