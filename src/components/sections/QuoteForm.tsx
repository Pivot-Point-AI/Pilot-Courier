'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, ChevronDown, Search } from 'lucide-react';
import { shipmentApi } from '@/lib/api';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pilot-courier-ackend.vercel.app/api';

const ALL_COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' }, { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' }, { code: 'AR', name: 'Argentina' },
  { code: 'AU', name: 'Australia' }, { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' }, { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' }, { code: 'BE', name: 'Belgium' },
  { code: 'BR', name: 'Brazil' }, { code: 'CA', name: 'Canada' },
  { code: 'CL', name: 'Chile' }, { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' }, { code: 'HR', name: 'Croatia' },
  { code: 'CZ', name: 'Czech Republic' }, { code: 'DK', name: 'Denmark' },
  { code: 'EG', name: 'Egypt' }, { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' }, { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' }, { code: 'GR', name: 'Greece' },
  { code: 'HK', name: 'Hong Kong' }, { code: 'HU', name: 'Hungary' },
  { code: 'IN', name: 'India' }, { code: 'ID', name: 'Indonesia' },
  { code: 'IE', name: 'Ireland' }, { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' }, { code: 'JP', name: 'Japan' },
  { code: 'JO', name: 'Jordan' }, { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' }, { code: 'KW', name: 'Kuwait' },
  { code: 'LB', name: 'Lebanon' }, { code: 'MY', name: 'Malaysia' },
  { code: 'MX', name: 'Mexico' }, { code: 'MA', name: 'Morocco' },
  { code: 'NL', name: 'Netherlands' }, { code: 'NZ', name: 'New Zealand' },
  { code: 'NG', name: 'Nigeria' }, { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' }, { code: 'PK', name: 'Pakistan' },
  { code: 'PE', name: 'Peru' }, { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Poland' }, { code: 'PT', name: 'Portugal' },
  { code: 'QA', name: 'Qatar' }, { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' }, { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SG', name: 'Singapore' }, { code: 'ZA', name: 'South Africa' },
  { code: 'ES', name: 'Spain' }, { code: 'LK', name: 'Sri Lanka' },
  { code: 'SE', name: 'Sweden' }, { code: 'CH', name: 'Switzerland' },
  { code: 'TW', name: 'Taiwan' }, { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' }, { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' }, { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' }, { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' }, { code: 'VN', name: 'Vietnam' },
  { code: 'YE', name: 'Yemen' }, { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
];

const PACKAGE_TYPES = [
  { id: 'Parcel', label: 'Parcel' },
  { id: 'Envelope', label: 'Envelope' },
  { id: 'LTL', label: 'LTL' },
  { id: 'Pak', label: 'Pak' },
];

async function lookupPostal(country: string, postal: string) {
  try {
    const r = await fetch(`${API_URL}/geo/postal?country=${country}&postal=${encodeURIComponent(postal)}`);
    return await r.json();
  } catch { return null; }
}

// ── Searchable Country Dropdown ───────────────────────────────────────────────
function CountryDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = ALL_COUNTRIES.find(c => c.code === value);
  const filtered = ALL_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) || c.code.toLowerCase().includes(q.toLowerCase())
  );

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => { if (open) { setQ(''); setTimeout(() => inputRef.current?.focus(), 40); } }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full h-11 flex items-center justify-between border border-gray-200 rounded-lg px-3 bg-white text-sm hover:border-[#1B2B6B] focus:outline-none transition-colors">
        <span className={selected ? 'text-gray-800' : 'text-gray-400'}>{selected?.name || 'Pick country'}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1.5">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <input ref={inputRef} type="text" value={q} onChange={e => setQ(e.target.value)}
                placeholder="Search country…"
                className="bg-transparent text-sm w-full focus:outline-none placeholder-gray-400" />
            </div>
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.map(c => (
              <li key={c.code} onMouseDown={() => { onChange(c.code); setOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${c.code === value ? 'bg-[#1B2B6B] text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                <span className="font-mono text-[10px] opacity-50 w-5">{c.code}</span>{c.name}
              </li>
            ))}
            {filtered.length === 0 && <li className="px-3 py-2 text-sm text-gray-400 text-center">No results</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

interface Pkg { id: string; length: string; width: string; height: string; weight: string; }
const newPkg = (): Pkg => ({ id: Math.random().toString(36).slice(2), length: '', width: '', height: '', weight: '' });

export default function QuoteForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pkgType, setPkgType] = useState('Parcel');
  const [uom, setUom] = useState<'I' | 'M'>('I'); // Imperial / Metric
  const [originCountry, setOriginCountry] = useState('CA');
  const [originPostal, setOriginPostal] = useState('');
  const [originCity, setOriginCity] = useState('');
  const [originProvince, setOriginProvince] = useState('');
  const [originResidential, setOriginResidential] = useState(false);
  const [destCountry, setDestCountry] = useState('CA');
  const [destPostal, setDestPostal] = useState('');
  const [destCity, setDestCity] = useState('');
  const [destProvince, setDestProvince] = useState('');
  const [destResidential, setDestResidential] = useState(false);
  const [packages, setPackages] = useState<Pkg[]>([newPkg()]);
  const [lookingUp, setLookingUp] = useState<'origin' | 'dest' | null>(null);

  const weightLabel = uom === 'I' ? 'Lbs' : 'Kg';
  const dimLabel = uom === 'I' ? 'inches' : 'cm';

  const handlePostal = async (side: 'origin' | 'dest', country: string, val: string) => {
    if (side === 'origin') setOriginPostal(val); else setDestPostal(val);
    if (val.replace(/\s/g, '').length < 4) return;
    setLookingUp(side);
    const res = await lookupPostal(country, val);
    setLookingUp(null);
    if (res?.city) {
      if (side === 'origin') { setOriginCity(res.city); setOriginProvince(res.province || ''); }
      else { setDestCity(res.city); setDestProvince(res.province || ''); }
    }
  };

  const updatePkg = (id: string, f: keyof Pkg, v: string) =>
    setPackages(p => p.map(pkg => pkg.id === id ? { ...pkg, [f]: v } : pkg));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const first = packages[0];
    if (!first.weight || !first.length || !first.width || !first.height) {
      toast.error('Please fill in package dimensions and weight.'); return;
    }
    setLoading(true);
    try {
      const { data } = await shipmentApi.getRates({
        originPostal, originCity, originProvince, originCountry, originResidential,
        destinationPostal: destPostal, destinationCity: destCity, destinationProvince: destProvince,
        destinationCountry: destCountry, destinationResidential: destResidential,
        weight: parseFloat(first.weight),
        weightUnit: uom === 'I' ? 'lbs' : 'kg',
        length: parseFloat(first.length), width: parseFloat(first.width), height: parseFloat(first.height),
        dimensionUnit: uom === 'I' ? 'in' : 'cm',
        packagingType: pkgType,
      } as any);
      sessionStorage.setItem('pc_rates', JSON.stringify(data.rates));
      sessionStorage.setItem('pc_quote_form', JSON.stringify({ originPostal, originCity, originCountry, destPostal, destCity, destCountry, packages, pkgType, uom }));
      router.push('/quote/results');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to fetch rates.');
    } finally { setLoading(false); }
  };

  const field = 'w-full h-11 border border-gray-200 rounded-lg px-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1B2B6B] bg-white transition-colors';

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden w-full">

      {/* ── Top bar: package type tabs + unit toggle ── */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-1">
          {PACKAGE_TYPES.map(t => (
            <button key={t.id} type="button" onClick={() => setPkgType(t.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${pkgType === t.id ? 'text-[#1B2B6B]' : 'text-gray-400 hover:text-gray-600'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center bg-gray-100 rounded-full p-0.5">
          {(['I', 'M'] as const).map(u => (
            <button key={u} type="button" onClick={() => setUom(u)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${uom === u ? 'bg-[#1B2B6B] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {u === 'I' ? 'Imperial' : 'Metric'}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

        {/* ── Shipping from / to ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-start">

          {/* From */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#1B2B6B] uppercase tracking-wide">Shipping from</p>
            <CountryDropdown value={originCountry} onChange={v => { setOriginCountry(v); setOriginCity(''); setOriginPostal(''); setOriginProvince(''); }} />
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input type="text" value={originPostal}
                  onChange={e => handlePostal('origin', originCountry, e.target.value)}
                  placeholder="Postal code" className={field} />
                {lookingUp === 'origin' && <Loader2 className="absolute right-2.5 top-3 w-4 h-4 text-gray-300 animate-spin" />}
              </div>
              <input type="text" value={originCity} onChange={e => setOriginCity(e.target.value)}
                placeholder="City" className={field} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={originResidential} onChange={e => setOriginResidential(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 accent-[#1B2B6B]" />
              <span className="text-sm text-gray-500">Residential</span>
            </label>
          </div>

          {/* Truck divider */}
          <div className="hidden md:flex items-center justify-center pt-8">
            <div className="w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center">
              <svg className="w-5 h-5 text-[#1B2B6B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
          </div>

          {/* To */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#1B2B6B] uppercase tracking-wide">Shipping to</p>
            <CountryDropdown value={destCountry} onChange={v => { setDestCountry(v); setDestCity(''); setDestPostal(''); setDestProvince(''); }} />
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input type="text" value={destPostal}
                  onChange={e => handlePostal('dest', destCountry, e.target.value)}
                  placeholder="Postal code" className={field} />
                {lookingUp === 'dest' && <Loader2 className="absolute right-2.5 top-3 w-4 h-4 text-gray-300 animate-spin" />}
              </div>
              <input type="text" value={destCity} onChange={e => setDestCity(e.target.value)}
                placeholder="City" className={field} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={destResidential} onChange={e => setDestResidential(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 accent-[#1B2B6B]" />
              <span className="text-sm text-gray-500">Residential</span>
            </label>
          </div>
        </div>

        {/* ── Package rows ── */}
        <div>
          <p className="text-xs font-bold text-[#1B2B6B] uppercase tracking-wide mb-2">
            Dimensions (L×W×H in {dimLabel}) &nbsp;&amp;&nbsp; Weight ({weightLabel})
          </p>
          <div className="space-y-2">
            {packages.map((pkg, idx) => (
              <div key={pkg.id} className="grid grid-cols-4 gap-2">
                <input type="number" value={pkg.length} onChange={e => updatePkg(pkg.id, 'length', e.target.value)}
                  placeholder="Length" min="0.1" step="0.1" required={idx === 0} className={field} />
                <input type="number" value={pkg.width} onChange={e => updatePkg(pkg.id, 'width', e.target.value)}
                  placeholder="Width" min="0.1" step="0.1" required={idx === 0} className={field} />
                <input type="number" value={pkg.height} onChange={e => updatePkg(pkg.id, 'height', e.target.value)}
                  placeholder="Height" min="0.1" step="0.1" required={idx === 0} className={field} />
                <div className="flex gap-2">
                  <input type="number" value={pkg.weight} onChange={e => updatePkg(pkg.id, 'weight', e.target.value)}
                    placeholder={weightLabel} min="0.1" step="0.01" required={idx === 0} className={`${field} flex-1`} />
                  {packages.length > 1 && (
                    <button type="button" onClick={() => setPackages(p => p.filter(x => x.id !== pkg.id))}
                      className="w-11 h-11 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors">
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button type="button" onClick={() => setPackages(p => [...p, newPkg()])}
            className="mt-3 flex items-center gap-2 text-sm text-gray-500 hover:text-[#1B2B6B] transition-colors font-medium">
            <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
              <Plus className="w-3 h-3" />
            </div>
            Add a Package to this Shipment
          </button>
        </div>

        {/* ── Submit ── */}
        <div className="flex justify-end pt-1">
          <button type="submit" disabled={loading}
            className="h-12 px-10 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold text-sm rounded-full transition-colors shadow-md disabled:opacity-60 flex items-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Getting Rates…</> : 'Get a Quote'}
          </button>
        </div>
      </form>
    </div>
  );
}
