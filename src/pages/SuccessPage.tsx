import { CheckCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);
  const searchParams = new URLSearchParams(location.search);
  const tier = searchParams.get("tier");
  let tierHeading = "";
  let tierMessage = "Your subscription is now active.";

  if (tier === "equity") {
    tierHeading = "Equity Analyst Subscription";
    tierMessage = "Your Equity Analyst subscription is now active.";
  } else if (tier === "global") {
    tierHeading = "Global Macro Subscription";
    tierMessage = "Your Global Macro subscription is now active.";
  }

  useEffect(() => {
    toast.success("Payment successful!", { position: "top-center" });

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
        <div className="flex items-center justify-center mb-4">
          <CheckCircleIcon className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-3">
          Payment Successful!
        </h2>
        {tierHeading && (
          <h3 className="text-lg font-semibold text-center text-gray-700 dark:text-gray-300 mb-4">
            {tierHeading}
          </h3>
        )}
        <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
          Thank you for your purchase. <br /> {tierMessage}
        </p>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Redirecting in {countdown} seconds...
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Go to Login Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
