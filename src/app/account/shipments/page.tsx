'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/lib/store';
import { shipmentApi } from '@/lib/api';
import { Package, ArrowRight, Loader2, RefreshCw, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyShipmentsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    loadShipments();
  }, [isAuthenticated, page]);

  const loadShipments = async () => {
    setLoading(true);
    try {
      const { data } = await shipmentApi.getMyShipments({ page, limit: 10 });
      setShipments(data.shipments);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load shipments.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this shipment?')) return;
    try {
      const { data } = await shipmentApi.cancel(id, 'Customer requested cancellation');
      toast.success(`Shipment cancelled. Refund: $${data.refundAmount?.toFixed(2)} — ${data.refundNote}`);
      loadShipments();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Cancellation failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display font-800 text-2xl text-brand-navy">My Shipments</h1>
              <p className="text-gray-500 text-sm">Welcome back, {user?.firstName}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={loadShipments} className="btn-ghost p-2.5">
                <RefreshCw className="w-4 h-4" />
              </button>
              <Link href="/quote" className="btn-primary text-sm">
                <Package className="w-4 h-4" /> New Shipment
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
          ) : shipments.length === 0 ? (
            <div className="card p-12 text-center">
              <Package className="w-14 h-14 text-gray-200 mx-auto mb-4" />
              <p className="font-display font-700 text-xl text-brand-navy mb-2">No shipments yet</p>
              <p className="text-gray-500 text-sm mb-6">Create your first shipment to get started.</p>
              <Link href="/quote" className="btn-primary text-sm">Get a Quote</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {shipments.map((s: any) => (
                <div key={s._id} className="card p-5 hover:shadow-card-hover transition-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-mono font-semibold text-sm text-brand-navy">{s.shipmentNumber}</p>
                        <span className={`status-${s.status}`}>{s.status?.replace(/_/g, ' ')}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {s.shipper?.city}, {s.shipper?.province}
                        <span className="text-gray-300 mx-2">→</span>
                        {s.recipient?.city}, {s.recipient?.province}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {s.selectedRate?.carrierName} · {s.selectedRate?.serviceName} · ${s.payment?.amount?.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.trackingNumber && (
                        <Link href={`/track?number=${s.trackingNumber}`} className="btn-ghost text-xs py-1.5 px-3 gap-1">
                          Track <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                      {['pending_payment', 'paid', 'label_generated'].includes(s.status) && (
                        <button onClick={() => handleCancel(s._id)} className="text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 mt-3">
                    {new Date(s.createdAt).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              ))}

              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-4">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-sm py-2 px-4 disabled:opacity-40">Prev</button>
                  <span className="text-sm text-gray-500">Page {page} of {pagination.pages}</span>
                  <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-secondary text-sm py-2 px-4 disabled:opacity-40">Next</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
