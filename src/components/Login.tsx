import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, googleSignIn, resetPassword } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Logged in successfully!", {
        position: "bottom-center",
      });
      navigate("/chat");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSignInClick = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    try {
      const { error } = await googleSignIn();
      if (error) {
        console.log("Google sign-in error", error);
        setErrorMsg(error.message);
      } else {
        // navigate("/chat");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("An unexpected error occurred.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setErrorMsg(null);
    setResetPasswordLoading(true);
    try {
      await resetPassword(email);
      toast.success(
        "Password reset link sent to your email. Check your email.",
        {
          position: "top-center",
        }
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("An unexpected error occurred.");
      }
    } finally {
      setResetPasswordLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      {googleLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader2 className="h-10 w-10 animate-spin text-white" />
        </div>
      )}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md"
        >
          <div className="flex flex-col justify-between items-center mb-4">
            <button
              onClick={handleBack}
              className="flex w-max text-sm mr-auto items-center gap-2 hover:gap-1 transition-all text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Go Back</span>
            </button>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">
              Login
            </h2>
            <div></div>
          </div>

          {errorMsg && (
            <p className="text-red-500 text-sm text-center mt-2">{errorMsg}</p>
          )}
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 top-1/2 -translate-y-1/2 pt-1 flex items-center text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className={`w-full mt-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={handleForgotPassword}
              className={`w-full mt-5 text-indigo-500 hover:underline text-sm transition ${
                resetPasswordLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={resetPasswordLoading}
            >
              {resetPasswordLoading
                ? "Sending Reset Link..."
                : "Forgot password?"}
            </button>
          </form>
          <div className="mt-4 flex items-center justify-center">
            <div className="border-t border-gray-300 dark:border-gray-700 w-1/3"></div>
            <span className="mx-2 text-gray-600 dark:text-gray-400">or</span>
            <div className="border-t border-gray-300 dark:border-gray-700 w-1/3"></div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={handleGoogleSignInClick}
              className={`flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 px-4 font-medium text-gray-700 bg-white hover:bg-gray-100 transition-all shadow-sm ${
                googleLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={googleLoading}
            >
              <img src="/google-icon.webp" alt="Google" className="h-5 w-5" />
              <span>
                {googleLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Continue with Google"
                )}
              </span>
            </button>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-indigo-500 hover:underline">
              Sign up
            </a>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Login;
