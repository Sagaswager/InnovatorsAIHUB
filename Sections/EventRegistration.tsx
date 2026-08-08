import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coffee,
  Compass,
  HelpCircle,
  Loader2,
  Mail,
  Map,
  MapPin,
  Megaphone,
  Phone,
  QrCode,
  ShieldCheck,
  Sparkles,
  Timer,
  User,
  Users,
} from 'lucide-react';
import { trackEvent } from '../analytics';

interface EventRegistrationProps {
  isDarkMode: boolean;
}

const GOOGLE_SHEET_URL =
  'https://script.google.com/macros/s/AKfycbzNeX0d3ucPSeAydnFkTUkNejmTdzQc7A8ez6bcX-PYJpnaSfmWLu37x97SxosTx1y7TQ/exec';

const countryCodes = [
  { code: '+91', name: 'IN (+91)' },
  { code: '+1', name: 'US/CA (+1)' },
  { code: '+44', name: 'UK (+44)' },
  { code: '+971', name: 'UAE (+971)' },
  { code: '+65', name: 'SG (+65)' },
  { code: '+61', name: 'AU (+61)' },
  { code: '+49', name: 'DE (+49)' },
];

const EventRegistration: React.FC<EventRegistrationProps> = () => {
  const [focused, setFocused] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const [countryCode, setCountryCode] = useState('+91');
  const [seatsLeft, setSeatsLeft] = useState(12);
  const [step, setStep] = useState<'form' | 'payment' | 'completed'>('form');
  const [timeLeft, setTimeLeft] = useState(600);
  const [txnId, setTxnId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    designation: '',
    city: '',
    whatsappConsent: true,
    humanVerified: false,
  });

  const [registeredUser, setRegisteredUser] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    designation: '',
    city: '',
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
    <Users className="w-5 h-5 text-emerald-400 shrink-0" />,
    <Compass className="w-5 h-5 text-emerald-400 shrink-0" />,
    <Megaphone className="w-5 h-5 text-emerald-400 shrink-0" />,
    <Award className="w-5 h-5 text-emerald-400 shrink-0" />,
    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />,
    <Coffee className="w-5 h-5 text-emerald-400 shrink-0" />,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSeatsLeft((previousSeats) => {
        if (previousSeats <= 4) return previousSeats;
        return Math.random() > 0.85 ? previousSeats - 1 : previousSeats;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (step !== 'payment' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => previousTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');

    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');

    return `${minutes}:${remainingSeconds}`;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.humanVerified) {
      alert('Please confirm the human verification checkbox before registering.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    const fullPhoneNumber = `'${countryCode} ${formData.phone}`;

    const userData = {
      name: formData.name,
      email: formData.email,
      phone: fullPhoneNumber,
      company: formData.company,
      designation: formData.designation,
      city: formData.city,
    };

    setRegisteredUser(userData);

    const payload = {
      fullName: formData.name,
      email: formData.email,
      contactNumber: fullPhoneNumber,
      subject: 'AI for Business (Form Submitted - Pending Payment)',
      location: formData.city,
      message: `Company: ${formData.company} | Designation: ${
        formData.designation
      } | Price: ₹899 | WhatsApp Updates: ${
        formData.whatsappConsent ? 'Yes' : 'No'
      }`,
    };

    try {
      trackEvent('event_registration_lead', {
        company: formData.company,
      });

      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      trackEvent('event_lead_success', {
        email: formData.email,
      });
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

  const upiPaymentLink =
    `upi://pay?pa=${upiId}` +
    `&pn=${encodeURIComponent(registeredName)}` +
    `&am=${amount}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent('AI for Business Event Pass')}`;

  const qrCodeUrl =
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250` +
    `&data=${encodeURIComponent(upiPaymentLink)}` +
    `&color=09090b&bgcolor=ffffff`;

  const handlePaymentVerify = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!txnId.trim() || txnId.length !== 12) {
      alert('Please enter a valid 12-digit UPI Ref No. / Transaction ID.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    const payload = {
      fullName: registeredUser.name,
      email: registeredUser.email,
      contactNumber: registeredUser.phone,
      subject: 'AI for Business (PAYMENT VERIFICATION COMPLETED)',
      location: registeredUser.city,
      message: `Company: ${registeredUser.company} | Designation: ${registeredUser.designation} | UTR / Txn Ref ID: ${txnId} | Paid: ₹899`,
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

      trackEvent('payment_verification_success', {
        email: registeredUser.email,
      });

      setTimeout(() => {
        const whatsappMessage = encodeURIComponent(
          `Hi Sagar, I have successfully paid ₹899 for the "AI for Business" event. Please verify my payment and issue my pass.\n\nName: ${registeredUser.name}\nEmail: ${registeredUser.email}\nCompany: ${registeredUser.company}\nUTR / Ref ID: ${txnId}`,
        );

        window.location.href = `https://wa.me/919810875683?text=${whatsappMessage}`;
        setStep('completed');
      }, 2500);
    } catch (error) {
      console.error('Payment confirmation error:', error);
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  const getInputStyle = (fieldName: string) =>
    `relative flex items-center rounded-2xl border transition-all duration-300 px-4 py-3.5 bg-zinc-950/40 ${
      focused === fieldName
        ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.06)] bg-zinc-950/60'
        : 'border-zinc-800/80 hover:border-zinc-700/40'
    }`;

  const getLabelStyle = (fieldName: string) =>
    `text-[10px] font-bold uppercase tracking-[0.25em] mb-2 block transition-colors duration-300 ${
      focused === fieldName ? 'text-emerald-400' : 'text-emerald-300'
    }`;

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 md:px-8 bg-zinc-950 overflow-hidden text-white font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-[800px] mx-auto">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div
              key="step-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* TITLE AT TOP */}
              <div className="text-center mb-8">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none font-sora">
                  AI for Business
                </h1>
              </div>

              {/* FOUNDER DETAILS FORM */}
              <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/80 hover:border-zinc-700/60 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 md:p-12 transition-colors duration-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none z-0" />

                <div className="mb-10 text-left relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-emerald-400">
                      Secure Your Access
                    </span>
                  </div>

                  <h2 className="text-3xl font-extrabold tracking-tight text-white font-sora">
                    Founder Details
                  </h2>

                  <p className="text-xs text-emerald-300 mt-1.5 max-w-md">
                    Please enter exact information to generate your WhatsApp
                    entry pass correctly.
                  </p>

                  <div className="h-px w-full bg-gradient-to-r from-emerald-500/20 via-zinc-800 to-transparent mt-5" />
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-8 text-left">
                  <div>
                    <label className={getLabelStyle('name')}>Name</label>
                    <div className={getInputStyle('name')}>
                      <User
                        size={18}
                        strokeWidth={1.5}
                        className={`mr-3.5 shrink-0 ${
                          focused === 'name'
                            ? 'text-emerald-400'
                            : 'text-zinc-400'
                        }`}
                      />
                      <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused(null)}
                        type="text"
                        placeholder="Your full name"
                        className="w-full bg-transparent outline-none text-white text-base placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={getLabelStyle('email')}>
                      Email Address
                    </label>
                    <div className={getInputStyle('email')}>
                      <Mail
                        size={18}
                        strokeWidth={1.5}
                        className={`mr-3.5 shrink-0 ${
                          focused === 'email'
                            ? 'text-emerald-400'
                            : 'text-zinc-400'
                        }`}
                      />
                      <input
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                        type="email"
                        placeholder="name@company.com"
                        className="w-full bg-transparent outline-none text-white text-base placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={getLabelStyle('phone')}>
                      Phone Number (WhatsApp)
                    </label>

                    <div className="flex gap-3">
                      <div className="shrink-0 flex items-center rounded-2xl border border-zinc-800/80 bg-zinc-950/40 px-4 py-3.5">
                        <select
                          value={countryCode}
                          onChange={(event) =>
                            setCountryCode(event.target.value)
                          }
                          className="bg-transparent outline-none text-white text-base font-semibold cursor-pointer"
                        >
                          {countryCodes.map((country) => (
                            <option
                              key={country.code}
                              value={country.code}
                              className="bg-zinc-900 text-white"
                            >
                              {country.code}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={`${getInputStyle('phone')} flex-grow`}>
                        <Phone
                          size={18}
                          strokeWidth={1.5}
                          className={`mr-3.5 shrink-0 ${
                            focused === 'phone'
                              ? 'text-emerald-400'
                              : 'text-zinc-400'
                          }`}
                        />
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
                          placeholder="99999 99999"
                          className="w-full bg-transparent outline-none text-white text-base placeholder:text-zinc-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={getLabelStyle('company')}>
                      Brand / Company Name
                    </label>
                    <div className={getInputStyle('company')}>
                      <Building2
                        size={18}
                        strokeWidth={1.5}
                        className={`mr-3.5 shrink-0 ${
                          focused === 'company'
                            ? 'text-emerald-400'
                            : 'text-zinc-400'
                        }`}
                      />
                      <input
                        required
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        onFocus={() => setFocused('company')}
                        onBlur={() => setFocused(null)}
                        type="text"
                        placeholder="e.g. InnovatorsHub"
                        className="w-full bg-transparent outline-none text-white text-base placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={getLabelStyle('designation')}>
                      Designation
                    </label>
                    <div className={getInputStyle('designation')}>
                      <Briefcase
                        size={18}
                        strokeWidth={1.5}
                        className={`mr-3.5 shrink-0 ${
                          focused === 'designation'
                            ? 'text-emerald-400'
                            : 'text-zinc-400'
                        }`}
                      />
                      <input
                        required
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        onFocus={() => setFocused('designation')}
                        onBlur={() => setFocused(null)}
                        type="text"
                        placeholder="e.g. Founder, Growth Head"
                        className="w-full bg-transparent outline-none text-white text-base placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={getLabelStyle('city')}>City</label>
                    <div className={getInputStyle('city')}>
                      <Map
                        size={18}
                        strokeWidth={1.5}
                        className={`mr-3.5 shrink-0 ${
                          focused === 'city'
                            ? 'text-emerald-400'
                            : 'text-zinc-400'
                        }`}
                      />
                      <input
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        onFocus={() => setFocused('city')}
                        onBlur={() => setFocused(null)}
                        type="text"
                        placeholder="e.g. Noida"
                        className="w-full bg-transparent outline-none text-white text-base placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-2">
                    <label className="relative flex items-center cursor-pointer mt-0.5 shrink-0">
                      <input
                        type="checkbox"
                        name="whatsappConsent"
                        checked={formData.whatsappConsent}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 rounded border border-white/20 bg-zinc-950 flex items-center justify-center peer-checked:bg-emerald-500 peer-checked:border-emerald-500">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3px] opacity-0 peer-checked:opacity-100" />
                      </div>
                    </label>

                    <span className="text-xs text-white font-medium leading-normal">
                      Send me event updates and my pass on WhatsApp. You can
                      opt out anytime by replying STOP.
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/10">
                    <label className="relative flex items-center cursor-pointer mt-0.5 shrink-0">
                      <input
                        required
                        type="checkbox"
                        name="humanVerified"
                        checked={formData.humanVerified}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 rounded border border-emerald-500/20 bg-zinc-950 flex items-center justify-center peer-checked:bg-emerald-500 peer-checked:border-emerald-500">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3px] opacity-0 peer-checked:opacity-100" />
                      </div>
                    </label>

                    <span className="text-xs text-emerald-200 leading-normal font-bold">
                      Yes, I verify that I am an actual founder/executive
                      attending in person.
                    </span>
                  </div>

                  <div className="pt-4 flex flex-col items-center gap-3">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || !formData.humanVerified}
                      whileHover={{
                        scale: formData.humanVerified ? 1.02 : 1,
                      }}
                      whileTap={{
                        scale: formData.humanVerified ? 0.98 : 1,
                      }}
                      className="w-full py-6 rounded-full font-bold uppercase tracking-[0.35em] text-[11px] flex items-center justify-center gap-3 transition-all bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          Reserving Your Slot
                          <Loader2 size={18} className="animate-spin" />
                        </>
                      ) : (
                        <>
                          Click here to Register
                          <ArrowRight size={16} strokeWidth={2.5} />
                        </>
                      )}
                    </motion.button>

                    <span className="text-[10px] text-emerald-300 uppercase tracking-widest text-center font-bold">
                      No payment yet — your seat is reserved on the next step
                    </span>
                  </div>
                </form>
              </div>

              {/* ALL OTHER EVENT DETAILS BELOW FORM */}
              <div className="mt-12 text-center">
                <div className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6 py-2.5 rounded-full border border-white/20 bg-zinc-900/60 backdrop-blur-md text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-8 shadow-lg">
                  <span className="text-emerald-400">
                    Organised By:{' '}
                    <span className="text-white font-extrabold">
                      Innovatorsaihub
                    </span>
                  </span>

                  <span className="hidden xs:inline text-white/30">•</span>

                  <span className="text-emerald-400">
                    Associate:{' '}
                    <span className="text-white font-extrabold">
                      Social Hub & E-Cafe Community
                    </span>
                  </span>

                  <span className="hidden xs:inline text-white/30">•</span>

                  <span className="text-emerald-400">
                    Venue Partner:{' '}
                    <span className="text-white font-extrabold">
                      Ofis Square
                    </span>
                  </span>
                </div>

                <p className="text-lg sm:text-xl md:text-2xl font-light text-emerald-400 tracking-tight mb-8">
                  Meet Founders using AI for 10X Growth
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
                  <div className="flex items-center gap-3.5 px-5 py-4 rounded-2xl border border-white/10 bg-zinc-900/40 text-left">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                        Date
                      </p>
                      <p className="text-sm font-semibold text-white">
                        22nd Aug 2026
                      </p>
                      <p className="text-xs text-white">Saturday</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 px-5 py-4 rounded-2xl border border-white/10 bg-zinc-900/40 text-left">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                        Venue
                      </p>
                      <p className="text-sm font-semibold text-white">
                        Ofis Square, Noida
                      </p>
                      <p className="text-xs text-white">Sector
