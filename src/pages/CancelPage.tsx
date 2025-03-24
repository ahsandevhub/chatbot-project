import { XCircleIcon } from "lucide-react"; // Import cancel icon
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CancelPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    toast.error("Payment failed!", { position: "top-center" });

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate("/login");
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
        <div className="flex items-center justify-center mb-4">
          <XCircleIcon className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-4">
          Payment Failed
        </h2>
        <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
          Your payment was failed. Please try again or contact support.
        </p>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Redirecting in {countdown} seconds...
          </p>
          <button
            onClick={() => navigate("/pricing")}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;
