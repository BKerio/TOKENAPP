import React, { useState, useEffect } from 'react';
import {
  Zap,
  TrendingUp,
  MapPin,
  ArrowRight,
  Mail,
  Phone,
  Droplets,
  Home,
  Building2,
  Factory,
  Shield,
  CreditCard,
  BarChart3,
  Wifi,
  Clock,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import TokenPapLogo from '@/components/TokenPapLogo';
import { ThemeToggle } from '@/components/theme-toggle';

// Clean, flat design - no gradients, no animations
const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const topBarHeight = 40;
  const navBarHeight = isScrolled ? 72 : 88;

  const navLinks = [
    { label: 'Products', href: '#products' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      {/* Top Contact Bar */}
      <div
        className="w-full bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-6 lg:px-8"
        style={{ height: topBarHeight }}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <MapPin size={14} className="text-amber-600" />
              <span className="uppercase tracking-wider">Nairobi, Kenya</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium border-l border-gray-200 dark:border-gray-800 pl-6">
              <Mail size={14} className="text-amber-600" />
              <span>info@tokenpap.com</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
            <Phone size={14} className="text-amber-600" />
            <span>+254 741 099 909</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className="w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800"
        style={{ height: navBarHeight }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div style={{ height: isScrolled ? '48px' : '56px' }}>
                <TokenPapLogo className="h-full w-auto" />
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-800" />

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <ChevronDown
                  size={20}
                  className={`text-gray-600 dark:text-gray-300 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 px-6 py-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors mt-2"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-32 pb-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column: Text Content */}
          <div className="flex flex-col text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 w-fit">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              STS-Compliant Prepaid Metering
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
              Smart Utility Management for <span className="text-amber-600">Modern Real Estate</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mb-10 leading-relaxed font-medium">
              TokenPap delivers end-to-end prepaid electricity, water, and gas metering solutions.
              From precision-engineered smart meters to cloud-based management platforms,
              we help property owners eliminate utility waste and maximize revenue recovery.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/login"
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-4 rounded-lg font-black text-lg transition-colors flex items-center gap-3"
              >
                Get Started
                <ArrowRight size={20} />
              </Link>
              <a
                href="#products"
                className="px-8 py-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-slate-700 dark:text-white hover:border-amber-500 dark:hover:border-amber-500 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors font-black text-lg"
              >
                Explore Solutions
              </a>
            </div>

            {/* Quick Stats Summary */}
            <div className="mt-12 flex items-center gap-8 border-t border-gray-200 dark:border-gray-800 pt-8">
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">500+</p>
                <p className="text-xs uppercase font-bold text-slate-500 tracking-widest mt-1">Smart Meters Deployed</p>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-gray-800" />
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">120+</p>
                <p className="text-xs uppercase font-bold text-slate-500 tracking-widest mt-1">Enterprise Customers</p>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-gray-800" />
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">99.9%</p>
                <p className="text-xs uppercase font-bold text-slate-500 tracking-widest mt-1">Uptime Guaranteed</p>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Product Visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative max-w-[400px] w-full">
              {/* Main meter image */}
              <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
                <img
                  src="/brain/1d02b2d3-7d2f-481d-bd8f-a1ab4953cd0c/tokenpap_mobile_app_mockup_1776674249658.png"
                  alt="TokenPap Mobile Dashboard"
                  className="w-full h-auto rounded-xl"
                />
              </div>

              {/* Floating status cards - static, no animation */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Zap className="text-green-600 dark:text-green-400 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Status</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">Meter Connected</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <TrendingUp className="text-amber-600 dark:text-amber-400 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recovery Rate</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">+42% Revenue</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const Products: React.FC = () => {
  const products = [
    {
      icon: <Zap size={24} />,
      title: "Prepaid Electricity Meters",
      description: "STS-compliant prepaid electricity meters with keypad token entry. Compatible with Kenya Power and private utility networks.",
      features: ["20-digit token entry", "Tamper detection", "Load management", "LCD display"]
    },
    {
      icon: <Droplets size={24} />,
      title: "Prepaid Water Meters",
      description: "Smart water metering with remote monitoring. Dallas key, smartcard, and keypad variants for all deployment scenarios.",
      features: ["Leak detection alerts", "Remote valve control", "Consumption analytics", "STS compliant"]
    },
    {
      icon: <Wifi size={24} />,
      title: "IoT Smart Meters",
      description: "LoRa and NB-IoT connected meters for real-time monitoring. Automatic reading and remote disconnection capabilities.",
      features: ["Real-time data", "Remote disconnect", "Low power design", "Cloud synced"]
    },
    {
      icon: <CreditCard size={24} />,
      title: "Vending Platform",
      description: "Cloud-based token vending system with M-Pesa integration. Manage sales, vendors, and customer accounts from one dashboard.",
      features: ["M-Pesa integration", "SMS token delivery", "Vendor management", "Real-time reporting"]
    }
  ];

  return (
    <section id="products" className="py-24 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            Our Products
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Explore TokenPap's full range of prepaid and smart metering solutions —
            designed for precision, built for scale, and ready for every utility application.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-amber-500 dark:hover:border-amber-500 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 group-hover:bg-amber-500 group-hover:text-white dark:group-hover:bg-amber-500 transition-colors">
                {product.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {product.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                {product.description}
              </p>
              <ul className="space-y-2">
                {product.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <CheckCircle2 size={14} className="text-amber-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Solutions: React.FC = () => {
  const solutions = [
    {
      icon: <Home size={32} />,
      title: "Residential",
      description: "Individual unit prepaid sub metering with M-Pesa token payments. Automated billing and leak detection for apartments and gated communities.",
      stats: "500+ Units Managed"
    },
    {
      icon: <Building2 size={32} />,
      title: "Commercial",
      description: "Multi-tariff sub meter management for shopping malls and office complexes. Common area cost allocation and peak load monitoring.",
      stats: "120+ Properties"
    },
    {
      icon: <Factory size={32} />,
      title: "Industrial",
      description: "3-phase prepaid sub meters with power factor monitoring. Demand side management and shift-based consumption analysis.",
      stats: "50+ Installations"
    }
  ];

  return (
    <section id="solutions" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            Solutions by Sector
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            TokenPap serves a wide spectrum of customers — from individual landlords to national utilities.
            Explore tailored prepaid and smart metering solutions built for your sector.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800"
            >
              <div className="w-16 h-16 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                {solution.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {solution.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                {solution.description}
              </p>
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm font-bold text-amber-600 uppercase tracking-wider">
                  {solution.stats}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Evaluate",
      description: "Free site analysis and consultation. We assess your property's utility infrastructure and recommend the optimal metering solution.",
      icon: <BarChart3 size={24} />
    },
    {
      number: "02",
      title: "Install",
      description: "Qualified technicians install STS-compliant meters with minimal disruption. Full testing and commissioning included.",
      icon: <Shield size={24} />
    },
    {
      number: "03",
      title: "Vend",
      description: "Tenants purchase prepaid tokens via M-Pesa, bank transfer, or authorized vendors. Instant SMS delivery of 20-digit tokens.",
      icon: <CreditCard size={24} />
    },
    {
      number: "04",
      title: "Monitor",
      description: "Track real-time consumption, revenue, and meter health from your cloud dashboard. Automated alerts for anomalies and leaks.",
      icon: <BarChart3 size={24} />
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From evaluation to ongoing monitoring, TokenPap provides a complete turnkey
            solution for prepaid utility management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl font-black text-gray-200 dark:text-gray-800">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <ArrowRight size={20} className="text-gray-300 dark:text-gray-700" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Shield size={24} />,
      title: "STS Compliant",
      description: "All meters conform to IEC 62055-41 Standard Transfer Specification for secure token encryption and interoperability."
    },
    {
      icon: <Clock size={24} />,
      title: "24/7 Monitoring",
      description: "Cloud-based platform provides round-the-clock monitoring of all connected meters with instant anomaly detection."
    },
    {
      icon: <CreditCard size={24} />,
      title: "M-Pesa Integration",
      description: "Native integration with Kenya's M-Pesa for seamless token purchases and automatic payment reconciliation."
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Revenue Analytics",
      description: "Comprehensive dashboards tracking revenue recovery, consumption patterns, and predictive maintenance alerts."
    },
    {
      icon: <Wifi size={24} />,
      title: "Remote Management",
      description: "LoRa and NB-IoT connectivity enables remote meter reading, tariff updates, and emergency disconnect from anywhere."
    },
    {
      icon: <Droplets size={24} />,
      title: "Leak Detection",
      description: "Smart algorithms detect unusual flow patterns and automatically alert property managers to potential leaks."
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            Why Choose TokenPap
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Built for the unique challenges of utility management in East Africa,
            our platform combines industrial-grade hardware with intelligent software.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex gap-4 p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-amber-500 dark:hover:border-amber-500 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA: React.FC = () => {
  return (
    <section className="py-24 bg-amber-500 dark:bg-amber-600">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
          Ready to Transform Your<br />Utility Infrastructure?
        </h2>
        <p className="text-slate-800 dark:text-slate-900 text-xl mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
          Join 120+ enterprises across East Africa already leveraging TokenPap's
          intelligent utility systems. Schedule a free site evaluation today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-black text-lg transition-colors">
            Schedule a Demo
          </button>
          <button className="px-8 py-4 rounded-lg border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors font-bold">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <Link to="/" className="block mb-6 h-12">
              <TokenPapLogo className="h-full w-auto" />
            </Link>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm mb-6 leading-relaxed font-medium">
              Pioneering prepaid and smart metering solutions across East Africa.
              Based in Nairobi's Silicon Savannah, serving the continent with
              cutting-edge utility technology and STS-compliant systems.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <MapPin size={16} className="text-amber-600" />
                <span>Nairobi, Kenya • Silicon Savannah</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <Mail size={16} className="text-amber-600" />
                <span>info@tokenpap.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <Phone size={16} className="text-amber-600" />
                <span>+254 741 099 909</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-4 uppercase tracking-widest text-xs">Products</h4>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 text-sm font-medium">
              <li><a href="#" className="hover:text-amber-600 transition-colors">Prepaid Electricity</a></li>
              <li><a href="#" className="hover:text-amber-600 transition-colors">Prepaid Water</a></li>
              <li><a href="#" className="hover:text-amber-600 transition-colors">IoT Smart Meters</a></li>
              <li><a href="#" className="hover:text-amber-600 transition-colors">Vending Platform</a></li>
              <li><a href="#" className="hover:text-amber-600 transition-colors">Mobile App</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-4 uppercase tracking-widest text-xs">Company</h4>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 text-sm font-medium">
              <li><a href="#" className="hover:text-amber-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-amber-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-amber-600 transition-colors">Partners</a></li>
              <li><a href="#" className="hover:text-amber-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-amber-600 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
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
const Landing: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-200 font-sans selection:bg-amber-500/30">
      <Navbar />
      <main>
        <Hero />
        <Products />
        <Solutions />
        <HowItWorks />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
