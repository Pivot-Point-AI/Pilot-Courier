'use client';
import { useState } from 'react';
import { Plus, X, Store } from 'lucide-react';
import toast from 'react-hot-toast';

const inp = 'w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#00529B] bg-white';
const lbl = 'block text-xs text-gray-500 mb-1';

const PLATFORMS = [
  'Amazon Seller Central', 'BigCommerce', 'BigCommerce2.0', 'eBay',
  'Etsy', 'Magento', 'OpenCart', 'Shopify', 'Squarespace',
  'WooCommerce', 'Wix', 'Yahoo Store', 'Other',
];

const EMPTY = { platform: '', storeName: '', storeUrl: '' };

export default function StoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });

  const handleSave = () => {
    if (!form.platform || !form.storeName || !form.storeUrl) {
      toast.error('All fields are required.'); return;
    }
    setStores(p => [...p, { ...form, id: Date.now() }]);
    toast.success('Store connected.');
    setShowModal(false);
    setForm({ ...EMPTY });
  };

  const f = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }));

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Manage Stores</h2>
        <button onClick={() => setShowModal(true)}
          className="px-4 py-1.5 text-xs font-semibold rounded text-white bg-[#00529B] hover:bg-[#00529B]/90 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add New Store +
        </button>
      </div>

      <div className="px-6 py-6">
        {stores.length === 0 ? (
          <div className="flex items-center gap-3 text-gray-600">
            <span className="font-bold text-lg text-gray-700">0</span>
            <span className="font-semibold text-gray-600">Stores Connected</span>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-600">{stores.length} Store{stores.length !== 1 ? 's' : ''} Connected</p>
            <div className="divide-y divide-gray-100">
              {stores.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Store className="w-5 h-5 text-[#00529B]" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{s.storeName}</p>
                      <p className="text-xs text-gray-400">{s.platform} · {s.storeUrl}</p>
                    </div>
                  </div>
                  <button onClick={() => setStores(p => p.filter(x => x.id !== s.id))}
                    className="text-xs text-red-400 hover:text-red-600">Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Add New Store</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className={lbl}>Platform <span className="text-red-500">*</span></label>
                <select className={inp} value={form.platform} onChange={e => f('platform', e.target.value)}>
                  <option value="">--Select Cart--</option>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Store Name <span className="text-red-500">*</span></label>
                <input className={inp} value={form.storeName} onChange={e => f('storeName', e.target.value)} placeholder="My Store" />
              </div>
              <div>
                <label className={lbl}>Store URL <span className="text-red-500">*</span></label>
                <input className={inp} value={form.storeUrl} onChange={e => f('storeUrl', e.target.value)} placeholder="https://mystore.com" />
              </div>
            </div>
            <div className="flex gap-3 justify-end px-5 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:border-gray-400">Cancel</button>
              <button onClick={handleSave}
                className="px-6 py-2 text-sm font-semibold rounded text-white bg-[#00529B] hover:bg-[#00529B]/90">Save Store</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
