import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { Mail, User, Lock, Eye, EyeOff, ChevronDown, CheckCircle2 } from "lucide-react";
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
    description: "Login using your registered email",
    icon: <Mail className="w-5 h-5" />,
  },
  {
    value: "kanisa",
    label: "Account ID",
    description: "Login using your account number",
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
  const [, setError] = useState<string | null>(null);

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
        icon: "error",
        title: "Error",
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
          icon: "success",
          title: "Login successful!",
          timer: 1500,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
        });

        login(response.data.user, response.data.token);

        if (response.data.user.role === "vendor") {
          if (response.data.user.vendor_type === "Company") {
            navigate("/dashboard/company");
          } else if (response.data.user.vendor_type === "Individual") {
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
          icon: "error",
          title: "Authentication Failed",
          text: msg,
        });
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "An error occurred during login";

      setError(msg);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentMode =
    modeOptions.find((m) => m.value === mode) || modeOptions[0];

  return (
    <div className="min-h-screen bg-[#E8F4FD] dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-400/20 blur-[120px] rounded-full" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-400/20 blur-[120px] rounded-full" />

      {/* Main container */}
      <div className="w-full max-w-[380px] relative">

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 sm:p-7 border border-slate-100 dark:border-slate-800">

          {/* Logo */}
          <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="flex flex-col items-center mb-5"
           >
             <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner mb-3">
               <img src={Logo} alt="Token Utility System" className="w-10" />
             </div>
           
             <h2 className="text-lg font-bold text-slate-800 dark:text-white text-center">
               Token Utility System
             </h2>
           
             <p className="text-[11px] text-slate-400 mt-1 text-center">
               Powering secure token distribution and seamless utility management
             </p>
           </motion.div>

          <form onSubmit={handleLogin} className="space-y-3.5">

            {/* Login method selector */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 ml-1">
                Login method
              </label>

              <button
                type="button"
                onClick={() => setShowModeSelector(true)}
                className="w-full mt-1"
              >
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md transition">

                  <div className="flex items-center gap-3">
                    <motion.div
                      key={mode}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                    >
                      {currentMode.icon}
                    </motion.div>

                    <div className="text-left">
                      <p className="text-[13px] font-semibold text-slate-800 dark:text-white leading-tight">
                        {currentMode.label}
                      </p>

                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                        {currentMode.description}
                      </p>
                    </div>
                  </div>

                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </button>
            </div>

            {/* Identifier */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {mode === "email" ? <Mail size={15} /> : <User size={15} />}
              </div>

              <input
                type={mode === "email" ? "email" : "text"}
                placeholder={
                  mode === "email"
                    ? "Enter your email"
                    : "Enter your account ID"
                }
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition text-[13px] placeholder:text-slate-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition text-[13px] placeholder:text-slate-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Login button */}
            <AnimatePresence mode="wait">
              {!isLoading ? (
                <motion.button
                  key="login"
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2.5 rounded-xl text-white text-[13px] font-bold bg-[#0A1F44] hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                >
                  Login to dashboard
                </motion.button>
              ) : (
                <div className="flex justify-center py-2.5">
                  <div className="flex items-center gap-2 text-slate-500">
                    <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
                    <span className="text-[13px] font-medium">Logging in...</span>
                  </div>
                </div>
              )}
            </AnimatePresence>

            <div className="text-center pt-1">
              <a
                href="/forgot-password"
                className="text-xs text-slate-500 hover:text-blue-600"
              >
                Forgot password?
              </a>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} TokenPap Utility Sytem . All rights reserved.
          </div>
        </div>

        {/* Login Method Selector */}
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
                  className="bg-white dark:bg-slate-900 rounded-t-[2rem] shadow-2xl border-t border-slate-100 dark:border-slate-800 pointer-events-auto"
                >
                  <div className="p-5">

                    <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-3" />

                    <h3 className="text-sm font-bold text-center dark:text-white">
                      Login using
                    </h3>

                    <p className="text-center text-[11px] text-slate-400 mb-5">
                      Choose your preferred login method
                    </p>

                    <div className="space-y-2.5">
                      {modeOptions.map((option) => {
                        const isSelected = option.value === mode;

                        return (
                          <button
                            key={option.value}
                            onClick={() => handleModeSelect(option.value)}
                            className={`w-full flex items-center gap-3.5 p-3 rounded-xl border transition
                            ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                                : "border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            <div
                              className={`w-9 h-9 flex items-center justify-center rounded-lg
                              ${
                                isSelected
                                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              {option.icon}
                            </div>

                            <div className="flex-1 text-left">
                              <p className="text-[13px] font-bold text-slate-800 dark:text-white leading-tight">
                                {option.label}
                              </p>

                              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                                {option.description}
                              </p>
                            </div>

                            {isSelected && (
                              <CheckCircle2 className="text-blue-500 w-5 h-5" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setShowModeSelector(false)}
                      className="w-full mt-3 py-2 text-[13px] font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
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
  );
};

export default Login;