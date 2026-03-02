import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import Logo from "@/assets/icon.png";
import React from "react";

type LoginMode = "email" | "kanisa";

interface ModeOption {
  value: LoginMode;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const modeOptions: ModeOption[] = [
  {
    value: "email",
    label: "Email Address",
    description: "Login with your registered email",
    icon: <Mail className="w-5 h-5" />,
  },
  {
    value: "kanisa",
    label: "Account ID",
    description: "Login with your unique account number",
    icon: <User className="w-5 h-5" />,
  },
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<LoginMode>("email");
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleModeSelect = useCallback((selectedMode: LoginMode) => {
    setMode(selectedMode);
    setIdentifier("");
    setPassword("");
    setShowModeSelector(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      const msg = "Please enter both credentials";
      setError(msg);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/admin/login", {
        identifier,
        password,
      });

      if (response.data.status === 200 && response.data.token) {
        Swal.fire({
          icon: 'success',
          title: 'Login successful!',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        login(response.data.user, response.data.token);

        if (response.data.user.role === 'vendor') {
          if (response.data.user.vendor_type === 'Company') {
            navigate("/dashboard/company");
          } else if (response.data.user.vendor_type === 'Individual') {
            navigate("/dashboard/individual");
          } else {
            navigate("/dashboard");
          }
        } else {
          navigate("/dashboard");
        }

      } else {
        const msg = response.data.message || "Authentication failed";
        setError(msg);
        Swal.fire({
          icon: 'error',
          title: 'Authentication Failed',
          text: msg,
        });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "An error occurred during login";
      setError(msg);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentMode = modeOptions.find((m) => m.value === mode) || modeOptions[0];

  return (
    <div className="min-h-screen bg-[#E8F4FD] dark:bg-slate-950 p-4 font-sans relative overflow-y-auto">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] dark:bg-blue-600/5" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-600/5" />
      </div>

      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="w-full max-w-[380px] relative my-auto">
          {/* Main Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 md:p-8 border border-white/20 dark:border-slate-800">
            {/* Logo Section - ORIGINAL RESTORED */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 shadow-inner flex items-center justify-center mb-4 overflow-hidden border border-slate-100 dark:border-slate-700">
                  <img src={Logo} alt="Logo" className="w-12 h-auto object-contain" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-[#2E3A59] dark:text-white text-center tracking-tight">
                Welcome back
              </h2>
              <p className="text-slate-400 font-medium text-xs mt-1 text-center">
                Access your console securely
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Login Mode Selector - OPTIMIZED */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-slate-400 ml-1">Login using</label>
                <button
                  type="button"
                  onClick={() => setShowModeSelector(true)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      {React.cloneElement(currentMode.icon as React.ReactElement, {
                        className: "w-4 h-4 text-blue-600 dark:text-blue-400"
                      })}
                    </div>
                    <div className="text-left">
                      <span className="block text-gray-900 dark:text-slate-200 text-sm font-semibold">
                        {currentMode.label}
                      </span>
                      <span className="block text-[10px] text-gray-500 dark:text-slate-400">
                        {currentMode.description}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>
              </div>

              {/* Identifier Input */}
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  {mode === "email" ? <Mail className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <input
                  type={mode === "email" ? "email" : "text"}
                  placeholder={mode === "email" ? "Enter your email address" : "Enter your Account ID"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 bg-gray-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500/20 focus:bg-white dark:focus:bg-slate-800 rounded-xl outline-none transition-all placeholder:text-gray-400 text-sm font-medium text-slate-900 dark:text-white"
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-3 bg-gray-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500/20 focus:bg-white dark:focus:bg-slate-800 rounded-xl outline-none transition-all placeholder:text-gray-400 text-sm font-medium text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Submit Button Section */}
              <AnimatePresence mode="wait">
                {!isLoading ? (
                  <motion.button
                    key="submit-button"
                    type="submit"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 text-sm font-bold rounded-xl shadow-lg transition-all text-white bg-[#0A1F44] hover:bg-[#0A1F44]/90 shadow-[#0A1F44]/10"
                  >
                    Login to access your console
                  </motion.button>
                ) : (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center py-2"
                  >
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                      <span className="text-sm font-medium">Logging in...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center pt-1">
                <a href="/forgot-password" className="text-xs text-gray-500 hover:text-blue-600 transition-colors font-medium">
                  Forgot your password?
                </a>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800 text-center">
              <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                © {new Date().getFullYear()} TokenPap System • Version 1.1.0
              </p>
            </div>
          </div>

          {/* Bottom Sheet Mode Selector - Same width as parent container */}
          <AnimatePresence>
            {showModeSelector && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowModeSelector(false)}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20"
                />
                <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="bg-white dark:bg-slate-900 rounded-t-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t border-slate-100 dark:border-slate-800 max-h-[70vh] overflow-y-auto pointer-events-auto"
                  >
                    <div className="p-6">
                      <div className="w-10 h-1 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto mb-4" />
                      <h3 className="text-base font-bold text-center mb-1 dark:text-white">Login using</h3>
                      <p className="text-center text-xs text-gray-500 dark:text-slate-400 mb-6">
                        Choose your preferred login method
                      </p>

                      <div className="space-y-2">
                        {modeOptions.map((option) => {
                          const isSelected = mode === option.value;
                          const unselectedClasses = "bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700";
                          const selectedClasses = "bg-blue-50 dark:bg-blue-900/20 border-blue-500/20 text-blue-600 dark:text-blue-400";

                          return (
                            <button
                              key={option.value}
                              onClick={() => handleModeSelect(option.value)}
                              className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${isSelected ? `${selectedClasses} shadow-sm` : unselectedClasses
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isSelected ? "bg-white/50" : "bg-white dark:bg-slate-700"}`}>
                                  {React.cloneElement(option.icon as React.ReactElement, {
                                    className: `w-4 h-4 ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`
                                  })}
                                </div>
                                <div className="text-left">
                                  <span className={`block text-sm font-bold ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-slate-300"}`}>
                                    {option.label}
                                  </span>
                                  <span className="block text-[10px] text-gray-500 dark:text-slate-400">
                                    {option.description}
                                  </span>
                                </div>
                              </div>
                              {isSelected && (
                                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setShowModeSelector(false)}
                        className="w-full mt-4 py-2.5 text-sm text-gray-500 font-medium hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;