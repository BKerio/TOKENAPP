import React, { useState, useEffect } from 'react';
import {
  Zap,
  Droplets,
  Activity,
  Shield,
  Smartphone,
  TrendingUp,
  MapPin,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Play,
  Mail,
  Phone,
  ArrowUpRightFromCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TokenPapLogo from '@/components/TokenPapLogo';
import { ThemeToggle } from '@/components/theme-toggle';


// Components
const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const topBarHeight = 40;
  const navBarHeight = isScrolled ? 72 : 88;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Contact Bar */}
      <div
        className="w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center h-10 px-6 lg:px-8"
        style={{ height: topBarHeight }}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">
              <MapPin size={14} className="text-amber-500" />
              <span className="uppercase tracking-wider">Nairobi, Kenya</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 font-medium border-l border-gray-100 dark:border-gray-800 pl-6">
              <Mail size={14} className="text-amber-500" />
              <span>info@tokenpap.com</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 font-medium">
            <Phone size={14} className="text-amber-500" />
            <span>+254 741 099 909</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`w-full transition-all duration-500 border-b ${
          isScrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border-gray-100 dark:border-gray-800' 
            : 'bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm border-transparent'
        }`}
        style={{ height: navBarHeight }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div
                className="transition-all duration-500"
                style={{ height: isScrolled ? '48px' : '56px' }}
              >
                <TokenPapLogo className="h-full w-auto" />
              </div>
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4 lg:gap-6">
              <ThemeToggle />
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-800" />
              <Link
                to="/login"
                className="group relative inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20"
              >
                Get Started
                <ArrowUpRightFromCircle size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-24 pb-20 overflow-hidden bg-white dark:bg-slate-950">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Main Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-8 w-fit"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Next-Gen Utility Management
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
              AI-Powered Utility and Vending <span className="text-blue-600 dark:text-blue-400">Platform for Real Estate</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl mb-12 leading-relaxed font-bold">
              TokenPap is an innovative smart metering platform designed for property owners and tenants, 
              featuring AI-powered tools to accelerate your utility management journey.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link 
                to="/login"
                className="group relative bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-black text-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-xl shadow-blue-600/20"
              >
                Get Started
                <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
              </Link>
              <button 
                className="px-8 py-4 rounded-full border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white hover:border-blue-600/30 dark:hover:border-blue-400/30 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-black text-lg active:scale-95"
              >
                Explore Solutions
              </button>
            </div>

            {/* Quick Stats Summary */}
            <div className="mt-16 flex items-center gap-8 border-t border-slate-100 dark:border-slate-900 pt-10">
               <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">500+</p>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Active Meters</p>
               </div>
               <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
               <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">120+</p>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Companies</p>
               </div>
               <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
               <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">99.9%</p>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Uptime Rate</p>
               </div>
            </div>
          </motion.div>

          {/* Right Column: Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Visual Backdrops */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-20 max-w-[320px] md:max-w-[380px]">
              <div className="relative group perspective-1000">
                <motion.div
                   animate={{ y: [0, -10, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   className="relative z-10"
                >
                  <img 
                    src="/brain/1d02b2d3-7d2f-481d-bd8f-a1ab4953cd0c/tokenpap_mobile_app_mockup_1776674249658.png"
                    alt="TokenPap App Dashboard"
                    className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_35px_35px_rgba(0,0,0,0.4)] transform-gpu hover:scale-[1.02] transition-transform duration-500"
                  />
                </motion.div>
                
                {/* Floating Elements (Decorative) */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -top-6 -right-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 z-30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                      <Zap className="text-green-600 dark:text-green-400 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Status</p>
                      <p className="text-xs font-black text-slate-900 dark:text-white">Meter #4490 Connected</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 z-30"
                >
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                        <TrendingUp className="text-amber-600 dark:text-amber-400 w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efficiency</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white">+42% Revenue Recovery</p>
                     </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Prepaid Electricity",
      description: "Advanced STS-compliant meters with seamless token generation and instant top-up capabilities."
    },
    {
      icon: <Droplets className="w-6 h-6" />,
      title: "Smart Water metering",
      description: "Precision ultrasonic flow sensors with leak detection and consumption analytics."
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Real-time Analytics",
      description: "AI-driven consumption patterns and predictive maintenance alerts via cloud dashboard."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Tamper Detection",
      description: "Industrial-grade security with magnetic field detection and remote disconnect capabilities."
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile Management",
      description: "Native iOS and Android apps for tenants and property managers on the go."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Revenue Recovery",
      description: "Eliminate non-technical losses and improve collection rates by up to 40%."
    }
  ];

  return (
    <section id="products" className="py-32 bg-slate-50 dark:bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
            End-to-End <span className="text-amber-500">Utility Solutions</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            From precision-engineered hardware to cloud-based management platforms,
            we provide complete infrastructure for the modern utility ecosystem.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="group p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/30 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};



const CTA: React.FC = () => {
  return (
    <section className="py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-blue-500/10 dark:from-amber-600/20 dark:to-blue-600/20" />
      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
            Ready to Transform Your<br />
            <span className="text-amber-500">Utility Infrastructure?</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Join 120+ enterprises across East Africa already leveraging TokenPap's
            intelligent utility systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-4 rounded-full font-black text-lg transition-all hover:scale-105 shadow-xl shadow-amber-500/30">
              Schedule a Demo
            </button>
            <button className="px-8 py-4 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white hover:bg-white dark:hover:bg-slate-900 transition-all font-bold shadow-sm">
              Contact Sales
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <Link to="/" className="block mb-6 h-12">
              <TokenPapLogo className="h-full w-auto" />
            </Link>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm mb-6 leading-relaxed font-medium">
              Pioneering prepaid and smart metering solutions across East Africa.
              Based in Nairobi, serving the continent with cutting-edge utility technology.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <MapPin size={16} className="text-amber-500" />
                <span>Nairobi, Kenya • Silicon Savannah</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <Mail size={16} className="text-amber-500" />
                <span>info@tokenpap.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-4 uppercase tracking-widest text-[11px]">Products</h4>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 text-sm font-medium">
              <li><a href="#" className="hover:text-amber-500 transition-colors">Smart Meters</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Water Sensors</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Cloud Platform</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Mobile Apps</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-4 uppercase tracking-widest text-[11px]">Company</h4>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 text-sm font-medium">
              <li><a href="#" className="hover:text-amber-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Partners</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} TokenPap Technologies. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-amber-600 transition-colors text-xs font-semibold uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-amber-600 transition-colors text-xs font-semibold uppercase tracking-widest">Terms</a>
            <a href="#" className="text-slate-400 hover:text-amber-600 transition-colors text-xs font-semibold uppercase tracking-widest">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
const TokenPapLanding: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-200 font-sans selection:bg-amber-500/30 transition-colors duration-500">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default TokenPapLanding;