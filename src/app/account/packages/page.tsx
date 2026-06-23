'use client';
import { useState, useEffect } from 'react';
import { authApi } from '@/lib/api';
import { Plus, Trash2, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const inp = 'w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-[#00529B] bg-white';
const lbl = 'block text-xs text-gray-500 mb-0.5';
const EMPTY = { name: '', description: '', length: 1, width: 1, height: 1, weight: 1, dimensionUnit: 'in', weightUnit: 'lbs', specialHandling: false };

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });

  const load = async () => { try { const { data } = await authApi.getPackages(); setPackages(data.packages || []); } catch {} finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.name) { toast.error('Package name is required.'); return; }
    setSaving(true);
    try { await authApi.addPackage(form); await load(); toast.success('Package saved.'); setShowModal(false); setForm({ ...EMPTY }); }
    catch (err: any) { toast.error(err?.response?.data?.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this package preset?')) return;
    setDeleting(id);
    try { await authApi.deletePackage(id); await load(); toast.success('Package removed.'); }
    catch { toast.error('Failed to remove.'); } finally { setDeleting(null); }
  };

  const f = (field: string, value: any) => setForm(p => ({ ...p, [field]: value }));

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Manage Packages</h2>
        <button onClick={() => setShowModal(true)} className="px-4 py-1.5 text-xs font-semibold rounded text-white bg-[#00529B] hover:bg-[#00529B]/90 flex items-center justify-center gap-1.5 w-full sm:w-auto">
          <Plus className="w-3.5 h-3.5" /> Add New Package +
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#00529B]" /></div>
      ) : packages.length === 0 ? (
        <div className="px-6 py-8">
          <p className="text-sm font-semibold text-gray-700 mb-2">Do you ship using the same box dimensions and weights on a regular basis? If you do, then capturing and storing your common package types will save you time.</p>
          <p className="text-sm text-gray-500">Simply capture your package details here, and the next time you quote a shipment, simply choose your package from the drop-down list. No need to input dimensions or weights. You're all set.</p>
          <button onClick={() => setShowModal(true)} className="mt-4 px-5 py-2 text-sm font-semibold rounded text-white bg-[#00529B] hover:bg-[#00529B]/90 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New Package
          </button>
        </div>
      ) : (
        <>
        {/* Mobile cards */}
        <div className="md:hidden p-3 space-y-3 bg-gray-50">
          {packages.map((p: any) => (
            <div key={p._id} className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="flex items-center gap-3 px-4 pt-4">
                <div className="w-10 h-10 rounded-xl bg-[#00529B] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                  {(p.name || '?').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#c0392b] text-sm truncate">{p.name}</p>
                  <p className="text-xs text-gray-500 truncate">{p.description}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${p.specialHandling ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>{p.specialHandling ? 'Special' : 'Standard'}</span>
              </div>
              <div className="px-4 pt-3 pb-4">
                <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl px-3 py-2.5 text-xs">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Dimensions</p>
                    <p className="text-gray-700 font-medium">{p.length}×{p.width}×{p.height} {p.dimensionUnit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Weight</p>
                    <p className="text-gray-700 font-medium">{p.weight} {p.weightUnit}</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 bg-gray-50/60">
                <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id}
                  className="w-full flex items-center justify-center gap-1 py-3 text-[11px] font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                  {deleting === p._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100">{['Name','Description','Dimensions','Weight','Handling',''].map(h => (
            <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400">{h}</th>
          ))}</tr></thead>
          <tbody className="divide-y divide-gray-50">
            {packages.map((p: any) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-[#c0392b]">{p.name}</td>
                <td className="px-5 py-3 text-gray-500 text-xs">{p.description}</td>
                <td className="px-5 py-3 text-gray-600 text-xs">{p.length}×{p.width}×{p.height} {p.dimensionUnit}</td>
                <td className="px-5 py-3 text-gray-600 text-xs">{p.weight} {p.weightUnit}</td>
                <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded ${p.specialHandling ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>{p.specialHandling ? 'Yes' : 'No'}</span></td>
                <td className="px-5 py-3"><button onClick={() => handleDelete(p._id)} disabled={deleting === p._id} className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                  {deleting === p._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        </>
      )}

      {/* Add Package Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Add New Package</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className={lbl}>Package Name <span className="text-red-500">*</span></label><input className={inp} value={form.name} onChange={e => f('name', e.target.value)} /></div>
                <div><label className={lbl}>Description <span className="text-red-500">*</span></label><input className={inp} value={form.description} onChange={e => f('description', e.target.value)} /></div>
              </div>
              <div className="border-t border-gray-100 mt-3 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Length ({form.dimensionUnit}) <span className="text-red-500">*</span></label>
                  <input type="number" min="0.1" step="0.1" className={inp} value={form.length} onChange={e => f('length', parseFloat(e.target.value))} />
                </div>
                <div>
                  <label className={lbl}>Height ({form.dimensionUnit}) <span className="text-red-500">*</span></label>
                  <input type="number" min="0.1" step="0.1" className={inp} value={form.height} onChange={e => f('height', parseFloat(e.target.value))} />
                </div>
                <div>
                  <label className={lbl}>Width ({form.dimensionUnit}) <span className="text-red-500">*</span></label>
                  <input type="number" min="0.1" step="0.1" className={inp} value={form.width} onChange={e => f('width', parseFloat(e.target.value))} />
                </div>
                <div>
                  <label className={lbl}>Weight ({form.weightUnit}) <span className="text-red-500">*</span></label>
                  <input type="number" min="0.01" step="0.01" className={inp} value={form.weight} onChange={e => f('weight', parseFloat(e.target.value))} />
                </div>
                <div>
                  <label className={lbl}>Units</label>
                  <select className={inp} value={form.dimensionUnit} onChange={e => { f('dimensionUnit', e.target.value); f('weightUnit', e.target.value === 'cm' ? 'kg' : 'lbs'); }}>
                    <option value="in">Imperial (in / lbs)</option>
                    <option value="cm">Metric (cm / kg)</option>
                  </select>
                </div>
              </div>
              <div className="border-t border-gray-100 mt-3 pt-3">
                <label className={lbl}>Special Handling <span className="text-red-500">*</span></label>
                <select className={inp} value={form.specialHandling ? 'yes' : 'no'} onChange={e => f('specialHandling', e.target.value === 'yes')}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 px-5 py-4 border-t border-gray-100">
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm font-semibold rounded text-white bg-[#00529B] hover:bg-[#00529B]/90 flex items-center justify-center gap-2 disabled:opacity-60 flex-1 sm:flex-initial">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Create New Package
              </button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-500 flex-1 sm:flex-initial">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
