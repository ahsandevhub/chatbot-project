// src/components/AuthRedirectHandler.tsx
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthRedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      console.log("AuthRedirectHandler: Starting...");
      console.log("AuthRedirectHandler: Location:", location);

      const params = new URLSearchParams(
        location.search || location.hash.substring(1)
      );
      console.log("AuthRedirectHandler: Params:", params);

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      console.log("AuthRedirectHandler: Access Token:", accessToken);
      console.log("AuthRedirectHandler: Refresh Token:", refreshToken);

      if (accessToken && refreshToken) {
        console.log(
          "AuthRedirectHandler: Tokens found, attempting to set session..."
        );
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("AuthRedirectHandler: Error setting session:", error);
            navigate("/login");
            return;
          }

          console.log("AuthRedirectHandler: Session set, navigating to /chat");
          console.log("Navigating to /chat...");
          navigate("/chat");
        } catch (error: unknown) {
          console.error("AuthRedirectHandler: Error during setSession:", error);
          navigate("/login");
        }
      } else {
        console.log(
          "AuthRedirectHandler: Tokens not found, navigating to /login"
        );
        navigate("/login");
      }
    };

    handleRedirect();
  }, [location, navigate]);

  return null;
};

export default AuthRedirectHandler;
