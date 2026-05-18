'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { shipmentApi } from '@/lib/api';
import {
  Search, RefreshCw, Loader2, Download, RotateCcw,
  XCircle, Truck, Printer, ChevronLeft, ChevronRight,
  RotateCw, Link2, Package,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_BADGE: Record<string, string> = {
  pending_payment: 'bg-yellow-100 text-yellow-700',
  paid:            'bg-blue-100 text-blue-700',
  label_generated: 'bg-indigo-100 text-indigo-700',
  pickup_scheduled:'bg-purple-100 text-purple-700',
  in_transit:      'bg-cyan-100 text-cyan-700',
  out_for_delivery:'bg-orange-100 text-orange-700',
  delivered:       'bg-green-100 text-green-700',
  cancelled:       'bg-red-100 text-red-700',
  refunded:        'bg-gray-100 text-gray-500',
};

const STATUS_LABEL: Record<string, string> = {
  pending_payment:  'Pending Payment',
  paid:             'Paid',
  label_generated:  'Ready For Shipping',
  pickup_scheduled: 'Ready For Shipping',
  in_transit:       'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
  refunded:         'Refunded',
};

const STATUS_SUB: Record<string, string> = {
  pickup_scheduled: 'Pick-up scheduled',
  label_generated:  'Label generated',
};

const SORT_OPTIONS = [
  { val: 'createdAt_desc', label: 'Newest First' },
  { val: 'createdAt_asc',  label: 'Oldest First' },
  { val: 'amount_desc',    label: 'Highest Charge' },
  { val: 'amount_asc',     label: 'Lowest Charge' },
];

const PER_PAGE_OPTIONS = [10, 20, 50];

const STATUS_FILTER_OPTIONS = [
  { val: '', label: 'All Statuses' },
  { val: 'pending_payment', label: 'Pending Payment' },
  { val: 'label_generated', label: 'Ready For Shipping' },
  { val: 'pickup_scheduled',label: 'Pick-up Scheduled' },
  { val: 'in_transit',      label: 'In Transit' },
  { val: 'out_for_delivery',label: 'Out for Delivery' },
  { val: 'delivered',       label: 'Delivered' },
  { val: 'cancelled',       label: 'Cancelled' },
];

function StatusCell({ status }: { status: string }) {
  const cls = STATUS_BADGE[status] || 'bg-gray-100 text-gray-500';
  const sub = STATUS_SUB[status];
  return (
    <div>
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
        {STATUS_LABEL[status] || status.replace(/_/g, ' ')}
      </span>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function downloadPDF(base64: string, filename: string) {
  const a = document.createElement('a');
  a.href = base64;
  a.download = filename;
  a.click();
}

export default function HistoryTrackingPage() {
  const router = useRouter();

  // Filters
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 45);
    return d.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('');
  const [trackingSearch, setTrackingSearch] = useState('');
  const [referenceSearch, setReferenceSearch] = useState('');
  const [shipFromTo, setShipFromTo] = useState('');
  const [includeCancelled, setIncludeCancelled] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [perPage, setPerPage] = useState(20);

  // Data
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [labelLoading, setLabelLoading] = useState<string | null>(null);
  const [labelCopies, setLabelCopies] = useState('01');

  const loadShipments = useCallback(async () => {
    setLoading(true);
    try {
      const search = [trackingSearch, referenceSearch, shipFromTo].filter(Boolean).join(' ');
      const params: any = {
        page, limit: perPage,
        search: search || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };

      if (statusFilter) {
        params.status = statusFilter;
      } else if (!includeCancelled) {
        // exclude cancelled when "include cancelled" is off and no explicit filter
        params.excludeStatus = 'cancelled';
      }

      const { data } = await shipmentApi.getMyShipments(params);
      let list = data.shipments || [];

      // Client-side sort for fields not sorted server-side
      if (sortBy === 'amount_desc') list = [...list].sort((a, b) => (b.payment?.amount || 0) - (a.payment?.amount || 0));
      if (sortBy === 'amount_asc')  list = [...list].sort((a, b) => (a.payment?.amount || 0) - (b.payment?.amount || 0));

      setShipments(list);
      setPagination(data.pagination);
      setSelected(new Set());
    } catch {
      toast.error('Failed to load shipments.');
    } finally {
      setLoading(false);
    }
  }, [page, perPage, statusFilter, trackingSearch, referenceSearch, shipFromTo, dateFrom, dateTo, includeCancelled, sortBy]);

  useEffect(() => { loadShipments(); }, [loadShipments]);

  const handleSearch = () => { setPage(1); loadShipments(); };
  const handleReset = () => {
    const d = new Date(); d.setDate(d.getDate() - 45);
    setDateFrom(d.toISOString().split('T')[0]);
    setDateTo(new Date().toISOString().split('T')[0]);
    setStatusFilter(''); setTrackingSearch(''); setReferenceSearch('');
    setShipFromTo(''); setIncludeCancelled(false); setSortBy('createdAt_desc');
    setPerPage(20); setPage(1);
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };
  const selectAll = () => setSelected(new Set(shipments.map(s => s._id)));
  const clearAll  = () => setSelected(new Set());

  const handleDownloadLabel = async (s: any) => {
    setLabelLoading(s._id);
    try {
      const { data } = await shipmentApi.downloadLabel(s._id);
      downloadPDF(data.label, `label-${data.trackingNumber || s.shipmentNumber}.pdf`);
      toast.success('Label downloaded.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Label not available yet.');
    } finally {
      setLabelLoading(null);
    }
  };

  const handlePrintSelected = async () => {
    if (!selected.size) { toast.error('Select at least one shipment.'); return; }
    const ids = [...selected];
    for (const id of ids) {
      const s = shipments.find(x => x._id === id);
      if (s) await handleDownloadLabel(s);
    }
  };

  const handleRepeat = (s: any) => {
    const qf = {
      originPostal: s.shipper?.postalCode || '',
      originCity: s.shipper?.city || '',
      originProvince: s.shipper?.province || '',
      originCountry: s.shipper?.country || 'CA',
      originResidential: s.shipper?.isResidential || false,
      destinationPostal: s.recipient?.postalCode || '',
      destinationCity: s.recipient?.city || '',
      destinationProvince: s.recipient?.province || '',
      destinationCountry: s.recipient?.country || 'CA',
      destinationResidential: s.recipient?.isResidential || false,
      weightUnit: s.parcels?.[0]?.weightUnit || 'lbs',
      dimensionUnit: s.parcels?.[0]?.dimensionUnit || 'in',
      shipmentType: s.shipmentType || 'domestic',
      packages: (s.parcels || []).map((p: any) => ({
        id: Math.random().toString(36).slice(2),
        length: String(p.length || ''), width: String(p.width || ''), height: String(p.height || ''),
        weight: String(p.weight || ''), insuranceAmount: String(p.insuranceAmount || '0.00'),
        specialHandling: p.specialHandling || false, description: p.description || '',
      })),
    };
    sessionStorage.setItem('pc_quote_form', JSON.stringify(qf));
    toast.success('Shipment details loaded — rate and rebook!');
    router.push('/booking');
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this shipment?')) return;
    try {
      const { data } = await shipmentApi.cancel(id, 'Customer requested cancellation');
      toast.success(`Cancelled. ${data.refundNote}`);
      loadShipments();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Cancellation failed.');
    }
  };

  const hasLabel = (s: any) => ['label_generated','pickup_scheduled','in_transit','out_for_delivery','delivered'].includes(s.status);
  const cancellable = (s: any) => ['pending_payment','paid','label_generated'].includes(s.status);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-CA', { day: '2-digit', month: 'short', year: '2-digit' });
  const fmtWeight = (s: any) => {
    const w = (s.parcels || []).reduce((t: number, p: any) => t + (p.weight || 0), 0);
    return `${w.toFixed(2)} ${s.parcels?.[0]?.weightUnit?.toUpperCase() || 'LBS'}`;
  };

  return (
    <div className="space-y-4">
      {/* ── Search & Filter ── */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700 text-sm">Search &amp; Filter</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {/* Date range */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs text-gray-500 mb-1">Select time period</label>
              <div className="flex gap-1 items-center">
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-brand-navy" />
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-brand-navy" />
              </div>
            </div>

            {/* Order Status */}
            <div>
              <label className="block text-xs text-[#c0392b] font-medium mb-1">Order Status</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-navy bg-white">
                {STATUS_FILTER_OPTIONS.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
              </select>
            </div>

            {/* Tracking # */}
            <div>
              <label className="block text-xs text-[#c0392b] font-medium mb-1">Tracking #</label>
              <input type="text" value={trackingSearch} onChange={e => setTrackingSearch(e.target.value)}
                placeholder="Tracking number"
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-navy" />
            </div>

            {/* Reference */}
            <div>
              <label className="block text-xs text-[#c0392b] font-medium mb-1">Reference</label>
              <input type="text" value={referenceSearch} onChange={e => setReferenceSearch(e.target.value)}
                placeholder="Reference value"
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-navy" />
            </div>

            {/* Shipped From/To */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Shipped From/To</label>
              <input type="text" value={shipFromTo} onChange={e => setShipFromTo(e.target.value)}
                placeholder="City, postal code..."
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-navy" />
            </div>

            {/* Sort by */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Sort by</label>
              <div className="flex gap-1">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-brand-navy bg-white">
                  {SORT_OPTIONS.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Results per page */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Results Per Page</label>
              <select value={perPage} onChange={e => setPerPage(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-navy bg-white">
                {PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            {/* Include cancelled */}
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
                <input type="checkbox" checked={includeCancelled} onChange={e => setIncludeCancelled(e.target.checked)} className="accent-brand-navy" />
                Include Cancelled Shipments
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={handleSearch}
              className="px-6 py-2 text-sm font-semibold rounded text-white bg-brand-navy hover:bg-brand-navy/90 transition-all flex items-center gap-2">
              <Search className="w-3.5 h-3.5" /> Search
            </button>
            <button
              className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded text-gray-600 hover:border-brand-navy hover:text-brand-navy transition-all bg-white">
              Save List
            </button>
            <button onClick={handleReset}
              className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded text-gray-600 hover:border-brand-navy hover:text-brand-navy transition-all bg-white">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* ── Results table ── */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Table header bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700 text-sm">
            {loading ? 'Loading...' : `${pagination?.total ?? shipments.length} Shipment${(pagination?.total ?? shipments.length) !== 1 ? 's' : ''}`}
          </h3>
          <div className="flex items-center gap-3">
            {/* Label copies */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Shipping Label Copies</span>
              <select value={labelCopies} onChange={e => setLabelCopies(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-brand-navy bg-white w-14">
                {['01','02','03'].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <button onClick={handlePrintSelected}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded text-white bg-brand-navy hover:bg-brand-navy/90 transition-all">
              <Printer className="w-3.5 h-3.5" /> Print Label
            </button>
            <button onClick={loadShipments} className="p-1.5 text-gray-400 hover:text-brand-navy transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link href="/booking" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-brand-orange text-white hover:bg-orange-600 transition-all">
              <Package className="w-3.5 h-3.5" /> New Shipment
            </Link>
          </div>
        </div>

        {/* Select all / clear all */}
        <div className="flex items-center gap-4 px-5 py-2 border-b border-gray-100 text-xs">
          <button onClick={selectAll} className="text-brand-orange hover:underline font-medium">Select All</button>
          <button onClick={clearAll} className="text-gray-400 hover:underline">Clear All</button>
          {selected.size > 0 && <span className="text-gray-500">{selected.size} selected</span>}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin text-brand-orange" />
          </div>
        ) : shipments.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No shipments found matching your filters.</p>
            <button onClick={handleReset} className="mt-3 text-xs text-brand-orange hover:underline">Reset Filters</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="w-8 px-3 py-3" />
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Shipping Date</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Order #</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Tracking #</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Service &amp; Carrier</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    <span className="block">Quoted Weight</span>
                    <span className="block text-gray-300">Billed Weight</span>
                  </th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    <span className="block">Quoted Charge</span>
                    <span className="block text-gray-300">Billed Charge</span>
                  </th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Shipped To</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {shipments.map((s: any) => (
                  <tr key={s._id} className={`hover:bg-gray-50 transition-colors ${selected.has(s._id) ? 'bg-orange-50' : ''}`}>
                    {/* Checkbox */}
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(s._id)}
                        onChange={() => toggleSelect(s._id)}
                        className="accent-brand-navy w-4 h-4"
                      />
                    </td>

                    {/* Shipping Date */}
                    <td className="px-3 py-3 text-gray-600 whitespace-nowrap text-xs">
                      {fmtDate(s.createdAt)}
                    </td>

                    {/* Order # */}
                    <td className="px-3 py-3">
                      <p className="font-mono text-xs font-semibold text-brand-navy">{s.shipmentNumber}</p>
                      {s.netparcelOrderId && (
                        <p className="text-xs text-gray-400">{s.netparcelOrderId}</p>
                      )}
                    </td>

                    {/* Tracking # */}
                    <td className="px-3 py-3">
                      {s.trackingNumber ? (
                        <Link href={`/track?number=${s.trackingNumber}`}
                          className="font-mono text-xs text-brand-orange hover:underline">
                          {s.trackingNumber.length > 14 ? s.trackingNumber.slice(0, 14) + '…' : s.trackingNumber}
                        </Link>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </td>

                    {/* Service & Carrier */}
                    <td className="px-3 py-3">
                      <p className="font-semibold text-gray-800 text-xs">{s.selectedRate?.carrierName}</p>
                      <p className="text-xs text-gray-400">{s.selectedRate?.serviceName}</p>
                    </td>

                    {/* Weight */}
                    <td className="px-3 py-3 text-xs">
                      <p className="text-gray-700">{fmtWeight(s)}</p>
                      <p className="text-gray-400">{fmtWeight(s)}</p>
                    </td>

                    {/* Charge */}
                    <td className="px-3 py-3 text-xs">
                      <p className="font-semibold text-gray-800">${s.payment?.amount?.toFixed(2)} {s.payment?.currency}</p>
                      <p className="text-gray-400">${s.payment?.amount?.toFixed(2)} {s.payment?.currency}</p>
                    </td>

                    {/* Shipped To */}
                    <td className="px-3 py-3">
                      <p className="text-gray-700 text-xs truncate max-w-[120px]">
                        {s.recipient?.company || s.recipient?.name}, {s.recipient?.city}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      <StatusCell status={s.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        {/* Reprint / refresh */}
                        {hasLabel(s) ? (
                          <button
                            onClick={() => handleDownloadLabel(s)}
                            disabled={labelLoading === s._id}
                            title="Download / Reprint Label"
                            className="p-1.5 text-gray-400 hover:text-brand-navy transition-colors rounded hover:bg-gray-100"
                          >
                            {labelLoading === s._id
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <RotateCw className="w-3.5 h-3.5" />}
                          </button>
                        ) : (
                          <button title="Track" onClick={() => s.trackingNumber && router.push(`/track?number=${s.trackingNumber}`)}
                            className="p-1.5 text-gray-400 hover:text-brand-navy transition-colors rounded hover:bg-gray-100">
                            <Truck className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Copy tracking link */}
                        {s.trackingNumber && (
                          <button
                            title="Copy tracking link"
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/track?number=${s.trackingNumber}`);
                              toast.success('Tracking link copied!');
                            }}
                            className="p-1.5 text-gray-400 hover:text-brand-navy transition-colors rounded hover:bg-gray-100"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Repeat */}
                        <button
                          onClick={() => handleRepeat(s)}
                          title="Repeat Shipment"
                          className="p-1.5 text-gray-400 hover:text-green-600 transition-colors rounded hover:bg-gray-100"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        {/* Cancel */}
                        {cancellable(s) && (
                          <button
                            onClick={() => handleCancel(s._id)}
                            title="Cancel Shipment"
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-gray-100"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm">
            <p className="text-xs text-gray-400">
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded border border-gray-200 text-gray-500 hover:border-brand-navy hover:text-brand-navy disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(7, pagination.pages) }, (_, i) => {
                const pg = Math.max(1, Math.min(page - 3, pagination.pages - 6)) + i;
                return (
                  <button key={pg} onClick={() => setPage(pg)}
                    className={`w-8 h-8 rounded text-xs font-medium transition-all ${pg === page ? 'bg-brand-navy text-white' : 'border border-gray-200 text-gray-500 hover:border-brand-navy hover:text-brand-navy'}`}>
                    {pg}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                className="p-1.5 rounded border border-gray-200 text-gray-500 hover:border-brand-navy hover:text-brand-navy disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
