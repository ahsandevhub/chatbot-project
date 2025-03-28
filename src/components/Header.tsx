import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="py-3 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="container px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img
              src={"/logo.svg"}
              alt="Stonk Hub Logo"
              className="h-8 md:h-10"
            />
          </Link>
        </div>
        <div>
          <Link
            to="/login"
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
