'use client';
import { useState, useEffect } from 'react';
import { authApi } from '@/lib/api';
import { Plus, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const inp = 'w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-[#00529B] bg-white';
const lbl = 'block text-xs text-gray-500 mb-0.5';

const TICKET_TYPES = ['General Inquiry','Billing Issue','Shipment Issue','Technical Support','Rate Dispute','Other'];
const STATUS_COLOR: Record<string, string> = { open: 'bg-yellow-100 text-yellow-700', in_progress: 'bg-blue-100 text-blue-700', closed: 'bg-gray-100 text-gray-500' };
const EMPTY = { subject: '', type: 'General Inquiry', message: '', orderNumber: '' };

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  // Search filters
  const [sf, setSf] = useState({ dateFrom: '', dateTo: '', ticketNum: '', orderNum: '', type: 'All', status: 'All' });

  const load = async () => { try { const { data } = await authApi.getTickets(); setTickets(data.tickets || []); } catch {} finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const filtered = tickets.filter(t => {
    if (sf.type !== 'All' && t.type !== sf.type) return false;
    if (sf.status !== 'All' && t.status !== sf.status) return false;
    if (sf.orderNum && !(t.orderNumber || '').includes(sf.orderNum)) return false;
    return true;
  });

  const handleSave = async () => {
    if (!form.subject || !form.message) { toast.error('Subject and message are required.'); return; }
    setSaving(true);
    try { await authApi.createTicket(form); await load(); toast.success('Ticket submitted. Our team will respond shortly.'); setShowModal(false); setForm({ ...EMPTY }); }
    catch (err: any) { toast.error(err?.response?.data?.message || 'Failed to submit ticket.'); }
    finally { setSaving(false); }
  };

  const f = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }));

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Search Ticket</h2>
      </div>

      {/* Search filters */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div><label className={lbl}>From Date</label><input type="date" value={sf.dateFrom} onChange={e => setSf(p => ({ ...p, dateFrom: e.target.value }))} className={inp} /></div>
          <div><label className={lbl}>Order #</label><input type="text" value={sf.orderNum} onChange={e => setSf(p => ({ ...p, orderNum: e.target.value }))} className={inp} /></div>
          <div className="flex flex-wrap items-end gap-2">
            <button className="px-5 py-1.5 text-xs font-semibold border border-gray-300 rounded text-gray-600 hover:border-[#00529B] hover:text-[#00529B] transition-all flex-1 sm:flex-initial">Search</button>
            <button onClick={() => setSf({ dateFrom:'', dateTo:'', ticketNum:'', orderNum:'', type:'All', status:'All' })} className="px-4 py-1.5 text-xs border border-gray-300 rounded text-gray-500 flex-1 sm:flex-initial">Reset</button>
            <button onClick={() => setShowModal(true)} className="px-4 py-1.5 text-xs font-semibold border border-[#00529B] rounded text-[#00529B] hover:bg-[#00529B] hover:text-white transition-all flex-1 sm:flex-initial">New Ticket</button>
          </div>
          <div><label className={lbl}>To Date</label><input type="date" value={sf.dateTo} onChange={e => setSf(p => ({ ...p, dateTo: e.target.value }))} className={inp} /></div>
          <div><label className={lbl}>Type</label>
            <select value={sf.type} onChange={e => setSf(p => ({ ...p, type: e.target.value }))} className={inp}>
              <option value="All">All</option>
              {TICKET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div><label className={lbl}>Ticket #</label><input type="text" value={sf.ticketNum} onChange={e => setSf(p => ({ ...p, ticketNum: e.target.value }))} className={inp} /></div>
          <div><label className={lbl}>Status</label>
            <select value={sf.status} onChange={e => setSf(p => ({ ...p, status: e.target.value }))} className={inp}>
              <option value="All">All</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#00529B]" /></div>
      ) : filtered.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <p className="text-gray-400 text-sm mb-4">No tickets found.</p>
          <button onClick={() => setShowModal(true)} className="px-5 py-2 text-sm font-semibold rounded text-white bg-[#00529B] hover:bg-[#00529B]/90 flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" /> Submit a New Ticket
          </button>
        </div>
      ) : (
        <>
        {/* Mobile cards */}
        <div className="md:hidden p-3 space-y-3 bg-gray-50">
          {filtered.map((t: any) => (
            <div key={t._id} className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="flex items-center gap-3 px-4 pt-4">
                <div className="w-10 h-10 rounded-xl bg-[#00529B] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 shadow-sm">
                  #{t._id?.slice(-4).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{t.subject}</p>
                  <p className="text-[11px] text-gray-400">{new Date(t.createdAt).toLocaleDateString('en-CA', { month:'short', day:'numeric', year:'numeric' })}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLOR[t.status] || 'bg-gray-100 text-gray-500'}`}>{t.status.replace('_',' ')}</span>
              </div>
              <div className="px-4 pt-3 pb-4 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Type</p>
                    <p className="text-gray-700 font-medium">{t.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Order #</p>
                    <p className="text-gray-700 font-medium">{t.orderNumber || '—'}</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 bg-gray-50/60">
                <button className="w-full flex items-center justify-center gap-1 py-3 text-[11px] font-semibold text-[#00529B] hover:bg-white transition-colors">View</button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100">{['Ticket #','Subject','Type','Order #','Status','Date',''].map(h => (
            <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400">{h}</th>
          ))}</tr></thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((t: any) => (
              <tr key={t._id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-mono text-xs text-[#00529B]">#{t._id?.slice(-6).toUpperCase()}</td>
                <td className="px-5 py-3 font-medium text-gray-800 text-sm">{t.subject}</td>
                <td className="px-5 py-3 text-gray-500 text-xs">{t.type}</td>
                <td className="px-5 py-3 text-gray-500 text-xs">{t.orderNumber || '—'}</td>
                <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLOR[t.status] || 'bg-gray-100 text-gray-500'}`}>{t.status.replace('_',' ')}</span></td>
                <td className="px-5 py-3 text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString('en-CA', { month:'short', day:'numeric', year:'numeric' })}</td>
                <td className="px-5 py-3"><button className="text-xs text-[#00529B] hover:underline">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        </>
      )}

      {/* New Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">New Support Ticket</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div><label className={lbl}>Subject <span className="text-red-500">*</span></label><input className={inp} value={form.subject} onChange={e => f('subject', e.target.value)} placeholder="Brief description of your issue" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className={lbl}>Type</label>
                  <select className={inp} value={form.type} onChange={e => f('type', e.target.value)}>
                    {TICKET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div><label className={lbl}>Order # (Optional)</label><input className={inp} value={form.orderNumber} onChange={e => f('orderNumber', e.target.value)} placeholder="PC-..." /></div>
              </div>
              <div><label className={lbl}>Message <span className="text-red-500">*</span></label>
                <textarea className={`${inp} h-28 resize-none`} value={form.message} onChange={e => f('message', e.target.value)} placeholder="Describe your issue in detail..." />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 px-5 py-4 border-t border-gray-100">
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm font-semibold rounded text-white bg-[#00529B] hover:bg-[#00529B]/90 flex items-center justify-center gap-2 disabled:opacity-60 flex-1 sm:flex-initial">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Submit Ticket
              </button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-500 flex-1 sm:flex-initial">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
