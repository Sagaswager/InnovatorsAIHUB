import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Check, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Map, 
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  Compass,
  Megaphone,
  Coffee,
  HelpCircle,
  QrCode,
  Sparkles,
  Timer,
  ChevronRight
} from 'lucide-react';
import { trackEvent } from '../analytics';

interface EventRegistrationProps {
  isDarkMode: boolean;
}

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzNeX0d3ucPSeAydnFkTUkNejmTdzQc7A8ez6bcX-PYJpnaSfmWLu37x97SxosTx1y7TQ/exec";

const countryCodes = [
  { code: '+91', name: 'IN (+91)' },
  { code: '+1', name: 'US/CA (+1)' },
  { code: '+44', name: 'UK (+44)' },
  { code: '+971', name: 'UAE (+971)' },
  { code: '+65', name: 'SG (+65)' },
  { code: '+61', name: 'AU (+61)' },
  { code: '+49', name: 'DE (+49)' },
];

const EventRegistration: React.FC<EventRegistrationProps> = ({ isDarkMode }) => {
  const [focused, setFocused] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [countryCode, setCountryCode] = useState('+91');
  const [seatsLeft, setSeatsLeft] = useState(12);

  // Flow steps: 'form' -> 'payment' -> 'completed'
  const [step, setStep] = useState<'form' | 'payment' | 'completed'>('form');
  
  // Timer state for payment window (10 minutes)
  const [timeLeft, setTimeLeft] = useState(600);
  
  // Transaction Reference State
  const [txnId, setTxnId] = useState('');
  
  // Stored form data to carry forward to step 2 submission
  const [registeredUser, setRegisteredUser] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    designation: '',
    city: ''
  });

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    designation: '',
    city: '',
    whatsappConsent: true,
    humanVerified: false
  });

  // Highlight points
  const highlights = [
    "Meet 70+ TOP 1% Company MDs, CEOs, CMOs & Business Founders",
    "AI Agents Team Building Workshop",
    "Marketing Strategy: How to Scale your Business in 2026",
    "Founders Growth Roundtable",
    "Founders Elevator Pitch Opportunity",
    "High Tea & Elite Networking"
  ];

  const highlightIcons = [
    <Users className="w-5 h-5 text-emerald-400 shrink-0" />,
    <Compass className="w-5 h-5 text-emerald-400 shrink-0" />,
    <Megaphone className="w-5 h-5 text-emerald-400 shrink-0" />,
    <Award className="w-5 h-5 text-emerald-400 shrink-0" />,
    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />,
    <Coffee className="w-5 h-5 text-emerald-400 shrink-0" />
  ];

  // Simulating slightly shifting seats left to create FOMO (urgency)
  useEffect(() => {
    const interval = setInterval(() => {
      setSeatsLeft(prev => {
        if (prev <= 4) return prev;
        return Math.random() > 0.85 ? prev - 1 : prev;
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Timer Countdown Logic
  useEffect(() => {
    if (step !== 'payment' || timeLeft <= 0) return;
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [step, timeLeft]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Step 1: Submit Form Data to spreadsheet (leads collection) and advance to payment
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.humanVerified) {
      alert("Please confirm the human verification checkbox before registering.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    const fullPhoneNumber = `'${countryCode} ${formData.phone}`;
    
    // Save locally to use in payment verification step
    setRegisteredUser({
      name: formData.name,
      email: formData.email,
      phone: fullPhoneNumber,
      company: formData.company,
      designation: formData.designation,
      city: formData.city
    });

    const payload = {
      fullName: formData.name,
      email: formData.email,
      contactNumber: fullPhoneNumber,
      subject: "AI for Business (Form Submitted - Pending Payment)",
      location: formData.city,
      message: `Company: ${formData.company} | Designation: ${formData.designation} | Price: ₹899 | WhatsApp Updates: ${formData.whatsappConsent ? 'Yes' : 'No'}`
    };

    try {
      trackEvent('event_registration_lead', { company: formData.company });

      // Post initial lead details
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      trackEvent('event_lead_success', { email: formData.email });
      
      // Advance to payment step
      setIsSubmitting(false);
      setStep('payment');
      setTimeLeft(600); // reset 10 mins

    } catch (error) {
      console.error("Lead submission error:", error);
      // Even if network fails, let them proceed to payment to not block them
      setIsSubmitting(false);
      setStep('payment');
      setTimeLeft(600);
    }
  };

  // UPI deep links and QR data
  const upiId = "sagafreelance@okaxis";
  const registeredName = "Sagar";
  const amount = "899";
  const transactionNote = encodeURIComponent("AI for Business Event Pass");
  
  // Standard UPI Link Format
  const upiPaymentLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(registeredName)}&am=${amount}&cu=INR&tn=${transactionNote}`;
  
  // Free public QR Code generator API (No dependencies, matches theme inside component)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiPaymentLink)}&color=09090b&bgcolor=ffffff`;

  // Step 2: Verify Payment Code and Complete Registration
  const handlePaymentVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!txnId.trim() || txnId.length < 8) {
      alert("Please enter a valid UPI Ref No. / Transaction ID.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    const payload = {
      fullName: registeredUser.name,
      email: registeredUser.email,
      contactNumber: registeredUser.phone,
      subject: "AI for Business (PAYMENT VERIFICATION COMPLETED)",
      location: registeredUser.city,
      message: `Company: ${registeredUser.company} | Designation: ${registeredUser.designation} | UTR / Txn Ref ID: ${txnId} | Paid: ₹899`
    };

    try {
      trackEvent('payment_verification_attempt', { txnId });

      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      setSubmitStatus('success');
      trackEvent('payment_verification_success', { email: registeredUser.email });

      // Show success screen and auto-redirect to WhatsApp
      setTimeout(() => {
        const text = encodeURIComponent(`Hi Sagar, I have successfully paid ₹899 for the "AI for Business" event. Please verify my payment and issue my pass.\n\nName: ${registeredUser.name}\nEmail: ${registeredUser.email}\nCompany: ${registeredUser.company}\nUTR / Ref ID: ${txnId}`);
        window.location.href = `https://wa.me/919810875683?text=${text}`;
        setStep('completed');
      }, 2500);

    } catch (error) {
      console.error("Payment confirmation log error:", error);
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 md:px-8 bg-zinc-950 overflow-hidden text-white font-sans">
      
      {/* Background radial glow - Subtle Green Accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-[800px] mx-auto">
        
        <AnimatePresence mode="wait">
          
          {/* STEP 1: FORM SELECTION */}
          {step === 'form' && (
            <motion.div
              key="step-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-10">
                {/* Partners Badge Row */}
                <div className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6 py-2.5 rounded-full border border-white/20 bg-zinc-900/60 backdrop-blur-md text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-8 shadow-lg">
                  <span className="text-emerald-400">Organised By: <span className="text-white font-extrabold">Innovatorsaihub</span></span>
                  <span className="hidden xs:inline text-white/30">•</span>
                  <span className="text-emerald-400">Associate: <span className="text-white font-extrabold">Social Hub & E-Cafe Community</span></span>
                  <span className="hidden xs:inline text-white/30">•</span>
                  <span className="text-emerald-400">Venue Partner: <span className="text-white font-extrabold">Ofis Square</span></span>
                </div>

                {/* Event Title */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none mb-4 font-sora">
                  AI for Business
                </h1>

                {/* Event Subtitle */}
                <p className="text-lg sm:text-xl md:text-2xl font-light text-emerald-400 tracking-tight mb-8">
                  Meet Founders using AI for 10X Growth
                </p>

                {/* Date, Venue, Time Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
                  
                  <div className="flex items-center gap-3.5 px-5 py-4 rounded-2xl border border-white/10 bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-emerald-500/20 transition-all duration-300 text-left">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Date</p>
                      <p className="text-sm font-semibold text-white">22nd Aug 2026</p>
                      <p className="text-xs text-white">Saturday</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 px-5 py-4 rounded-2xl border border-white/10 bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-emerald-500/20 transition-all duration-300 text-left">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Venue</p>
                      <p className="text-sm font-semibold text-white truncate">Ofis Square, Noida</p>
                      <p className="text-xs text-white truncate">Sector 3, Noida</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 px-5 py-4 rounded-2xl border border-white/10 bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-emerald-500/20 transition-all duration-300 text-left">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Time</p>
                      <p className="text-sm font-semibold text-white">10:00 AM – 2:00 PM</p>
                      <p className="text-xs text-white">IST (Morning Session)</p>
                    </div>
                  </div>

                </div>

                {/* Highlights Section */}
                <div className="p-6 md:p-8 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-md text-left mb-10">
                  <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300 mb-6 flex items-center gap-2">
                    <span>Event Highlights</span>
                    <div className="h-px bg-white/10 flex-grow" />
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {highlights.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {highlightIcons[index]}
                        <span className="text-sm font-semibold text-white leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seats Left Progress Bar */}
                <div className="max-w-md mx-auto p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 backdrop-blur-md">
                  <div className="flex justify-between items-center mb-2.5 text-xs">
                    <span className="font-semibold text-emerald-300">Registration Status</span>
                    <span className="font-bold text-white uppercase tracking-wider">Only {seatsLeft} Seats Left!</span>
                  </div>
                  
                  {/* The bar */}
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: `${((70 - seatsLeft) / 70) * 100}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    />
                  </div>
                  <p className="text-[10px] text-white/80 text-left mt-2 font-medium uppercase tracking-wider">
                    {70 - seatsLeft} / 70 slots already reserved by elite founders
                  </p>
                </div>

              </div>

              {/* Form Card */}
              <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/80 hover:border-zinc-700/60 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 md:p-12 transition-colors duration-500 relative overflow-hidden">
                {/* Subtle internal glowing orb */}
                <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none z-0" />
                
                <div className="mb-10 text-left relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-emerald-400">Secure Your Access</span>
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-white font-sora">Founder Details</h2>
                  <p className="text-xs text-emerald-300 mt-1.5 max-w-md">
                    Please enter exact information to generate your WhatsApp entry pass correctly.
                  </p>
                  <div className="h-px w-full bg-gradient-to-r from-emerald-500/20 via-zinc-800 to-transparent mt-5" />
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-8 text-left">
                  
                  {/* Name */}
                  <div className="relative">
                    <label className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-2 block transition-colors duration-300 ${focused === 'name' ? 'text-emerald-400' : 'text-emerald-300'}`}>Name</label>
                    <div className={`relative flex items-center rounded-2xl border transition-all duration-300 px-4 py-3.5 bg-zinc-950/40 ${focused === 'name' ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.06)] bg-zinc-950/60' : 'border-zinc-800/80 hover:border-zinc-700/40'}`}>
                      <span className={`text-zinc-400 mr-3.5 shrink-0 transition-colors duration-300 ${focused === 'name' ? 'text-emerald-400' : ''}`}><User size={18} strokeWidth={1.5} /></span>
                      <input 
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused(null)}
                        type="text" 
                        className="w-full bg-transparent outline-none text-white text-base placeholder:text-zinc-500"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <label className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-2 block transition-colors duration-300 ${focused === 'email' ? 'text-emerald-400' : 'text-emerald-300'}`}>Email Address</label>
                    <div className={`relative flex items-center rounded-2xl border transition-all duration-300 px-4 py-3.5 bg-zinc-950/40 ${focused === 'email' ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.06)] bg-zinc-950/60' : 'border-zinc-800/80 hover:border-zinc-700/40'}`}>
                      <span className={`text-zinc-400 mr-3.5 shrink-0 transition-colors duration-300 ${focused === 'email' ? 'text-emerald-400' : ''}`}><Mail size={18} strokeWidth={1.5} /></span>
                      <input 
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                        type="email" 
                        className="w-full bg-transparent outline-none text-white text-base placeholder:text-zinc-500"
                        placeholder="name@company.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <label className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-2 block transition-colors duration-300 ${focused === 'phone' ? 'text-emerald-400' : 'text-emerald-300'}`}>Phone Number (WhatsApp)</label>
                    <div className="flex gap-3">
                      <div className="relative shrink-0 flex items-center rounded-2xl border border-zinc-800/80 bg-zinc-950/40 px-4 py-3.5 hover:border-zinc-700/40 transition-colors">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="bg-transparent outline-none text-white text-base font-semibold tracking-wider cursor-pointer"
                        >
                          {countryCodes.map((item) => (
                            <option key={item.code} value={item.code} className="bg-zinc-900 text-white">
                              {item.code}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={`relative flex-grow flex items-center rounded-2xl border transition-all duration-300 px-4 py-3.5 bg-zinc-950/40 ${focused === 'phone' ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.06)] bg-zinc-950/60' : 'border-zinc-800/80 hover:border-zinc-700/40'}`}>
                        <span className={`text-zinc-400 mr-3.5 shrink-0 transition-colors duration-300 ${focused === 'phone' ? 'text-emerald-400' : ''}`}><Phone size={18} strokeWidth={1.5} /></span>
                        <input 
                          required
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onFocus={() => setFocused('phone')}
                          onBlur={() => setFocused(null)}
                          type="tel" 
                          pattern="[0-9]*"
                          inputMode="numeric"
                          className="w-full bg-transparent outline-none text-white text-base placeholder:text-zinc-500"
                          placeholder="99999 99999"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company */}
                  <div className="relative">
                    <label className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-2 block transition-colors duration-300 ${focused === 'company' ? 'text-emerald-400' : 'text-emerald-300'}`}>Brand / Company Name</label>
                    <div className={`relative flex items-center rounded-2xl border transition-all duration-300 px-4 py-3.5 bg-zinc-950/40 ${focused === 'company' ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.06)] bg-zinc-950/60' : 'border-zinc-800/80 hover:border-zinc-700/40'}`}>
                      <span className={`text-zinc-400 mr-3.5 shrink-0 transition-colors duration-300 ${focused === 'company' ? 'text-emerald-400' : ''}`}><Building2 size={18} strokeWidth={1.5} /></span>
                      <input 
                        required
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        onFocus={() => setFocused('company')}
                        onBlur={() => setFocused(null)}
                        type="text" 
                        className="w-full bg-transparent outline-none text-white text-base placeholder:text-zinc-500"
                        placeholder="e.g. InnovatorsHub"
                      />
                    </div>
                  </div>

                  {/* Designation */}
                  <div className="relative">
                    <label className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-2 block transition-colors duration-300 ${focused === 'designation' ? 'text-emerald-400' : 'text-emerald-300'}`}>Designation</label>
                    <div className={`relative flex items-center rounded-2xl border transition-all duration-300 px-4 py-3.5 bg-zinc-950/40 ${focused === 'designation' ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.06)] bg-zinc-950/60' : 'border-zinc-800/80 hover:border-zinc-700/40'}`}>
                      <span className={`text-zinc-400 mr-3.5 shrink-0 transition-colors duration-300 ${focused === 'designation' ? 'text-emerald-400' : ''}`}><Briefcase size={18} strokeWidth={1.5} /></span>
                      <input 
                        required
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        onFocus={() => setFocused('designation')}
                        onBlur={() => setFocused(null)}
                        type="text" 
                        className="w-full bg-transparent outline-none text-white text-base placeholder:text-zinc-500"
                        placeholder="e.g. Founder, Growth Head"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="relative">
                    <label className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-2 block transition-colors duration-300 ${focused === 'city' ? 'text-emerald-400' : 'text-emerald-300'}`}>City</label>
                    <div className={`relative flex items-center rounded-2xl border transition-all duration-300 px-4 py-3.5 bg-zinc-950/40 ${focused === 'city' ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.06)] bg-zinc-950/60' : 'border-zinc-800/80 hover:border-zinc-700/40'}`}>
                      <span className={`text-zinc-400 mr-3.5 shrink-0 transition-colors duration-300 ${focused === 'city' ? 'text-emerald-400' : ''}`}><Map size={18} strokeWidth={1.5} /></span>
                      <input 
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        onFocus={() => setFocused('city')}
                        onBlur={() => setFocused(null)}
                        type="text" 
                        className="w-full bg-transparent outline-none text-white text-base placeholder:text-zinc-500"
                        placeholder="e.g. Noida"
                      />
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="flex items-start gap-3.5 pt-2">
                    <label className="relative flex items-center cursor-pointer mt-0.5 shrink-0">
                      <input 
                        type="checkbox"
                        name="whatsappConsent"
                        checked={formData.whatsappConsent}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 rounded border border-white/20 bg-zinc-950 flex items-center justify-center peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3px] opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </label>
                    <span className="text-xs text-white font-medium leading-normal select-none">
                      Send me event updates & my pass on WhatsApp. You can opt out anytime by replying STOP.
                    </span>
                  </div>

                  {/* Human verification */}
                  <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/10">
                    <label className="relative flex items-center cursor-pointer mt-0.5 shrink-0">
                      <input 
                        type="checkbox"
                        name="humanVerified"
                        checked={formData.humanVerified}
                        onChange={handleChange}
                        className="sr-only peer"
                        required
                      />
                      <div className="w-5 h-5 rounded border border-emerald-500/20 bg-zinc-950 flex items-center justify-center peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3px] opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </label>
                    <span className="text-xs text-emerald-200 leading-normal select-none font-bold">
                      Yes, I verify that I am an actual founder/executive attending in person.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex flex-col items-center gap-3 w-full">
                    <motion.button 
                      key="btn-submit"
                      type="submit"
                      disabled={isSubmitting || !formData.humanVerified}
                      whileHover={{ scale: formData.humanVerified ? 1.02 : 1 }}
                      whileTap={{ scale: formData.humanVerified ? 0.98 : 1 }}
                      className="w-full py-6 rounded-full font-bold uppercase tracking-[0.35em] text-[11px] flex items-center justify-center gap-3 transition-all bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 hover:from-emerald-400 hover:to-teal-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] disabled:bg-zinc-800 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {isSubmitting ? (
                        <>Reserving Your Slot <Loader2 size={18} className="animate-spin" /></>
                      ) : (
                        <>Click here to Register <ArrowRight size={16} strokeWidth={2.5} /></>
                      )}
                    </motion.button>
                    <span className="text-[10px] text-emerald-300 uppercase tracking-widest text-center mt-1 font-bold">
                      No payment yet — your seat is reserved on the next step
                    </span>
                  </div>

                </form>
              </div>
            </motion.div>
          )}

          {/* STEP 2: ₹899 PAYMENT CARD WITH QR & VALUE STACK */}
          {step === 'payment' && (
            <motion.div
              key="step-payment"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="max-w-[700px] mx-auto"
            >
              
              {/* Main Container */}
              <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/80 hover:border-zinc-700/60 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                
                {/* Back Link */}
                <button
                  onClick={() => setStep('form')}
                  className="absolute top-8 left-8 text-xs text-white hover:text-emerald-300 transition-colors flex items-center gap-1 font-bold uppercase tracking-wider"
                >
                  ← Edit Info
                </button>

                {/* Urgency countdown bar */}
                <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-red-950/20 border border-red-500/20 mb-8 max-w-sm mx-auto mt-4">
                  <Timer className="w-4 h-4 text-red-300 animate-pulse" />
                  <span className="text-[11px] font-bold text-red-300 uppercase tracking-wider">
                    Seat Locked For: {formatTime(timeLeft)} Min
                  </span>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-400 mb-2 block">AI for Business Leaders</span>
                  <h2 className="text-4xl font-bold tracking-tight text-white mb-2">Claim Founder's Pass</h2>
                  <p className="text-sm font-medium text-emerald-100 max-w-md mx-auto">
                    Hi <span className="font-semibold text-white">{registeredUser.name}</span>, complete your ₹899 payment to generate your official invite.
                  </p>
                </div>

                {/* Price Display */}
                <div className="flex items-center justify-center gap-4 py-4 border-y border-white/10 mb-8">
                  <div className="text-left">
                    <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest block">Original Price</span>
                    <span className="text-lg text-white/40 line-through">₹1,499</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/20" />
                  <div className="text-left">
                    <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-widest block">Founder's Special</span>
                    <span className="text-3xl font-extrabold text-white">₹899</span>
                  </div>
                  <div className="ml-2 px-3 py-1 rounded-full bg-emerald-500/20 text-[9px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-400/20">
                    Save 40%
                  </div>
                </div>

                {/* Value Stack List (Persuasive copywriting) */}
                <div className="space-y-4 mb-8 text-left bg-zinc-950/40 p-6 rounded-3xl border border-white/10">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-2">Everything included in your pass:</h4>

                  <div className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-white"><strong>Elite Founders Circle</strong>: Network with 70+ high-growth CEOs & MDs</span>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-white"><strong>Elite High Tea</strong>: Networking and refreshments at Ofis Square, Sector 3</span>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-emerald-200"><strong>Free AI Agent Toolkit Bonus</strong>: Pre-built templates, CRM automations, & prompts package (worth ₹25,000)</span>
                  </div>
                </div>

                {/* Payment Steps Section */}
                <div className="space-y-8">
                  
                  {/* Step 2.1: Payment Gateway Options */}
                  <div className="flex flex-col items-center gap-6 bg-zinc-950/80 p-8 rounded-3xl border border-white/10 relative">
                    
                    {/* Visual QR container */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-2xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />
                      <div className="w-[180px] h-[180px] bg-white p-3 rounded-2xl border border-white/10 shadow-xl relative z-10 flex items-center justify-center">
                        <img 
                          src={qrCodeUrl}
                          alt="Payment UPI QR Code" 
                          className="w-full h-full object-contain"
                          loading="eager"
                        />
                      </div>
                    </div>

                    <div className="text-center space-y-2">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-white">Scan QR Code using any UPI App</p>
                      <p className="text-xs text-emerald-300 font-semibold">(BHIM, GPay, Paytm, PhonePe, Cred)</p>
                      <p className="text-sm font-bold text-emerald-400 tracking-wider">UPI ID: sagafreelance@okaxis</p>
                      <p className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Verified Merchant Account: Sagar</p>
                    </div>

                    {/* Mobile Deep Link Payment Button */}
                    <div className="w-full sm:hidden border-t border-white/10 pt-4">
                      <motion.a
                        href={upiPaymentLink}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                      >
                        <Sparkles className="w-4 h-4" /> Tap to Pay via UPI Apps
                      </motion.a>
                      <p className="text-[9px] text-white/70 text-center mt-2 font-medium">
                        Opens GPay, PhonePe, Paytm, or BHIM instantly.
                      </p>
                    </div>

                  </div>

                  {/* Step 2.2: UPI Reference Number Input (Confirm payment) */}
                  <form onSubmit={handlePaymentVerify} className="space-y-6 text-left border-t border-white/10 pt-8">
                    
                    <div className="relative">
                      <label className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-2.5 block transition-colors duration-300 ${focused === 'txnId' ? 'text-emerald-400' : 'text-emerald-300'}`}>
                        Enter 12-Digit UPI Ref No. / UTR ID (After Payment)
                      </label>
                      <div className={`relative flex items-center rounded-2xl border transition-all duration-300 px-4 py-3.5 bg-zinc-950/40 ${focused === 'txnId' ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.06)] bg-zinc-950/60' : 'border-zinc-800/80 hover:border-zinc-700/40'}`}>
                        <span className={`text-zinc-400 mr-3.5 shrink-0 transition-colors duration-300 ${focused === 'txnId' ? 'text-emerald-400' : ''}`}><QrCode size={18} strokeWidth={1.5} /></span>
                        <input 
                          required
                          name="txnId"
                          value={txnId}
                          onChange={(e) => setTxnId(e.target.value.replace(/[^0-9]/g, ''))} // only numbers
                          onFocus={() => setFocused('txnId')}
                          onBlur={() => setFocused(null)}
                          type="text" 
                          maxLength={12}
                          pattern="[0-9]{12}"
                          className="w-full bg-transparent outline-none text-white text-base tracking-widest placeholder:text-zinc-400"
                          placeholder="e.g. 628945009124"
                        />
                      </div>
                      <p className="text-[10px] text-white/75 mt-2 font-medium">
                        *UTR number is listed in GPay, Paytm, or PhonePe transaction success screen.
                      </p>
                    </div>

                    {/* Verify Submit Button */}
                    <div className="pt-4">
                      <AnimatePresence mode="wait">
                        {submitStatus === 'success' ? (
                          <motion.div 
                            key="verify-success"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center gap-3 py-6 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] text-center"
                          >
                            <div className="flex items-center justify-center gap-2.5 text-emerald-400 font-bold uppercase tracking-[0.2em] text-[11px]">
                              <CheckCircle2 size={20} /> Payment Verified Successfully!
                            </div>
                            <p className="text-xs text-white mt-1">
                              Redirecting to WhatsApp to claim your verified VIP pass...
                            </p>
                          </motion.div>
                        ) : submitStatus === 'error' ? (
                          <motion.div 
                            key="verify-error"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center gap-3 py-6 px-4 bg-red-500/10 border border-red-500/20 rounded-[2rem] text-center w-full"
                          >
                            <div className="flex items-center justify-center gap-2.5 text-red-400 font-bold uppercase tracking-[0.2em] text-[11px]">
                              <AlertCircle size={20} /> Verification Submission Failed
                            </div>
                            <button 
                              type="button" 
                              onClick={() => setSubmitStatus('idle')}
                              className="text-xs underline text-white font-bold hover:text-red-300 transition-colors"
                            >
                              Try Again
                            </button>
                          </motion.div>
                        ) : (
                          <motion.button 
                            key="btn-verify"
                            type="submit"
                            disabled={isSubmitting || txnId.length < 12}
                            whileHover={{ scale: txnId.length === 12 ? 1.02 : 1 }}
                            whileTap={{ scale: txnId.length === 12 ? 0.98 : 1 }}
                            className="w-full py-6 rounded-full font-bold uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 transition-all bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 hover:from-emerald-400 hover:to-teal-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] disabled:bg-zinc-800 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                          >
                            {isSubmitting ? (
                              <>Verifying Transaction... <Loader2 size={18} className="animate-spin" /></>
                            ) : (
                              <>Payment Done - Confirm Registration <ArrowRight size={16} strokeWidth={2.5} /></>
                            )}
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>

                  </form>

                </div>

              </div>

            </motion.div>
          )}

          {/* STEP 3: FINAL COMPLETED PASS CONFIRMATION */}
          {step === 'completed' && (
            <motion.div
              key="step-completed"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-[600px] mx-auto text-center"
            >
              <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/80 hover:border-zinc-700/60 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center">
                
                {/* Green Glow Check Ring */}
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 relative">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-400 to-green-600 flex items-center justify-center text-white shadow-lg"
                  >
                    <Check size={26} strokeWidth={3} />
                  </motion.div>
                  <div className="absolute inset-0 rounded-full bg-emerald-500/5 blur-md animate-pulse" />
                </div>

                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-400 mb-2 block">Registration Verified</span>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Founder Pass Booked!</h2>
                
                <div className="space-y-4 max-w-sm text-center mb-8">
                  <p className="text-sm font-medium text-white">
                    Your payment of <span className="font-semibold text-emerald-400">₹899</span> has been logged under UTR ID: <span className="font-mono text-emerald-300 text-xs">{txnId}</span>.
                  </p>
                  <p className="text-xs text-white/95 leading-relaxed font-medium">
                    Sagar and the Innovators AI Hub team will check your Transaction UTR and deliver your verified PDF Pass on WhatsApp.
                  </p>
                </div>

                {/* Redirect Prompt Button */}
                <motion.a
                  href={`https://wa.me/919810875683?text=${encodeURIComponent(`Hi Sagar, my UTR is ${txnId}. Please share my pass details.`)}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-5 rounded-full bg-white text-black font-bold uppercase tracking-wider text-xs flex items-center gap-2 shadow-xl hover:bg-zinc-100 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300"
                >
                  Contact Sagar on WhatsApp <ArrowRight size={14} />
                </motion.a>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Dynamic FAQ / Help hint */}
        <div className="mt-12 text-center">
          <p className="text-xs text-white/80 flex items-center justify-center gap-2 font-medium">
            <HelpCircle size={14} className="text-emerald-400" /> Questions about payments? Reach us at <a href="mailto:Sagarmasand9@gmail.com" className="text-white hover:text-emerald-400 underline transition-colors font-bold">Sagarmasand9@gmail.com</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default EventRegistration;
