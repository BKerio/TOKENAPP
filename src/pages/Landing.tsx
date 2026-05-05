import React, { useState, useEffect } from 'react';
import {
  Zap,
  TrendingUp,
  MapPin,
  ArrowRight,
  Mail,
  Phone,
  Droplets,
  Shield,
  Wifi,
  ChevronDown,
  Search,
  Loader2,
  Quote,
  Copy,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import TokenPapLogo from '@/components/TokenPapLogo';
import { ThemeToggle } from '@/components/theme-toggle';

// Testimonial Assets
import PicKPA from "@/assets/testimonials/Picture1.png";
import PicRailways from "@/assets/testimonials/Picture12.png";
import PicCoop from "@/assets/testimonials/Picture3.png";
import PicKPLC from "@/assets/testimonials/Picture20.png";
import PicVilcom from "@/assets/testimonials/Picture11.png";
import PicDrone from "@/assets/testimonials/Picture5.png";
import PicSign from "@/assets/testimonials/signvrse.png";
import PicIndo from "@/assets/testimonials/Picture18.png";

// --- Types ---
interface Transaction {
  _id: string;
  created_at: string;
  amount: number;
  tokens: string[];
  status: string;
  description: string;
  meter?: {
    meter_number: string;
  };
}

// --- Components ---

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Products', href: 'products' },
    { label: 'How It Works', href: 'how-it-works' },
    { label: 'Success Stories', href: 'testimonials' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 py-3'
        : 'bg-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`transition-all duration-500 ${isScrolled ? 'h-8' : 'h-10'}`}>
              <TokenPapLogo className="h-full w-auto" />
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors tracking-tight"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 mr-2">
              <ThemeToggle />
              <Link
                to="/track-token"
                className="text-sm font-bold text-amber-600 dark:text-amber-500 hover:opacity-80 transition-opacity"
              >
                Track Token
              </Link>
            </div>

            <Link
              to="/login"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>

            <button
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`h-0.5 w-full bg-current transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`h-0.5 w-full bg-current transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`h-0.5 w-full bg-current transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 lg:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-lg font-bold text-slate-900 dark:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />
              <Link to="/track-token" className="text-lg font-bold text-amber-600">Track Token</Link>
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Transaction[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await api.get(`/tokens/search?q=${encodeURIComponent(query.trim())}`);
      setResults(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.status === 404 ? 'No tokens found.' : 'Search error.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">


      {/* Meshed Design Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50 dark:opacity-30">
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
            scale: [1, 1.2, 0.9, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-amber-500/20 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 120, 0],
            y: [0, 100, -80, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/15 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, 50, -100, 0],
            y: [0, 120, 50, 0],
            scale: [1, 1.1, 0.8, 1]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] rounded-full bg-rose-500/10 blur-[130px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-xs font-black uppercase tracking-[0.2em] mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Smart Utility Evolution
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-950 dark:text-white mb-8 tracking-tighter leading-[0.95]">
            Save More <span className="relative inline-block">
              <i className="font-serif italic font-light text-amber-600">Every Month</i>
              <svg className="absolute -bottom-2 left-0 w-full h-3 overflow-visible pointer-events-none" viewBox="0 0 200 20" fill="none">
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                  d="M5 15C35 12 65 18 95 15C125 12 155 18 195 13"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="text-amber-500/40 dark:text-amber-400/30"
                />
              </svg>
            </span> <br />
            With Smart Meters
          </h1>

          <p className="text-xl text-slate-700 dark:text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Revolutionize your utility management with TokenPap.
            Precision-engineered prepaid meters for water and electricity.
          </p>

          {/* Separated Search & History Controls */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="grid md:grid-cols-2 gap-6">

              {/* Card 1: Find Tokens by Meter */}
              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white dark:border-slate-800 shadow-2xl text-left"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-950 dark:text-white uppercase tracking-tight">Meter Search</h3>
                    <p className="text-xs text-slate-500">Find your latest 20-digit token</p>
                  </div>
                </div>
                <form onSubmit={handleSearch} className="flex flex-col gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Enter Meter Number..."
                      className="w-full bg-white/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 py-3 rounded-xl font-black transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : 'Fetch Token'}
                  </button>
                </form>
              </motion.div>

              {/* Card 2: Purchase History by Phone */}
              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-slate-800/50 shadow-2xl text-left"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-950 dark:text-white uppercase tracking-tight">Latest History</h3>
                    <p className="text-xs text-slate-500">View recent purchase trends</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Access your complete vending history and analytics in one tap.</p>
                  <Link
                    to="/track-token"
                    className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white py-3 rounded-xl font-black border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    Track All Tokens
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>

            </div>

            {/* Results Area (Shared or Specific) */}
            <AnimatePresence>
              {hasSearched && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-left overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
                    <button onClick={() => setHasSearched(false)} className="text-slate-400 hover:text-slate-600 transition-colors text-sm">Clear</button>
                  </div>

                  {results.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {results.slice(0, 4).map((tx) => (
                        <motion.div
                          key={tx._id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group overflow-hidden"
                        >
                          {/* Visual Accent */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                          
                          <div className="flex justify-between items-start mb-2 pl-2">
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Receipt</p>
                              <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">KES {tx.amount.toLocaleString()}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] font-bold text-slate-400 block">{new Date(tx.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                              <span className="text-[8px] font-medium text-slate-500 block uppercase">Meter: {tx.meter?.meter_number.slice(-4) || '...'}</span>
                            </div>
                          </div>

                          <div className="bg-amber-50 dark:bg-amber-500/5 rounded-lg p-2 mt-1 border border-amber-500/10 flex items-center justify-between group-hover:bg-amber-500/10 transition-colors">
                            <code className="font-mono text-[11px] font-black text-amber-700 dark:text-amber-500 tracking-wider">
                              {tx.tokens[0] ? tx.tokens[0].match(/.{1,4}/g)?.join('-') : 'VENDING...'}
                            </code>
                            <button 
                              onClick={() => {
                                if(tx.tokens[0]) navigator.clipboard.writeText(tx.tokens[0]);
                              }}
                              className="p-1.5 hover:bg-amber-500/20 rounded-md transition-colors"
                              title="Copy Token"
                            >
                              <Copy className="text-amber-600" size={12} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-slate-500">{error || 'No results found.'}</p>
                  )}
                  <Link
                    to="/track-token"
                    className="block text-center mt-6 text-sm font-bold text-amber-600 hover:underline"
                  >
                    View detailed history
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Floating Feature Icons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: <Zap className="text-amber-500" />, label: 'Prepaid Power' },
              { icon: <Droplets className="text-blue-500" />, label: 'Smart Water' },
              { icon: <Shield className="text-emerald-500" />, label: 'STS Secured' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-800/20"
              >
                <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
};

const StatsBar: React.FC = () => {
  const stats = [
    { value: '500+', label: 'Smart Meters Deployed' },
    { value: '120+', label: 'Enterprise Customers' },
    { value: '6+', label: 'Innovations Hub' },
    { value: '99.9%', label: 'Uptime Probability' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-12 relative z-20">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-2xl grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="text-center lg:border-r last:border-0 border-slate-100 dark:border-slate-800 px-4">
            <h3 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white mb-2">{stat.value}</h3>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Zap size={32} />,
      title: "Electrical Precision",
      description: "STS-compliant prepaid electricity meters with keypad token entry. Compatible with all private utility networks.",
      color: "bg-amber-500"
    },
    {
      icon: <Droplets size={32} />,
      title: "Smart Water Control",
      description: "Leak detection, remote valve control, and consumption analytics. The future of water management.",
      color: "bg-blue-500"
    },
    {
      icon: <Wifi size={32} />,
      title: "IoT Connectivity",
      description: "LoRa and NB-IoT connected meters for real-time monitoring and automatic remote reading.",
      color: "bg-emerald-500"
    }
  ];

  return (
    <section id="products" className="py-32 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-amber-600 font-black uppercase tracking-widest text-sm mb-4 block">Our Solutions</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white mb-8 leading-tight">
              Driving the Future of <br /> <span className="text-amber-600">Smart Energy</span>
            </h2>
            <div className="space-y-8">
              {features.map((feat, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className={`w-16 h-16 rounded-2xl ${feat.color} flex items-center justify-center text-white shadow-xl shadow-${feat.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
                    {feat.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">{feat.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">{feat.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-12 bg-slate-950 dark:bg-white dark:text-slate-950 text-white px-8 py-4 rounded-full font-black flex items-center gap-3 hover:opacity-90 transition-opacity">
              Explore All Products
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="relative">
            <div className="aspect-square bg-slate-100 dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-3xl">
              <img
                src="https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Smart Meter Technology"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            {/* Floating Overlay Card */}
            <div className="absolute -bottom-10 -left-10 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 max-w-xs">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Recovery Rate</p>
                  <p className="text-2xl font-black text-slate-950 dark:text-white">+42.5%</p>
                </div>
              </div>
              <p className="text-sm text-slate-500">Average revenue increase for properties switching to TokenPap Smart Meters.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Showcase: React.FC = () => {
  return (
    <section className="py-32 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-slate-950 rounded-[4rem] overflow-hidden relative min-h-[600px] flex items-center">
          <img
            src="https://images.pexels.com/photos/5999818/pexels-photo-5999818.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Sustainability"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative z-10 px-12 md:px-24 py-20 max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
              Where Utility Meets <br /> <span className="text-amber-500">Sustainable Style.</span>
            </h2>
            <p className="text-xl text-slate-300 mb-12">
              We don't just provide hardware. We provide a complete ecosystem
              for managing resources efficiently and elegantly.
            </p>
            <button className="bg-white text-slate-950 px-10 py-5 rounded-full font-black text-lg hover:scale-105 transition-transform">
              Request A Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials: React.FC = () => {
  const testimonialsData = [
    { name: "Kenya Ports Authority", role: "Public Infrastructure", quote: "Working with this team exceeded our expectations. Their innovative problem solving and deep expertise helped us modernize operations.", avatar: PicKPA },
    { name: "Kenya Railways", role: "Transport & Logistics", quote: "Their dedication to excellence shone through. Our IT infrastructure is now faster, more reliable, and future-ready.", avatar: PicRailways },
    { name: "Co-operative Bank", role: "Financial Services", quote: "Outstanding results under tight timelines. Their expert guidance transformed our digital banking platform.", avatar: PicCoop },
    { name: "Kenya Power", role: "Energy Utility", quote: "The impact on our billing and grid-management systems has been remarkable. A robust, scalable solution.", avatar: PicKPLC },
    { name: "Vilcom Networks", role: "Telecommunications", quote: "Intuitive dashboards and robust security features. The result is a more transparent, efficient service.", avatar: PicVilcom },
    { name: "Precision Drones", role: "Tech & IoT", quote: "Expertise in IoT and data analytics took our operations to the next level. Seamless collaboration throughout.", avatar: PicDrone },
    { name: "SignVrse", role: "Digital Signage", quote: "Professionalism and design sensibility impressed us. Powerful remote management and rich analytics.", avatar: PicSign },
    { name: "Indonesian Embassy", role: "Diplomatic Mission", quote: "Created a secure, multilingual portal. Handled sensitive data with the utmost professionalism.", avatar: PicIndo },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-32 bg-white dark:bg-slate-950 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-20 relative z-10">
        <span className="text-amber-600 font-black uppercase tracking-widest text-sm mb-4 block">Social Proof</span>
        <h2 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white">What Our <span className="text-amber-600">Clients</span> Say</h2>
      </div>

      <div className="relative h-[700px] flex items-center justify-center">
        {/* Rotating Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="relative w-[500px] h-[500px] flex items-center justify-center"
        >
          {/* Decorative Circles */}
          <div className="absolute inset-0 border-[1px] border-dashed border-slate-200 dark:border-slate-800 rounded-full" />
          <div className="absolute inset-20 border-[1px] border-dashed border-slate-200 dark:border-slate-800 rounded-full" />

          {testimonialsData.map((t, i) => {
            const angle = (i * 360) / testimonialsData.length;
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  transform: `rotate(${angle}deg) translate(250px) rotate(-${angle}deg)`
                }}
              >
                {/* Counter-rotating the internal content to stay upright */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                  className="relative group"
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  <div className={`w-16 h-16 rounded-full border-4 transition-all duration-500 overflow-hidden shadow-xl cursor-pointer ${activeIndex === i ? 'scale-125 border-amber-500 shadow-amber-500/20' : 'border-white dark:border-slate-800 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'}`}>
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>

        {/* Static Center Content */}
        <div className="absolute z-20 pointer-events-none flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-10 rounded-full shadow-3xl border border-amber-500/10 text-center max-w-[320px] aspect-square flex flex-col items-center justify-center"
            >
              <Quote className="text-amber-600 mb-4 opacity-50" size={32} />
              <p className="text-sm font-medium italic text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                "{testimonialsData[activeIndex].quote}"
              </p>
              <div>
                <p className="font-black text-xs text-slate-950 dark:text-white uppercase tracking-wider">{testimonialsData[activeIndex].name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{testimonialsData[activeIndex].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: "How long does it take to install a meter?", a: "Installation typically takes 1-2 hours per unit. For large complexes, we can deploy a team to complete dozens of units in a single day." },
    { q: "Can I use M-Pesa to buy tokens?", a: "Yes, TokenPap is natively integrated with M-Pesa. Tokens are sent via SMS immediately after payment." },
    { q: "What happens if a meter is tampered with?", a: "Our meters feature advanced tamper detection. Any unauthorized access will automatically disconnect the supply and alert the manager." },
    { q: "Are the meters STS compliant?", a: "Absolutely. All our electricity and water meters follow the Standard Transfer Specification for maximum security." },
  ];

  return (
    <section className="py-32 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h2 className="text-4xl font-black text-center mb-16 text-slate-950 dark:text-white">Frequently Asked <span className="text-amber-600">Questions</span></h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 text-left flex justify-between items-center group"
              >
                <span className="font-bold text-lg text-slate-950 dark:text-white group-hover:text-amber-600 transition-colors">{faq.q}</span>
                <div className={`transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}>
                  <ChevronDown size={20} className="text-slate-400" />
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800 mt-2">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 pt-32 pb-12 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-2">
            <div className="h-12 mb-8">
              <TokenPapLogo className="h-full w-auto brightness-0 invert" />
            </div>
            <p className="text-lg text-slate-400 mb-8 max-w-sm">
              Leading the smart utility revolution in East Africa.
              Efficiency, Transparency, Precision.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-slate-400 font-bold text-sm">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-500">
                  <Phone size={18} />
                </div>
                <span>+254 741 099 909</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 font-bold text-sm">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-500">
                  <Mail size={18} />
                </div>
                <span>info@tokenpap.com</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 font-bold text-sm">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-500">
                  <MapPin size={18} />
                </div>
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Quick Links</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><a href="products" className="hover:text-amber-500 transition-colors">Products</a></li>
              <li><a href="solutions" className="hover:text-amber-500 transition-colors">Solutions</a></li>
              <li><a href="how-it-works" className="hover:text-amber-500 transition-colors">How It Works</a></li>
              <li><Link to="/track-token" className="hover:text-amber-500 transition-colors">Track Token</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Support</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><Link to="/help" className="hover:text-amber-500 transition-colors">Help Center</Link></li>
              <li><Link to="/api-docs" className="hover:text-amber-500 transition-colors">API Docs</Link></li>
              <li><Link to="/terms" className="hover:text-amber-500 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-amber-500 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-900 flex flex-col md:row justify-between items-center gap-6">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">© {new Date().getFullYear()} TokenPap . All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/login" className="text-amber-500 font-black text-xs uppercase tracking-widest">Login</Link>
            <Link to="/register" className="text-white font-black text-xs uppercase tracking-widest">Register</Link>
          </div>
        </div>

        <div className="mt-20 text-center opacity-5 select-none pointer-events-none">
          <h1 className="text-[15vw] font-black leading-none">TOKENPAP</h1>
        </div>
      </div>
    </footer>
  );
};

const Landing: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen text-slate-950 dark:text-slate-200 font-sans selection:bg-amber-500/30 selection:text-slate-950">
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <Features />
        <Showcase />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
