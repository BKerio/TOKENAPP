import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { User, Smartphone, Mail, Hash, CreditCard, Activity, CalendarClock, Zap } from 'lucide-react';
import dayjs from 'dayjs';

const CustomerDashboard = () => {
    // Get the user data that was injected directly by DashboardLayout via Outlet context
    const { user } = useOutletContext<any>();
    
    const meter = user?.meter;
    const vendor = user?.vendor;
    const recentTransactions = user?.recent_transactions || [];
    
    // Find the latest successful transaction that has tokens
    const latestTokenTx = recentTransactions.find((tx: any) => tx.tokens && tx.tokens.length > 0 && tx.status === 'success');
    let latestToken = 'N/A';
    if (latestTokenTx && latestTokenTx.tokens.length > 0) {
        latestToken = latestTokenTx.tokens[0];
        // Format token into chunks of 4 for readability
        latestToken = latestToken.match(/.{1,4}/g)?.join('-') || latestToken;
    }

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <User size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome back, {user?.name}!</h1>
                        <p className="text-slate-500 dark:text-slate-400">Manage your utility account and view your meter status.</p>
                        {vendor && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium bg-blue-50 dark:bg-blue-900/30 inline-block px-2 py-0.5 rounded-full">
                                Serviced by: {vendor.business_name}
                            </p>
                        )}
                    </div>
                </div>
                <div className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm border border-emerald-100 dark:border-emerald-800/50">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="font-bold text-sm">Account Active</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="relative">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shadow-inner">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg">My Profile</h3>
                                <p className="text-xs text-slate-400">Contact Information</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                <Mail size={16} className="text-blue-500" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{user?.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                <Smartphone size={16} className="text-blue-500" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{user?.phone || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Meter Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="relative">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 shadow-inner">
                                <Hash size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Meter Details</h3>
                                <p className="text-xs text-slate-400">Assigned Equipment</p>
                            </div>
                        </div>
                        
                        {meter ? (
                            <div className="space-y-4">
                                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex flex-col gap-1">
                                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Meter Number</span>
                                    <span className="text-lg font-mono font-black text-slate-800 dark:text-white tracking-widest leading-none">
                                        {meter.meter_number}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-sm font-medium text-slate-500">Status</span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                        meter.status === 'active' 
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' 
                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                                    }`}>
                                        {meter.status || 'Unknown'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="h-24 flex items-center justify-center text-sm text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                No meter assigned yet.
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Latest Token Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="relative">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 shadow-inner">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Latest Token</h3>
                                <p className="text-xs text-slate-400">Most Recent Purchase</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 text-center flex flex-col justify-center min-h-[5rem]">
                                {latestTokenTx ? (
                                    <>
                                        <span className="text-xl md:text-2xl font-black font-mono tracking-[0.15em] text-indigo-700 dark:text-indigo-400 drop-shadow-sm">
                                            {latestToken}
                                        </span>
                                        <span className="text-[10px] font-bold text-indigo-400 dark:text-indigo-500 uppercase tracking-widest mt-2 block">
                                            Purchased: {dayjs(latestTokenTx.created_at).format('MMM D, YYYY')}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-sm font-medium text-slate-400">No tokens generated yet.</span>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            
            <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                    <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <CreditCard className="text-slate-400" size={20} />
                        Recent Transactions
                    </h2>
                </div>
                
                {recentTransactions && recentTransactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                                    <th className="p-4 pl-6">Date</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Tokens</th>
                                    <th className="p-4 pr-6">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {recentTransactions.map((tx: any) => (
                                    <tr key={tx._id || tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-2">
                                                <CalendarClock size={16} className="text-slate-400" />
                                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    {dayjs(tx.created_at).format('MMM D, YYYY HH:mm')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm font-black text-slate-800 dark:text-slate-200">
                                                Ksh {tx.amount?.toLocaleString() || '0'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {tx.tokens && tx.tokens.length > 0 ? (
                                                <div className="flex flex-col gap-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-slate-600 dark:text-slate-300 w-fit">
                                                    {tx.tokens.map((token: string, idx: number) => (
                                                        <span key={idx}>{token.match(/.{1,4}/g)?.join('-') || token}</span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">No tokens</span>
                                            )}
                                        </td>
                                        <td className="p-4 pr-6">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block ${
                                                tx.status === 'success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' :
                                                tx.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                                                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                            }`}>
                                                {tx.status || 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50/30 dark:bg-slate-900/30">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                            <Activity size={32} />
                        </div>
                        <p className="font-medium">No recent transaction history found.</p>
                        <p className="text-sm mt-1">When you purchase tokens, they will appear here.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default CustomerDashboard;
