'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';
import { Loader2, Edit2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const inp = 'w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#00529B] bg-white';
const lbl = 'block text-xs text-gray-500 mb-1';

const CA_PROVINCES = ['AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT'];

export default function AccountPaymentPage() {
  const { user, fetchMe } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', company: '',
    street: '', city: '', province: '', postalCode: '', country: 'CA',
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        company: (user as any).company || '',
        street: (user as any).address?.street || '',
        city: (user as any).address?.city || '',
        province: (user as any).address?.province || '',
        postalCode: (user as any).address?.postalCode || '',
        country: (user as any).address?.country || 'CA',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authApi.updateFullProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        company: form.company,
        address: { street: form.street, city: form.city, province: form.province, postalCode: form.postalCode, country: form.country },
      });
      await fetchMe();
      toast.success('Account updated.');
      setEditing(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update.');
    } finally {
      setSaving(false);
    }
  };

  const f = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }));

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Account name header */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-base font-semibold text-[#c0392b]">
          {(user as any)?.company || `${user?.firstName} ${user?.lastName}`}
          {' '}<span className="text-gray-400 font-normal text-sm">| Account #: NPC-{user?.id?.slice(-6).toUpperCase()}</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* My Account Details */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span className="text-[#c0392b]">👤</span> My Account Details
            </div>
            {!editing && (
              <button onClick={() => setEditing(true)} className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-600 hover:border-[#00529B] hover:text-[#00529B] transition-all">
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>First Name</label><input className={inp} value={form.firstName} onChange={e => f('firstName', e.target.value)} /></div>
                <div><label className={lbl}>Last Name</label><input className={inp} value={form.lastName} onChange={e => f('lastName', e.target.value)} /></div>
                <div className="col-span-2"><label className={lbl}>Company</label><input className={inp} value={form.company} onChange={e => f('company', e.target.value)} /></div>
                <div className="col-span-2"><label className={lbl}>Street Address</label><input className={inp} value={form.street} onChange={e => f('street', e.target.value)} /></div>
                <div><label className={lbl}>City</label><input className={inp} value={form.city} onChange={e => f('city', e.target.value)} /></div>
                <div><label className={lbl}>Province</label>
                  <select className={inp} value={form.province} onChange={e => f('province', e.target.value)}>
                    <option value="">Select</option>
                    {CA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div><label className={lbl}>Postal Code</label><input className={inp} value={form.postalCode} onChange={e => f('postalCode', e.target.value)} /></div>
                <div><label className={lbl}>Phone</label><input className={inp} value={form.phone} onChange={e => f('phone', e.target.value)} /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="px-5 py-1.5 text-sm font-semibold rounded text-white bg-[#00529B] hover:bg-[#00529B]/90 disabled:opacity-60 flex items-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Save
                </button>
                <button onClick={() => setEditing(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded text-gray-500 hover:border-gray-400">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="p-5 grid grid-cols-2 gap-5 text-sm">
              <div>
                <p className="font-semibold text-gray-600 mb-2">Contact Details</p>
                <p className="text-gray-700">{user?.firstName} {user?.lastName}</p>
                <p className="text-gray-500">{user?.email}</p>
                <p className="text-gray-500">Phone : {user?.phone || '—'}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-2">Address</p>
                {(user as any)?.address?.street ? (
                  <>
                    <p className="text-[#00529B]">{(user as any).address.street}</p>
                    <p className="text-[#00529B]">{(user as any).address.city}, {(user as any).address.province}</p>
                    <p className="text-[#00529B]">{(user as any).address.country} , {(user as any).address.postalCode}</p>
                  </>
                ) : <p className="text-gray-400 text-xs italic">No address on file</p>}
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Contact Name</p>
                <p className="text-gray-700">{user?.firstName}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Invoicing Email</p>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* My Payment Information */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span className="text-[#00529B]">💳</span> My Payment Information
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs text-[#c0392b] hover:underline">View Payment History</button>
              <button className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-600 hover:border-[#00529B]">Manage</button>
              <button className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-600 hover:border-[#00529B]">Add</button>
            </div>
          </div>
          <div className="p-5 grid grid-cols-2 gap-5 text-sm text-gray-500">
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1">Last 4 digits on Card</p>
              <p>—</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1">Billing Address</p>
              <p>{(user as any)?.address?.postalCode || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1">Expiry Month / Year</p>
              <p>/ </p>
            </div>
          </div>
        </div>
      </div>

      {/* API Credentials */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-w-lg">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <span className="text-[#c0392b]">👤</span> API Credentials
          </div>
          <button className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-600 hover:border-[#00529B]">
            Regenerate
          </button>
        </div>
        <div className="p-5 grid grid-cols-2 gap-5 text-sm">
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">API UserName</p>
            <p className="text-gray-700 font-mono">{user?.email?.split('@')[0] || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">API Password</p>
            <p className="text-gray-700 font-mono">••••••••</p>
          </div>
        </div>
      </div>
    </div>
  );
}
