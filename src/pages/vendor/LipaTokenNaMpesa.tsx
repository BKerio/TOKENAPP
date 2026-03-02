import { useState } from 'react';
import axios from 'axios';
import { Smartphone, Play, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { useOutletContext } from 'react-router-dom';

interface UserContext {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

const LipaTokenNaMpesa = () => {
    const { user } = useOutletContext<UserContext>();
    const [testPhone, setTestPhone] = useState('');
    const [testAmount, setTestAmount] = useState('');
    const [testing, setTesting] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    const handleTestMpesa = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!testPhone || !testAmount) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing details',
                text: 'Please enter both phone number and amount.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
            });
            return;
        }

        const amountNumber = Number(testAmount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid amount',
                text: 'Please enter a valid amount greater than 0.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
            });
            return;
        }

        try {
            setTesting(true);
            const token = localStorage.getItem('token');

            const payload: any = {
                phone: testPhone,
                amount: amountNumber,
                vendor_email: user?.email || ''
            };

            const response = await axios.post(
                `${API_URL}/admin/system-config/test-mpesa`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'STK Push Sent',
                    text: 'M-Pesa prompt sent. Check the phone for the payment request.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                });
            }
        } catch (error: any) {
            console.error('Error sending test M-Pesa:', error);
            Swal.fire({
                icon: 'error',
                title: 'Payment Failed',
                text: error.response?.data?.message || 'Failed to initiate M-Pesa STK push. Check your credentials in System Configuration.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
            });
        } finally {
            setTesting(false);
        }
    };

    return (
        <div className="p-6 md:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
                <div className="p-6 md:p-8 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-800/50 text-center">
                    <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm">
                        <Smartphone size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Lipa Na M-Pesa
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Simulate a customer payment to test your STK credentials.
                    </p>
                </div>

                <form onSubmit={handleTestMpesa} className="p-6 md:p-8 space-y-5">
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 flex gap-3 text-amber-700 dark:text-amber-400 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>This will send a real M-Pesa prompt to the phone number below if your credentials are valid.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">M-Pesa Phone Number</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">254</span>
                            <input
                                type="text"
                                required
                                disabled={testing}
                                value={testPhone}
                                onChange={(e) => setTestPhone(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:opacity-50"
                                placeholder="712345678"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Test Amount (KES)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Ksh</span>
                            <input
                                type="number"
                                min="1"
                                step="1"
                                required
                                disabled={testing}
                                value={testAmount}
                                onChange={(e) => setTestAmount(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-lg font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:opacity-50"
                                placeholder="1"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <motion.button
                            whileHover={!testing ? { scale: 1.02 } : {}}
                            whileTap={!testing ? { scale: 0.98 } : {}}
                            type="submit"
                            disabled={testing || !testPhone || !testAmount}
                            className="w-full py-3.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                        >
                            {testing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Initiating...</span>
                                </>
                            ) : (
                                <>
                                    <Play size={18} fill="currentColor" />
                                    <span>Send STK Push</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default LipaTokenNaMpesa;
