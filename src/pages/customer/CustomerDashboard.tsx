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
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 px-8 py-6 rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                        {user?.profile_image ? (
                            <img src={user.profile_image} alt={user?.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <User size={28} className="text-slate-500 dark:text-slate-400" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">Welcome back, {user?.name}</h1>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">Manage your utility account and view your meter status.</p>
                        {vendor && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <span>Serviced by:</span>
                                <span className="text-slate-700 dark:text-slate-300">{vendor.business_name}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-bold tracking-wide uppercase">Account Active</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 p-7 rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-200/60 dark:border-slate-800 flex flex-col"
                >
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800/80">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400">
                            <User size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white text-base">My Profile</h3>
                            <p className="text-xs font-medium text-slate-400">Contact Details</p>
                        </div>
                    </div>
                    
                    <div className="space-y-5 flex-1 font-medium">
                        <div className="flex items-center gap-3">
                            <Mail size={16} className="text-slate-400" />
                            <span className="text-sm text-slate-700 dark:text-slate-200">{user?.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Smartphone size={16} className="text-slate-400" />
                            <span className="text-sm text-slate-700 dark:text-slate-200">{user?.phone || 'N/A'}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Meter Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-900 p-7 rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-200/60 dark:border-slate-800 flex flex-col"
                >
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800/80">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400">
                            <Hash size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white text-base">Meter Details</h3>
                            <p className="text-xs font-medium text-slate-400">Assigned Equipment</p>
                        </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                        {meter ? (
                            <div className="space-y-5">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Meter Number</span>
                                    <span className="text-xl font-mono font-black tracking-widest text-slate-800 dark:text-white">
                                        {meter.meter_number}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                                        meter.status === 'active' 
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/10 dark:border-emerald-800/50 dark:text-emerald-400' 
                                        : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/10 dark:border-amber-800/50 dark:text-amber-400'
                                    }`}>
                                        {meter.status || 'Unknown'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col flex-1 items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                <span className="text-sm font-medium">No meter assigned</span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Latest Token Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900 dark:bg-black p-7 rounded-3xl shadow-[0_10px_30px_-10px_rgba(15,23,42,0.3)] border border-slate-800 dark:border-slate-800/80 flex flex-col"
                >
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800 dark:border-slate-900">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 dark:bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300">
                            <Zap size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-base">Latest Token</h3>
                            <p className="text-xs font-medium text-slate-400">Most Recent Purchase</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col flex-1 justify-center">
                        {latestTokenTx ? (
                            <div className="space-y-3">
                                <span className="text-2xl font-black font-mono tracking-[0.2em] text-white break-words leading-tight">
                                    {latestToken}
                                </span>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <CalendarClock size={12} />
                                    <span>{dayjs(latestTokenTx.created_at).format('MMM D, YYYY')}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col flex-1 items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                                <span className="text-sm font-medium">No tokens generated</span>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
            
            <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-200/60 dark:border-slate-800 overflow-hidden mt-8">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700">
                        <CreditCard className="text-slate-600 dark:text-slate-400" size={18} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Recent Transactions</h2>
                </div>
                
                {recentTransactions && recentTransactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800/80 text-[11px] uppercase tracking-widest font-bold text-slate-400">
                                    <th className="py-4 pl-8 font-bold">Date & Time</th>
                                    <th className="py-4 font-bold">Amount</th>
                                    <th className="py-4 font-bold">Tokens</th>
                                    <th className="py-4 pr-8 font-bold text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {recentTransactions.map((tx: any) => (
                                    <tr key={tx._id || tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="py-5 pl-8">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                {dayjs(tx.created_at).format('MMM D, YYYY HH:mm')}
                                            </span>
                                        </td>
                                        <td className="py-5">
                                            <span className="text-sm font-black text-slate-900 dark:text-white">
                                                Ksh {tx.amount?.toLocaleString() || '0'}
                                            </span>
                                        </td>
                                        <td className="py-5">
                                            {tx.tokens && tx.tokens.length > 0 ? (
                                                <div className="flex flex-col gap-1 text-xs font-mono bg-slate-50 border border-slate-200/60 dark:bg-slate-800/50 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 w-fit">
                                                    {tx.tokens.map((token: string, idx: number) => (
                                                        <span key={idx}>{token.match(/.{1,4}/g)?.join('-') || token}</span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-xs font-medium text-slate-400 italic">No tokens</span>
                                            )}
                                        </td>
                                        <td className="py-5 pr-8 text-right">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider inline-block border ${
                                                tx.status === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/10 dark:border-emerald-800/50 dark:text-emerald-400' :
                                                tx.status === 'failed' ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/10 dark:border-red-800/50 dark:text-red-400' :
                                                'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400'
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
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 dark:bg-slate-800/50 dark:border-slate-800 flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                            <Activity size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No transaction history.</p>
                        <p className="text-xs mt-1 font-medium">Purchased tokens will be tracked here.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default CustomerDashboard;
