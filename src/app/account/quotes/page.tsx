'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { Trash2, Loader2, ArrowRight, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface SavedQuote {
  _id: string;
  type: 'quick' | 'detailed';
  formData: any;
  rates: any[];
  expiresAt: string;
  createdAt: string;
}

const daysLeft = (expiresAt: string) => {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
};

const PER_PAGE = 10;

export default function SavedQuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const { data } = await authApi.getSavedQuotes({ page: p, limit: PER_PAGE });
      setQuotes(data.quotes || []);
      setPagination(data.pagination || null);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(page); }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this saved quote?')) return;
    setDeleting(id);
    try { await authApi.deleteSavedQuote(id); await load(page); toast.success('Quote removed.'); }
    catch { toast.error('Failed to remove.'); } finally { setDeleting(null); }
  };

  const handleResume = (q: SavedQuote) => {
    sessionStorage.setItem('pc_quote_form', JSON.stringify(q.formData));
    if (q.type === 'detailed') {
      sessionStorage.setItem('pc_booking_rates', JSON.stringify(q.rates));
      router.push('/booking');
    } else {
      sessionStorage.setItem('pc_rates', JSON.stringify(q.rates));
      router.push('/quote/results');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Saved Quotes</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#00529B]" /></div>
      ) : quotes.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-sm text-gray-500">No saved quotes yet. Quotes from Quick Quote are kept for 15 days, and from Rate &amp; Ship for 2 months.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100">{['Type','Route','Weight','Rates Found','Saved On','Expires',''].map(h => (
            <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400">{h}</th>
          ))}</tr></thead>
          <tbody className="divide-y divide-gray-50">
            {quotes.map((q) => (
              <tr key={q._id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${q.type === 'detailed' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                    {q.type === 'detailed' ? 'Rate & Ship' : 'Quick Quote'}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-600 text-xs">{q.formData?.originPostal} → {q.formData?.destinationPostal || '—'}</td>
                <td className="px-5 py-3 text-gray-600 text-xs">{q.formData?.weight} {q.formData?.weightUnit}</td>
                <td className="px-5 py-3 text-gray-600 text-xs">{q.rates?.length || 0}</td>
                <td className="px-5 py-3 text-gray-500 text-xs">{new Date(q.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-xs">
                  <span className="inline-flex items-center gap-1 text-gray-500">
                    <Clock className="w-3 h-3" /> {daysLeft(q.expiresAt)}d left
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleResume(q)} className="flex items-center gap-1 text-xs font-semibold text-[#00529B] hover:underline">
                      Resume <ArrowRight className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDelete(q._id)} disabled={deleting === q._id} className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                      {deleting === q._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm">
          <p className="text-xs text-gray-400">
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, pagination.total)} of {pagination.total}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 rounded border border-gray-200 text-gray-500 hover:border-[#00529B] hover:text-[#00529B] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(7, pagination.pages) }, (_, i) => {
              const pg = Math.max(1, Math.min(page - 3, pagination.pages - 6)) + i;
              return (
                <button key={pg} onClick={() => setPage(pg)}
                  className={`w-8 h-8 rounded text-xs font-medium transition-all ${pg === page ? 'bg-[#00529B] text-white' : 'border border-gray-200 text-gray-500 hover:border-[#00529B] hover:text-[#00529B]'}`}>
                  {pg}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
              className="p-1.5 rounded border border-gray-200 text-gray-500 hover:border-[#00529B] hover:text-[#00529B] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
