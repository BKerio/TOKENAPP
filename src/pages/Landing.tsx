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
  Quote
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import TokenPapLogo from '@/components/TokenPapLogo';
import { ThemeToggle } from '@/components/theme-toggle';

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
    { label: 'Products', href: '#products' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
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
            Save More <i className="font-serif italic font-light text-amber-600">Every Month</i> <br />
            With Smart Meters
          </h1>

          <p className="text-xl text-slate-700 dark:text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Revolutionize your utility management with TokenPap.
            Precision-engineered prepaid meters for water and electricity.
          </p>

          {/* Integrated Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <form
              onSubmit={handleSearch}
              className="relative group p-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl flex flex-col md:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter Meter or Phone Number..."
                  className="w-full bg-transparent pl-12 pr-4 py-4 rounded-xl text-slate-950 dark:text-white focus:outline-none text-lg font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-8 py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Find Tokens'}
              </button>
            </form>

            {/* Quick Search Results Dropdown */}
            <AnimatePresence>
              {hasSearched && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-6 right-6 md:left-auto md:right-auto md:w-[672px] mt-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-left max-h-[400px] overflow-y-auto z-50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white">Search Results</h3>
                    <button onClick={() => setHasSearched(false)} className="text-slate-400 hover:text-slate-600 transition-colors text-sm">Close</button>
                  </div>

                  {results.length > 0 ? (
                    <div className="space-y-4">
                      {results.map((tx) => (
                        <div key={tx._id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-black text-amber-600 uppercase tracking-widest">Amount Paid</span>
                            <span className="text-xs text-slate-400">{new Date(tx.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between items-end">
                            <p className="text-xl font-black text-slate-900 dark:text-white">KES {tx.amount.toLocaleString()}</p>
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-slate-400 uppercase font-bold">Token</span>
                              <p className="font-mono font-bold text-amber-600">{tx.tokens[0] || 'Pending'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-slate-500">{error || 'No tokens found for this number.'}</p>
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
    { value: '12+', label: 'Years Experience' },
    { value: '17K+', label: 'Meters Installed' },
    { value: '200M', label: 'Liters Water Saved' },
    { value: '94%', label: 'Revenue Recovery' },
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
  const testimonials = [
    { name: "John Doe", role: "Property Manager", quote: "TokenPap has completely automated our billing process.", avatar: "https://i.pravatar.cc/150?u=1" },
    { name: "Jane Smith", role: "Landlord", quote: "The best ROI we've seen in years.", avatar: "https://i.pravatar.cc/150?u=2" },
    { name: "Alex Ke", role: "Utility Director", quote: "Reliable, secure, and incredibly easy to use.", avatar: "https://i.pravatar.cc/150?u=3" },
    { name: "Sarah M.", role: "Estate Agent", quote: "Tenants love the transparency of the app.", avatar: "https://i.pravatar.cc/150?u=4" },
    { name: "Mike R.", role: "Tech Lead", quote: "The API integration is seamless and powerful.", avatar: "https://i.pravatar.cc/150?u=5" },
  ];

  return (
    <section className="py-32 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white">What Our <span className="text-amber-600">Clients</span> Say</h2>
      </div>

      <div className="relative h-[600px] flex items-center justify-center">
        {/* Radial Layout Mockup */}
        <div className="relative w-[500px] h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 border-[1px] border-dashed border-slate-200 dark:border-slate-800 rounded-full" />
          <div className="absolute inset-20 border-[1px] border-dashed border-slate-200 dark:border-slate-800 rounded-full" />

          <div className="z-20 bg-white dark:bg-slate-900 p-10 rounded-full shadow-2xl border border-amber-500/20 text-center max-w-[300px]">
            <Quote className="text-amber-600 mx-auto mb-4" size={32} />
            <p className="text-sm font-medium italic text-slate-600 dark:text-slate-300">
              "TokenPap has transformed how we manage utilities across our portfolio of 500+ units."
            </p>
          </div>

          {testimonials.map((t, i) => {
            const angle = (i * 360) / testimonials.length;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.2 }}
                className="absolute"
                style={{
                  transform: `rotate(${angle}deg) translate(250px) rotate(-${angle}deg)`
                }}
              >
                <div className="relative group">
                  <div className="w-16 h-16 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden shadow-xl group-hover:scale-125 transition-transform cursor-pointer">
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none min-w-[150px]">
                    <p className="font-bold text-xs text-slate-950 dark:text-white">{t.name}</p>
                    <p className="text-[10px] text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
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
            <div className="flex gap-4">
              {[Phone, Mail, MapPin].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer">
                  <Icon size={18} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Quick Links</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><a href="#products" className="hover:text-amber-500 transition-colors">Products</a></li>
              <li><a href="#solutions" className="hover:text-amber-500 transition-colors">Solutions</a></li>
              <li><a href="#how-it-works" className="hover:text-amber-500 transition-colors">How It Works</a></li>
              <li><Link to="/track-token" className="hover:text-amber-500 transition-colors">Track Token</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Support</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><a href="#" className="hover:text-amber-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-900 flex flex-col md:row justify-between items-center gap-6">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">© {new Date().getFullYear()} TokenPap Technologies. All rights reserved.</p>
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
