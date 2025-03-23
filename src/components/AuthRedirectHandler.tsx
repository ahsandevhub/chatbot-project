import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthRedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      console.log("AuthRedirectHandler: Starting...");

      const params = new URLSearchParams(
        location.search || location.hash.substring(1)
      );
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken && refreshToken) {
        console.log("AuthRedirectHandler: Tokens found, setting session...");
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("AuthRedirectHandler: Session error:", error);
            navigate("/login");
            return;
          }

          console.log("AuthRedirectHandler: Session set. Redirecting...");
          navigate("/chat", { replace: true }); // Ensure replace is used
        } catch (error) {
          console.error("AuthRedirectHandler: Error setting session:", error);
          navigate("/login");
        }
      } else {
        console.log(
          "AuthRedirectHandler: No tokens found, redirecting to login."
        );
        navigate("/login");
      }
    };

    handleRedirect();
  }, [location, navigate]);

  return null;
};

export default AuthRedirectHandler;
