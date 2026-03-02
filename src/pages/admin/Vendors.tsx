import { useState, useEffect } from 'react';
import axios from 'axios';

import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Building2,
    MapPin,
    CreditCard,
    User,
    Mail,
    AtSign,
    ShieldCheck,
    Loader2,
    X,
    Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLoader from '@/lib/loader';
import Swal from 'sweetalert2';

interface VendorData {
    id: string;
    user_id: string;
    business_name: string;
    address: string;
    account_id: string;
    paybill: string;
    vendor_type: string;
    bank_name: string;
    status: string;
    user?: {
        name: string;
        email: string;
        username: string;
    };
}

const Vendors = () => {
    const [vendors, setVendors] = useState<VendorData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<VendorData | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        business_name: '',
        address: '',
        account_id: '',
        paybill: '',
        vendor_type: '',
        bank_name: '',
    });

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/admin/vendors?search=${searchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVendors(response.data.data);
        } catch (error) {
            console.error('Failed to fetch vendors', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load vendors',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (vendor: VendorData | null = null) => {
        if (vendor) {
            setEditingVendor(vendor);
            setFormData({
                name: vendor.user?.name || '',
                email: vendor.user?.email || '',
                username: vendor.user?.username || '',
                password: '',
                business_name: vendor.business_name,
                address: vendor.address,
                account_id: vendor.account_id,
                paybill: vendor.paybill,
                vendor_type: vendor.vendor_type || '',
                bank_name: vendor.bank_name || '',
            });
        } else {
            setEditingVendor(null);
            setFormData({
                name: '',
                email: '',
                username: '',
                password: '',
                business_name: '',
                address: '',
                account_id: '',
                paybill: '',
                vendor_type: '',
                bank_name: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            if (editingVendor) {
                // Filter out empty password or fields that shouldn't be sent if empty
                const updateData: any = { ...formData };
                if (!updateData.password) delete updateData.password;

                // For updates, we might want to be even more selective if fields are hidden
                // but for now, just sending everything as intended by the form state.

                await axios.put(`${API_URL}/admin/vendors/${editingVendor.id}`, updateData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Vendor updated successfully',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            } else {
                await axios.post(`${API_URL}/admin/vendors`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Vendor created successfully',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
            setIsModalOpen(false);
            fetchVendors();
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Operation failed',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (vendor: VendorData) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete vendor "${vendor.business_name}". This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/admin/vendors/${vendor.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted',
                    text: 'Vendor deleted successfully',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                fetchVendors();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete vendor',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        }
    };

    if (loading && vendors.length === 0) {
        return <DashboardLoader title="Loading Vendors..." subtitle="Fetching business accounts" />;
    }

    return (
        <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-blue-600" />
                        Vendor Management
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Setup and manage vendor business accounts</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleOpenModal()}
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
                    <span>Create Vendor</span>
                </motion.button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search business name, account ID, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-blue-600 transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-medium text-slate-500">{vendors.length} Vendors Total</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Business / Vendor</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type / Bank</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Payments (M-Pesa)</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {vendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                                                {vendor.business_name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white">{vendor.business_name}</div>
                                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                                    <MapPin className="w-3 h-3" /> {vendor.address}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{vendor.user?.name}</div>
                                            <div className="text-xs text-slate-500">{vendor.user?.email}</div>
                                            <div className="text-[10px] font-mono mt-1 text-slate-400 italic">@{vendor.user?.username}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded-md inline-block">
                                                {vendor.vendor_type}
                                            </div>
                                            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                                                <Building2 className="w-3.5 h-3.5" /> {vendor.bank_name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                                <CreditCard className="w-4 h-4 text-blue-500" />
                                                Acc ID: {vendor.account_id}
                                            </div>
                                            <div className="text-[11px] font-medium px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md inline-block">
                                                PayBill: {vendor.paybill}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${vendor.status === 'active'
                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                                            }`}>
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenModal(vendor)}
                                                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(vendor)}
                                                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-600 hover:text-white transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/30">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {editingVendor ? 'Update Vendor Account' : 'Setup New Vendor'}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">Configure business and security details</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[65vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Personal Info */}
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest pl-1">Personal Details</h3>
                                    <div className="space-y-2.5">
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Contact Person Name"
                                                required
                                                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-slate-200"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="email"
                                                placeholder="Contact Email"
                                                required
                                                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-slate-200"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        {!editingVendor && (
                                            <>
                                                <div className="relative">
                                                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Desired Username"
                                                        required
                                                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-slate-200"
                                                        value={formData.username}
                                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                    />
                                                </div>
                                                <input
                                                    type="password"
                                                    placeholder="Account Password"
                                                    required
                                                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-slate-200"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Business Info */}
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest pl-1">Business Details</h3>
                                    <div className="space-y-2.5">
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Business Trading Name"
                                                required
                                                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-slate-200"
                                                value={formData.business_name}
                                                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                            />
                                        </div>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Physical Address"
                                                required
                                                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-slate-200"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        </div>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Account ID (Unique)"
                                                required
                                                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-slate-200"
                                                value={formData.account_id}
                                                onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="M-Pesa PayBill Number"
                                            required
                                            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-slate-200"
                                            value={formData.paybill}
                                            onChange={(e) => setFormData({ ...formData, paybill: e.target.value })}
                                        />

                                        <div className="grid grid-cols-2 gap-2">
                                            <select
                                                required
                                                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-600 dark:text-slate-300"
                                                value={formData.vendor_type}
                                                onChange={(e) => setFormData({ ...formData, vendor_type: e.target.value })}
                                            >
                                                <option value="">Vendor Type</option>
                                                <option value="Individual">Individual</option>
                                                <option value="Company">Company</option>
                                            </select>

                                            <select
                                                required
                                                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-600 dark:text-slate-300"
                                                value={formData.bank_name}
                                                onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                                            >
                                                <option value="">Select Bank</option>
                                                <option value="Equity Bank">Equity</option>
                                                <option value="NCBA Bank">NCBA</option>
                                                <option value="KCB Bank">KCB</option>
                                                <option value="Co-op Bank">Co-op</option>
                                                <option value="Family Bank">Family</option>
                                                <option value="Stanbic Bank">Stanbic</option>
                                                <option value="Absa Bank">Absa</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-3 flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="submit"
                                    disabled={submitting}
                                    className="
                                        group flex items-center gap-2
                                        bg-[#0A1F44] text-white
                                        px-5 py-2.5
                                        rounded-xl
                                        font-medium text-[13px]
                                        shadow-sm
                                        transition-all duration-200
                                        hover:bg-[#0A1F44]/90
                                        focus:outline-none focus:ring-2 focus:ring-[#0A1F44]/30
                                        disabled:opacity-70 disabled:cursor-not-allowed
                                    "
                                >
                                    {submitting ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <ShieldCheck className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" />
                                    )}
                                    <span>{editingVendor ? 'Update Account' : 'Initialize Vendor Account'}</span>
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Vendors;
