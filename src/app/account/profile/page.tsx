'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';
import { User, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const inp = 'w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20 bg-white';
const lbl = 'block text-xs font-medium text-gray-500 mb-1';

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });

  useEffect(() => {
    if (user) setForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || '' });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authApi.updateProfile(form);
      await fetchMe();
      toast.success('Profile updated.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      {/* Account details card */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-brand-orange" />
            <h2 className="font-semibold text-gray-700 text-sm">My Account Details</h2>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>First Name</label>
              <input className={inp} value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
            </div>
            <div>
              <label className={lbl}>Last Name</label>
              <input className={inp} value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
            </div>
            <div>
              <label className={lbl}>Email Address</label>
              <input className={`${inp} bg-gray-50 text-gray-400 cursor-not-allowed`} value={user?.email || ''} disabled />
              <p className="text-xs text-gray-400 mt-0.5">Email cannot be changed.</p>
            </div>
            <div>
              <label className={lbl}>Phone Number</label>
              <input className={inp} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 416 555 0100" />
            </div>
          </div>
          <div className="pt-2">
            <button onClick={handleSave} disabled={saving} className="px-6 py-2 text-sm font-semibold rounded text-white bg-brand-navy hover:bg-brand-navy/90 transition-all flex items-center justify-center gap-2 disabled:opacity-60 w-full sm:w-auto">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <>Save Changes</>}
            </button>
          </div>
        </div>
      </div>

      {/* Account info */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700 text-sm">Account Information</h2>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-xs text-gray-400 mb-1">Contact Name</p>
            <p className="font-medium text-gray-800">{user?.firstName} {user?.lastName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Email</p>
            <p className="font-medium text-gray-800">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Phone</p>
            <p className="font-medium text-gray-800">{user?.phone || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Account Role</p>
            <p className="font-medium text-gray-800 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
