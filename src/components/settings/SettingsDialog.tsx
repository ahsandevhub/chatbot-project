
import React, { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const SettingsDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    console.log("Logout clicked");
    // Placeholder for logout functionality
    onOpenChange(false);
  };

  // Ensure proper cleanup when dialog is closed
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Manage your preferences and account settings
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Theme</h3>
              <div className="flex items-center justify-between">
                <span>Dark mode</span>
                <Switch 
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => {
                    setTheme(checked ? "dark" : "light");
                  }}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">Chat options</h3>
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <span className="font-medium">Show suggestions</span>
                  <p className="text-sm text-muted-foreground">Show follow up suggestions in chats</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="font-medium">Show code</span>
                  <p className="text-sm text-muted-foreground">Always show code when using data analyst</p>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">Data & Privacy</h3>
              <div className="flex items-center justify-between mb-4">
                <span>Clear conversation history</span>
                <Button variant="outline" size="sm">Clear history</Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Delete all chats</span>
                <Button variant="destructive" size="sm">Delete all</Button>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between">
                <span>Log out on this device</span>
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
