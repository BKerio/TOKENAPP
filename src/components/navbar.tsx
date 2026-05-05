import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu, LogOut,
  User as UserIcon, ChevronDown,
  Search, Plus, Bell,
  Mail, Phone,
  X
} from "lucide-react";
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { getVendorLogoUrl } from "@/lib/utils";
import TokenPapLogo from "@/components/TokenPapLogo";
import KenyaFlag from "@/assets/kenya-flag.svg";

// Types
interface User {
  name: string;
  email: string;
  role?: string;
  roles?: string[];
}

interface VendorProfile {
  logo_url?: string | null;
  business_name?: string;
  dashboard_settings?: { show_logo_in_sidebar?: boolean; tagline?: string };
}

interface NavbarProps {
  user?: User | null;
  vendorProfile?: VendorProfile | null;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
  sidebarOpen?: boolean;
  onLogout?: () => void;
  hideTopBar?: boolean;
}

const Navbar = ({ user, vendorProfile, onToggleSidebar, showSidebarToggle = false, sidebarOpen, onLogout, hideTopBar = false }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin' || user?.roles?.includes('admin') || (!user?.role && user); // Fallback for admin if role missing but user exists



  const handleLogout = async () => {
    const isDarkMode = document.documentElement.classList.contains('dark');

    const result = await Swal.fire({
      title: 'Ready to leave?',
      text: 'You are about to sign out of the system.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: isDarkMode ? '#334155' : '#94a3b8',
      confirmButtonText: 'Sign Out',
      cancelButtonText: 'Stay',
      background: isDarkMode ? '#020617' : '#ffffff',
      color: isDarkMode ? '#f1f5f9' : '#1e293b',
      customClass: {
        popup: `rounded-3xl border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`,
        confirmButton: 'rounded-xl px-6',
        cancelButton: 'rounded-xl px-6'
      }
    });

    if (result.isConfirmed) {
      if (onLogout) onLogout();
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'Logged out successfully.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      setScrolled(currentScrollY > 10);

      // Auto-hide logic: scroll down hides, scroll up shows
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY + 15) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY - 10) {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const coverageBarHeight = hideTopBar ? 0 : 44;
  const navBarBaseHeight = scrolled ? 72 : 88;
  const totalHeaderHeight = coverageBarHeight + navBarBaseHeight;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
      >
        {/* TOP BAR / COVERAGE BAR */}
        {!hideTopBar && (
          <div
            className="w-full bg-white/80 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md"
            style={{ height: coverageBarHeight }}
          >
            <div className="max-w-7xl mx-auto h-full px-4 md:px-8 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <img src={KenyaFlag} alt="Kenya" className="w-5 h-5 rounded-full object-cover shadow-sm ring-1 ring-slate-200 dark:ring-slate-700" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Kenya</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4">
                  <Mail size={14} className="text-amber-500" />
                  <span className="text-[10px] font-bold text-slate-500 tracking-wide">info@tokenpap.com</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-slate-500">
                  <Phone size={14} className="text-amber-500" />
                  <span className="text-[10px] font-bold tracking-wide">+254 741 099 909</span>
                </div>
                <Link
                  to="/contact"
                  className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-wider transition-colors shadow-sm"
                >
                  Support
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* MAIN NAVIGATION BAR */}
        <motion.nav
          initial={false}
          animate={{ height: navBarBaseHeight }}
          className={`
            w-full border-b backdrop-blur-2xl transition-all duration-500
            ${scrolled
              ? "bg-white/95 dark:bg-slate-950/95 border-slate-200/60 dark:border-slate-800/60 shadow-xl"
              : "bg-white/60 dark:bg-slate-950/60 border-transparent"
            }
          `}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex justify-between items-center px-0">
            {/* Left Section */}
            <div className="flex items-center gap-6 h-full">
              {showSidebarToggle && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onToggleSidebar}
                  className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Menu className={`h-5 w-5 ${sidebarOpen ? 'rotate-90' : ''}`} />
                </motion.button>
              )}

              <Link to="/dashboard" className="h-full flex items-center group">
                {user?.role === 'vendor' && vendorProfile?.logo_url ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={getVendorLogoUrl(vendorProfile.logo_url) || ''}
                      alt="Logo"
                      className="h-8 w-auto rounded-lg shadow-sm"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        {vendorProfile.business_name}
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Dashboard</span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="transition-all duration-500"
                    style={{ height: scrolled ? '44px' : '52px' }}
                  >
                    <TokenPapLogo isScrolled={scrolled} className="h-full w-auto" />
                  </div>
                )}
              </Link>
            </div>

            {/* Middle Section (Desktop Dashboard Search) */}
            {isAdmin && !isMobile && (
              <div className="hidden lg:flex flex-1 max-w-md px-12">
                <div className="relative w-full group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Global system search..."
                    className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-transparent focus:bg-white dark:focus:bg-slate-800 rounded-2xl py-2 pl-10 pr-4 text-sm font-bold transition-all"
                  />
                </div>
              </div>
            )}

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {isAdmin && !isMobile && (
                <div className="flex items-center gap-1.5 mr-2">
                  <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"><Plus size={20} /></button>
                  <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all relative">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
                  </button>
                </div>
              )}

              <ThemeToggle />

              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2" />

              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 group p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
                  >
                    <div className="relative">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f59e0b&color=fff&bold=true`}
                        className="w-8 h-8 rounded-full shadow-sm ring-1 ring-slate-200 dark:ring-slate-800"
                        alt="avatar"
                      />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-950 rounded-full"></div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                      >
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">{user.role || 'Admin'}</p>
                        </div>
                        <div className="p-2">
                          <button onClick={() => window.location.href = '/dashboard/manage-account'} className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                            <UserIcon size={16} /> My Account
                          </button>
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
                            <LogOut size={16} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-5 py-2 rounded-full text-xs font-black uppercase shadow-lg">Login</Link>
              )}

              {/* Mobile Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 transition-all"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </motion.nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-xs bg-white dark:bg-slate-950 z-50 shadow-2xl md:hidden flex flex-col pt-24 px-6 gap-8"
            >
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Navigation</p>
                <div className="flex flex-col gap-4">
                  <Link to="/dashboard" className="text-xl font-black text-slate-900 dark:text-white" onClick={() => setIsOpen(false)}>Dashboard</Link>
                  <Link to="/contact" className="text-xl font-black text-slate-900 dark:text-white" onClick={() => setIsOpen(false)}>Support</Link>
                </div>
              </div>

              <div className="mt-auto mb-12 space-y-4">
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-red-500/20"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div style={{ height: totalHeaderHeight }} />
    </>
  );
};

export default Navbar;