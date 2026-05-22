'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { shipmentApi, paymentApi } from '@/lib/api';
import type { Rate, Address } from '@/lib/api';
import { Loader2, CheckCircle2, ArrowLeftRight, Plus, Copy, Trash2, Download, ArrowRight, ChevronDown, Search, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Country list ─────────────────────────────────────────────────────────────
const ALL_COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' }, { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' }, { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' }, { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' }, { code: 'AM', name: 'Armenia' },
  { code: 'AU', name: 'Australia' }, { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' }, { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' }, { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbados' }, { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' }, { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' }, { code: 'BT', name: 'Bhutan' },
  { code: 'BO', name: 'Bolivia' }, { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' }, { code: 'BR', name: 'Brazil' },
  { code: 'BN', name: 'Brunei' }, { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' }, { code: 'BI', name: 'Burundi' },
  { code: 'CV', name: 'Cabo Verde' }, { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' }, { code: 'CA', name: 'Canada' },
  { code: 'CF', name: 'Central African Republic' }, { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' }, { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' }, { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo' }, { code: 'CD', name: 'Congo (DRC)' },
  { code: 'CR', name: 'Costa Rica' }, { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' }, { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' }, { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' }, { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' }, { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' }, { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' }, { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' }, { code: 'SZ', name: 'Eswatini' },
  { code: 'ET', name: 'Ethiopia' }, { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' }, { code: 'FR', name: 'France' },
  { code: 'GA', name: 'Gabon' }, { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' }, { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' }, { code: 'GR', name: 'Greece' },
  { code: 'GD', name: 'Grenada' }, { code: 'GT', name: 'Guatemala' },
  { code: 'GN', name: 'Guinea' }, { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' }, { code: 'HT', name: 'Haiti' },
  { code: 'HN', name: 'Honduras' }, { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' }, { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' }, { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran' }, { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' }, { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' }, { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' }, { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' }, { code: 'KE', name: 'Kenya' },
  { code: 'KI', name: 'Kiribati' }, { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' }, { code: 'LA', name: 'Laos' },
  { code: 'LV', name: 'Latvia' }, { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' }, { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' }, { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' }, { code: 'LU', name: 'Luxembourg' },
  { code: 'MG', name: 'Madagascar' }, { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' }, { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' }, { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' }, { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' }, { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia' }, { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' }, { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' }, { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' }, { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' }, { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' }, { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' }, { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' }, { code: 'NG', name: 'Nigeria' },
  { code: 'NO', name: 'Norway' }, { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' }, { code: 'PW', name: 'Palau' },
  { code: 'PA', name: 'Panama' }, { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' }, { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' }, { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' }, { code: 'QA', name: 'Qatar' },
  { code: 'RO', name: 'Romania' }, { code: 'RU', name: 'Russia' },
  { code: 'RW', name: 'Rwanda' }, { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' }, { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', name: 'Samoa' }, { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'Sao Tome and Principe' }, { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' }, { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' }, { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' }, { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' }, { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia' }, { code: 'ZA', name: 'South Africa' },
  { code: 'SS', name: 'South Sudan' }, { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' }, { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' }, { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' }, { code: 'SY', name: 'Syria' },
  { code: 'TW', name: 'Taiwan' }, { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania' }, { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' }, { code: 'TG', name: 'Togo' },
  { code: 'TO', name: 'Tonga' }, { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TN', name: 'Tunisia' }, { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' }, { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda' }, { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' }, { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' }, { code: 'VU', name: 'Vanuatu' },
  { code: 'VE', name: 'Venezuela' }, { code: 'VN', name: 'Vietnam' },
  { code: 'YE', name: 'Yemen' }, { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
];

async function fetchProvinces(country: string): Promise<{ label: string; value: string }[]> {
  try {
    const r = await fetch(`${API_URL}/geo/provinces?country=${country}`);
    const data = await r.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

function CountrySelect({ value, onChange }: { value: string; onChange: (code: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selected = ALL_COUNTRIES.find(c => c.code === value);
  const filtered = ALL_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => { if (open) { setSearch(''); setTimeout(() => searchRef.current?.focus(), 50); } }, [open]);
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between border border-gray-300 rounded px-2.5 py-1.5 text-sm bg-white hover:border-brand-navy focus:outline-none focus:border-brand-navy transition-colors">
        <span className={selected ? 'text-gray-800' : 'text-gray-300'}>{selected ? selected.name : 'Select country'}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1.5">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input ref={searchRef} type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search country..." className="bg-transparent text-sm w-full focus:outline-none text-gray-700 placeholder-gray-400" />
            </div>
          </div>
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0
              ? <li className="px-3 py-2 text-sm text-gray-400 text-center">No results</li>
              : filtered.map(c => (
                <li key={c.code} onMouseDown={() => { onChange(c.code); setOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${c.code === value ? 'bg-brand-navy text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <span className="font-mono text-xs opacity-60 w-6">{c.code}</span>
                  <span>{c.name}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ProvinceSelect({ value, onChange, options }: {
  value: string; onChange: (val: string) => void; options: { label: string; value: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selected = options.find(o => o.value === value);
  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase()) || o.value.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => { if (open) { setSearch(''); setTimeout(() => searchRef.current?.focus(), 50); } }, [open]);
  if (options.length === 0) {
    return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="Province / State"
      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20 bg-white placeholder:text-gray-300" />;
  }
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between border border-gray-300 rounded px-2.5 py-1.5 text-sm bg-white hover:border-brand-navy focus:outline-none focus:border-brand-navy transition-colors">
        <span className={selected ? 'text-gray-800' : 'text-gray-300'}>{selected ? selected.label : 'Select province / state'}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1.5">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input ref={searchRef} type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search..." className="bg-transparent text-sm w-full focus:outline-none text-gray-700 placeholder-gray-400" />
            </div>
          </div>
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0
              ? <li className="px-3 py-2 text-sm text-gray-400 text-center">No results</li>
              : filtered.map(o => (
                <li key={o.value} onMouseDown={() => { onChange(o.value); setOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${o.value === value ? 'bg-brand-navy text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <span className="font-mono text-xs opacity-60 w-6">{o.value}</span>
                  <span>{o.label}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function CityInput({ value, onChange, country }: { value: string; onChange: (val: string) => void; country: string }) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setShowSugg(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const handleInput = async (val: string) => {
    onChange(val);
    if (val.length < 2) { setShowSugg(false); return; }
    try {
      const r = await fetch(`${API_URL}/geo/cities?country=${country}&q=${encodeURIComponent(val)}`);
      const data = await r.json();
      const cities: string[] = Array.isArray(data) ? data.map((d: any) => typeof d === 'string' ? d : d.label || d) : [];
      setSuggestions(cities.slice(0, 8));
      setShowSugg(cities.length > 0);
    } catch { setShowSugg(false); }
  };
  return (
    <div className="relative" ref={ref}>
      <input type="text" value={value} onChange={e => handleInput(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowSugg(true)}
        placeholder="City" autoComplete="off"
        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20 bg-white placeholder:text-gray-300" />
      {showSugg && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-1 py-1 max-h-48 overflow-y-auto">
          {suggestions.map(city => (
            <li key={city} onMouseDown={() => { onChange(city); setShowSugg(false); }}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">{city}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const inp = 'w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20 bg-white placeholder:text-gray-300';
const lbl = 'block text-xs text-gray-500 mb-0.5';
const req = <span className="text-red-500">*</span>;

// ─── Types ────────────────────────────────────────────────────────────────────
interface PkgRow {
  id: string;
  length: string; width: string; height: string;
  weight: string;
  insuranceAmount: string;
  specialHandling: boolean;
  description: string;
}

const mkPkg = (): PkgRow => ({
  id: Math.random().toString(36).slice(2),
  length: '', width: '', height: '', weight: '',
  insuranceAmount: '0.00', specialHandling: false, description: '',
});

const EMPTY: Address = {
  name: '', company: '', street: '', street2: '',
  city: '', province: '', postalCode: '', country: '',
  phone: '', email: '', isResidential: false,
};

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINS = ['00', '15', '30', '45'];
const PICKUP_LOCS = ['Front Door','Back Door','Side Door','Reception','Mailroom'];

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = ['SHIPMENT DETAILS', 'GET QUOTE', 'REVIEW', 'PAYMENT', 'VIEW & PRINT LABEL'];

function StepBar({ current }: { current: number }) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex">
          {STEPS.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <div key={label} className="flex-1 flex items-center gap-0">
                <div className={`py-3 px-2 flex items-center gap-2 text-xs font-semibold border-b-2 transition-all w-full justify-center ${active ? 'border-brand-orange text-brand-navy' : done ? 'border-green-500 text-green-600' : 'border-transparent text-gray-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${active ? 'bg-brand-orange text-white' : done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {done ? '✓' : i + 1}
                  </span>
                  <span className="hidden sm:block">{label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Address Panel ────────────────────────────────────────────────────────────
function AddressPanel({ title, color, address, onChange, showConfirmEmail }: {
  title: string; color: 'red' | 'blue';
  address: Address; onChange: (f: string, v: any) => void;
  showConfirmEmail?: boolean;
}) {
  const dot = color === 'red' ? 'bg-brand-orange' : 'bg-brand-navy';
  const hdr = color === 'red' ? 'text-brand-orange' : 'text-brand-navy';
  const [provinces, setProvinces] = useState<{ label: string; value: string }[]>([]);
  const [postalLoading, setPostalLoading] = useState(false);

  useEffect(() => {
    if (address.country) fetchProvinces(address.country).then(setProvinces);
    onChange('province', '');
    onChange('city', '');
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
        <div>
          <label className={lbl}>Company / Person {req}</label>
          <input className={inp} value={address.company || ''} onChange={e => onChange('company', e.target.value)} placeholder="Company or person name" />
        </div>
        <div>
          <label className={lbl}>Address Line 1 {req}</label>
          <input className={inp} value={address.street} onChange={e => onChange('street', e.target.value)} placeholder="Street address" required />
        </div>
        <div>
          <label className={lbl}>Address Line 2</label>
          <input className={inp} value={address.street2 || ''} onChange={e => onChange('street2', e.target.value)} placeholder="Suite / Unit / Apt" />
        </div>
        <div>
          <label className={lbl}>Country {req}</label>
          <CountrySelect value={address.country || ''} onChange={v => onChange('country', v)} />
        </div>
        <div>
          <label className={lbl}>Zip / Postal code</label>
          <div className="relative">
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
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={lbl}>City {req}</label>
            <CityInput value={address.city} onChange={v => onChange('city', v)} country={address.country || ''} />
          </div>
          <div>
            <label className={lbl}>Province / State</label>
            <ProvinceSelect value={address.province} onChange={v => onChange('province', v)} options={provinces} />
          </div>
        </div>
        <div>
          <label className={lbl}>Attention {req}</label>
          <input className={inp} value={address.name} onChange={e => onChange('name', e.target.value)} placeholder="Contact name" required />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={lbl}>Phone {req}</label>
            <input className={inp} type="tel" value={address.phone} onChange={e => onChange('phone', e.target.value)} placeholder="+1 416 555 0100" required />
          </div>
          <div>
            <label className={lbl}>Email {req}</label>
            <input className={inp} type="email" value={address.email || ''} onChange={e => onChange('email', e.target.value)} placeholder="email@example.com" />
          </div>
        </div>
        <div>
          <label className={lbl}>Instruction</label>
          <input className={inp} placeholder="Delivery instructions (optional)" />
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

// ─── Rate card ────────────────────────────────────────────────────────────────
function RateCard({ rate, selected, onSelect }: { rate: Rate; selected: boolean; onSelect: () => void }) {
  const carrierColor: Record<string, string> = {
    UPS: 'bg-yellow-600', PUROLATOR: 'bg-purple-700', DHL: 'bg-red-600', FEDEX: 'bg-purple-900', ICS: 'bg-blue-700',
  };
  const initials = rate.carrierName.slice(0, 3).toUpperCase();
  const bg = carrierColor[rate.carrierName.toUpperCase()] || 'bg-gray-600';

  return (
    <label className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${selected ? 'border-brand-orange bg-orange-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
      <input type="radio" checked={selected} onChange={onSelect} className="sr-only" />
      <div className={`w-10 h-10 rounded-lg ${bg} text-white flex items-center justify-center font-bold text-xs flex-shrink-0`}>{initials}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm">{rate.serviceName}</p>
        <p className="text-xs text-gray-400">{rate.transitDays} business day{rate.transitDays !== 1 ? 's' : ''}{rate.estimatedDelivery ? ` · Est. ${rate.estimatedDelivery}` : ''}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {rate.isCheapest && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Cheapest</span>}
        {rate.isFastest && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Fastest</span>}
        {rate.isBestValue && !rate.isCheapest && !rate.isFastest && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Best Value</span>}
        <p className="font-bold text-lg text-brand-navy">${rate.totalCharge.toFixed(2)} <span className="text-xs font-normal text-gray-400">{rate.currency}</span></p>
        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${selected ? 'border-brand-orange bg-brand-orange' : 'border-gray-300'}`}>
          {selected && <div className="w-2.5 h-2.5 bg-white rounded-full m-auto mt-0.5" />}
        </div>
      </div>
    </label>
  );
}

// ─── Stripe Payment Form ──────────────────────────────────────────────────────
function StripePaymentForm({ amount, currency, onSuccess, onBack }: {
  amount: number; currency: string;
  onSuccess: (transactionId: string) => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });
    setPaying(false);
    if (error) {
      toast.error(error.message || 'Payment failed. Please try again.');
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700 text-sm">Payment Details</h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Lock className="w-3 h-3" /> Secured by Stripe
          </div>
        </div>
        <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Charge</span>
          <span className="font-bold text-brand-navy text-lg">${amount.toFixed(2)} <span className="text-xs font-normal text-gray-400">{currency}</span></span>
        </div>
        <PaymentElement />
      </div>
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack}
          className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded text-gray-600 hover:border-brand-navy hover:text-brand-navy transition-all bg-white">
          ← Back
        </button>
        <button type="submit" disabled={!stripe || paying}
          className="px-8 py-2.5 text-sm font-semibold rounded text-white bg-brand-orange hover:bg-orange-600 transition-all flex items-center gap-2 disabled:opacity-60">
          {paying ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <><Lock className="w-4 h-4" /> Pay ${amount.toFixed(2)} {currency}</>}
        </button>
      </div>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BookingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [step, setStep] = useState(0); // 0=details, 1=quote, 2=review, 3=label

  // Addresses
  const [shipper, setShipper] = useState<Address>({ ...EMPTY });
  const [recipient, setRecipient] = useState<Address>({ ...EMPTY });

  // Packages
  const [packages, setPackages] = useState<PkgRow[]>([mkPkg()]);
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [dimUnit, setDimUnit] = useState<'in' | 'cm'>('in');
  const [packagingType] = useState('My Packaging');

  // Pickup & services
  const [pickupMethod, setPickupMethod] = useState<'schedule_pickup' | 'drop_off'>('schedule_pickup');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Front Door');
  const [pickupInstructions, setPickupInstructions] = useState('');
  const [readyHour, setReadyHour] = useState('15');
  const [readyMin, setReadyMin] = useState('30');
  const [closeHour, setCloseHour] = useState('18');
  const [closeMin, setCloseMin] = useState('00');
  const [signatureType, setSignatureType] = useState('none');
  const [saturdayDelivery, setSaturdayDelivery] = useState(false);
  const [holdForPickup, setHoldForPickup] = useState(false);
  const [references, setReferences] = useState([{ name: '', value: '' }]);

  // Quote results
  const [rates, setRates] = useState<Rate[]>([]);
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // Booking result
  const [bookLoading, setBookLoading] = useState(false);
  const [createdId, setCreatedId] = useState('');
  const [createdNumber, setCreatedNumber] = useState('');
  const [labelBase64, setLabelBase64] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem('pc_redirect_after_login', '/booking');
      router.push('/auth/login?next=/booking');
      return;
    }

    // Pre-fill from quote form if coming from quick quote
    const savedForm = sessionStorage.getItem('pc_quote_form');
    const savedRate = sessionStorage.getItem('pc_selected_rate');

    if (savedForm) {
      const f = JSON.parse(savedForm);
      setShipper(prev => ({
        ...prev,
        postalCode: f.originPostal || '',
        city: f.originCity || '',
        province: f.originProvince || '',
        isResidential: f.originResidential || false,
      }));
      setRecipient(prev => ({
        ...prev,
        postalCode: f.destinationPostal || '',
        city: f.destinationCity || '',
        province: f.destinationProvince || '',
        country: f.destinationCountry || 'CA',
        isResidential: f.destinationResidential || false,
      }));
      if (f.weightUnit) setWeightUnit(f.weightUnit);
      if (f.dimensionUnit) setDimUnit(f.dimensionUnit);
      if (f.packages?.length) {
        setPackages(f.packages.map((p: any) => ({
          id: p.id || Math.random().toString(36).slice(2),
          length: String(p.length || ''), width: String(p.width || ''), height: String(p.height || ''),
          weight: String(p.weight || ''), insuranceAmount: String(p.insuranceAmount || '0.00'),
          specialHandling: p.specialHandling || false, description: p.description || '',
        })));
      }
    }

    // Pre-fill user's shipper address if available
    if (user) {
      setShipper(prev => ({
        ...prev,
        name: prev.name || `${user.firstName} ${user.lastName}`,
        email: prev.email || user.email,
        phone: prev.phone || user.phone || '',
      }));
    }

    // Default pickup date to today
    const today = new Date().toISOString().split('T')[0];
    setPickupDate(today);

    // If we have a rate already selected (from quick quote flow), jump to review
    if (savedRate) {
      const rate = JSON.parse(savedRate);
      setSelectedRate(rate);
      // Don't auto-advance; let them fill in the full form first
    }
  }, [isAuthenticated, user]);

  const updateShipper = (f: string, v: any) => setShipper(p => ({ ...p, [f]: v }));
  const updateRecipient = (f: string, v: any) => setRecipient(p => ({ ...p, [f]: v }));

  const updatePkg = (id: string, field: keyof PkgRow, value: any) =>
    setPackages(p => p.map(pkg => pkg.id === id ? { ...pkg, [field]: value } : pkg));
  const addPkg = () => setPackages(p => [...p, mkPkg()]);
  const dupPkg = (pkg: PkgRow) => setPackages(p => [...p, { ...pkg, id: Math.random().toString(36).slice(2) }]);
  const removePkg = (id: string) => setPackages(p => p.length > 1 ? p.filter(pkg => pkg.id !== id) : p);

  const swapAddresses = () => {
    const tmp = { ...shipper };
    setShipper({ ...recipient });
    setRecipient(tmp);
  };

  const validateStep0 = () => {
    const reqFields = ['street', 'city', 'postalCode', 'country', 'name', 'phone'];
    for (const f of reqFields) {
      if (!(shipper as any)[f]) { toast.error(`Shipping From: ${f.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`); return false; }
      if (!(recipient as any)[f]) { toast.error(`Shipping To: ${f.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`); return false; }
    }
    const first = packages[0];
    if (!first.weight || !first.length || !first.width || !first.height) {
      toast.error('Please complete package dimensions and weight for at least one package.');
      return false;
    }
    return true;
  };

  const handleGetQuote = async () => {
    if (!validateStep0()) return;
    setQuoteLoading(true);
    setRates([]);
    setSelectedRate(null);
    try {
      const first = packages[0];
      const { data } = await shipmentApi.getRates({
        originPostal: shipper.postalCode,
        originCity: shipper.city,
        originProvince: shipper.province,
        originCountry: shipper.country,
        originResidential: shipper.isResidential,
        destinationPostal: recipient.postalCode,
        destinationCity: recipient.city,
        destinationProvince: recipient.province,
        destinationCountry: recipient.country,
        destinationResidential: recipient.isResidential,
        weight: parseFloat(first.weight),
        weightUnit,
        length: parseFloat(first.length),
        width: parseFloat(first.width),
        height: parseFloat(first.height),
        dimensionUnit: dimUnit,
        description: first.description || 'Package',
        insuranceAmount: parseFloat(first.insuranceAmount) || 0,
        specialHandling: first.specialHandling,
      } as any);
      setRates(data.rates || []);
      if (data.rates?.length) setSelectedRate(data.rates.find((r: Rate) => r.isCheapest) || data.rates[0]);
      setStep(1);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to fetch rates. Please try again.');
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedRate) { toast.error('Please select a shipping service.'); return; }
    setBookLoading(true);
    try {
      const pkgList = packages.map(p => ({
        weight: parseFloat(p.weight || '1'),
        weightUnit,
        length: parseFloat(p.length || '1'),
        width: parseFloat(p.width || '1'),
        height: parseFloat(p.height || '1'),
        dimensionUnit: dimUnit,
        description: p.description || 'Package',
        insuranceAmount: parseFloat(p.insuranceAmount) || 0,
        specialHandling: p.specialHandling,
        quantity: 1,
      }));

      const { data: bookData } = await shipmentApi.book({
        shipper, recipient,
        parcels: pkgList,
        selectedRate,
        shipmentType: recipient.country !== shipper.country ? 'international' : 'domestic',
        guestEmail: shipper.email,
        guestPhone: shipper.phone,
        pickupDetails: {
          method: pickupMethod,
          location: pickupLocation,
          instructions: pickupInstructions,
          pickupDate,
          readyHour, readyMin, closeHour, closeMin,
        },
        specialServices: {
          saturdayDelivery,
          signatureRequired: signatureType === 'signature_required',
          adultSignature: signatureType === 'adult_signature',
          holdForPickup,
        },
        references: references.filter(r => r.name && r.value).map(r => ({ referenceName: r.name, referenceValue: r.value })),
      });

      setCreatedId(bookData.shipmentId);
      setCreatedNumber(bookData.shipmentNumber);
      // Fetch Stripe payment intent
      const { data: intentData } = await paymentApi.createStripeIntent(bookData.shipmentId);
      setClientSecret(intentData.clientSecret);
      setStep(3);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookLoading(false);
    }
  };

  const handleConfirmPayment = async (transactionId: string) => {
    if (!createdId) return;
    setBookLoading(true);
    try {
      const { data } = await shipmentApi.confirmPayment(createdId, {
        method: 'stripe',
        transactionId,
      });
      if (data.shipment?.labelBase64) setLabelBase64(data.shipment.labelBase64);
      if (data.shipment?.trackingNumber) setTrackingNumber(data.shipment.trackingNumber);
      setStep(4);
      toast.success('Payment successful! Label is ready.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to generate label.');
    } finally {
      setBookLoading(false);
    }
  };

  const downloadLabel = () => {
    if (!labelBase64) return;
    const a = document.createElement('a');
    a.href = labelBase64;
    a.download = `label-${trackingNumber || createdNumber}.pdf`;
    a.click();
  };

  const totalWeight = packages.reduce((s, p) => s + (parseFloat(p.weight) || 0), 0);

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <Navbar />

      <div className="pt-16">
        <StepBar current={step} />

        <div className="max-w-6xl mx-auto px-4 py-6">

          {/* ── STEP 0: SHIPMENT DETAILS ─────────────────────────────────── */}
          {step === 0 && (
            <div className="space-y-4">
              {/* Title */}
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-gray-700">Provide Complete Details To Get A Quote</h1>
                <button onClick={() => router.push('/quote')} className="text-xs text-brand-navy hover:underline">Switch to Quick Quote ↗</button>
              </div>

              {/* Address panels side by side */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-stretch gap-0 relative">
                  <AddressPanel title="Shipping From" color="red" address={shipper} onChange={updateShipper} />
                  {/* Swap button */}
                  <div className="flex items-start justify-center pt-12 px-2 flex-shrink-0">
                    <button
                      onClick={swapAddresses}
                      title="Swap addresses"
                      className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-400 hover:border-brand-orange hover:text-brand-orange transition-all shadow-sm"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <AddressPanel title="Shipping To" color="blue" address={recipient} onChange={updateRecipient} showConfirmEmail />
                </div>
              </div>

              {/* Package Details */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-brand-orange text-white flex items-center justify-center text-xs">📦</span>
                    <span className="font-semibold text-gray-700 text-sm">Package Details</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Packaging Type</span>
                      <select className={`${inp} py-1 text-xs w-36`} value={packagingType} disabled>
                        <option>My Packaging</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Quantity</span>
                      <select className={`${inp} py-1 text-xs w-16`} value={packages.length} onChange={e => {
                        const n = parseInt(e.target.value);
                        if (n > packages.length) for (let i = packages.length; i < n; i++) addPkg();
                        else setPackages(p => p.slice(0, n));
                      }}>
                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-4 overflow-x-auto">
                  {/* Units row */}
                  <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
                    <span className="font-medium">Units:</span>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="radio" checked={dimUnit === 'cm'} onChange={() => { setDimUnit('cm'); setWeightUnit('kg'); }} className="accent-brand-navy" /> cm / kg
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="radio" checked={dimUnit === 'in'} onChange={() => { setDimUnit('in'); setWeightUnit('lbs'); }} className="accent-brand-navy" /> in / lbs
                    </label>
                  </div>

                  {/* Table header */}
                  <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 mb-2 px-2">
                    <span className="text-xs text-gray-400 w-6" />
                    <span className="text-xs text-gray-400">Dimensions L × W × H ({dimUnit})</span>
                    <span className="text-xs text-gray-400" />
                    <span className="text-xs text-gray-400" />
                    <span className="text-xs text-gray-400">Weight ({weightUnit})</span>
                    <span className="text-xs text-gray-400">Insurance Val ($)</span>
                    <span className="text-xs text-gray-400">Special Handling</span>
                    <span className="text-xs text-gray-400">Description</span>
                    <span className="text-xs text-gray-400 w-20" />
                  </div>

                  {/* Package rows */}
                  <div className="space-y-2">
                    {packages.map((pkg, idx) => (
                      <div key={pkg.id} className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 items-center">
                        <span className="text-xs text-gray-400 font-mono w-6">{String(idx + 1).padStart(2, '0')}.</span>
                        <input type="number" value={pkg.length} onChange={e => updatePkg(pkg.id, 'length', e.target.value)} placeholder="L" min="0.1" step="0.1" className={`${inp} text-center`} />
                        <input type="number" value={pkg.width} onChange={e => updatePkg(pkg.id, 'width', e.target.value)} placeholder="W" min="0.1" step="0.1" className={`${inp} text-center`} />
                        <input type="number" value={pkg.height} onChange={e => updatePkg(pkg.id, 'height', e.target.value)} placeholder="H" min="0.1" step="0.1" className={`${inp} text-center`} />
                        <input type="number" value={pkg.weight} onChange={e => updatePkg(pkg.id, 'weight', e.target.value)} placeholder="1" min="0.01" step="0.01" className={`${inp} text-center`} required={idx === 0} />
                        <input type="number" value={pkg.insuranceAmount} onChange={e => updatePkg(pkg.id, 'insuranceAmount', e.target.value)} placeholder="0.00" min="0" step="0.01" className={`${inp} text-center`} />
                        <select value={pkg.specialHandling ? 'yes' : 'no'} onChange={e => updatePkg(pkg.id, 'specialHandling', e.target.value === 'yes')} className={inp}>
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                        <input type="text" value={pkg.description} onChange={e => updatePkg(pkg.id, 'description', e.target.value)} placeholder="Description" className={inp} />
                        <div className="flex items-center gap-1 w-20">
                          <button type="button" onClick={addPkg} title="Add row" className="p-1 text-gray-400 hover:text-brand-navy transition-colors">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => dupPkg(pkg)} title="Duplicate" className="p-1 text-gray-400 hover:text-brand-navy transition-colors">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => dupPkg(pkg)} title="Clone" className="p-1 text-gray-400 hover:text-brand-navy transition-colors">
                            <Copy className="w-3.5 h-3.5 opacity-50" />
                          </button>
                          {packages.length > 1 && (
                            <button type="button" onClick={() => removePkg(pkg.id)} title="Remove" className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Services */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                  <span className="text-brand-orange font-bold text-sm">≡</span>
                  <span className="font-semibold text-gray-700 text-sm">Additional Services</span>
                </div>
                <div className="p-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left: Pickup */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-2 block">How to Ship?</label>
                        <div className="flex gap-4">
                          {[
                            { val: 'schedule_pickup', label: 'Schedule a Pick Up' },
                            { val: 'drop_off', label: 'Drop Off at Carrier' },
                          ].map(({ val, label }) => (
                            <label key={val} className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-600">
                              <input type="radio" checked={pickupMethod === val} onChange={() => setPickupMethod(val as any)} className="accent-brand-navy" />
                              {label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {pickupMethod === 'schedule_pickup' && (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={lbl}>Pick Up Date</label>
                              <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} className={inp} min={new Date().toISOString().split('T')[0]} />
                            </div>
                            <div>
                              <label className={lbl}>Pickup Location</label>
                              <select value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} className={inp}>
                                {PICKUP_LOCS.map(l => <option key={l} value={l}>{l}</option>)}
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={lbl}>Earliest Time Ready</label>
                              <div className="flex gap-1">
                                <select value={readyHour} onChange={e => setReadyHour(e.target.value)} className={`${inp} flex-1`}>
                                  {HOURS.map(h => <option key={h}>{h}</option>)}
                                </select>
                                <select value={readyMin} onChange={e => setReadyMin(e.target.value)} className={`${inp} w-16`}>
                                  {MINS.map(m => <option key={m}>{m}</option>)}
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className={lbl}>Latest Time Ready</label>
                              <div className="flex gap-1">
                                <select value={closeHour} onChange={e => setCloseHour(e.target.value)} className={`${inp} flex-1`}>
                                  {HOURS.map(h => <option key={h}>{h}</option>)}
                                </select>
                                <select value={closeMin} onChange={e => setCloseMin(e.target.value)} className={`${inp} w-16`}>
                                  {MINS.map(m => <option key={m}>{m}</option>)}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className={lbl}>Instructions</label>
                            <input type="text" value={pickupInstructions} onChange={e => setPickupInstructions(e.target.value)} placeholder="Please bring Envelope" className={inp} />
                          </div>
                          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
                            <input type="checkbox" className="accent-brand-navy" />
                            Save Pickup Preference
                          </label>
                        </>
                      )}
                    </div>

                    {/* Right: References + signature + saturday + hold */}
                    <div className="space-y-3">
                      {/* References */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-2 block">References</label>
                        {references.map((ref, i) => (
                          <div key={i} className="flex gap-2 mb-2">
                            <input type="text" value={ref.name} onChange={e => { const r = [...references]; r[i] = { ...r[i], name: e.target.value }; setReferences(r); }} placeholder="Reference name" className={`${inp} flex-1`} />
                            <input type="text" value={ref.value} onChange={e => { const r = [...references]; r[i] = { ...r[i], value: e.target.value }; setReferences(r); }} placeholder="Value" className={`${inp} flex-1`} />
                          </div>
                        ))}
                        {references.length < 3 && (
                          <button type="button" onClick={() => setReferences([...references, { name: '', value: '' }])} className="text-xs text-brand-navy hover:underline">+ Add Reference</button>
                        )}
                      </div>

                      {/* Signature */}
                      <div>
                        <label className={lbl}>Signature Type</label>
                        <select value={signatureType} onChange={e => setSignatureType(e.target.value)} className={inp}>
                          <option value="none">Choose an Option for Signature</option>
                          <option value="signature_required">Signature Required</option>
                          <option value="adult_signature">Adult Signature</option>
                        </select>
                      </div>

                      {/* Toggles */}
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
                          <input type="checkbox" checked={saturdayDelivery} onChange={e => setSaturdayDelivery(e.target.checked)} className="accent-brand-navy" />
                          Saturday Delivery
                        </label>
                        <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
                          <input type="checkbox" checked={holdForPickup} onChange={e => setHoldForPickup(e.target.checked)} className="accent-brand-navy" />
                          Hold For Pickup
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom action bar */}
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Select <button onClick={handleGetQuote} className="text-brand-orange font-semibold hover:underline">Get Quote</button> to view available pricing and carrier options for the route selected
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (!validateStep0()) return;
                      toast.success('Shipment saved as draft.');
                    }}
                    className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded text-gray-600 hover:border-brand-navy hover:text-brand-navy transition-all bg-white"
                  >
                    Save Shipment
                  </button>
                  <button
                    onClick={handleGetQuote}
                    disabled={quoteLoading}
                    className="px-6 py-2 text-sm font-semibold rounded text-white bg-brand-navy hover:bg-brand-navy/90 transition-all flex items-center gap-2 disabled:opacity-60"
                  >
                    {quoteLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Getting Rates...</> : 'Get Quote'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 1: GET QUOTE ────────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Available Rates</h2>
                  <p className="text-sm text-gray-400">
                    {shipper.city || shipper.postalCode} → {recipient.city || recipient.postalCode} · {totalWeight.toFixed(2)} {weightUnit} · {packages.length} pkg
                  </p>
                </div>
                <button onClick={() => setStep(0)} className="text-sm text-brand-navy hover:underline flex items-center gap-1">
                  ← Edit Details
                </button>
              </div>

              {rates.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                  <p className="text-gray-400">No rates found for this route. Please adjust your shipment details.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {rates.map(rate => (
                    <RateCard key={rate.serviceCode} rate={rate} selected={selectedRate?.serviceCode === rate.serviceCode} onSelect={() => setSelectedRate(rate)} />
                  ))}
                </div>
              )}

              {selectedRate && (
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Selected: <span className="font-semibold text-brand-navy">{selectedRate.carrierName} — {selectedRate.serviceName}</span>
                    <span className="ml-3 font-bold text-brand-orange">${selectedRate.totalCharge.toFixed(2)} {selectedRate.currency}</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(0)} className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded text-gray-600 hover:border-brand-navy hover:text-brand-navy transition-all bg-white">
                      ← Back
                    </button>
                    <button onClick={() => setStep(2)} className="px-6 py-2 text-sm font-semibold rounded text-white bg-brand-navy hover:bg-brand-navy/90 transition-all flex items-center gap-2">
                      Review & Payment <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: REVIEW & PAYMENT ─────────────────────────────────── */}
          {step === 2 && selectedRate && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <h2 className="text-lg font-semibold text-gray-700">Review & Payment</h2>

              {/* Rate summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <p className="text-xs text-gray-400 mb-1">Selected Service</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-brand-navy text-lg">{selectedRate.carrierName} — {selectedRate.serviceName}</p>
                    <p className="text-sm text-gray-500">{selectedRate.transitDays} business days · Est. {selectedRate.estimatedDelivery}</p>
                  </div>
                  <p className="font-bold text-2xl text-brand-orange">${selectedRate.totalCharge.toFixed(2)} <span className="text-sm text-gray-400 font-normal">{selectedRate.currency}</span></p>
                </div>
              </div>

              {/* Addresses side by side */}
              <div className="grid md:grid-cols-2 gap-4">
                {[{ label: 'Shipping From', addr: shipper, dot: 'bg-brand-orange' }, { label: 'Shipping To', addr: recipient, dot: 'bg-brand-navy' }].map(({ label, addr, dot }) => (
                  <div key={label} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                      <span className="font-semibold text-sm text-gray-700">{label}</span>
                      {addr.isResidential && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Residential</span>}
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">{addr.company || addr.name}</p>
                    <p className="text-sm text-gray-600">{addr.street}{addr.street2 ? `, ${addr.street2}` : ''}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.province} {addr.postalCode}</p>
                    <p className="text-sm text-gray-600">{addr.country}</p>
                    <p className="text-sm text-gray-500 mt-1">{addr.phone} · {addr.email}</p>
                  </div>
                ))}
              </div>

              {/* Packages summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-sm text-gray-700 mb-3">{packages.length} Package{packages.length > 1 ? 's' : ''} · {totalWeight.toFixed(2)} {weightUnit}</p>
                <div className="divide-y divide-gray-50">
                  {packages.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-4 py-1.5 text-sm text-gray-600">
                      <span className="text-gray-400 text-xs font-mono">#{i + 1}</span>
                      <span>{p.length}×{p.width}×{p.height} {dimUnit}</span>
                      <span>{p.weight} {weightUnit}</span>
                      {parseFloat(p.insuranceAmount) > 0 && <span className="text-blue-600 text-xs">Insured ${p.insuranceAmount}</span>}
                      {p.specialHandling && <span className="text-orange-500 text-xs">Special Handling</span>}
                      {p.description && <span className="text-gray-400 text-xs truncate">{p.description}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pickup summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm">
                <p className="font-semibold text-gray-700 mb-2">Shipping Details</p>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div><span className="text-gray-400">Method:</span> {pickupMethod === 'schedule_pickup' ? `Pickup on ${pickupDate}` : 'Drop Off at Carrier'}</div>
                  {pickupMethod === 'schedule_pickup' && <div><span className="text-gray-400">Window:</span> {readyHour}:{readyMin} – {closeHour}:{closeMin}</div>}
                  {signatureType !== 'none' && <div><span className="text-gray-400">Signature:</span> {signatureType.replace(/_/g, ' ')}</div>}
                  {saturdayDelivery && <div className="text-brand-orange font-medium">Saturday Delivery</div>}
                  {holdForPickup && <div className="text-brand-orange font-medium">Hold For Pickup</div>}
                </div>
              </div>

              {/* Payment action */}
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
                <button onClick={() => setStep(1)} className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded text-gray-600 hover:border-brand-navy hover:text-brand-navy transition-all bg-white">
                  ← Back
                </button>
                <button
                  onClick={handleBook}
                  disabled={bookLoading}
                  className="px-6 py-2.5 text-sm font-semibold rounded text-white bg-brand-orange hover:bg-orange-600 transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {bookLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <>Proceed to Payment <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: PAYMENT ──────────────────────────────────────────── */}
          {step === 3 && clientSecret && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">Complete Payment</h2>
                <p className="text-sm text-gray-400">Order: <span className="font-mono font-semibold text-brand-navy">{createdNumber}</span></p>
              </div>
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                <StripePaymentForm
                  amount={selectedRate?.totalCharge || 0}
                  currency={selectedRate?.currency || 'CAD'}
                  onSuccess={handleConfirmPayment}
                  onBack={() => setStep(2)}
                />
              </Elements>
            </div>
          )}

          {/* ── STEP 4: VIEW & PRINT LABEL ───────────────────────────────── */}
          {step === 4 && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-9 h-9 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-brand-navy mb-1">Shipment Created!</h2>
                <p className="text-gray-500 text-sm mb-1">Order: <span className="font-mono font-semibold text-brand-navy">{createdNumber}</span></p>
                {trackingNumber && (
                  <p className="text-gray-500 text-sm mb-4">Tracking: <span className="font-mono font-semibold text-brand-orange">{trackingNumber}</span></p>
                )}

                <div className="flex gap-3 justify-center mt-6">
                  {labelBase64 ? (
                    <button onClick={downloadLabel} className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded text-white bg-brand-navy hover:bg-brand-navy/90 transition-all">
                      <Download className="w-4 h-4" /> Download Label (PDF)
                    </button>
                  ) : (
                    <p className="text-sm text-gray-400">Label is being generated…</p>
                  )}
                  {trackingNumber && (
                    <a href={`/track?number=${trackingNumber}`} className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded border border-gray-300 text-gray-600 hover:border-brand-navy hover:text-brand-navy transition-all">
                      Track Shipment
                    </a>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3 justify-center">
                  <button onClick={() => { setStep(0); setCreatedId(''); setCreatedNumber(''); setTrackingNumber(''); setLabelBase64(''); setClientSecret(''); setRates([]); setSelectedRate(null); setPackages([mkPkg()]); }} className="text-sm text-brand-orange hover:underline">
                    + New Shipment
                  </button>
                  <span className="text-gray-300">·</span>
                  <a href="/account/shipments" className="text-sm text-gray-500 hover:underline">View All Shipments</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
