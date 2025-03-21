import { AuthError, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  googleSignIn: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Fetched Session on Load:", session);
      setUser(session?.user || null);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth State Changed:", session);
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    if (error) throw error;
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    setIsLoading(true);
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { firstName, lastName } },
    });
    setIsLoading(false);
    if (error) throw error;

    if (user) {
      try {
        let sessionResponse = null;
        let accessToken = null;
        const retries = 5; // Number of retry attempts

        for (let i = 0; i < retries; i++) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay

          sessionResponse = await supabase.auth.getSession();
          accessToken = sessionResponse.data.session?.access_token;

          if (accessToken) {
            break; // Access token found, exit loop
          }
        }

        console.log("Session Response:", sessionResponse);
        console.log("Access Token:", accessToken);

        if (!accessToken) {
          console.error("Access token not available after signup.");
          return;
        }

        const response = await fetch(
          "https://rwbfjxwueaygxtyuwrvu.supabase.co/functions/v1/create_user_defaults",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                import.meta.env.VITE_SUPABASE_SERVICE_ROLE
              }`,
            },
            body: JSON.stringify({ user }),
          }
        );
        const result = await response.json();
        console.log("Edge Function result:", result);
      } catch (err) {
        console.error("Edge Function error:", err);
      }
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsLoading(false);
  };

  const googleSignIn = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setIsLoading(false);
    return { error };
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setIsLoading(false);
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        googleSignIn,
        resetPassword,
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
