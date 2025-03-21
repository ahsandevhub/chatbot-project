// src/App.tsx
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import AuthRedirectHandler from "./components/AuthRedirectHandler";
import Login from "./components/Login";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from "./components/ResetPassword";
import Signup from "./components/Signup";
import TermsAndServices from "./components/TermsAndServices";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Chat from "./pages/Chat";
import ChatIndex from "./pages/ChatIndex";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Test from "./pages/Test";

const queryClient = new QueryClient();

const ThemeSetter = () => {
  const location = useLocation();
  const { setTheme } = useTheme();

  useEffect(() => {
    const alwaysLightRoutes = [
      "/",
      "/login",
      "/signup",
      "/profile",
      "/privacy-policy",
      "/terms-services",
    ];

    if (alwaysLightRoutes.includes(location.pathname)) {
      setTheme("light");
    }
  }, [location.pathname, setTheme]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ThemeSetter />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-services" element={<TermsAndServices />} />
              <Route path="/auth/callback" element={<AuthRedirectHandler />} />
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/chat/*" // Match all chat routes
                  element={
                    <ChatProvider>
                      <Routes>
                        <Route index element={<ChatIndex />} />
                        <Route path=":id" element={<Chat />} />
                      </Routes>
                    </ChatProvider>
                  }
                />
                <Route path="/test" element={<Test />} />
                <Route
                  path="/settings"
                  element={
                    <Settings
                      onClose={function (): void {
                        throw new Error("Function not implemented.");
                      }}
                    />
                  }
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
