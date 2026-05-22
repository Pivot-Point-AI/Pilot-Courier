'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { shipmentApi } from '@/lib/api';
import { Loader2, Plus, Copy, Trash2, ExternalLink, ChevronDown, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ── Full country list ─────────────────────────────────────────────────────────
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

const PACKAGING_TYPES = ['My Packaging', 'Envelope', 'Pak', 'Pallet'];

// ── Searchable Country Select ─────────────────────────────────────────────────
function CountrySelect({ value, onChange, placeholder = 'Select country' }: {
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = ALL_COUNTRIES.find(c => c.code === value);
  const filtered = ALL_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) { setSearch(''); setTimeout(() => searchRef.current?.focus(), 50); }
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between border border-gray-300 rounded px-3 py-2 text-sm bg-white hover:border-[#1B2B6B] focus:outline-none focus:border-[#1B2B6B] transition-colors"
      >
        <span className={selected ? 'text-gray-800' : 'text-gray-400'}>
          {selected ? `${selected.name}` : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1.5">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search country..."
                className="bg-transparent text-sm w-full focus:outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-400 text-center">No results</li>
            ) : filtered.map(c => (
              <li
                key={c.code}
                onMouseDown={() => { onChange(c.code); setOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${
                  c.code === value ? 'bg-[#1B2B6B] text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
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

// ── Province Select ───────────────────────────────────────────────────────────
function ProvinceSelect({ value, onChange, options, placeholder = 'Select province / state' }: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find(o => o.value === value);
  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase()) ||
    o.value.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) { setSearch(''); setTimeout(() => searchRef.current?.focus(), 50); }
  }, [open]);

  if (options.length === 0) {
    return (
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Province / State"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1B2B6B] transition-colors"
      />
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between border border-gray-300 rounded px-3 py-2 text-sm bg-white hover:border-[#1B2B6B] focus:outline-none focus:border-[#1B2B6B] transition-colors"
      >
        <span className={selected ? 'text-gray-800' : 'text-gray-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1.5">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent text-sm w-full focus:outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-400 text-center">No results</li>
            ) : filtered.map(o => (
              <li
                key={o.value}
                onMouseDown={() => { onChange(o.value); setOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${
                  o.value === value ? 'bg-[#1B2B6B] text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
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

// ── City autocomplete ─────────────────────────────────────────────────────────
function CityInput({ value, onChange, country, placeholder = 'City', required }: {
  value: string;
  onChange: (val: string) => void;
  country: string;
  placeholder?: string;
  required?: boolean;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowSugg(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
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
      <input
        type="text"
        value={value}
        onChange={e => handleInput(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowSugg(true)}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1B2B6B] transition-colors"
      />
      {showSugg && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-1 py-1 max-h-48 overflow-y-auto">
          {suggestions.map(city => (
            <li
              key={city}
              onMouseDown={() => { onChange(city); setShowSugg(false); }}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Geo lookup helpers ────────────────────────────────────────────────────────
async function lookupPostal(country: string, postal: string): Promise<{ city: string; province: string } | null> {
  try {
    const r = await fetch(`${API_URL}/geo/postal?country=${country}&postal=${encodeURIComponent(postal)}`);
    const data = await r.json();
    return data || null;
  } catch { return null; }
}

async function fetchProvinces(country: string): Promise<{ label: string; value: string }[]> {
  try {
    const r = await fetch(`${API_URL}/geo/provinces?country=${country}`);
    const data = await r.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

// ── Package row ───────────────────────────────────────────────────────────────
interface PackageRow {
  id: string; length: string; width: string; height: string;
  weight: string; insuranceAmount: string; specialHandling: boolean; description: string;
}
const newPkg = (): PackageRow => ({
  id: Math.random().toString(36).slice(2),
  length: '', width: '', height: '', weight: '',
  insuranceAmount: '0.00', specialHandling: false, description: '',
});

// ── Pin Icon ──────────────────────────────────────────────────────────────────
function PinIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={color} />
      <circle cx="12" cy="9" r="2.5" fill="white" />
    </svg>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function QuotePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [packagingType, setPackagingType] = useState('My Packaging');
  const [form, setForm] = useState({
    originPostal: '', originCity: '', originProvince: '', originCountry: 'CA',
    originResidential: false,
    destinationPostal: '', destinationCity: '', destinationProvince: '', destinationCountry: 'CA',
    destinationResidential: false,
    weightUnit: 'lbs' as 'kg' | 'lbs',
    dimensionUnit: 'in' as 'cm' | 'in',
  });
  const [packages, setPackages] = useState<PackageRow[]>([newPkg()]);
  const [originProvinces, setOriginProvinces] = useState<{ label: string; value: string }[]>([]);
  const [destProvinces, setDestProvinces] = useState<{ label: string; value: string }[]>([]);
  const [postalLookingUp, setPostalLookingUp] = useState<'origin' | 'destination' | null>(null);

  useEffect(() => {
    fetchProvinces(form.originCountry).then(setOriginProvinces);
    setForm(p => ({ ...p, originProvince: '', originCity: '' }));
  }, [form.originCountry]);

  useEffect(() => {
    fetchProvinces(form.destinationCountry).then(setDestProvinces);
    setForm(p => ({ ...p, destinationProvince: '', destinationCity: '' }));
  }, [form.destinationCountry]);

  const setField = (field: string, value: any) => setForm(p => ({ ...p, [field]: value }));

  const handlePostalChange = async (prefix: 'origin' | 'destination', country: string, postal: string) => {
    setField(`${prefix}Postal`, postal);
    const clean = postal.replace(/\s/g, '');
    if (clean.length < 4) return;
    setPostalLookingUp(prefix);
    const result = await lookupPostal(country, postal);
    setPostalLookingUp(null);
    if (result) {
      setForm(p => ({
        ...p,
        [`${prefix}City`]: result.city,
        [`${prefix}Province`]: result.province,
      }));
    }
  };

  const updatePkg = (id: string, field: keyof PackageRow, value: any) =>
    setPackages(p => p.map(pkg => pkg.id === id ? { ...pkg, [field]: value } : pkg));
  const addPkg = () => setPackages(p => [...p, newPkg()]);
  const dupPkg = (pkg: PackageRow) => setPackages(p => [...p, { ...pkg, id: Math.random().toString(36).slice(2) }]);
  const removePkg = (id: string) => setPackages(p => p.length > 1 ? p.filter(pkg => pkg.id !== id) : p);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const first = packages[0];
    if (!first.weight || !first.length || !first.width || !first.height) {
      toast.error('Please fill in all package dimensions and weight.'); return;
    }
    if (!form.originCity) {
      toast.error('Please enter the origin city.'); return;
    }
    setLoading(true);
    try {
      const { data } = await shipmentApi.getRates({
        originPostal: form.originPostal, originCity: form.originCity,
        originProvince: form.originProvince, originCountry: form.originCountry,
        originResidential: form.originResidential,
        destinationPostal: form.destinationPostal, destinationCity: form.destinationCity,
        destinationProvince: form.destinationProvince, destinationCountry: form.destinationCountry,
        destinationResidential: form.destinationResidential,
        weight: parseFloat(first.weight), weightUnit: form.weightUnit,
        length: parseFloat(first.length), width: parseFloat(first.width), height: parseFloat(first.height),
        dimensionUnit: form.dimensionUnit, description: first.description || 'Package',
        insuranceAmount: parseFloat(first.insuranceAmount) || 0,
        specialHandling: first.specialHandling, packagingType,
      } as any);
      sessionStorage.setItem('pc_rates', JSON.stringify(data.rates));
      sessionStorage.setItem('pc_quote_form', JSON.stringify({ ...form, packages, packagingType }));
      router.push('/quote/results');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to fetch rates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-bold text-[#1B2B6B]">Provide Details To Get A Quick Quote</h1>
          <Link href="/booking" className="flex items-center gap-1 text-sm text-[#1B2B6B] hover:text-[#FF6B00] font-medium transition-colors">
            Switch to Rate &amp; Ship <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── Addresses ── */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-5">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">

              {/* From */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <PinIcon color="#1B2B6B" />
                  <span className="font-bold text-[#1B2B6B] text-sm tracking-wide">Shipping From</span>
                  <label className="ml-auto flex items-center gap-2 cursor-pointer select-none">
                    <div className="relative">
                      <input type="checkbox" checked={form.originResidential}
                        onChange={e => setField('originResidential', e.target.checked)} className="sr-only peer" />
                      <div className="w-8 h-4 bg-gray-200 rounded-full peer peer-checked:bg-[#1B2B6B] transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                    </div>
                    <span className="text-xs text-gray-500">Residential</span>
                  </label>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Country</label>
                    <CountrySelect value={form.originCountry} onChange={v => setForm(p => ({ ...p, originCountry: v }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Zip / Postal Code <span className="text-[#FF6B00]">*</span></label>
                    <div className="relative">
                      <input type="text" value={form.originPostal}
                        onChange={e => handlePostalChange('origin', form.originCountry, e.target.value)}
                        placeholder="e.g. L1Z 0R6"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1B2B6B] transition-colors"
                        required />
                      {postalLookingUp === 'origin' && <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 animate-spin" />}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">City <span className="text-[#FF6B00]">*</span></label>
                    <CityInput value={form.originCity} onChange={v => setField('originCity', v)} country={form.originCountry} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Province / State <span className="text-[#FF6B00]">*</span></label>
                    <ProvinceSelect
                      value={form.originProvince}
                      onChange={v => setField('originProvince', v)}
                      options={originProvinces}
                    />
                  </div>
                </div>
              </div>

              {/* To */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <PinIcon color="#FF6B00" />
                  <span className="font-bold text-[#1B2B6B] text-sm tracking-wide">Shipping To</span>
                  <label className="ml-auto flex items-center gap-2 cursor-pointer select-none">
                    <div className="relative">
                      <input type="checkbox" checked={form.destinationResidential}
                        onChange={e => setField('destinationResidential', e.target.checked)} className="sr-only peer" />
                      <div className="w-8 h-4 bg-gray-200 rounded-full peer peer-checked:bg-[#1B2B6B] transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                    </div>
                    <span className="text-xs text-gray-500">Residential</span>
                  </label>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Country</label>
                    <CountrySelect value={form.destinationCountry} onChange={v => setForm(p => ({ ...p, destinationCountry: v }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Zip / Postal Code</label>
                    <div className="relative">
                      <input type="text" value={form.destinationPostal}
                        onChange={e => handlePostalChange('destination', form.destinationCountry, e.target.value)}
                        placeholder="e.g. V6B 1A1 (optional)"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1B2B6B] transition-colors" />
                      {postalLookingUp === 'destination' && <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 animate-spin" />}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                    <CityInput value={form.destinationCity} onChange={v => setField('destinationCity', v)} country={form.destinationCountry} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Province / State</label>
                    <ProvinceSelect
                      value={form.destinationProvince}
                      onChange={v => setField('destinationProvince', v)}
                      options={destProvinces}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Package Details ── */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-5">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#FF6B00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
                <span className="font-bold text-[#1B2B6B] text-sm">Package Details</span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500 font-medium">Packaging Type</label>
                  <select value={packagingType} onChange={e => setPackagingType(e.target.value)}
                    className="border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#1B2B6B] bg-white transition-colors">
                    {PACKAGING_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500 font-medium">Weight</label>
                  <select value={form.weightUnit} onChange={e => setField('weightUnit', e.target.value)}
                    className="border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#1B2B6B] bg-white transition-colors">
                    <option value="lbs">lbs</option>
                    <option value="kg">kg</option>
                  </select>
                  <label className="text-xs text-gray-500 font-medium">Dims</label>
                  <select value={form.dimensionUnit} onChange={e => setField('dimensionUnit', e.target.value)}
                    className="border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#1B2B6B] bg-white transition-colors">
                    <option value="in">in</option>
                    <option value="cm">cm</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 overflow-x-auto">
              {/* Header */}
              <div className="grid gap-2 mb-2 min-w-[700px]"
                style={{ gridTemplateColumns: '2rem 1fr 1fr 1fr 1fr 1fr 6rem 1fr auto' }}>
                <span className="text-xs font-semibold text-gray-400 text-center">#</span>
                <span className="text-xs font-semibold text-gray-500">L ({form.dimensionUnit})</span>
                <span className="text-xs font-semibold text-gray-500">W ({form.dimensionUnit})</span>
                <span className="text-xs font-semibold text-gray-500">H ({form.dimensionUnit})</span>
                <span className="text-xs font-semibold text-gray-500">Weight ({form.weightUnit})</span>
                <span className="text-xs font-semibold text-gray-500">Insurance ($)</span>
                <span className="text-xs font-semibold text-gray-500 text-center">Sp. Handling</span>
                <span className="text-xs font-semibold text-gray-500">Description</span>
                <span />
              </div>

              <div className="space-y-2 min-w-[700px]">
                {packages.map((pkg, idx) => (
                  <div key={pkg.id} className="grid gap-2 items-center bg-gray-50 rounded-lg px-2 py-2.5 border border-gray-100"
                    style={{ gridTemplateColumns: '2rem 1fr 1fr 1fr 1fr 1fr 6rem 1fr auto' }}>
                    <span className="text-xs font-bold text-gray-400 text-center">{idx + 1}</span>
                    {(['length','width','height','weight'] as const).map(f => (
                      <input key={f} type="number" value={pkg[f]}
                        onChange={e => updatePkg(pkg.id, f, e.target.value)}
                        placeholder={f[0].toUpperCase()} min="0.1" step="0.1"
                        required={idx === 0}
                        className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] bg-white transition-colors text-center" />
                    ))}
                    <input type="number" value={pkg.insuranceAmount}
                      onChange={e => updatePkg(pkg.id, 'insuranceAmount', e.target.value)}
                      placeholder="0.00" min="0" step="0.01"
                      className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] bg-white transition-colors text-center" />
                    <select value={pkg.specialHandling ? 'Yes' : 'No'}
                      onChange={e => updatePkg(pkg.id, 'specialHandling', e.target.value === 'Yes')}
                      className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#1B2B6B] bg-white transition-colors text-center">
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                    <input type="text" value={pkg.description}
                      onChange={e => updatePkg(pkg.id, 'description', e.target.value)}
                      placeholder="Description"
                      className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] bg-white transition-colors" />
                    <div className="flex items-center gap-0.5">
                      <button type="button" title="Add" onClick={addPkg}
                        className="p-1.5 rounded text-gray-400 hover:text-[#1B2B6B] hover:bg-gray-200 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" title="Duplicate" onClick={() => dupPkg(pkg)}
                        className="p-1.5 rounded text-gray-400 hover:text-[#1B2B6B] hover:bg-gray-200 transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {packages.length > 1 && (
                        <button type="button" title="Remove" onClick={() => removePkg(pkg.id)}
                          className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Submit ── */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 hidden sm:block">
              Select <span className="text-[#FF6B00] font-semibold">Get Quote</span> to view available pricing and carrier options for the selected route
            </p>
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 bg-[#1B2B6B] hover:bg-[#152259] text-white font-bold text-sm px-10 py-3 rounded-lg transition-colors shadow-sm disabled:opacity-60 ml-auto">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Getting Rates...</> : 'Get Quote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
