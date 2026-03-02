import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import { Activity, Building2, DollarSign, Gauge, Plus, RefreshCw, Save, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLoader from '@/lib/loader';

type RawVendor = {
  id?: string;
  _id?: string;
  business_name?: string;
  address?: string;
  account_id?: string;
  paybill?: string;
  status?: string;
};

type Vendor = {
  id: string;
  business_name: string;
  address?: string;
  account_id?: string;
  paybill?: string;
  status?: string;
};

type RawMeter = {
  id?: string;
  _id?: string;
  meter_number?: string;
  type?: string;
  initial_reading?: number;
  price_per_unit?: number;
  status?: 'active' | 'inactive' | 'maintenance' | string;
  vendor_id?: string | null;
  vendor?: { id?: string; _id?: string; business_name?: string };
};

type Meter = {
  id: string;
  meter_number: string;
  type: string;
  initial_reading: number;
  price_per_unit: number;
  status: 'active' | 'inactive' | 'maintenance' | string;
  vendor_id: string | null;
  sgc?: number;
  krn?: number;
  ti?: number;
  ea?: number;
  ken?: number;
};

function normalizeVendor(v: RawVendor): Vendor | null {
  const id = String(v?.id ?? v?._id ?? '').trim();
  if (!id) return null;
  return {
    id,
    business_name: String(v?.business_name ?? '').trim(),
    address: v?.address ? String(v.address) : undefined,
    account_id: v?.account_id ? String(v.account_id) : undefined,
    paybill: v?.paybill ? String(v.paybill) : undefined,
    status: v?.status ? String(v.status) : undefined,
  };
}

function normalizeMeter(m: RawMeter): Meter | null {
  const id = String(m?.id ?? m?._id ?? '').trim();
  if (!id) return null;

  const vendorId =
    (m?.vendor_id ? String(m.vendor_id) : '') ||
    String(m?.vendor?.id ?? m?.vendor?._id ?? '').trim() ||
    null;

  return {
    id,
    meter_number: String(m?.meter_number ?? '').trim(),
    type: String(m?.type ?? '').trim() || 'electricity',
    initial_reading: Number(m?.initial_reading ?? 0),
    price_per_unit: Number(m?.price_per_unit ?? 0),
    status: (m?.status ?? 'active') as Meter['status'],
    vendor_id: vendorId && vendorId.length > 0 ? vendorId : null,
  };
}

/** Only block access when we are certain the user is a vendor. Everyone else (admin, missing role, etc.) is allowed. */
function isVendorOnly(user: { role?: string; roles?: string[] } | null | undefined): boolean {
  if (!user) return false;
  const role = (user.role ?? '').toLowerCase().trim();
  const roles = (user.roles ?? []).map((r: string) => String(r).toLowerCase().trim());
  if (role === 'vendor') return true;
  if (roles.length > 0 && roles.includes('vendor') && !roles.some((r) => ['admin', 'system_admin', 'administrator', 'super_admin', 'superadmin'].includes(r))) return true;
  return false;
}

export default function AdminMeter() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const outletContext = useOutletContext<{ user?: { role?: string; roles?: string[] } }>();
  const user = outletContext?.user;
  const isVendor = isVendorOnly(user);
  const canAccess = !isVendor; // allow when user not set (still loading) or not vendor

  useEffect(() => {
    if (user && !canAccess) {
      const vendorType = (user as any).vendor_type;
      if (vendorType === 'Individual') {
        navigate('/dashboard/individual', { replace: true });
      } else {
        navigate('/dashboard/company', { replace: true });
      }
    }
  }, [user, canAccess, navigate]);

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [meters, setMeters] = useState<Meter[]>([]);
  const [metersError, setMetersError] = useState<string | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assigningVendor, setAssigningVendor] = useState<Vendor | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [meterForm, setMeterForm] = useState({
    meter_number: '',
    type: 'electricity',
    initial_reading: '0',
    status: 'active',
    sgc: '201457',
    krn: '1',
    ti: '1',
    ea: '7',
    ken: '255'
  });

  const openAssignModal = (vendor: Vendor) => {
    setAssigningVendor(vendor);
    setMeterForm({
      meter_number: '',
      type: 'electricity',
      initial_reading: '0',
      status: 'active',
      sgc: '201457',
      krn: '1',
      ti: '1',
      ea: '7',
      ken: '255'
    });
    setAssignModalOpen(true);
  };

  const fetchMeters = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMetersError('Not signed in');
      setMeters([]);
      return;
    }
    setMetersError(null);
    try {
      // Admin can see all meters; request a larger page size
      const res = await axios.get(`${API_URL}/admin/meters?per_page=1000`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rawList = res.data?.data ?? (Array.isArray(res.data) ? res.data : []);
      const list = Array.isArray(rawList)
        ? (rawList as RawMeter[])
          .map(normalizeMeter)
          .filter((m): m is Meter => m !== null && Boolean(m.meter_number))
        : [];
      setMeters(list);
    } catch (e: unknown) {
      const message = axios.isAxiosError(e)
        ? (e.response?.data?.message || e.message || 'Failed to load meters')
        : 'Failed to load meters';
      setMetersError(message);
      setMeters([]);
    }
  }, [API_URL]);

  const submitMeterAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningVendor) return;

    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Not signed in',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        `${API_URL}/admin/meters`,
        {
          meter_number: meterForm.meter_number.trim(),
          vendor_id: assigningVendor.id,
          type: meterForm.type,
          initial_reading: parseFloat(meterForm.initial_reading || '0'),
          status: meterForm.status,
          sgc: parseInt(meterForm.sgc || '201457', 10),
          krn: parseInt(meterForm.krn || '1', 10),
          ti: parseInt(meterForm.ti || '1', 10),
          ea: parseInt(meterForm.ea || '7', 10),
          ken: parseInt(meterForm.ken || '255', 10)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Meter assigned to vendor',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      setAssignModalOpen(false);
      // refresh meters list so the newly assigned meter appears on the vendor card
      fetchMeters();
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message || err.message || 'Failed to assign meter')
        : 'Failed to assign meter';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fetchVendors = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setError('Not signed in');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/admin/vendors?per_page=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rawList = res.data?.data ?? (Array.isArray(res.data) ? res.data : []);
      const list = Array.isArray(rawList)
        ? (rawList as RawVendor[])
          .map(normalizeVendor)
          .filter((v): v is Vendor => Boolean(v))
        : [];

      setVendors(list);
    } catch (e: unknown) {
      const message = axios.isAxiosError(e)
        ? (e.response?.data?.message || e.message || 'Failed to load vendors')
        : 'Failed to load vendors';
      setError(message);
      setVendors([]);
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
  }, [API_URL]);

  useEffect(() => {
    // Only redirect when we're certain the user is a vendor (never when user is undefined / still loading)
    if (user && isVendor) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'Access denied. Vendor Overview is for administrators only.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      navigate('/dashboard', { replace: true });
      return;
    }
    if (canAccess && user) {
      fetchVendors();
      fetchMeters();
    }
  }, [user, isVendor, canAccess, fetchVendors, fetchMeters, navigate]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vendors;
    return vendors.filter((v) => v.business_name.toLowerCase().includes(q) || v.id.toLowerCase().includes(q));
  }, [vendors, search]);

  const metersByVendor = useMemo(() => {
    const map = new Map<string, Meter[]>();
    for (const m of meters) {
      if (!m.vendor_id) continue;
      const list = map.get(m.vendor_id) ?? [];
      list.push(m);
      map.set(m.vendor_id, list);
    }
    // stable sorting: meter_number
    for (const [k, list] of map.entries()) {
      list.sort((a, b) => a.meter_number.localeCompare(b.meter_number));
      map.set(k, list);
    }
    return map;
  }, [meters]);

  // Wait for user from layout context before deciding access (avoid redirecting before context is ready)
  if (!user) {
    return <DashboardLoader title="Loading..." subtitle="Checking access..." />;
  }
  if (loading) {
    return <DashboardLoader title="Loading Vendors" subtitle="Fetching vendor directory..." />;
  }

  return (
    <div className="p-6 md:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 mb-2 text-blue-600 dark:text-blue-400">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <Building2 size={22} />
            </div>
            <span className="font-bold tracking-widest uppercase text-xs">Directory</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Vendors <span className="text-dark-600 dark:text-blue-400">Overview</span>
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">
            View already added vendors. This list is used when assigning meters to vendors.
          </p>
        </motion.div>

        <button
          type="button"
          onClick={() => {
            fetchVendors();
            fetchMeters();
          }}
          className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendors by business name or id..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-2xl p-4 text-sm text-red-800 dark:text-red-200 flex items-start gap-3">
          <Activity className="mt-0.5" size={18} />
          <div className="flex-1">
            <div className="font-bold">Couldn’t load vendors</div>
            <div className="mt-1 opacity-90">{error}</div>
          </div>
        </div>
      )}

      {metersError && (
        <div className="mb-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 text-sm text-amber-800 dark:text-amber-200 flex items-start gap-3">
          <Activity className="mt-0.5" size={18} />
          <div className="flex-1">
            <div className="font-bold">Meters list not available</div>
            <div className="mt-1 opacity-90">{metersError}</div>
          </div>
        </div>
      )}

      {!error && filtered.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Building2 className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No vendors found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Add vendors in <strong>Vendor Management</strong>, then come back here to view them and assign meters.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((v, idx) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.03, 0.2) }}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Business</div>
                <div className="text-lg font-black text-slate-900 dark:text-white truncate">
                  {v.business_name || '(No business name)'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 break-all">
                  <span className="font-bold text-slate-600 dark:text-slate-300">ID:</span> {v.id}
                </div>
              </div>
              <div
                className={[
                  'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border',
                  v.status === 'active'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
                ].join(' ')}
              >
                {v.status || 'unknown'}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
              <div className="min-w-0">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account ID</div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                  {v.account_id || '—'}
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paybill</div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{v.paybill || '—'}</div>
              </div>
              <div className="col-span-2 min-w-0">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{v.address || '—'}</div>
              </div>
            </div>

            {/* Assigned meters for this vendor */}
            <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned meters</div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {(metersByVendor.get(v.id)?.length ?? 0).toString()}
                </div>
              </div>

              {metersByVendor.get(v.id)?.length ? (
                <div className="space-y-2 max-h-32 overflow-auto pr-1">
                  {metersByVendor.get(v.id)!.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-black text-slate-800 dark:text-slate-200 truncate">
                          {m.meter_number}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {m.type} • {m.status}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KES/unit</div>
                        <div className="text-sm font-black text-slate-800 dark:text-slate-200">{m.price_per_unit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 px-3 py-3 text-xs text-slate-500 dark:text-slate-400">
                  No meters assigned yet.
                </div>
              )}
            </div>

            <div className="mt-5 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openAssignModal(v)}
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
                <span>Assign Meter</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Assign Meter Modal */}
      {assignModalOpen && assigningVendor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => (submitting ? null : setAssignModalOpen(false))}
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
                  Assign meter to vendor
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vendor: <span className="font-bold text-slate-700 dark:text-slate-300">{assigningVendor.business_name || assigningVendor.id}</span>
                </p>
              </div>
              <button
                type="button"
                disabled={submitting}
                onClick={() => setAssignModalOpen(false)}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 shadow-sm disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitMeterAssignment} className="p-5 space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Meter Number</label>
                <div className="relative">
                  <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    required
                    value={meterForm.meter_number}
                    onChange={(e) => setMeterForm({ ...meterForm, meter_number: e.target.value })}
                    placeholder="e.g. MTR-001"
                    className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 pl-9 pr-3 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Type</label>
                  <select
                    value={meterForm.type}
                    onChange={(e) => setMeterForm({ ...meterForm, type: e.target.value })}
                    className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="electricity">Electricity</option>
                    <option value="water">Water</option>
                    <option value="gas">Gas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Status</label>
                  <select
                    value={meterForm.status}
                    onChange={(e) => setMeterForm({ ...meterForm, status: e.target.value })}
                    className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Initial Reading</label>
                  <input
                    type="number"
                    step="0.01"
                    value={meterForm.initial_reading}
                    onChange={(e) => setMeterForm({ ...meterForm, initial_reading: e.target.value })}
                    className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-3 py-2 text-[10px] md:text-xs text-slate-500 dark:text-slate-400">
                  <DollarSign className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>Pricing set by vendor later.</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <h3 className="block text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3 ml-1">Prism Key Configuration</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">SGC (Group Code)</label>
                    <input
                      type="number"
                      value={meterForm.sgc}
                      onChange={(e) => setMeterForm({ ...meterForm, sgc: e.target.value })}
                      className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">KRN (Key Rev No)</label>
                    <input
                      type="number"
                      value={meterForm.krn}
                      onChange={(e) => setMeterForm({ ...meterForm, krn: e.target.value })}
                      className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">TI (Tariff Index)</label>
                    <input
                      type="number"
                      value={meterForm.ti}
                      onChange={(e) => setMeterForm({ ...meterForm, ti: e.target.value })}
                      className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">EA</label>
                      <input
                        type="number"
                        value={meterForm.ea}
                        onChange={(e) => setMeterForm({ ...meterForm, ea: e.target.value })}
                        className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">KEN</label>
                      <input
                        type="number"
                        value={meterForm.ken}
                        onChange={(e) => setMeterForm({ ...meterForm, ken: e.target.value })}
                        className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 px-3 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setAssignModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white font-medium text-[13px] px-6 py-2.5 rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-[#0A1F44]/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Save className="w-3.5 h-3.5" />
                  {submitting ? 'Assigning...' : 'Assign meter'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

