'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import {
  Package, Users, DollarSign, Truck, Search, ChevronDown,
  RefreshCw, Download, Edit2, CheckCircle2, LayoutDashboard,
  TrendingUp, Clock, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  'all', 'quote', 'pending_payment', 'paid', 'label_generated',
  'pickup_scheduled', 'in_transit', 'out_for_delivery', 'delivered',
  'cancelled', 'refunded'
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [editStatusId, setEditStatusId] = useState<string | null>(null);
  const [tab, setTab] = useState<'shipments' | 'users'>('shipments');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    loadShipments();
  }, [search, statusFilter, page]);

  const loadDashboard = async () => {
    try {
      const { data } = await adminApi.getDashboard();
      setStats(data.stats);
    } catch {
      toast.error('Failed to load dashboard stats.');
    }
  };

  const loadShipments = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getShipments({ page, limit: 15, status: statusFilter === 'all' ? undefined : statusFilter, search: search || undefined });
      setShipments(data.shipments);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load shipments.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await adminApi.updateStatus(id, status);
      toast.success('Status updated.');
      setEditStatusId(null);
      loadShipments();
      loadDashboard();
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const statCards = stats ? [
    { label: 'Total Shipments', value: stats.totalShipments, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: "Today's Shipments", value: stats.todayShipments, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Revenue', value: `$${(stats.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: 'text-brand-orange', bg: 'bg-orange-50' },
    { label: 'Active Shipments', value: stats.activeShipments, icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Customers', value: stats.totalUsers, icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Nav */}
      <header className="bg-brand-navy text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-5 h-5 text-brand-orange" />
          <span className="font-display font-700 text-lg">Pilot Courier <span className="text-brand-orange">Admin</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-sm">{user?.firstName} {user?.lastName}</span>
          <a href="/" className="text-xs text-white/40 hover:text-white transition-colors">← View Site</a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card p-5">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="font-display font-800 text-2xl text-brand-navy">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
          {!stats && <div className="card p-5 col-span-5 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>}
        </div>

        {/* Shipments Table */}
        <div className="card overflow-hidden">
          {/* Table Header */}
          <div className="p-5 border-b border-gray-100 flex flex-wrap items-center gap-3">
            <h2 className="font-display font-700 text-brand-navy text-lg flex-1">Shipments</h2>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search shipments..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange w-56"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="py-2 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange capitalize"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace(/_/g, ' ')}</option>
              ))}
            </select>

            <button onClick={loadShipments} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {['Shipment #', 'Customer', 'From → To', 'Carrier', 'Amount', 'Status', 'Created', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {shipments.map((s: any) => (
                    <tr key={s._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-brand-navy font-semibold">{s.shipmentNumber}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800 text-xs">{s.userId?.firstName || 'Guest'} {s.userId?.lastName || ''}</p>
                        <p className="text-gray-400 text-xs">{s.userId?.email || s.guestEmail || '—'}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        <span>{s.shipper?.city}, {s.shipper?.province}</span>
                        <span className="text-gray-300 mx-1">→</span>
                        <span>{s.recipient?.city}, {s.recipient?.province}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700">{s.selectedRate?.carrierName}</td>
                      <td className="px-4 py-3 font-semibold text-brand-navy text-xs">${s.payment?.amount?.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        {editStatusId === s._id ? (
                          <select
                            defaultValue={s.status}
                            onChange={e => handleStatusUpdate(s._id, e.target.value)}
                            autoFocus
                            onBlur={() => setEditStatusId(null)}
                            className="text-xs border border-brand-orange rounded px-2 py-1 focus:outline-none"
                          >
                            {STATUS_OPTIONS.filter(s => s !== 'all').map(st => (
                              <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>
                            ))}
                          </select>
                        ) : (
                          <span className={`status-${s.status}`}>
                            {s.status?.replace(/_/g, ' ')}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(s.createdAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: '2-digit' })}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setEditStatusId(s._id)}
                          className="p-1.5 hover:bg-orange-50 rounded-lg text-gray-400 hover:text-brand-orange transition-colors"
                          title="Edit Status"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!loading && shipments.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No shipments found.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm">
              <p className="text-gray-400 text-xs">Showing {shipments.length} of {pagination.total} shipments</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-gray-50 disabled:opacity-40">Prev</button>
                <span className="text-xs text-gray-500">Page {page} of {pagination.pages}</span>
                <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-gray-50 disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
