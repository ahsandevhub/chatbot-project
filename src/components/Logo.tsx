import React from "react";
import { useTheme } from "../context/ThemeContext"; // Adjust the path as needed

const Logo: React.FC = () => {
  const { theme } = useTheme(); // Get the theme from context

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        <img
          src={theme === "dark" ? "/logo-wh.svg" : "/logo.svg"} // Conditional src
          alt="Stonk Hub Logo"
          className="h-10 md:h-12"
        />
      </div>
    </div>
  );
};

export default Logo;
