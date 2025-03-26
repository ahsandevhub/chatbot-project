import { AuthError, Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    firstName: string
  ) => Promise<{ user: User | null; session: Session | null }>;
  equitySignUp: (
    email: string,
    password: string,
    firstName: string
  ) => Promise<{ user: User | null; session: Session | null }>;
  globalSignUp: (
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session: initialSession },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        setIsLoading(false);
        return;
      }
      setUser(initialSession?.user || null);
      setSession(initialSession || null);
      setIsLoading(false);
    };

    fetchSession();

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setUser(currentSession?.user || null);
        setSession(currentSession || null);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setSession(null);
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setUser(data.user);
      setSession(data.session);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string) => {
    setIsLoading(true);
    try {
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
      return data;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const equitySignUp = async (
    email: string,
    password: string,
    firstName: string
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/custom-signup?priceId=${
            import.meta.env.VITE_EQUITY_ANALYST_PRICE_ID
          }`,
          data: {
            firstName: firstName,
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        setUser(data.user);
        setSession(data.session);
        return {
          user: data.user,
          session: data.session,
        };
      }

      // If email confirmation is required, attempt sign in
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (signInError) throw signInError;

      setUser(signInData.user);
      setSession(signInData.session);
      return {
        user: signInData.user,
        session: signInData.session,
      };
    } catch (error) {
      console.error("Equity sign up error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const globalSignUp = async (
    email: string,
    password: string,
    firstName: string
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/global-signup?priceId=${
            import.meta.env.VITE_GLOBAL_MACRO_PRICE_ID
          }`,
          data: {
            firstName: firstName,
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        setUser(data.user);
        setSession(data.session);
        return {
          user: data.user,
          session: data.session,
        };
      }

      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (signInError) throw signInError;

      setUser(signInData.user);
      setSession(signInData.session);
      return {
        user: signInData.user,
        session: signInData.session,
      };
    } catch (error) {
      console.error("Global sign up error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      return { error };
    } catch (error) {
      console.error("Google sign in error:", error);
      return { error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  const customGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      return { data, error };
    } catch (error) {
      console.error("Custom Google sign in error:", error);
      return { data: null, error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        equitySignUp,
        globalSignUp,
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
