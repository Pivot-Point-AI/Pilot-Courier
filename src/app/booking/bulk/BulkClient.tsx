'use client';
import { useMemo, useRef, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';
import { Upload, RefreshCw } from 'lucide-react';
import { ShipmentModeTabs } from '../_components/ShipmentModeTabs';
import { inp } from '../_components/styles';
import { ALL_COUNTRIES } from '../_lib/constants';
import { parseOrdersCsv, type BulkOrder } from './_lib/csv';

const HOME_COUNTRY = 'CA';

export default function BulkClient() {
  const [orders, setOrders] = useState<BulkOrder[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [destination, setDestination] = useState<'all' | 'domestic' | 'international'>('all');
  const [source, setSource] = useState<'all' | 'csv'>('all');
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const countryName = (code: string) => ALL_COUNTRIES.find(c => c.code === code.toUpperCase())?.name || code;

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const rows = parseOrdersCsv(String(reader.result || ''));
      if (!rows.length) {
        toast.error('No orders found in that CSV file.');
        return;
      }
      const now = Date.now();
      const newOrders: BulkOrder[] = rows.map((r, i) => ({
        id: Math.random().toString(36).slice(2),
        ...r,
        source: 'CSV Upload',
        addedAt: now + i,
      }));
      setOrders(prev => [...prev, ...newOrders]);
      toast.success(`Imported ${newOrders.length} order${newOrders.length === 1 ? '' : 's'} from CSV.`);
    };
    reader.readAsText(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const filtered = useMemo(() => {
    let list = orders;
    if (destination !== 'all') {
      list = list.filter(o => (o.country.toUpperCase() === HOME_COUNTRY) === (destination === 'domestic'));
    }
    if (source === 'csv') {
      list = list.filter(o => o.source === 'CSV Upload');
    }
    return [...list].sort((a, b) => (sortBy === 'newest' ? b.addedAt - a.addedAt : a.addedAt - b.addedAt));
  }, [orders, destination, source, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleRow = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    setSelected(prev => (prev.size === pageRows.length && pageRows.length > 0 ? new Set() : new Set(pageRows.map(r => r.id))));
  };

  const requireSelection = (action: string) => {
    if (selected.size === 0) return;
    toast(`${action} for ${selected.size} order${selected.size === 1 ? '' : 's'} is coming soon.`);
  };

  const removeSelected = () => {
    if (selected.size === 0) return;
    setOrders(prev => prev.filter(o => !selected.has(o.id)));
    setSelected(new Set());
  };

  const actionButtons = [
    { label: 'Cancel', onClick: removeSelected },
    { label: 'Edit packages', onClick: () => requireSelection('Editing packages') },
    { label: 'Edit additional services', onClick: () => requireSelection('Editing additional services') },
    { label: 'Edit rates', onClick: () => requireSelection('Editing rates') },
    { label: 'Buy labels', onClick: () => requireSelection('Buying labels') },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <Navbar />
      <div className="pt-24">
        <ShipmentModeTabs mode="bulk" />

        <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
          <h1 className="text-lg font-semibold text-gray-700">Bulk Shipping</h1>

          {orders.length === 0 && (
            <div className="bg-blue-50 border border-blue-100 text-sm text-blue-700 rounded-lg px-4 py-3">
              No carts found, but you can use the «Upload CSV» function.
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-4 py-3 border-b border-gray-100">
              <span className="font-semibold text-gray-700 text-sm">Unfulfilled orders</span>
              <div className="flex flex-wrap items-center gap-2">
                <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={onFileChange} />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-semibold rounded text-white bg-brand-navy hover:bg-brand-navy/90 flex items-center gap-1.5 transition-all"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload CSV
                </button>
                <button
                  type="button"
                  onClick={() => toast('No connected store. Add one in Account → Stores to sync orders.')}
                  className="px-3 py-1.5 text-xs font-semibold rounded text-white bg-brand-navy hover:bg-brand-navy/90 flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Sync Orders
                </button>
                {actionButtons.map(btn => (
                  <button
                    key={btn.label}
                    type="button"
                    disabled={selected.size === 0}
                    onClick={btn.onClick}
                    className="px-3 py-1.5 text-xs font-semibold rounded border border-gray-300 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed enabled:text-gray-600 enabled:hover:border-brand-navy enabled:hover:text-brand-navy transition-all"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 px-4 py-3 border-b border-gray-100 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span>Sort by</span>
                <select className={`${inp} py-1 w-28`} value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span>Destination</span>
                <select className={`${inp} py-1 w-32`} value={destination} onChange={e => { setDestination(e.target.value as any); setPage(1); }}>
                  <option value="all">All</option>
                  <option value="domestic">Domestic</option>
                  <option value="international">International</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span>Source</span>
                <select className={`${inp} py-1 w-32`} value={source} onChange={e => { setSource(e.target.value as any); setPage(1); }}>
                  <option value="all">All</option>
                  <option value="csv">CSV Upload</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span>Results Per Page</span>
                <select className={`${inp} py-1 w-20`} value={perPage} onChange={e => { setPerPage(parseInt(e.target.value)); setPage(1); }}>
                  {[10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            {pageRows.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-gray-400">
                No unfulfilled orders. Upload a CSV to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400 border-b border-gray-100">
                      <th className="px-4 py-2 text-left w-8">
                        <input type="checkbox" checked={selected.size === pageRows.length} onChange={toggleAll} className="accent-brand-navy" />
                      </th>
                      <th className="px-2 py-2 text-left">Order #</th>
                      <th className="px-2 py-2 text-left">Recipient</th>
                      <th className="px-2 py-2 text-left">Destination</th>
                      <th className="px-2 py-2 text-left">Items</th>
                      <th className="px-2 py-2 text-left">Weight</th>
                      <th className="px-2 py-2 text-left">Source</th>
                      <th className="px-2 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map(o => (
                      <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <input type="checkbox" checked={selected.has(o.id)} onChange={() => toggleRow(o.id)} className="accent-brand-navy" />
                        </td>
                        <td className="px-2 py-2 font-medium text-gray-700">{o.orderNumber}</td>
                        <td className="px-2 py-2 text-gray-600">{o.recipientName || '—'}</td>
                        <td className="px-2 py-2 text-gray-600">{[o.city, countryName(o.country)].filter(Boolean).join(', ') || '—'}</td>
                        <td className="px-2 py-2 text-gray-600">{o.items || '—'}</td>
                        <td className="px-2 py-2 text-gray-600">{o.weight || '—'}</td>
                        <td className="px-2 py-2 text-gray-500">{o.source}</td>
                        <td className="px-2 py-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">Unfulfilled</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filtered.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
                <span>{filtered.length} order{filtered.length === 1 ? '' : 's'}</span>
                <div className="flex items-center gap-2">
                  <button type="button" disabled={currentPage <= 1} onClick={() => setPage(p => p - 1)} className="px-2 py-1 border border-gray-300 rounded disabled:opacity-40">Prev</button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage(p => p + 1)} className="px-2 py-1 border border-gray-300 rounded disabled:opacity-40">Next</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
