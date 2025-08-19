import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../services/supabase";

type AuthUser = { id: string; email: string | null } | null;

type AuthContextType = {
  user: AuthUser;
  initializing: boolean;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>; // username or email
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!isMounted) return;
      const authedUser = data.user ? { id: data.user.id, email: data.user.email ?? null } : null;
      setUser(authedUser);
      setInitializing(false);
      if (authedUser) {
        ensureProfile(authedUser.id, authedUser.email || null).catch(() => {});
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? null } : null);
    });
    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (identifier: string, password: string) => {
    setLoading(true);
    try {
      let email = identifier.trim();
      if (!email.includes('@')) {
        const { data, error } = await supabase.rpc('lookup_email_for_username', { p_username: email });
        if (error) throw error;
        if (!data) throw new Error('No account with that username');
        email = String(data);
      }
      const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });
      if (authErr) throw authErr;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error('Please verify your account via email to continue');
      const { error: pErr } = await supabase
        .from('profiles')
        .insert({ user_id: data.user.id, username, email });
      if (pErr) {
        if ((pErr as any).code === '23505') {
          throw new Error('Username or email already in use');
        }
        throw pErr;
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, initializing, loading, signIn, signUp, signOut }}>
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

async function ensureProfile(userId: string, email: string | null) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('user_id', userId)
    .single();
  if (existing) return;
  const { data: u } = await supabase.auth.getUser();
  const usernameCandidate = (u.user?.user_metadata as any)?.username
    || (u.user?.email ? String(u.user.email).split('@')[0] : `user_${userId.slice(0, 6)}`);
  const { error } = await supabase.from('profiles').insert({
    user_id: userId,
    username: usernameCandidate,
    email: email || u.user?.email || ''
  });
  if (error && (error as any).code !== '23505') throw error;
}
