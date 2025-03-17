
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "../hooks/use-mobile";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/ThemeContext";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Auto-close sidebar on mobile
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div 
        className="flex flex-col flex-1 w-full transition-all duration-300"
        style={{ 
          marginLeft: !isMobile && isSidebarOpen ? '260px' : '0'
        }}
      >
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2" 
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-semibold">Settings</h1>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-medium mb-4">Account</h2>
                <div className="bg-accent/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Manage your account settings and preferences.
                  </p>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-4">Appearance</h2>
                <div className="bg-accent/50 p-4 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Toggle between light and dark themes
                      </p>
                    </div>
                    <Switch 
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => {
                        setTheme(checked ? "dark" : "light");
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-4">Notifications</h2>
                <div className="bg-accent/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Configure how and when you receive notifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
