import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Droplets, 
  Activity, 
  Shield, 
  Smartphone, 
  TrendingUp, 
  Users, 
  MapPin, 
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface StatProps {
  value: string;
  label: string;
  suffix?: string;
}

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Components
const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Products', href: '#products' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
              <span className="text-slate-900 font-bold text-lg">T</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Token<span className="text-amber-400">Pap</span>
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-300 hover:text-amber-400 transition-colors text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
            <button className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-2.5 rounded-full font-semibold transition-all hover:scale-105">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800"
          >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-slate-300 hover:text-amber-400 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-slate-950 to-slate-950" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Now serving 120+ enterprise customers across East Africa
          </span>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-tight">
            Smart Metering for<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Modern Africa
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Eliminate utility waste and maximize revenue recovery with our 
            AI-driven prepaid metering solutions. Built for the Silicon Savannah.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="group bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 flex items-center gap-2">
              Explore Solutions
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button className="group flex items-center gap-3 px-8 py-4 rounded-full border border-slate-700 text-white hover:border-amber-500/50 hover:bg-slate-900/50 transition-all">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                <Play size={18} className="ml-1" />
              </div>
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {[
            { value: '500', suffix: '+', label: 'Smart Meters Deployed' },
            { value: '120', suffix: '+', label: 'Enterprise Customers' },
            { value: '6', suffix: '+', label: 'Innovation Hubs' },
            { value: '99.9', suffix: '%', label: 'Uptime Guaranteed' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {stat.value}<span className="text-amber-400">{stat.suffix}</span>
              </div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500"
      >
        <div className="w-6 h-10 rounded-full border-2 border-slate-700 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-amber-400 rounded-full" />
        </div>
      </motion.div>
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
    <section id="products" className="py-32 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            End-to-End <span className="text-amber-400">Utility Solutions</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
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
              className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-slate-900 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Solutions: React.FC = () => {
  const solutions = [
    {
      title: "Property Managers",
      description: "Automated billing, tenant management, and real-time monitoring for residential and commercial portfolios.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop"
    },
    {
      title: "Utility Companies",
      description: "Enterprise-grade AMI infrastructure with head-end system integration and revenue protection.",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Industrial Facilities",
      description: "High-precision monitoring for manufacturing plants with demand response and power quality analysis.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section id="solutions" className="py-32 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Tailored for <span className="text-amber-400">Your Sector</span>
          </h2>
        </motion.div>

        <div className="space-y-24">
          {solutions.map((solution, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
            >
              <div className="lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent z-10" />
                  <img 
                    src={solution.image} 
                    alt={solution.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="lg:w-1/2 space-y-6">
                <h3 className="text-3xl font-bold text-white">{solution.title}</h3>
                <p className="text-slate-400 text-lg leading-relaxed">{solution.description}</p>
                <ul className="space-y-3">
                  {['Real-time monitoring', 'Automated reporting', '24/7 support', 'API integration'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle2 className="text-amber-400" size={20} />
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="text-amber-400 font-semibold flex items-center gap-2 hover:gap-4 transition-all">
                  Learn more <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA: React.FC = () => {
  return (
    <section className="py-32 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-blue-600/20" />
      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Transform Your<br />
            <span className="text-amber-400">Utility Infrastructure?</span>
          </h2>
          <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto">
            Join 120+ enterprises across East Africa already leveraging TokenPap's 
            intelligent utility systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105">
              Schedule a Demo
            </button>
            <button className="px-8 py-4 rounded-full border border-slate-700 text-white hover:bg-slate-800 transition-all">
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
    <footer className="bg-slate-950 border-t border-slate-900 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                <span className="text-slate-900 font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-white">
                Token<span className="text-amber-400">Pap</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm mb-6">
              Pioneering prepaid and smart metering solutions across East Africa. 
              Based in Nairobi, serving the continent.
            </p>
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin size={16} />
              <span className="text-sm">Nairobi, Kenya • Silicon Savannah</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Products</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Smart Meters</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Water Sensors</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Cloud Platform</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Mobile Apps</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Partners</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm">
            © 2024 TokenPap Technologies. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors text-sm">Privacy</a>
            <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors text-sm">Terms</a>
            <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors text-sm">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
const TokenPapLanding: React.FC = () => {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-amber-500/30">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Solutions />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default TokenPapLanding;