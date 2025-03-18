import { ArrowLeftIcon, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signUp, googleSignIn } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, firstName, lastName);
      toast.success(
        "Account created successfully! Please confirm your email.",
        { position: "top-center" }
      );
      navigate("/chat");
    } catch (error: unknown) {
      let message = "An unexpected error occurred.";
      if (error instanceof Error) {
        if (error.message.includes("email-already-in-use")) {
          message = "Email address is already in use.";
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
        <button
          onClick={() => navigate("/")}
          className="flex w-max text-sm mb-4 items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
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
          <div className="mb-4 grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
          <span className="mx-2 text-gray-600 dark:text-gray-400">or</span>
          <div className="border-t border-gray-300 dark:border-gray-700 w-1/3"></div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={async () => {
              setLoading(true);
              setErrorMsg(null);
              try {
                await googleSignIn();
                toast.success("Signed up successfully with Google!", {
                  position: "top-center",
                });
                navigate("/chat");
              } catch (error: unknown) {
                let message = "An unexpected error occurred.";
                if (error instanceof Error) {
                  message = error.message.includes("email-already-in-use")
                    ? "Email address is already in use."
                    : error.message;
                }
                setErrorMsg(message);
                toast.error(message, { position: "top-center" });
              } finally {
                setLoading(false);
              }
            }}
            className={`flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 px-4 font-medium text-gray-700 bg-white hover:bg-gray-100 transition-all shadow-sm ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            <img src="/google-icon.webp" alt="Google" className="h-5 w-5" />
            <span>{loading ? "Signing up..." : "Continue with Google"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
