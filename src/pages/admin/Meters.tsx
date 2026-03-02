import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Gauge,
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    X,
    Save,
    Building2,
    DollarSign,
    CheckCircle2,
    AlertCircle,
    Activity,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Swal from 'sweetalert2';
import DashboardLoader from '@/lib/loader';
import { useOutletContext } from 'react-router-dom';

interface Vendor {
    id: string;
    business_name: string;
}

/** Normalize API vendor to { id, business_name } (MongoDB may return _id) */
function normalizeVendor(v: { id?: string; _id?: string; business_name?: string }): Vendor {
    return {
        id: String(v?.id ?? v?._id ?? ''),
        business_name: String(v?.business_name ?? ''),
    };
}

interface Meter {
    id: string;
    meter_number: string;
    type: string;
    initial_reading: number;
    price_per_unit: number;
    status: 'active' | 'inactive' | 'maintenance';
    vendor_id: string | null;
    vendor?: Vendor;
}

interface User {
    id: string;
    name: string;
    role: string;
}

const Meters = () => {
    const { user } = useOutletContext<{ user: User }>();
    const isAdmin = user.role === 'admin' || user.role === 'system_admin';

    const [meters, setMeters] = useState<Meter[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [metersFetchError, setMetersFetchError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingMeter, setEditingMeter] = useState<Meter | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        meter_number: '',
        type: 'electricity',
        initial_reading: '0',
        price_per_unit: '0',
        vendor_id: '',
        status: 'active'
    });

    const API_URL = import.meta.env.VITE_API_URL;

    const fetchMeters = useCallback(async () => {
        setMetersFetchError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            setMetersFetchError('Not signed in');
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_URL}/admin/meters?search=${searchTerm}&per_page=100`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const list = response.data?.data ?? (Array.isArray(response.data) ? response.data : []);
            setMeters(Array.isArray(list) ? list : []);
        } catch (error: unknown) {
            console.error('Failed to fetch meters', error);
            const message = axios.isAxiosError(error)
                ? (error.response?.data?.message || error.message || 'Failed to load meters')
                : 'Failed to load meters';
            setMetersFetchError(message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load meters',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        } finally {
            setLoading(false);
        }
    }, [API_URL, searchTerm]);

    const fetchVendors = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await axios.get(`${API_URL}/admin/vendors?per_page=100`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Laravel paginator: { data: [...], current_page, ... }; fallback to raw array
            const raw =
                response.data?.data ??
                (Array.isArray(response.data) ? response.data : []);
            const list = Array.isArray(raw)
                ? raw.map(normalizeVendor).filter((v) => v.id)
                : [];
            setVendors(list);
        } catch (error) {
            console.error('Failed to fetch vendors', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load vendors list',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            setVendors([]);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchMeters();
    }, [fetchMeters]);

    // Fetch available vendors on load (for admin assign dropdown)
    useEffect(() => {
        fetchVendors();
    }, [fetchVendors]);

    // When admin opens the modal, refetch vendors so the dropdown shows all current vendors
    useEffect(() => {
        if (isAdmin && showModal) fetchVendors();
    }, [isAdmin, showModal, fetchVendors]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const payload: Record<string, unknown> = {
                meter_number: formData.meter_number,
                type: formData.type,
                initial_reading: parseFloat(formData.initial_reading),
                vendor_id: formData.vendor_id || null,
                status: formData.status
            };
            // Only vendors can set pricing; admin must not send price_per_unit
            if (!isAdmin) {
                payload.price_per_unit = parseFloat(formData.price_per_unit);
            }

            if (editingMeter) {
                await axios.put(`${API_URL}/admin/meters/${editingMeter.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Meter updated successfully',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            } else {
                await axios.post(`${API_URL}/admin/meters`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Meter created successfully',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
            setShowModal(false);
            fetchMeters();
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Action failed',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    const handleDelete = async (id: string) => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        const result = await Swal.fire({
            title: 'Delete Meter?',
            text: "This will permanently remove this meter and its history.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it',
            background: isDarkMode ? '#0f172a' : '#fff',
            color: isDarkMode ? '#fff' : '#000'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/admin/meters/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted',
                    text: 'Meter deleted',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                fetchMeters();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete meter',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        }
    };

    const openModal = (meter: Meter | null = null) => {
        if (meter) {
            setEditingMeter(meter);
            setFormData({
                meter_number: meter.meter_number,
                type: meter.type,
                initial_reading: meter.initial_reading.toString(),
                price_per_unit: meter.price_per_unit.toString(),
                vendor_id: meter.vendor_id || '',
                status: meter.status
            });
        } else {
            setEditingMeter(null);
            setFormData({
                meter_number: '',
                type: 'electricity',
                initial_reading: '0',
                price_per_unit: '0',
                vendor_id: '',
                status: 'active'
            });
        }
        setShowModal(true);
    };

    if (loading) return <DashboardLoader title="Loading Equipment" subtitle="Syncing meter data..." />;

    return (
        <div className="p-6 md:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-2 text-blue-600 dark:text-blue-400">
                        <div className="p-2 bg-dark-50 dark:bg-blue-900/30 rounded-xl">
                            <Gauge size={24} />
                        </div>
                        <span className="font-bold tracking-widest normal text-xs">
                            {isAdmin ? 'Infrastructure' : 'Your Meters'}
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {isAdmin ? (
                            <span className="text-[#0A1F44]/90 dark:text-white">Meter Management</span>
                        ) : (
                            <span className="text-dark-600 dark:text-dark-400">My Meters & Pricing</span>
                        )}
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-xl">
                        {isAdmin
                            ? 'Monitor, assign, and manage vending equipment across your vendor network. Assign meters to vendors so they can set pricing for their customers.'
                            : 'View your assigned meters. Click Edit on a meter to set the price per unit for your customers or tenants.'}
                    </p>
                </motion.div>

                {isAdmin && (
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => openModal()}
                        className="
                            group flex items-center gap-2
                            bg-[#0A1F44] text-white
                            px-5 py-2.5
                            rounded-xl
                            font-medium text-sm
                            shadow-md
                            transition-all duration-200
                            hover:bg-[#0A1F44]/90
                            focus:outline-none focus:ring-2 focus:ring-[#0A1F44]/30
                        "
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
                        <span>Provision New Meter</span>
                    </motion.button>
                )}
            </div>

            {/* Controls Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="lg:col-span-3 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by meter number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                <div className="flex gap-4">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <Filter size={20} />
                        Filters
                    </button>
                    <button onClick={fetchMeters} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <Activity size={20} />
                    </button>
                </div>
            </div>

            {/* Error state: fetch failed */}
            {metersFetchError && !loading && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-3xl p-12 text-center"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Couldn’t load meters</h3>
                    <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                        {metersFetchError}
                    </p>
                    <button
                        type="button"
                        onClick={() => fetchMeters()}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl transition-all"
                    >
                        <Activity size={20} />
                        Try again
                    </button>
                </motion.div>
            )}

            {/* Empty state for vendors with no assigned meters */}
            {!isAdmin && meters.length === 0 && !loading && !metersFetchError && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Gauge className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No meters assigned yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                        Your admin has not assigned any meters to your account. Once assigned, you can set pricing here for your customers or tenants.
                    </p>
                    <button
                        type="button"
                        onClick={() => fetchMeters()}
                        className="inline-flex items-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-6 py-3 rounded-2xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                    >
                        <Activity size={20} />
                        Refresh
                    </button>
                </motion.div>
            )}

            {/* Empty state for admin with no meters */}
            {isAdmin && meters.length === 0 && !loading && !metersFetchError && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                        <Gauge className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No meters yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                        Create a meter and assign it to a vendor. The vendor will then see it in their dashboard and can set pricing for their customers.
                    </p>
                    <button
                        type="button"
                        onClick={() => openModal()}
                        className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
                    >
                        <Plus size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        <span className="tracking-wide">Provision first meter</span>
                    </button>
                </motion.div>
            )}

            {/* Meter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {meters.map((meter, index) => (
                        <motion.div
                            key={meter.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-400/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                    <Gauge className="text-blue-600 dark:text-blue-400" size={24} />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(meter)}
                                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(meter.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 mb-6 relative z-10">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                        SN: {meter.meter_number}
                                    </h3>
                                    <p className="text-sm font-bold text-slate-400 flex items-center gap-2 mt-1">
                                        {meter.type.toUpperCase()} •
                                        <span className={`flex items-center gap-1 ${meter.status === 'active' ? 'text-green-500' : 'text-amber-500'}`}>
                                            {meter.status === 'active' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                            {meter.status}
                                        </span>
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate (KES)</p>
                                        <p className="text-lg font-black text-slate-800 dark:text-white">{meter.price_per_unit}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Initial Reading</p>
                                        <p className="text-lg font-black text-slate-800 dark:text-white">{meter.initial_reading}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-50 dark:border-slate-800 relative z-10">
                                {meter.vendor ? (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                <Building2 size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Vendor Assigned</p>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[150px]">
                                                    {meter.vendor.business_name}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between py-1 bg-amber-50/50 dark:bg-amber-900/10 px-3 rounded-xl border border-dashed border-amber-200 dark:border-amber-800/50">
                                        <p className="text-xs font-bold text-amber-600 dark:text-amber-500 italic">Unassigned</p>
                                        <ArrowUpRight size={14} className="text-amber-400" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-slate-200 dark:border-slate-800"
                        >
                            <div className="p-5 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                                        {editingMeter ? 'Adjust Equipment' : 'Provision Meter'}
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Configure hardware settings and parameters</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 shadow-sm">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Meter Serial Number</label>
                                        <div className="relative">
                                            <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                required
                                                disabled={!isAdmin}
                                                placeholder="e.g. MTR-001"
                                                value={formData.meter_number}
                                                onChange={(e) => setFormData({ ...formData, meter_number: e.target.value })}
                                                className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 pl-9 pr-3 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    {isAdmin && (
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Assign to Vendor</label>
                                            {vendors.length === 0 ? (
                                                <div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10 p-3 text-xs text-amber-800 dark:text-amber-200 mb-2">
                                                    No vendors yet. Create vendors in <strong>Vendor Management</strong> first.
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="relative">
                                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                        <select
                                                            value={formData.vendor_id}
                                                            onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })}
                                                            className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 pl-9 pr-3 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                                                        >
                                                            <option value="">— No vendor (unassigned) —</option>
                                                            {vendors.map((v) => (
                                                                <option key={v.id} value={v.id}>{v.business_name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Fluid/Energy Type</label>
                                        <select
                                            value={formData.type}
                                            disabled={!isAdmin}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                                        >
                                            <option value="electricity">Electricity</option>
                                            <option value="water">Water</option>
                                            <option value="gas">Gas</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Service Status</label>
                                        <select
                                            value={formData.status}
                                            disabled={!isAdmin}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                            className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="maintenance">Maintenance</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Rate per Unit (KES)</label>
                                        {isAdmin ? (
                                            <>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={editingMeter ? formData.price_per_unit : '—'}
                                                        className="w-full text-sm bg-slate-100 dark:bg-slate-800/80 border-none rounded-xl py-2 pl-9 pr-3 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        required
                                                        value={formData.price_per_unit}
                                                        onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
                                                        className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 pl-9 pr-3 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Initial Meter Dial</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            disabled={!!editingMeter}
                                            value={formData.initial_reading}
                                            onChange={(e) => setFormData({ ...formData, initial_reading: e.target.value })}
                                            className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        type="submit"
                                        className="flex items-center gap-2 bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white font-medium text-[13px] px-6 py-2.5 rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-[#0A1F44]/30"
                                    >
                                        <Save className="w-3.5 h-3.5" />
                                        {editingMeter ? 'Update Hardware' : 'Provision Hardware'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Meters;
