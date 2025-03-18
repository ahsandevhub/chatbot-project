import { Menu } from "lucide-react";
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext"; // Import useTheme
import { ThemeToggle } from "./ui/ThemeToggle";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme(); // Get the theme from context

  return (
    <header className="py-2 sm:py-3 border-b border-gray-200 font-inter bg-white dark:bg-gray-900 dark:border-gray-700">
      <div className="container px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <img
              src={theme === "dark" ? "/logo-wh.svg" : "/logo.svg"} // Conditional src
              alt="Stonk Hub Logo"
              className="h-8 md:h-10"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8">
          <a
            href="/"
            className="text-gray-600 text-sm dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            Home
          </a>
          <a
            href="#pricing"
            className="text-gray-600 text-sm dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-gray-600 text-sm dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Right Section: Theme Toggle + Mobile Menu + Start Free Button */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Start Free Button */}
          <a
            href="/chat"
            className="hidden text-sm md:block bg-gray-800 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-gray-900 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Start Free
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 pe-0"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col items-center gap-4">
          <a
            href="/"
            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            Home
          </a>
          <a
            href="#pricing"
            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            FAQ
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
