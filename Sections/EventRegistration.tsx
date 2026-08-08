import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle, ArrowRight, Award, Briefcase, Building2, Calendar, Check,
  CheckCircle2, ChevronRight, Clock, Coffee, Compass, HelpCircle, Loader2,
  Mail, Map, MapPin, Megaphone, Phone, QrCode, ShieldCheck, Sparkles,
  Timer, User, Users,
} from 'lucide-react';
import { trackEvent } from '../analytics';

interface EventRegistrationProps {
  isDarkMode: boolean;
}

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzNeX0d3ucPSeAydnFkTUkNejmTdzQc7A8ez6bcX-PYJpnaSfmWLu37x97SxosTx1y7TQ/exec';

const countryCodes = [
  { code: '+91', name: 'IN (+91)' }, { code: '+1', name: 'US/CA (+1)' },
  { code: '+44', name: 'UK (+44)' }, { code: '+971', name: 'UAE (+971)' },
  { code: '+65', name: 'SG (+65)' }, { code: '+61', name: 'AU (+61)' },
  { code: '+49', name: 'DE (+49)' },
];

const EventRegistration: React.FC<EventRegistrationProps> = ({ isDarkMode: _isDarkMode }) => {
  const [focused, setFocused] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [countryCode, setCountryCode] = useState('+91');
  const [seatsLeft, setSeatsLeft] = useState(12);
  const [step, setStep] = useState<'form' | 'payment' | 'completed'>('form');
  const [timeLeft, setTimeLeft] = useState(600);
  const [txnId, setTxnId] = useState('');
  const [registeredUser, setRegisteredUser] = useState({ name: '', email: '', phone: '', company: '', designation: '', city: '' });
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', designation: '', city: '', whatsappConsent: true, humanVerified: false,
  });

  const highlights = [
    'Meet 70+ TOP 1% Company MDs, CEOs, CMOs & Business Founders',
    'AI Agents Team Building Workshop',
    'Marketing Strategy: How to Scale your Business in 2026',
    'Founders Growth Roundtable',
    'Founders Elevator Pitch Opportunity',
    'High Tea & Elite Networking',
  ];
  const highlightIcons = [
    <Users className="w-5 h-5 text-emerald-400 shrink-0" />, <Compass className="w-5 h-5 text-emerald-400 shrink-0" />,
    <Megaphone className="w-5 h-5 text-emerald-400 shrink-0" />, <Award className="w-5 h-5 text-emerald-400 shrink-0" />,
    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />, <Coffee className="w-5 h-5 text-emerald-400 shrink-0" />,
  ];

  useEffect(() => {
    const interval = setInterval(() => setSeatsLeft(prev => prev <= 4 ? prev : Math.random() > 0.85 ? prev - 1 : prev), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (step !== 'payment' || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.humanVerified) {
      alert('Please confirm the human verification checkbox before registering.');
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');
    const fullPhoneNumber = `'${countryCode} ${formData.phone}`;
    const user = { name: formData.name, email: formData.email, phone: fullPhoneNumber, company: formData.company, designation: formData.designation, city: formData.city };
    setRegisteredUser(user);
    const payload = {
      fullName: formData.name, email: formData.email, contactNumber: fullPhoneNumber,
      subject: 'AI for Business (Form Submitted - Pending Payment)', location: formData.city,
      message: `Company: ${formData.company} | Designation: ${formData.designation} | Price: ₹899 | WhatsApp Updates: ${formData.whatsappConsent ? 'Yes' : 'No'}`,
    };
    try {
      trackEvent('event_registration_lead', { company: formData.company });
      await fetch(GOOGLE_SHEET_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      trackEvent('event_lead_success', { email: formData.email });
    } catch (error) {
      console.error('Lead submission error:', error);
    } finally {
      setIsSubmitting(false);
      setStep('payment');
      setTimeLeft(600);
    }
  };

  const upiId = 'sagafreelance@okaxis';
  const registeredName = 'Sagar';
  const amount = '899';
  const upiPaymentLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(registeredName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('AI for Business Event Pass')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiPaymentLink)}&color=09090b&bgcolor=ffffff`;

  const handlePaymentVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnId.trim() || txnId.length < 12) {
      alert('Please enter a valid 12-digit UPI Ref No. / Transaction ID.');
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');
    const payload = {
      fullName: registeredUser.name, email: registeredUser.email, contactNumber: registeredUser.phone,
      subject: 'AI for Business (PAYMENT VERIFICATION COMPLETED)', location: registeredUser.city,
      message: `Company: ${registeredUser.company} | Designation: ${registeredUser.designation} | UTR / Txn Ref ID: ${txnId} | Paid: ₹899`,
    };
    try {
      trackEvent('payment_verification_attempt', { txnId });
      await fetch(GOOGLE_SHEET_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setSubmitStatus('success');
      trackEvent('payment_verification_success', { email: registeredUser.email });
      setTimeout(() => {
        const text = encodeURIComponent(`Hi Sagar, I have successfully paid ₹899 for the "AI for Business" event. Please verify my payment and issue my pass.\n\nName: ${registeredUser.name}\nEmail: ${registeredUser.email}\nCompany: ${registeredUser.company}\nUTR / Ref ID: ${txnId}`);
        window.location.href = `https://wa.me/919810875683?text=${text}`;
        setStep('completed');
      }, 2500);
    } catch (error) {
      console.error('Payment confirmation log error:', error);
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  const inputClass = (name: string) => `relative flex items-center rounded-2xl border transition-all duration-300 px-4 py-3.5 bg-zinc-950/40 ${focused === name ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.06)] bg-zinc-950/60' : 'border-zinc-800/80 hover:border-zinc-700/40'}`;
  const labelClass = (name: string) => `text-[10px] font-bold uppercase tracking-[0.25em] mb-2 block transition-colors ${focused === name ? 'text-emerald-400' : 'text-emerald-300'}`;

  const TextField = ({ name, label, placeholder, type = 'text', icon }: { name: keyof typeof formData; label: string; placeholder: string; type?: string; icon: React.ReactNode }) => (
    <div className="relative">
      <label className={labelClass(name)}>{label}</label>
      <div className={inputClass(name)}>
        <span className={`mr-3.5 shrink-0 ${focused === name ? 'text-emerald-400' : 'text-zinc-400'}`}>{icon}</span>
        <input required name={name} value={String(formData[name])} onChange={handleChange} onFocus={() => setFocused(name)} onBlur={() => setFocused(null)} type={type} className="w-full bg-transparent outline-none text-white text-base placeholder:text-zinc-500" placeholder={placeholder} />
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 md:px-8 bg-zinc-950 overflow-hidden text-white font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-[800px] mx-auto">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div key="step-form" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4 }}>
              {/* 1. TITLE */}
              <div className="text-center mb-8">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none font-sora">AI for Business</h1>
              </div>

              {/* 2. FOUNDER DETAILS FORM */}
              <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/80 hover:border-zinc-700/60 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 md:p-12 transition-colors duration-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none z-0" />
                <div className="mb-10 text-left relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /><span className="text-[9px] font-bold tracking-[0.25em] uppercase text-emerald-400">Secure Your Access</span></div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-white font-sora">Founder Details</h2>
                  <p className="text-xs text-emerald-300 mt-1.5 max-w-md">Please enter exact information to generate your WhatsApp entry pass correctly.</p>
                  <div className="h-px w-full bg-gradient-to-r from-emerald-500/20 via-zinc-800 to-transparent mt-5" />
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-8 text-left">
                  <TextField 
