'use client';
import { useState, useEffect } from 'react';
import { authApi } from '@/lib/api';
import { Plus, Trash2, Loader2, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const inp = 'w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-[#00529B] bg-white';
const lbl = 'block text-xs text-gray-500 mb-0.5';
const EMPTY = { productName: '', productCode: '', description: '', harmonizedCode: '', unitPrice: 0, originCountry: 'CA' };
const COUNTRIES = ['CA','US','GB','CN','DE','FR','JP','AU','MX','IN'];

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [search, setSearch] = useState({ name: '', code: '', description: '', harmonized: '' });

  const load = async () => { try { const { data } = await authApi.getProducts(); setProducts(data.products || []); } catch {} finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const filtered = products.filter(p =>
    (!search.name || p.productName?.toLowerCase().includes(search.name.toLowerCase())) &&
    (!search.code || p.productCode?.toLowerCase().includes(search.code.toLowerCase())) &&
    (!search.description || p.description?.toLowerCase().includes(search.description.toLowerCase())) &&
    (!search.harmonized || p.harmonizedCode?.includes(search.harmonized))
  );

  const handleSave = async () => {
    if (!form.productName || !form.productCode) { toast.error('Product Name and Code are required.'); return; }
    setSaving(true);
    try { await authApi.addProduct(form); await load(); toast.success('Product saved.'); setShowModal(false); setForm({ ...EMPTY }); }
    catch (err: any) { toast.error(err?.response?.data?.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this product?')) return;
    setDeleting(id);
    try { await authApi.deleteProduct(id); await load(); toast.success('Product removed.'); }
    catch { toast.error('Failed to remove.'); } finally { setDeleting(null); }
  };

  const f = (field: string, value: any) => setForm(p => ({ ...p, [field]: value }));

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Manage Products</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowModal(true)} className="px-4 py-1.5 text-xs font-semibold rounded text-white bg-[#00529B] hover:bg-[#00529B]/90 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add New Product +
          </button>
          <button className="px-4 py-1.5 text-xs font-semibold rounded border border-gray-300 text-gray-600 hover:border-[#00529B]">Import Products (CSV)</button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="grid grid-cols-4 gap-3">
          <div><label className={lbl}>Product Name</label><input className={inp} value={search.name} onChange={e => setSearch(p => ({ ...p, name: e.target.value }))} /></div>
          <div><label className={lbl}>Product Code</label><input className={inp} value={search.code} onChange={e => setSearch(p => ({ ...p, code: e.target.value }))} /></div>
          <div><label className={lbl}>Description</label><input className={inp} value={search.description} onChange={e => setSearch(p => ({ ...p, description: e.target.value }))} /></div>
          <div><label className={lbl}>Harmonized HS Code</label><input className={inp} value={search.harmonized} onChange={e => setSearch(p => ({ ...p, harmonized: e.target.value }))} /></div>
        </div>
        <div className="flex gap-2 mt-3">
          <button className="px-5 py-1.5 text-xs font-semibold border border-gray-300 rounded text-gray-600 hover:border-[#00529B]"><Search className="w-3 h-3 inline mr-1" />Search</button>
          <button onClick={() => setSearch({ name:'',code:'',description:'',harmonized:'' })} className="px-4 py-1.5 text-xs border border-gray-300 rounded text-gray-500">Reset</button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#00529B]" /></div>
      ) : filtered.length === 0 ? (
        <div className="px-6 py-8">
          <p className="text-sm font-semibold text-gray-700 mb-2">Do you ship items internationally often? If you do, then capturing your products here will help to save time completing your customs invoice every time.</p>
          <p className="text-sm text-gray-500">Simply capture your product details here, and the next time you need to create a customs invoice all the fields will populate for you.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100">{['Product Name','Product Code','Description','HS Code','Unit Price','Country',''].map(h => (
            <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400">{h}</th>
          ))}</tr></thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((p: any) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-[#c0392b]">{p.productName}</td>
                <td className="px-5 py-3 text-gray-600 text-xs font-mono">{p.productCode}</td>
                <td className="px-5 py-3 text-gray-500 text-xs">{p.description}</td>
                <td className="px-5 py-3 text-gray-500 text-xs">{p.harmonizedCode}</td>
                <td className="px-5 py-3 text-gray-700">${p.unitPrice?.toFixed(2)}</td>
                <td className="px-5 py-3 text-gray-500 text-xs">{p.originCountry}</td>
                <td className="px-5 py-3"><button onClick={() => handleDelete(p._id)} disabled={deleting === p._id} className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                  {deleting === p._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Add New Product</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>Product Name <span className="text-red-500">*</span></label><input className={inp} value={form.productName} onChange={e => f('productName', e.target.value)} /></div>
                <div><label className={lbl}>Description <span className="text-red-500">*</span></label><input className={inp} value={form.description} onChange={e => f('description', e.target.value)} /></div>
                <div><label className={lbl}>Harmonized HS Code <span className="text-red-500">*</span></label><input className={inp} value={form.harmonizedCode} onChange={e => f('harmonizedCode', e.target.value)} /></div>
                <div><label className={lbl}>Product Code <span className="text-red-500">*</span></label><input className={inp} value={form.productCode} onChange={e => f('productCode', e.target.value)} /></div>
                <div><label className={lbl}>Unit Price <span className="text-red-500">*</span></label><input type="number" min="0" step="0.01" className={inp} value={form.unitPrice} onChange={e => f('unitPrice', parseFloat(e.target.value))} /></div>
                <div><label className={lbl}>Origin Country <span className="text-red-500">*</span></label>
                  <select className={inp} value={form.originCountry} onChange={e => f('originCountry', e.target.value)}>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-5 py-4 border-t border-gray-100">
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm font-semibold rounded text-white bg-[#00529B] hover:bg-[#00529B]/90 flex items-center gap-2 disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Save Product
              </button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-500">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
