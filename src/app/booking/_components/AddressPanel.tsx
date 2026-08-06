'use client';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { Address } from '@/lib/api';
import { API_URL } from '../_lib/constants';
import { fetchProvinces } from '../_lib/geo';
import { CountrySelect } from './CountrySelect';
import { ProvinceSelect } from './ProvinceSelect';
import { CityInput } from './CityInput';
import { inp, lblRow, fieldRow, req } from './styles';

export function AddressPanel({ title, color, address, onChange, showConfirmEmail }: {
  title: string; color: 'red' | 'blue';
  address: Address; onChange: (f: string, v: any) => void;
  showConfirmEmail?: boolean;
}) {
  const dot = color === 'red' ? 'bg-brand-orange' : 'bg-brand-navy';
  const hdr = color === 'red' ? 'text-brand-orange' : 'text-brand-navy';
  const [provinces, setProvinces] = useState<{ label: string; value: string }[]>([]);
  const [postalLoading, setPostalLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (address.country) fetchProvinces(address.country).then(list => { if (!cancelled) setProvinces(list); });
    else setProvinces([]);
    return () => { cancelled = true; };
  }, [address.country]);

  useEffect(() => {
    const postal = address.postalCode?.trim();
    const country = address.country?.trim();
    if (!country || !postal || postal.replace(/\s/g, '').length < 5) return;
    const t = setTimeout(async () => {
      setPostalLoading(true);
      try {
        const res = await fetch(`${API_URL}/geo/postal?country=${encodeURIComponent(country)}&postal=${encodeURIComponent(postal)}`);
        const data = await res.json();
        if (data?.city) onChange('city', data.city);
        if (data?.province) onChange('province', data.province);
      } catch {}
      setPostalLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, [address.postalCode, address.country]);

  return (
    <div className="flex-1 min-w-0 border border-gray-200 rounded-lg overflow-hidden">
      <div className={`flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200 ${hdr} font-semibold text-sm`}>
        <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
        {title}
      </div>
      <div className="p-4 space-y-2.5">
        <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
          <input type="checkbox" checked={!!address.isResidential} onChange={e => onChange('isResidential', e.target.checked)} className="accent-brand-navy" />
          Residential
        </label>
        <div className={fieldRow}>
          <label className={lblRow}>Company / Person {req}</label>
          <input className={`${inp} w-full md:flex-1`} value={address.company || ''} onChange={e => onChange('company', e.target.value)} placeholder="Company or person name" />
        </div>
        <div className={fieldRow}>
          <label className={lblRow}>Address Line 1 {req}</label>
          <input className={`${inp} w-full md:flex-1`} value={address.street} onChange={e => onChange('street', e.target.value)} placeholder="Street address" required />
        </div>
        <div className={fieldRow}>
          <label className={lblRow}>Address Line 2</label>
          <input className={`${inp} w-full md:flex-1`} value={address.street2 || ''} onChange={e => onChange('street2', e.target.value)} placeholder="Suite / Unit / Apt" />
        </div>
        <div className={fieldRow}>
          <label className={lblRow}>Country {req}</label>
          <div className="w-full md:flex-1"><CountrySelect value={address.country || ''} onChange={v => { onChange('country', v); onChange('province', ''); onChange('city', ''); }} /></div>
        </div>
        <div className={fieldRow}>
          <label className={lblRow}>Zip / Postal code</label>
          <div className="relative w-full md:flex-1">
            <input
              className={`${inp} ${!address.country ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              value={address.postalCode}
              onChange={e => onChange('postalCode', e.target.value)}
              placeholder={address.country ? 'Postal code' : 'Select country first'}
              disabled={!address.country}
            />
            {postalLoading && <Loader2 className="absolute right-2.5 top-2 w-3.5 h-3.5 text-gray-400 animate-spin" />}
          </div>
        </div>
        <div className={fieldRow}>
          <label className={lblRow}>City {req}</label>
          <div className="w-full md:flex-1"><CityInput value={address.city} onChange={v => onChange('city', v)} country={address.country || ''} /></div>
        </div>
        <div className={fieldRow}>
          <label className={lblRow}>Province / State</label>
          <div className="w-full md:flex-1"><ProvinceSelect value={address.province} onChange={v => onChange('province', v)} options={provinces} /></div>
        </div>
        <div className={fieldRow}>
          <label className={lblRow}>Attention {req}</label>
          <input className={`${inp} w-full md:flex-1`} value={address.name} onChange={e => onChange('name', e.target.value)} placeholder="Contact name" required />
        </div>
        <div className={fieldRow}>
          <label className={lblRow}>Phone {req}</label>
          <input className={`${inp} w-full md:flex-1`} type="tel" value={address.phone} onChange={e => onChange('phone', e.target.value)} placeholder="+1 416 555 0100" required />
        </div>
        <div className={fieldRow}>
          <label className={lblRow}>Email {req}</label>
          <input className={`${inp} w-full md:flex-1`} type="email" value={address.email || ''} onChange={e => onChange('email', e.target.value)} placeholder="email@example.com" />
        </div>
        <div className={fieldRow}>
          <label className={lblRow}>Instruction</label>
          <input className={`${inp} w-full md:flex-1`} placeholder="Delivery instructions (optional)" />
        </div>
        <div className="flex flex-col gap-1.5 pt-1">
          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
            <input type="checkbox" className="accent-brand-navy" />
            Save to Address Book
          </label>
          {showConfirmEmail && (
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
              <input type="checkbox" defaultChecked className="accent-brand-navy" />
              Send Shipping Confirmation E-mail
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
