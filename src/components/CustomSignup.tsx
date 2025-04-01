import { supabase } from "@/lib/supabaseClient";
import { loadStripe } from "@stripe/stripe-js";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftIcon, Eye, EyeOff, MailCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const RESEND_COOLDOWN_SECONDS = 120;

const CustomSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { customSignUp, customGoogleSignIn, resendConfirmationEmail } =
    useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [searchParams] = useSearchParams();
  const priceId =
    searchParams.get("priceId") || import.meta.env.VITE_EQUITY_ANALYST_PRICE_ID;

  // Handle cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleResendEmail = async () => {
    if (!canResend) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      await resendConfirmationEmail(email);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setCanResend(false);
      toast.success("Confirmation email resent!", {
        position: "top-center",
        description: "Please check your inbox for the confirmation link.",
        duration: 10000,
      });
    } catch (error: unknown) {
      let message = "Failed to resend confirmation email.";
      if (error instanceof Error) {
        message = error.message;
      }
      setErrorMsg(message);
      toast.error(message, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleStripeCheckout = async (userId: string) => {
    const stripe = await stripePromise;

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URI}/api/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId: userId,
        }),
      }
    );

    const session = await response.json();
    const result = await stripe!.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
      toast.error("Failed to redirect to payment page");
    }
  };

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
      const { user } = await customSignUp(email.trim(), password, firstName);
      console.log("Signup successful!");
      setEmailSent(true);
      localStorage.setItem("runEdgeFunction", "true");

      // Only proceed to Stripe checkout if email is confirmed (optional)
      if (user?.id) {
        await handleStripeCheckout(user.id);
      }
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
          message = "Please confirm your email before proceeding.";
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

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await customGoogleSignIn();

      if (error) {
        throw error;
      }

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
          className="relative w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md"
        >
          <div className="absolute sm:max-w-md w-full text-center -top-20 left-1/2 -translate-x-1/2 bg-gray-200 rounded-full px-4 py-1 text-sm">
            Please provide a valid and permanent email address to ensure you
            receive the confirmation email.
          </div>
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

          {!emailSent ? (
            <>
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
                <span className="mx-2 text-gray-600 dark:text-gray-400">
                  or
                </span>
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
                  <img
                    src="/google-icon.webp"
                    alt="Google"
                    className="h-5 w-5"
                  />
                  <span>
                    {loading ? "Signing up..." : "Continue with Google"}
                  </span>
                </button>
              </div>
            </>
          ) : (
            <div className="mt-6 text-center">
              <div className="flex justify-center mb-4">
                <MailCheck className="h-12 w-12 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Check Your Email
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We've sent a confirmation link to{" "}
                <span className="font-medium">{email}</span>. Please click the
                link to verify your account before proceeding to payment.
              </p>
              <button
                onClick={handleResendEmail}
                className={`w-full flex items-center justify-center gap-2 ${
                  canResend
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                } font-semibold py-2 rounded-lg transition`}
                disabled={!canResend || loading}
              >
                {loading
                  ? "Sending..."
                  : canResend
                  ? "Resend Confirmation Email"
                  : `Resend available in ${formatTime(cooldown)}`}
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Didn't receive the email? Check your spam folder or try
                resending.
              </p>
            </div>
          )}

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

export default CustomSignup;
