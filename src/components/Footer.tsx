
import React from 'react';
import Logo from './Logo';
import { Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-6 border-t border-gray-200 font-inter">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <Logo />
            <p className="text-gray-500 text-sm mt-2 md:mt-0">
              © {new Date().getFullYear()} Stonk Hub. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-10">
            <a 
              href="mailto:support@stonk-hub.com" 
              className="flex items-center text-gray-600 hover:text-black transition-colors gap-1.5"
            >
              <Mail size={18} />
              <span>support@stonk-hub.com</span>
            </a>
            
            <div className="flex gap-8">
              <a href="#" className="text-gray-600 hover:text-black transition-colors font-inter">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors font-inter">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
