import { AuthError, Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string) => Promise<void>;
  customSignUp: (
    email: string,
    password: string,
    firstName: string
  ) => Promise<{ user: User | null; session: Session | null }>;
  customGoogleSignIn: () => Promise<{
    data: { provider: string; url: string } | null;
    error: AuthError | null;
  }>;
  signOut: () => Promise<void>;
  googleSignIn: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<void>;
  session: Session | null;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();
      setUser(initialSession?.user || null);
      setSession(initialSession || null);
      setIsLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          setUser(currentSession?.user || null);
          setSession(currentSession || null);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setSession(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setUser(data.user);
    setSession(data.session);
  };

  const signUp = async (email: string, password: string, firstName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName: firstName,
        },
        emailRedirectTo: `${window.location.origin}/login/`,
      },
    });
    if (error) throw error;
  };

  const customSignUp = async (
    email: string,
    password: string,
    firstName: string
  ) => {
    // First, sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login/`, // Where to redirect after email confirmation
        data: {
          firstName: firstName,
        },
      },
    });

    if (error) throw error;

    // If email confirmations are disabled or you want immediate access:
    if (data.session) {
      // User is immediately signed in (email confirmations disabled)
      return {
        user: data.user,
        session: data.session,
      };
    } else {
      // If email confirmations are required, sign them in manually
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;

      return {
        user: signInData.user,
        session: signInData.session,
      };
    }
  };

  const googleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    return { error };
  };

  const customGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        customSignUp,
        customGoogleSignIn,
        signOut,
        googleSignIn,
        resetPassword,
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
