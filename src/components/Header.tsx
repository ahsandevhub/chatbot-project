import { Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ThemeToggle } from "./ui/ThemeToggle";

const Header: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <header className="py-6 border-b border-gray-200 font-inter bg-white dark:bg-gray-900 dark:border-gray-700">
      <div className="container px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <img
              src="/lovable-uploads/42f319ec-6c0f-4a6e-9a40-44d73a3fad55.png"
              alt="Stonk Hub Logo"
              className="h-6 md:h-8"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8">
          <a
            href="#"
            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            Home
          </a>
          <a
            href="#"
            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#"
            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            Pricing
          </a>
        </nav>

        {/* Right Section: Theme Toggle + Mobile Menu */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
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
            href="#"
            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            Home
          </a>
          <a
            href="#"
            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#"
            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            Pricing
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
