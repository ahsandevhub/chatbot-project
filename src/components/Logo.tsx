import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        <img
          src={"/logo.svg"} // Conditional src
          alt="Stonk Hub Logo"
          className="h-10 md:h-12"
        />
      </div>
    </div>
  );
};

export default Logo;
