import React from "react";
import { useTheme } from "../context/ThemeContext";

const Header: React.FC = () => {
  const { theme } = useTheme();

  return (
    <header className="py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="container px-4 md:px-6 flex justify-center items-center">
        <div className="flex items-center">
          <a href="/">
            <img
              src={theme === "dark" ? "/logo-wh.svg" : "/logo.svg"}
              alt="Stonk Hub Logo"
              className="h-8 md:h-10"
            />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
