import { supabase } from "@/lib/supabaseClient";
import { loadStripe } from "@stripe/stripe-js";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftIcon, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const EquitySignup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { equitySignUp, customGoogleSignIn } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const priceId = import.meta.env.VITE_EQUITY_ANALYST_PRICE_ID;

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleStripeCheckout = async (userId: string) => {
    const stripe = await stripePromise;

    try {
      // 1. Get the Supabase access token
      const { data: supabaseSession } = await supabase.auth.getSession();
      const token = supabaseSession?.session?.access_token; // Retrieve Supabase JWT

      if (!token) throw new Error("User not authenticated");

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use Supabase JWT
          },
          body: JSON.stringify({
            priceId,
            userId: userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const session = await response.json();

      if (!session.id) {
        throw new Error("Session ID is missing in response");
      }

      const result = await stripe!.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
        toast.error("Failed to redirect to payment page");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout failed. Please try again.");
    }
  };

  // For email sign-up
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg("Invalid email format.");
      setLoading(false);
      return;
    }

    try {
      await equitySignUp(email.trim(), password, firstName);
      console.log("Signup successful!");
      toast.success("Account registered successfully!", {
        position: "top-center",
        description: "Confirm your email to complete the payment.",
        duration: 3000,
      });

      localStorage.setItem("runEdgeFunction", "false");
      // Redirect to Stripe checkout
      // if (user?.id) {
      //   await handleStripeCheckout(user.id);
      // }
    } catch (error: unknown) {
      let message = "An unexpected error occurred.";
      if (error instanceof Error) {
        console.error("Signup Error:", error);
        interface SupabaseAuthError extends Error {
          code?: string;
          error?: {
            message: string;
          };
        }
        const supabaseError = error as SupabaseAuthError;
        if (supabaseError.code === "email_exists") {
          message = "Email address is already in use.";
        } else if (supabaseError.code === "email_not_confirmed") {
          message = "Please confirm your email before logging in.";
        } else {
          message = error.message;
        }
      }
      setErrorMsg(message);
      toast.error(message, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  // For Google sign-up
  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);

    try {
      // Initiate Google sign-in
      const { error } = await customGoogleSignIn();

      if (error) {
        throw error;
      }

      // Set up auth state listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session?.user?.id) {
          try {
            await handleStripeCheckout(session.user.id);
          } catch (err) {
            console.error("Stripe redirect error:", err);
            toast.error("Failed to redirect to payment page");
          } finally {
            subscription.unsubscribe();
          }
        }
      });
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(err instanceof Error ? err.message : "Sign-in failed");
      toast.error("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md"
        >
          <button
            onClick={() => navigate("/")}
            className="flex w-max text-sm mr-auto items-center gap-2 hover:gap-1 transition-all text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Go Back</span>
          </button>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">
            Sign Up
          </h2>
          {errorMsg && (
            <p className="text-red-500 text-sm text-center mt-2">{errorMsg}</p>
          )}
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                required
              />
              {/* <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                required
              /> */}
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
              required
            />
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="relative mb-4">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <button
              type="submit"
              className={`w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          <div className="mt-4 flex items-center justify-center">
            <div className="border-t border-gray-300 dark:border-gray-700 w-1/3"></div>
            <span className="mx-2 text-gray-600 dark:text-gray-400">or</span>
            <div className="border-t border-gray-300 dark:border-gray-700 w-1/3"></div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={handleGoogleSignUp}
              className={`flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 px-4 font-medium text-gray-700 bg-white hover:bg-gray-100 transition-all shadow-sm ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              <img src="/google-icon.webp" alt="Google" className="h-5 w-5" />
              <span>{loading ? "Signing up..." : "Continue with Google"}</span>
            </button>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-500 hover:underline">
              Login
            </a>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EquitySignup;
