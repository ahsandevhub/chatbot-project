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

  return null; // This component doesn't render anything
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <ChatProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <ThemeSetter /> {/* Add the ThemeSetter component */}
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-services" element={<TermsAndServices />} />
                <Route
                  path="/auth/callback"
                  element={<AuthRedirectHandler />}
                />
                <Route element={<ProtectedRoute />}>
                  <Route path="/chat" element={<ChatIndex />} />
                  <Route path="/test" element={<Test />} />
                  <Route path="/chat/:id" element={<Chat />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </ChatProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
