'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';
import { Search, Trash2, Edit2, Eye, Loader2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const inp = 'w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-[#00529B] bg-white';
const lbl = 'block text-xs text-gray-500 mb-0.5';
const CA_PROVINCES = ['AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT'];
const EMPTY = { label: '', name: '', company: '', street: '', street2: '', city: '', province: '', postalCode: '', country: 'CA', phone: '', email: '', isDefault: false };

export default function AddressBookPage() {
  const { user, fetchMe } = useAuthStore();
  const [search, setSearch] = useState({ company: '', name: '', city: '', postalCode: '' });
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });

  const addresses: any[] = user?.savedAddresses || [];

  const filtered = addresses.filter(a => {
    if (search.company && !(a.company || '').toLowerCase().includes(search.company.toLowerCase())) return false;
    if (search.name && !(a.name || '').toLowerCase().includes(search.name.toLowerCase())) return false;
    if (search.city && !(a.city || '').toLowerCase().includes(search.city.toLowerCase())) return false;
    if (search.postalCode && !(a.postalCode || '').toLowerCase().includes(search.postalCode.toLowerCase())) return false;
    return true;
  });

  const handleSave = async () => {
    if (!form.name || !form.street || !form.city || !form.postalCode) { toast.error('Please fill required fields.'); return; }
    setSaving(true);
    try {
      await authApi.addAddress(form);
      await fetchMe();
      toast.success('Address saved.');
      setShowModal(false);
      setForm({ ...EMPTY });
    } catch (err: any) { toast.error(err?.response?.data?.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this address?')) return;
    setDeleting(id);
    try {
      await authApi.deleteAddress(id);
      await fetchMe();
      toast.success('Address removed.');
    } catch { toast.error('Failed to remove.'); }
    finally { setDeleting(null); }
  };

  const f = (field: string, value: any) => setForm(p => ({ ...p, [field]: value }));

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Search &amp; Manage Contacts</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowModal(true)}
            className="px-4 py-1.5 text-xs font-semibold rounded text-white bg-[#00529B] hover:bg-[#00529B]/90 transition-all flex items-center gap-1.5 w-full sm:w-auto justify-center">
            <Plus className="w-3.5 h-3.5" /> Add New Contact +
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div><label className={lbl}>Company</label><input className={inp} value={search.company} onChange={e => setSearch(p => ({ ...p, company: e.target.value }))} /></div>
          <div><label className={lbl}>Contact Name</label><input className={inp} value={search.name} onChange={e => setSearch(p => ({ ...p, name: e.target.value }))} /></div>
          <div><label className={lbl}>City</label><input className={inp} value={search.city} onChange={e => setSearch(p => ({ ...p, city: e.target.value }))} /></div>
          <div><label className={lbl}>Zip / Postal code</label><input className={inp} value={search.postalCode} onChange={e => setSearch(p => ({ ...p, postalCode: e.target.value }))} /></div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <button className="px-5 py-1.5 text-xs font-semibold rounded border border-gray-300 text-gray-600 hover:border-[#00529B] hover:text-[#00529B] transition-all flex-1 sm:flex-initial">Search</button>
          <button onClick={() => setSearch({ company: '', name: '', city: '', postalCode: '' })} className="px-4 py-1.5 text-xs border border-gray-300 rounded text-gray-500 hover:border-gray-400 transition-all flex-1 sm:flex-initial">Reset</button>
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-700">{filtered.length} Total Contacts</p>
        <p className="text-xs text-gray-400">{filtered.length} Contacts</p>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">No contacts found. Add your first contact above.</div>
      ) : (
        <>
        {/* Mobile cards */}
        <div className="md:hidden p-3 space-y-3 bg-gray-50">
          {filtered.map((a: any) => (
            <div key={a._id} className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="flex items-start gap-3 px-4 pt-4">
                <div className="w-10 h-10 rounded-xl bg-[#00529B] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                  {(a.company || a.name || '?').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#c0392b] text-sm truncate">{a.company || a.name}</p>
                  <p className="text-xs text-gray-500 truncate">{a.name}</p>
                </div>
              </div>
              <div className="px-4 pt-3 pb-4 space-y-2 text-xs">
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Location</p>
                  <p className="text-gray-700 font-medium uppercase">{a.city}{a.province ? `, ${a.province}` : ''}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Email</p>
                  {a.email ? <a href={`mailto:${a.email}`} className="text-[#c0392b] hover:underline">{a.email}</a> : <span className="text-gray-300">—</span>}
                </div>
              </div>
              <div className="grid grid-cols-3 border-t border-gray-100 divide-x divide-gray-100 bg-gray-50/60">
                <button title="View" className="flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-semibold text-gray-500 hover:bg-white hover:text-[#00529B] transition-colors">
                  <Eye className="w-4 h-4" /> View
                </button>
                <button title="Edit" className="flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-semibold text-gray-500 hover:bg-white hover:text-[#00529B] transition-colors">
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button title="Delete" onClick={() => handleDelete(a._id)} disabled={deleting === a._id}
                  className="flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                  {deleting === a._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['Company / Person', 'City', 'State / Province', 'Contact Name', 'Email', ''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((a: any) => (
              <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <p className="font-medium text-[#c0392b] hover:underline cursor-pointer">{a.company || a.name}</p>
                </td>
                <td className="px-5 py-3 text-gray-600 uppercase text-xs">{a.city}</td>
                <td className="px-5 py-3 text-gray-600 text-xs">{a.province}</td>
                <td className="px-5 py-3 text-gray-700">{a.name}</td>
                <td className="px-5 py-3">
                  {a.email ? <a href={`mailto:${a.email}`} className="text-[#c0392b] hover:underline text-xs">{a.email}</a> : <span className="text-gray-300 text-xs">—</span>}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button title="View" className="p-1 text-gray-300 hover:text-[#00529B] transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                    <button title="Edit" className="p-1 text-gray-300 hover:text-[#00529B] transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button title="Delete" onClick={() => handleDelete(a._id)} disabled={deleting === a._id}
                      className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                      {deleting === a._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        </>
      )}

      {/* Add Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Add New Contact</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2"><label className={lbl}>Label (e.g. Home, Office)</label><input className={inp} value={form.label} onChange={e => f('label', e.target.value)} /></div>
                <div><label className={lbl}>Full Name *</label><input className={inp} value={form.name} onChange={e => f('name', e.target.value)} required /></div>
                <div><label className={lbl}>Company</label><input className={inp} value={form.company} onChange={e => f('company', e.target.value)} /></div>
                <div className="sm:col-span-2"><label className={lbl}>Address Line 1 *</label><input className={inp} value={form.street} onChange={e => f('street', e.target.value)} required /></div>
                <div className="sm:col-span-2"><label className={lbl}>Address Line 2</label><input className={inp} value={form.street2} onChange={e => f('street2', e.target.value)} /></div>
                <div><label className={lbl}>City *</label><input className={inp} value={form.city} onChange={e => f('city', e.target.value)} required /></div>
                <div><label className={lbl}>Province</label>
                  <select className={inp} value={form.province} onChange={e => f('province', e.target.value)}>
                    <option value="">Select</option>
                    {CA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div><label className={lbl}>Postal Code *</label><input className={inp} value={form.postalCode} onChange={e => f('postalCode', e.target.value)} required /></div>
                <div><label className={lbl}>Country</label><input className={inp} value={form.country} onChange={e => f('country', e.target.value)} /></div>
                <div><label className={lbl}>Phone</label><input className={inp} value={form.phone} onChange={e => f('phone', e.target.value)} /></div>
                <div><label className={lbl}>Email</label><input className={inp} type="email" value={form.email} onChange={e => f('email', e.target.value)} /></div>
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer"><input type="checkbox" checked={form.isDefault} onChange={e => f('isDefault', e.target.checked)} className="accent-[#00529B]" /> Set as default address</label>
            </div>
            <div className="flex flex-wrap gap-3 px-5 py-4 border-t border-gray-100">
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm font-semibold rounded text-white bg-[#00529B] hover:bg-[#00529B]/90 flex items-center gap-2 disabled:opacity-60 flex-1 sm:flex-initial justify-center">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Save Contact
              </button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-500 flex-1 sm:flex-initial">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
