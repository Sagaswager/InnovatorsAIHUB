import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ChevronDown, LogIn, UserPlus } from 'lucide-react';

interface PlatformProps {
  isDarkMode: boolean;
  navigateTo?: (page: 'home' | 'portfolio' | 'services' | 'contact' | 'register' | 'platform') => void;
}

const Platform: React.FC<PlatformProps> = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <section className="bg-white min-h-screen w-full relative select-none font-sans overflow-hidden">
      
      {/* Top Right Action Group */}
      <div className="absolute top-6 right-8 z-50 flex items-center gap-4">
        
        {/* Book Demo Button (Simple Flat Outlined style) */}
        <a 
          href="https://calendar.app.google/D4VcVM3GVSh4PAia6" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-all inline-flex items-center gap-2 outline-none"
        >
          <Calendar size={13} className="text-zinc-500" />
          <span>Book Demo</span>
        </a>

        {/* Creative Profile Icon (Triggers Sign In / Get Started Dropdown) */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 focus:outline-none transition-transform active:scale-95"
            aria-label="Account Settings"
          >
            {/* Styled Profile / Avatar bubble */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-[1.5px] shadow-sm hover:shadow transition-shadow">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-zinc-600 hover:text-zinc-800 transition-colors">
                <User size={15} />
              </div>
            </div>
            <ChevronDown size={14} className="text-zinc-400 hover:text-zinc-600 transition-colors" />
          </button>

          {/* Account Action Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && (
              <>
                {/* Click outside background overlay to close dropdown */}
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setIsDropdownOpen(false)} 
                />
                
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-zinc-100 rounded-2xl shadow-xl p-2 z-50 text-left"
                >
                  {/* Sign In action */}
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      // Trigger normal browser alert as demo action
                      alert("Redirecting to Sign In page...");
                    }}
                    className="w-full px-4 py-2.5 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 text-xs font-semibold rounded-xl flex items-center gap-2.5 transition-all outline-none"
                  >
                    <LogIn size={13} className="text-zinc-400" />
                    <span>Sign In</span>
                  </button>

                  {/* Get Started / Sign Up action */}
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      alert("Opening Get Started registration wizard...");
                    }}
                    className="w-full px-4 py-2.5 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 text-xs font-semibold rounded-xl flex items-center gap-2.5 transition-all outline-none"
                  >
                    <UserPlus size={13} className="text-zinc-400" />
                    <span>Get Started</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

      </div>

    </section>
  );
};

export default Platform;
