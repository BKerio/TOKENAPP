import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import api from '@/lib/api';
import {
    Home,
    CreditCard,
    Phone,
    Mail,
    User,
    Activity,
    Calendar,
    ChevronRight,
    ShieldCheck,
    AlertTriangle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import DashboardLoader from '@/lib/loader';

interface OutletContextType {
    user: {
        id: string;
        name: string;
        email?: string;
        role?: string;
    };
}

interface LandlordProfile {
    id: string;
    full_name: string;
    phone: string;
    payment_account: string;
    status: string;
    user?: { id: string; name: string; email: string; username?: string };
}

const getGreeting = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return 'Good Morning';
    if (h >= 12 && h < 18) return 'Good Afternoon';
    return 'Good Evening';
};

const StatCard = ({
    icon: Icon,
    label,
    value,
    sub,
    color = 'emerald',
    delay = 0,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    sub?: string;
    color?: string;
    delay?: number;
}) => {
    const colors: Record<string, string> = {
        emerald: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
        amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
        slate: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all duration-300 group"
        >
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white break-all leading-snug group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">
                        {value}
                    </p>
                    {sub && <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">{sub}</p>}
                </div>
                <div className={`p-2.5 rounded-xl shrink-0 ${colors[color]}`}>
                    <Icon size={18} />
                </div>
            </div>
        </motion.div>
    );
};

const LandlordDashboard: React.FC = () => {
    useOutletContext<OutletContextType>();
    const [profile, setProfile] = useState<LandlordProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get<{ status: number; landlord: LandlordProfile }>('/landlord/profile');
                if (res.data.status === 200) {
                    setProfile(res.data.landlord);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const quickActions = [
        { text: 'My Profile', desc: 'View & edit details', icon: User, path: '/dashboard/account' },
        { text: 'Payment Info', desc: 'Account & billing', icon: CreditCard, path: '/dashboard/landlord/payment' },
        { text: 'Properties', desc: 'Manage properties', icon: Home, path: '/dashboard/landlord/properties' },
        { text: 'Security', desc: 'Password & access', icon: ShieldCheck, path: '/dashboard/account' },
    ];

    if (loading) {
        return <DashboardLoader title="Loading Landlord Portal" subtitle="Fetching your account details..." />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 bg-slate-50 dark:bg-slate-950">
                <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-2xl border border-red-100 dark:border-red-900/30 text-center max-w-md">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-red-900 dark:text-red-400">Dashboard Error</h3>
                    <p className="text-red-700 dark:text-red-400 mt-2 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    const displayName = profile?.full_name || profile?.user?.name || 'Landlord';

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-6 md:p-8 font-sans text-slate-900 dark:text-slate-100 transition-colors">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" strokeWidth={1.5} />
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                            {dayjs().format('dddd, D MMMM YYYY')}
                        </p>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                        {getGreeting()},{' '}
                        <span className="text-[#0A1F44] dark:text-blue-400 capitalize">{displayName}</span>
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl text-sm font-medium opacity-80">
                        Welcome to your Landlord Portal - manage your property account and details.
                    </p>
                </motion.div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                    <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${profile?.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`} />
                    {profile?.status || 'Active'}
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={User} label="Full Name" value={displayName} sub="Property Owner" color="emerald" delay={0} />
                <StatCard icon={Mail} label="Email" value={profile?.user?.email || '—'} sub="Registered email" color="blue" delay={0.1} />
                <StatCard icon={Phone} label="Phone" value={profile?.phone || '—'} sub="Contact number" color="amber" delay={0.2} />
                <StatCard icon={CreditCard} label="Payment Account" value={profile?.payment_account || '—'} sub="M-Pesa / Bank" color="slate" delay={0.3} />
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {quickActions.map((action, idx) => (
                            <Link key={idx} to={action.path}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/30 dark:hover:border-blue-800 hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center gap-3"
                                >
                                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-blue-900 dark:text-blue-400">
                                        <action.icon size={22} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{action.text}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Landlord Portal</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                            Your personal property owner workspace.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/dashboard/account"
                                className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm"
                            >
                                Edit My Profile <ChevronRight size={16} />
                            </Link>
                            <Link
                                to="/dashboard/landlord/properties"
                                className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-2 border border-slate-100 dark:border-slate-700"
                            >
                                My Properties <ChevronRight size={16} />
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Profile Card */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                    >
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="font-bold text-slate-900 dark:text-white">Owner Profile</h3>
                            <Link
                                to="/dashboard/account"
                                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 flex items-center gap-1"
                            >
                                Edit <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-[#0A1F44] text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                                    {displayName.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{displayName}</p>
                                    <p className="text-xs text-slate-500 font-medium">Property Owner</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                {profile?.user?.email && (
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <Mail size={14} className="shrink-0" />
                                        <span className="truncate text-xs">{profile.user.email}</span>
                                    </div>
                                )}
                                {profile?.phone && (
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <Phone size={14} className="shrink-0" />
                                        <span className="text-xs">{profile.phone}</span>
                                    </div>
                                )}
                                {profile?.payment_account && (
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <CreditCard size={14} className="shrink-0" />
                                        <span className="text-xs font-mono">{profile.payment_account}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Status card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#0A1F44] dark:bg-slate-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden border border-slate-700 dark:border-slate-800"
                    >
                        <div className="absolute top-0 right-0 opacity-10 transform translate-x-8 -translate-y-8">
                            <Home size={100} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-1">Account Status</h3>
                            <p className="text-blue-200 dark:text-slate-400 text-xs mb-6 font-medium">Property owner account</p>
                            <div className="flex justify-between items-center border-b border-blue-800/50 dark:border-slate-800/50 pb-2 text-sm">
                                <span className="text-emerald-100 flex items-center gap-2">
                                    <Activity size={16} /> Status
                                </span>
                                <span className="font-bold capitalize">{profile?.status || 'Active'}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 text-sm">
                                <span className="text-emerald-100 flex items-center gap-2">
                                    <ShieldCheck size={16} /> Role
                                </span>
                                <span className="font-bold">Landlord</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LandlordDashboard;
