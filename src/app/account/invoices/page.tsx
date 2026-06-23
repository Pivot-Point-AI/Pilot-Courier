'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { shipmentApi } from '@/lib/api';
import { Loader2, ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const inp = 'border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-[#00529B] bg-white';

const STATUS_OPTS = [
  { val: '', label: 'Choose status' },
  { val: 'paid', label: 'Paid' },
  { val: 'pending', label: 'Pending' },
  { val: 'refunded', label: 'Refunded' },
];

const PER_PAGE_OPTS = [10, 20, 50];

// Generate invoice number from shipment
const invoiceNum = (s: any) => {
  const n = s.netparcelOrderId || parseInt(s._id.slice(-7), 16) % 9999999;
  return `NPI${String(n).padStart(6, '0')}`;
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-CA', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-');

const dueDateStr = (d: string) => {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + 5);
  return fmtDate(dt.toISOString());
};

export default function InvoicesPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [shipments, setShipments] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const totalPages = Math.ceil(total / perPage);

  const doSearch = useCallback(async (pg = 1) => {
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await shipmentApi.getMyShipments({
        page: pg, limit: perPage,
        search: invoiceNumber || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        status: paymentStatus || undefined,
      });
      const list = (data.shipments || []).filter((s: any) =>
        ['paid','label_generated','pickup_scheduled','in_transit','out_for_delivery','delivered','refunded'].includes(s.status)
      );
      setShipments(list);
      setTotal(data.pagination?.total || list.length);
      setPage(pg);
    } catch { toast.error('Failed to load invoices.'); }
    finally { setLoading(false); }
  }, [perPage, invoiceNumber, dateFrom, dateTo, paymentStatus]);

  const handleSearch = () => doSearch(1);
  const handleReset = () => {
    setDateFrom(''); setDateTo(''); setInvoiceNumber(''); setPaymentStatus('');
    setPerPage(20); setPage(1); setShipments([]); setSearched(false);
  };

  const handleDownload = async (s: any) => {
    try {
      const { data } = await shipmentApi.downloadLabel(s._id);
      const a = document.createElement('a');
      a.href = data.label;
      a.download = `invoice-${invoiceNum(s)}.pdf`;
      a.click();
    } catch { toast.error('Label not available.'); }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Title */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Invoices</h2>
      </div>

      {/* Filter bar */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
          <div className="w-full sm:w-auto">
            <p className="text-xs text-gray-500 mb-1">From Date</p>
            <div className="relative">
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className={`${inp} w-full sm:w-auto`} />
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <p className="text-xs text-gray-500 mb-1">To Date</p>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className={`${inp} w-full sm:w-auto`} />
          </div>
          <div className="w-full sm:w-auto">
            <p className="text-xs text-gray-500 mb-1">Invoice Number</p>
            <input type="text" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)}
              placeholder="NPI..." className={`${inp} w-full sm:w-36`} />
          </div>
          <div className="w-full sm:w-auto">
            <p className="text-xs text-gray-500 mb-1">Payment Status</p>
            <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} className={`${inp} w-full sm:w-auto`}>
              {STATUS_OPTS.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <p className="text-xs text-gray-500 mb-1">Results Per Page</p>
            <select value={perPage} onChange={e => setPerPage(Number(e.target.value))} className={`${inp} w-full sm:w-auto`}>
              {PER_PAGE_OPTS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap gap-2 pb-0.5 w-full sm:w-auto">
            <button onClick={handleSearch}
              className="px-5 py-1.5 text-sm border border-gray-300 rounded text-gray-600 hover:border-[#00529B] hover:text-[#00529B] transition-all bg-white flex-1 sm:flex-initial">
              Search
            </button>
            <button className="px-5 py-1.5 text-sm border border-gray-300 rounded text-gray-600 hover:border-[#00529B] transition-all bg-white flex-1 sm:flex-initial">
              Summary
            </button>
            <button onClick={handleReset}
              className="px-5 py-1.5 text-sm border border-gray-300 rounded text-gray-600 hover:border-gray-400 transition-all bg-white flex-1 sm:flex-initial">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[#00529B]" /></div>
      ) : !searched ? (
        <div className="px-6 py-10 text-sm text-gray-400">
          Use the filters above and click <strong>Search</strong> to view your invoices.
        </div>
      ) : shipments.length === 0 ? (
        <div className="px-6 py-10 text-sm text-gray-400">No invoices found for the selected filters.</div>
      ) : (
        <>
          {/* Count + pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">
              <span className="text-[#00529B] font-bold mr-1">{total}</span> Invoices
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{page} of {totalPages}</span>
                <button onClick={() => doSearch(Math.max(1, page - 1))} disabled={page === 1}
                  className="p-1 border border-gray-300 rounded hover:border-[#00529B] disabled:opacity-40 transition-all">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => doSearch(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                  className="p-1 border border-gray-300 rounded hover:border-[#00529B] disabled:opacity-40 transition-all">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden p-3 space-y-3 bg-gray-50">
            {shipments.map((s: any) => {
              const inv = invoiceNum(s);
              const amt = s.payment?.amount || 0;
              const overdue = new Date(s.createdAt).getTime() + 5 * 86400000 < Date.now() && s.payment?.status !== 'completed';
              const statusLabel = s.payment?.status === 'completed' ? 'Paid' : s.payment?.status || 'Pending';
              return (
                <div key={s._id} className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <div className="flex items-center gap-3 px-4 pt-4">
                    <div className="w-10 h-10 rounded-xl bg-[#00529B] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 shadow-sm">
                      INV
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/account/invoices/${s._id}`} className="font-mono text-[13px] font-bold text-[#c0392b] hover:underline truncate block">{inv}</Link>
                      <p className="text-[11px] text-gray-400">{fmtDate(s.createdAt)}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusLabel === 'Paid' ? 'bg-green-100 text-green-700' : overdue ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="px-4 pt-3 pb-4 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Due Date</p>
                        <p className={`font-medium ${overdue ? 'text-[#c0392b]' : 'text-gray-700'}`}>{dueDateStr(s.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Total</p>
                        <p className="font-bold text-[#00529B] text-base leading-tight">${amt.toFixed(2)} <span className="text-[10px] font-normal text-gray-400">{s.payment?.currency || 'CAD'}</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 border-t border-gray-100 divide-x divide-gray-100 bg-gray-50/60">
                    <button onClick={() => handleDownload(s)}
                      className="flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-semibold text-gray-500 hover:bg-white hover:text-[#00529B] transition-colors">
                      <Download className="w-4 h-4" /> Download
                    </button>
                    <Link href={`/account/invoices/${s._id}`}
                      className="flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-semibold text-gray-500 hover:bg-white hover:text-[#00529B] transition-colors">
                      <FileText className="w-4 h-4" /> View
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Invoice #','Invoiced','Due Date','Currency','Total','Balance','Status','Invoice Attachments',''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {shipments.map((s: any) => {
                  const inv = invoiceNum(s);
                  const amt = s.payment?.amount || 0;
                  const overdue = new Date(s.createdAt).getTime() + 5 * 86400000 < Date.now() && s.payment?.status !== 'completed';
                  return (
                    <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <Link href={`/account/invoices/${s._id}`}
                          className="text-[#c0392b] hover:underline font-medium text-xs">
                          {inv}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-600">{fmtDate(s.createdAt)}</td>
                      <td className={`px-5 py-3 text-xs ${overdue ? 'text-[#c0392b]' : 'text-gray-600'}`}>
                        {dueDateStr(s.createdAt)}
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-600">{s.payment?.currency || 'CAD'}</td>
                      <td className="px-5 py-3 text-xs font-semibold text-gray-800">${amt.toFixed(2)}</td>
                      <td className="px-5 py-3 text-xs text-gray-600">$0.00</td>
                      <td className="px-5 py-3">
                        <span className="text-xs text-gray-600">
                          {s.payment?.status === 'completed' ? 'Paid' : s.payment?.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {/* PDF */}
                          <button onClick={() => handleDownload(s)} title="Download PDF"
                            className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity">
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                              <rect width="24" height="24" rx="3" fill="#E74C3C"/>
                              <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">PDF</text>
                            </svg>
                          </button>
                          {/* XLS placeholder */}
                          <button title="Download Excel" className="w-6 h-6 flex items-center justify-center opacity-40 cursor-not-allowed">
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                              <rect width="24" height="24" rx="3" fill="#27AE60"/>
                              <text x="12" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">XLS</text>
                            </svg>
                          </button>
                          {/* CSV placeholder */}
                          <button title="Download CSV" className="w-6 h-6 flex items-center justify-center opacity-40 cursor-not-allowed">
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                              <rect width="24" height="24" rx="3" fill="#2980B9"/>
                              <text x="12" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">CSV</text>
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <button title="Send invoice" className="text-gray-300 hover:text-gray-500 transition-colors">
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-gray-100 text-xs text-gray-500">
              <span>{page} of {totalPages}</span>
              <button onClick={() => doSearch(Math.max(1, page - 1))} disabled={page === 1}
                className="p-1 border border-gray-300 rounded hover:border-[#00529B] disabled:opacity-40 transition-all">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => doSearch(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                className="p-1 border border-gray-300 rounded hover:border-[#00529B] disabled:opacity-40 transition-all">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
