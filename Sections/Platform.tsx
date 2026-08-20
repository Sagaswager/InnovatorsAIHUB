import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ChevronDown, LogIn, UserPlus, Sparkles, MessageSquare, Linkedin, PhoneCall, Bot, X, Check, Loader2 } from 'lucide-react';

/*
GOOGLE APPS SCRIPT FOR GOOGLE SHEET:
Copy and paste this script into Extensions -> Apps Script inside your Google Sheet (https://docs.google.com/spreadsheets/d/1iYGkYrr97s9GjYAAbGrcdlzxPe-fycA-S-QQ-y_TPuw/edit?usp=sharing):

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Appends row with columns: Name, Mail, Number, Profession, Company Name
  sheet.appendRow([
    data.name,
    data.email,
    data.number,
    data.profession,
    data.companyName
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}

Make sure to click Deploy -> New Deployment -> Web App. Set Access to "Anyone" and paste the deployed URL into SCRIPT_URL below!
*/

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyj1N4f8l-72f5tYIe_fP00t_8r5Rk7eNlX_X-4mSg/exec"; // Replace with deployed Web App URL

interface PlatformProps {
  isDarkMode: boolean;
  navigateTo?: (page: 'home' | 'portfolio' | 'services' | 'contact' | 'register' | 'platform') => void;
}

const Platform: React.FC<PlatformProps> = ({ navigateTo }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'register' | 'login'>('register');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form Field states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [profession, setProfession] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Check login status on mount
  useEffect(() => {
    const saved = localStorage.getItem('platform_user');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
  }, []);

  // Handle Register/Login submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    if (modalMode === 'register') {
      const userData = {
        name,
        email,
        number,
        profession,
        companyName
      };

      try {
        // Post data to Google Apps Script Web App
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // standard Apps Script redirect handling
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        });

        // Store user database locally to simulate backend persistence
        const existingUsersRaw = localStorage.getItem('platform_registered_users');
        const existingUsers = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];
        
        // Save user if not already in list
        if (!existingUsers.some((u: any) => u.email === email)) {
          existingUsers.push(userData);
          localStorage.setItem('platform_registered_users', JSON.stringify(existingUsers));
        }

        // Login user session
        localStorage.setItem('platform_user', JSON.stringify({ name, email }));
        setCurrentUser({ name, email });
        
        // Reset form & close modal
        setName('');
        setEmail('');
        setNumber('');
        setProfession('');
        setCompanyName('');
        setIsModalOpen(false);
        alert(`Account created successfully! Welcome, ${name}!`);

      } catch (err) {
        console.error("Submission failed:", err);
        setSubmitError('Failed to register. Please check your internet connection.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Login flow: Lookup email in local registered list
      const existingUsersRaw = localStorage.getItem('platform_registered_users');
      const existingUsers = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];
      
      const foundUser = existingUsers.find((u: any) => u.email === email);
      
      if (foundUser) {
        localStorage.setItem('platform_user', JSON.stringify({ name: foundUser.name, email: foundUser.email }));
        setCurrentUser({ name: foundUser.name, email: foundUser.email });
        setEmail('');
        setIsModalOpen(false);
        alert(`Welcome back, ${foundUser.name}!`);
      } else {
        setSubmitError('Email not found. Click "Get Started" to register this email first!');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white min-h-screen w-full relative select-none font-sans overflow-hidden">
      
      {/* Top Left Brand / Back navigation (Positioned closer to the corner) */}
      <div className="absolute top-2 left-4 z-50">
        <button
          onClick={() => navigateTo?.('home')}
          className="flex items-center group focus:outline-none"
        >
          <img 
            src="/logo.png" 
            alt="Innovators AI HUB Logo" 
            style={{ filter: 'brightness(0)' }}
            className="h-20 md:h-28 w-auto object-contain transition-all duration-300 group-hover:opacity-80" 
          />
        </button>
      </div>

      {/* Top Right Action Group */}
      <div className="absolute top-6 right-8 z-50 flex items-center gap-4">
        
        {/* Book Demo Button (Black with zoom-in scale effect) */}
        <a 
          href="https://calendar.app.google/D4VcVM3GVSh4PAia6" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-black text-white hover:bg-zinc-900 border border-zinc-800 rounded-full px-5 py-2 text-xs font-semibold tracking-wide hover:scale-105 active:scale-95 transition-all duration-200 inline-flex items-center gap-2 outline-none shadow-sm"
        >
          <Calendar size={13} className="text-white/80" />
          <span>Book Demo</span>
        </a>

        {/* Account Menu (Dropdown) */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 focus:outline-none transition-transform active:scale-95"
            aria-label="Account Settings"
          >
            {/* Styled Profile / Avatar bubble */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-[1.5px] shadow-sm hover:shadow transition-shadow">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-zinc-600 hover:text-zinc-800 transition-colors font-bold text-xs uppercase">
                {currentUser ? currentUser.name.charAt(0) : <User size={15} />}
              </div>
            </div>
            <ChevronDown size={14} className="text-zinc-400 hover:text-zinc-600 transition-colors" />
          </button>

          {/* Account Action Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && (
              <>
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
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 border-b border-zinc-100 mb-1.5">
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Account</p>
                        <p className="text-xs font-bold text-zinc-950 truncate mt-0.5">{currentUser.name}</p>
                        <p className="text-[10px] text-zinc-500 truncate">{currentUser.email}</p>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          localStorage.removeItem('platform_user');
                          setCurrentUser(null);
                          alert("Signed out successfully!");
                        }}
                        className="w-full px-4 py-2.5 hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2.5 transition-all outline-none"
                      >
                        <LogIn size={13} className="text-red-400 rotate-180" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setModalMode('login');
                          setIsModalOpen(true);
                        }}
                        className="w-full px-4 py-2.5 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 text-xs font-semibold rounded-xl flex items-center gap-2.5 transition-all outline-none"
                      >
                        <LogIn size={13} className="text-zinc-400" />
                        <span>Sign In</span>
                      </button>

                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setModalMode('register');
                          setIsModalOpen(true);
                        }}
                        className="w-full px-4 py-2.5 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 text-xs font-semibold rounded-xl flex items-center gap-2.5 transition-all outline-none"
                      >
                        <UserPlus size={13} className="text-zinc-400" />
                        <span>Get Started</span>
                      </button>
                    </>
                  )}
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
            
            {/* Elegant Header with focus word 'Rent' styled 2X bigger and in green */}
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
                      fontSize: '0.3em', 
                      fontWeight: 600,
                      lineHeight: 1.1,
                      marginLeft: '0.05em',
                      paddingTop: '0.22em'
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
            
            {/* Left Side Aligned Starts At Button (Triggers Get Started glassy Form) */}
            <div className="text-left mt-6">
              <button 
                onClick={() => {
                  if (currentUser) {
                    alert(`You are logged in as ${currentUser.name}! Directing to dashboard...`);
                  } else {
                    setModalMode('register');
                    setIsModalOpen(true);
                  }
                }}
                style={{ 
                  fontFamily: '"Avenir Next", Avenir, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontWeight: 600,
                  backgroundColor: '#000000',
                  color: '#ffffff'
                }}
                className="px-5 py-2.5 rounded-xl text-xs md:text-sm tracking-wide shadow-md hover:bg-zinc-900 active:scale-95 transition-all cursor-pointer outline-none border border-zinc-800"
              >
                Starts at ₹999/mo
              </button>
            </div>

          </div>

          {/* Description updated by request */}
          <p className="text-zinc-500 text-sm md:text-base max-w-md leading-relaxed font-light select-text">
            Let's Build AI Co-Workers Team.
          </p>

        </div>

        {/* Right Side: Hero Image Showcase */}
        <div className="flex-1 w-full flex justify-center md:justify-end items-center select-none pointer-events-none md:-mr-12 lg:-mr-16">
          <div className="relative w-full flex justify-center md:justify-end items-center">
            {/* Soft creative background gradient highlights behind the image */}
            <div className="absolute top-1/2 left-1/2 md:left-auto md:right-12 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-green-100/35 to-indigo-100/35 blur-3xl -z-10" />
            
            {/* Image Wrapper with Bottom White Fade Overlay & Founder Tag */}
            <div className="relative flex justify-center items-end max-w-[450px] md:max-w-[540px] lg:max-w-[620px] w-full overflow-hidden -translate-y-8 md:-translate-y-14">
              <img 
                src="/platform_hero.png" 
                alt="AI Co-Worker Platform Hero" 
                className="w-full h-auto object-contain"
              />

              {/* Founder Label just below the tip of the arrow (Clickable LinkedIn Link) */}
              <a 
                href="https://www.linkedin.com/in/sagarmasand1/"
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute top-[66%] left-[3%] md:left-[6%] -translate-y-1/2 z-20 flex items-center gap-3 bg-white/95 hover:bg-white backdrop-blur-md p-1 pr-4 rounded-2xl border border-zinc-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_18px_rgba(0,0,0,0.08)] hover:scale-[1.03] transition-all duration-200 pointer-events-auto cursor-pointer"
                style={{ fontFamily: '"Avenir Next", Avenir, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
              >
                {/* Real LinkedIn logo image */}
                <img 
                  src="/linkedin_logo.png" 
                  alt="LinkedIn Logo" 
                  className="w-10 h-10 object-contain rounded-xl"
                />
                
                <div className="flex flex-col items-start leading-none pr-1">
                  <span className="text-[13px] font-bold text-zinc-900 leading-none">Sagar</span>
                  <span className="text-[9px] text-zinc-500 font-semibold tracking-wider uppercase mt-1">Founder</span>
                </div>
              </a>

              {/* Subtle whitish gradient overlay at the very bottom edge to blend the crop line smoothly */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
            </div>
          </div>
        </div>

      </div>

      {/* Glassy Get Started / Sign In Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm">
            {/* Modal backdrop clicks close modal */}
            <div className="fixed inset-0 cursor-default" onClick={() => setIsModalOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white/70 border border-white/30 backdrop-blur-xl rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-6 md:p-8 max-w-md w-full relative z-50 text-left"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1.5 rounded-full transition-colors outline-none"
              >
                <X size={16} />
              </button>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-zinc-950">
                  {modalMode === 'register' ? 'Get Started' : 'Sign In'}
                </h3>
                <p className="text-[11px] text-zinc-500 mt-1">
                  {modalMode === 'register' 
                    ? 'Enter your details below to rent your AI Co-worker team.' 
                    : 'Enter your email id to access your AI login account.'}
                </p>
              </div>

              {/* Error feedback */}
              {submitError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {modalMode === 'register' ? (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Name</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Sagar"
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/80 bg-white/50 focus:bg-white focus:border-zinc-400 text-sm outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Email (Mail)</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="sagar@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/80 bg-white/50 focus:bg-white focus:border-zinc-400 text-sm outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Number</label>
                      <input 
                        type="tel" 
                        required
                        value={number}
                        onChange={e => setNumber(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/80 bg-white/50 focus:bg-white focus:border-zinc-400 text-sm outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Profession / Role</label>
                      <input 
                        type="text" 
                        required
                        value={profession}
                        onChange={e => setProfession(e.target.value)}
                        placeholder="e.g. Founder"
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/80 bg-white/50 focus:bg-white focus:border-zinc-400 text-sm outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Company Name</label>
                      <input 
                        type="text" 
                        required
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        placeholder="Innovators AI HUB"
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/80 bg-white/50 focus:bg-white focus:border-zinc-400 text-sm outline-none transition-all"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="sagar@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/80 bg-white/50 focus:bg-white focus:border-zinc-400 text-sm outline-none transition-all"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 outline-none disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving to Sheet...</span>
                    </>
                  ) : (
                    <span>{modalMode === 'register' ? 'Submit & Create Account' : 'Verify Email'}</span>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-zinc-200/40 text-center">
                {modalMode === 'register' ? (
                  <button 
                    onClick={() => {
                      setSubmitError('');
                      setModalMode('login');
                    }}
                    className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-950 transition-colors"
                  >
                    Already have an account? <span className="text-indigo-600 font-bold underline">Sign In</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setSubmitError('');
                      setModalMode('register');
                    }}
                    className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-950 transition-colors"
                  >
                    Don't have an account yet? <span className="text-indigo-600 font-bold underline">Get Started</span>
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Platform;
