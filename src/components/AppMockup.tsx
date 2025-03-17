
import React from 'react';
import { Send } from 'lucide-react';

const AppMockup: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-10 rounded-lg overflow-hidden shadow-xl border border-gray-200">
      {/* Window Header */}
      <div className="bg-gray-900 p-3 flex items-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-white font-medium">
          StonkHub AI Assistant
        </div>
      </div>
      
      {/* Chat Content */}
      <div className="bg-white p-6 min-h-[300px] flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-2xl font-medium text-gray-800 text-center">
            Which market prices can I pull up for you?
          </div>
        </div>
        
        {/* Input Area */}
        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Ask anything..." 
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none"
              readOnly
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white">
              <Send size={18} />
            </button>
          </div>
          <div className="text-center text-gray-500 text-sm mt-4">
            Disclaimer: Mistakes can happen and all provided information is for educational purposes only.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppMockup;
