import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../services/supabase";

type AuthUser = { id: string; email: string | null } | null;

type AuthContextType = {
  user: AuthUser;
  initializing: boolean;
  signIn: (identifier: string, password: string) => Promise<boolean>; // username or email
  signUp: (username: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!isMounted) return;
      setUser(data.user ? { id: data.user.id, email: data.user.email } : null);
      setInitializing(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
    });
    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (identifier: string, password: string) => {
    let email = identifier.trim();
    if (!email.includes('@')) {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', email)
        .single();
      if (error || !data?.email) return false;
      email = data.email;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  };

  const signUp = async (username: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    });
    if (error) return false;
    const userId = data.user?.id;
    if (!userId) return false;
    // Create profile row
    const { error: pErr } = await supabase
      .from('profiles')
      .insert([{ user_id: userId, username, email }]);
    if (pErr) return false;
    return true;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, initializing, signIn, signUp, signOut }}>
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
