import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ChevronDown, LogIn, UserPlus, Sparkles, MessageSquare, Linkedin, PhoneCall, Bot } from 'lucide-react';

interface PlatformProps {
  isDarkMode: boolean;
  navigateTo?: (page: 'home' | 'portfolio' | 'services' | 'contact' | 'register' | 'platform') => void;
}

const Platform: React.FC<PlatformProps> = ({ navigateTo }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <section className="bg-white min-h-screen w-full relative select-none font-sans overflow-hidden">
      
      {/* Top Left Brand / Back navigation */}
      <div className="absolute top-6 left-8 z-50">
        <button
          onClick={() => navigateTo?.('home')}
          className="flex items-center gap-2 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20 group-hover:scale-105 active:scale-95 transition-all">
            iA
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 group-hover:text-zinc-950 transition-colors">
            Innovators AI HUB
          </span>
        </button>
      </div>

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

      {/* Main Hero Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-20 flex flex-col md:flex-row items-center gap-12 min-h-[85vh] relative z-10">
        
        {/* Left Side: Creative Typography & Details */}
        <div className="flex-1 text-left space-y-8 max-w-2xl">
          <div className="space-y-4">
            
            {/* Creative Typography: Rent (2X), your (1X), 1st (4X, Green), and AI Agent Co-Worker below */}
            <div 
              style={{ fontFamily: '"Avenir Next", Avenir, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
              className="flex flex-col items-start select-text"
            >
              {/* Line 1: Rent your 1st */}
              <h1 className="flex items-baseline flex-nowrap whitespace-nowrap leading-none">
                <span 
                  style={{ 
                    color: '#000000', 
                    fontWeight: 700,
                    fontSize: 'clamp(2rem, 5vw, 4rem)'
                  }}
                  className="mr-3 md:mr-4"
                >
                  Rent
                </span>
                <span 
                  style={{ 
                    color: '#000000',
                    fontWeight: 500,
                    fontSize: 'clamp(1rem, 2.5vw, 2rem)'
                  }}
                  className="mr-3 md:mr-5"
                >
                  your
                </span>
                <span 
                  style={{ 
                    color: '#95d656', 
                    fontWeight: 800,
                    fontSize: 'clamp(4rem, 10vw, 8rem)',
                    display: 'inline-flex',
                    alignItems: 'flex-start',
                    lineHeight: 1
                  }}
                  className="leading-none"
                >
                  <span>1</span>
                  <span 
                    style={{ 
                      fontSize: '0.10em', 
                      fontWeight: 600,
                      lineHeight: 1.1,
                      marginLeft: '0.05em',
                      paddingTop: '0.08em'
                    }}
                  >
                    st
                  </span>
                </span>
              </h1>

              {/* Line 2: AI Agent Co-Worker */}
              <h2 
                style={{ 
                  color: '#000000',
                  fontWeight: 600,
                  fontSize: 'clamp(1.5rem, 3.75vw, 3rem)'
                }}
                className="mt-3 md:mt-4 leading-tight tracking-tight"
              >
                AI Agent Co-Worker
              </h2>
            </div>
            {/* Left Side Aligned Pricing Button */}
            <div className="text-left mt-6">
              <button 
                style={{ 
                  fontFamily: '"Avenir Next", Avenir, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontWeight: 600,
                  color: '#000000',
                }}
                className="px-5 py-2.5 rounded-xl text-xs md:text-sm tracking-wide bg-white border border-zinc-200 shadow-[0_4px_0_0_rgba(228,228,231,1),0_4px_6px_-1px_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-1 transition-all cursor-default outline-none"
              >
                Starts at ₹999/mo
              </button>
            </div>

          </div>

          <p className="text-zinc-500 text-sm md:text-base max-w-md leading-relaxed font-light select-text">
            Instantly scale your operations with autonomous, pre-trained AI agents that seamlessly integrate into WhatsApp, LinkedIn, and voice workflows.
          </p>

          {/* Action Buttons (Neumorphic Design style) */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={() => navigateTo?.('services')}
              className="px-6 py-3.5 rounded-2xl bg-white text-xs font-bold text-indigo-600 uppercase tracking-wider border border-zinc-100 shadow-[4px_4px_10px_rgba(0,0,0,0.05),_-4px_-4px_10px_rgba(255,255,255,0.9)] hover:shadow-[2px_2px_5px_rgba(0,0,0,0.05),_-2px_-2px_5px_rgba(255,255,255,0.9)] hover:bg-zinc-50 active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-2px_-2px_5px_rgba(255,255,255,0.8)] transition-all duration-200 outline-none"
            >
              Get Stated
            </button>
            <button 
              onClick={() => navigateTo?.('contact')}
              className="px-6 py-3.5 rounded-2xl bg-zinc-900 text-xs font-bold text-white uppercase tracking-wider hover:bg-zinc-800 transition-all duration-200 shadow-md shadow-zinc-900/10 outline-none"
            >
              Request Custom Agent
            </button>
          </div>
        </div>

        {/* Right Side: Hero Image Showcase */}
        <div className="flex-1 w-full flex justify-center md:justify-end items-center select-none pointer-events-none">
          <div className="relative w-full flex justify-center md:justify-end items-center">
            {/* Soft creative background gradient highlights behind the image */}
            <div className="absolute top-1/2 left-1/2 md:left-auto md:right-12 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-green-100/35 to-indigo-100/35 blur-3xl -z-10" />
            
            {/* Image Wrapper with Bottom White Fade Overlay */}
            <div className="relative flex justify-center items-end max-w-[450px] md:max-w-[540px] lg:max-w-[620px] w-full overflow-hidden">
              <img 
                src="/platform_hero.png" 
                alt="AI Co-Worker Platform Hero" 
                className="w-full h-auto object-contain"
              />
              {/* Whitish gradient overlay to merge bottom dark vignetted edge with the white background */}
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none z-10" />
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};

export default Platform;
