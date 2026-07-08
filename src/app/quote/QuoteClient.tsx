'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { shipmentApi } from '@/lib/api';
import { Loader2, Plus, Copy, Trash2, ExternalLink, ChevronDown, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pilot-courier-ackend.vercel.app/api';

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
        className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50/60 hover:border-[#1B2B6B] focus:outline-none focus:border-[#1B2B6B] focus:bg-white focus:ring-2 focus:ring-[#1B2B6B]/10 transition-colors"
      >
        <span className={selected ? 'text-gray-800' : 'text-gray-400'}>
          {selected ? `${selected.name}` : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
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

  const selected = options.find(o => o.value.toLowerCase() === value.toLowerCase() || o.label.toLowerCase() === value.toLowerCase());
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
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50/60 focus:outline-none focus:border-[#1B2B6B] focus:bg-white focus:ring-2 focus:ring-[#1B2B6B]/10 transition-colors"
      />
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50/60 hover:border-[#1B2B6B] focus:outline-none focus:border-[#1B2B6B] focus:bg-white focus:ring-2 focus:ring-[#1B2B6B]/10 transition-colors"
      >
        <span className={selected || value ? 'text-gray-800' : 'text-gray-400'}>
          {selected ? selected.label : value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
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
                  o.value.toLowerCase() === value.toLowerCase() ? 'bg-[#1B2B6B] text-white' : 'text-gray-700 hover:bg-gray-50'
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
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50/60 focus:outline-none focus:border-[#1B2B6B] focus:bg-white focus:ring-2 focus:ring-[#1B2B6B]/10 transition-colors"
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
  freightClass: string;
}
const newPkg = (): PackageRow => ({
  id: Math.random().toString(36).slice(2),
  length: '1', width: '1', height: '1', weight: '1',
  insuranceAmount: '0.00', specialHandling: false, description: '', freightClass: '',
});

// Standard NMFC freight classes — required by netParcel's API when packaging_type is "Pallet"
const FREIGHT_CLASSES = ['50', '55', '60', '65', '70', '77.5', '85', '92.5', '100', '110', '125', '150', '175', '200', '250', '300', '400', '500'];

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
export default function QuoteClient() {
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
    const stored = sessionStorage.getItem('pc_quote_form');
    if (!stored) return;
    try {
      const { packages: storedPackages, packagingType: storedPackagingType, ...storedForm } = JSON.parse(stored);
      setForm(p => ({ ...p, ...storedForm }));
      if (storedPackages?.length) {
        setPackages(storedPackages);
      } else if (storedForm.length || storedForm.width || storedForm.height || storedForm.weight) {
        // Flat rate-request shape (e.g. resumed from a saved quote) — rebuild a single package row
        setPackages([{
          id: Math.random().toString(36).slice(2),
          length: String(storedForm.length ?? '1'),
          width: String(storedForm.width ?? '1'),
          height: String(storedForm.height ?? '1'),
          weight: String(storedForm.weight ?? '1'),
          insuranceAmount: String(storedForm.insuranceAmount ?? '0.00'),
          specialHandling: !!storedForm.specialHandling,
          description: storedForm.description || '',
          freightClass: String(storedForm.freightClass ?? ''),
        }]);
      }
      if (storedPackagingType) setPackagingType(storedPackagingType);
    } catch {}
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchProvinces(form.originCountry).then(list => { if (!cancelled) setOriginProvinces(list); });
    return () => { cancelled = true; };
  }, [form.originCountry]);

  useEffect(() => {
    let cancelled = false;
    fetchProvinces(form.destinationCountry).then(list => { if (!cancelled) setDestProvinces(list); });
    return () => { cancelled = true; };
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
    const isEnvelope = packagingType === 'Envelope';
    const isPak = packagingType === 'Pak';
    if (!isEnvelope) {
      if (!first.weight) { toast.error('Please fill in package weight.'); return; }
      if (!isPak && (!first.length || !first.width || !first.height)) {
        toast.error('Please fill in all package dimensions and weight.'); return;
      }
    }
    const isValidPostal = (postal: string, country: string) => {
      const s = postal.trim().replace(/\s/g, '');
      if (country === 'CA') return /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/.test(s);
      if (country === 'US') return /^\d{5}(\d{4})?$/.test(s);
      return s.length >= 3;
    };
    if (form.originPostal && !isValidPostal(form.originPostal, form.originCountry)) {
      toast.error('Origin postal code is incomplete or invalid.'); return;
    }
    if (form.destinationPostal && !isValidPostal(form.destinationPostal, form.destinationCountry)) {
      toast.error('Destination postal code is incomplete or invalid.'); return;
    }
    if (!form.originCity) {
      toast.error('Please enter the origin city.'); return;
    }
    if (!form.originProvince) {
      toast.error('Please select the origin province / state.'); return;
    }
    if (packagingType === 'Pallet' && !first.freightClass) {
      toast.error('Please select a freight class for Pallet shipments.'); return;
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
        freightClass: first.freightClass || undefined,
        quoteType: 'quick',
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

  const isEnvelope = packagingType === 'Envelope';
  const isPak = packagingType === 'Pak';
  const isPallet = packagingType === 'Pallet';
  const hideDims = isEnvelope || isPak;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 pt-24">

        {/* Header banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B2B6B] via-[#1B2B6B] to-[#0f1a4a] px-6 sm:px-8 py-6 mb-6 shadow-lg shadow-blue-900/10">
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -right-2 bottom-0 w-24 h-24 rounded-full bg-[#FF6B00]/10" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-[#FFB27A] text-xs font-semibold uppercase tracking-wider mb-1.5">Get Started</p>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Provide Details To Get A Quick Quote</h1>
            </div>
            <Link href="/booking" className="inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-white font-semibold bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg px-3.5 py-2 transition-colors self-start sm:self-auto whitespace-nowrap">
              Switch to Rate &amp; Ship <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── Addresses ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">

              {/* From */}
              <div className="p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 text-[#1B2B6B] shrink-0">
                    <PinIcon color="#1B2B6B" />
                  </span>
                  <span className="font-bold text-[#1B2B6B] text-sm tracking-wide">Shipping From</span>
                  <label className="ml-auto flex items-center gap-2 cursor-pointer select-none">
                    <div className="relative">
                      <input type="checkbox" checked={form.originResidential}
                        onChange={e => setField('originResidential', e.target.checked)} className="sr-only peer" />
                      <div className="w-8 h-4 bg-gray-200 rounded-full peer peer-checked:bg-[#1B2B6B] transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">Residential</span>
                  </label>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                    <label className="md:w-32 md:flex-shrink-0 text-xs font-medium text-gray-500">Country</label>
                    <div className="w-full md:flex-1"><CountrySelect value={form.originCountry} onChange={v => setForm(p => ({ ...p, originCountry: v, originProvince: '', originCity: '' }))} /></div>
                  </div>
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                    <label className="md:w-32 md:flex-shrink-0 text-xs font-medium text-gray-500">Zip / Postal Code <span className="text-[#FF6B00]">*</span></label>
                    <div className="relative w-full md:flex-1">
                      <input type="text" value={form.originPostal}
                        onChange={e => handlePostalChange('origin', form.originCountry, e.target.value)}
                        placeholder="e.g. L1Z 0R6"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50/60 focus:outline-none focus:border-[#1B2B6B] focus:bg-white focus:ring-2 focus:ring-[#1B2B6B]/10 transition-colors"
                        required />
                      {postalLookingUp === 'origin' && <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 animate-spin" />}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                    <label className="md:w-32 md:flex-shrink-0 text-xs font-medium text-gray-500">City <span className="text-[#FF6B00]">*</span></label>
                    <div className="w-full md:flex-1"><CityInput value={form.originCity} onChange={v => setField('originCity', v)} country={form.originCountry} required /></div>
                  </div>
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                    <label className="md:w-32 md:flex-shrink-0 text-xs font-medium text-gray-500">Province / State <span className="text-[#FF6B00]">*</span></label>
                    <div className="w-full md:flex-1">
                      <ProvinceSelect
                        value={form.originProvince}
                        onChange={v => setField('originProvince', v)}
                        options={originProvinces}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* To */}
              <div className="p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-100 text-[#FF6B00] shrink-0">
                    <PinIcon color="#FF6B00" />
                  </span>
                  <span className="font-bold text-[#1B2B6B] text-sm tracking-wide">Shipping To</span>
                  <label className="ml-auto flex items-center gap-2 cursor-pointer select-none">
                    <div className="relative">
                      <input type="checkbox" checked={form.destinationResidential}
                        onChange={e => setField('destinationResidential', e.target.checked)} className="sr-only peer" />
                      <div className="w-8 h-4 bg-gray-200 rounded-full peer peer-checked:bg-[#1B2B6B] transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">Residential</span>
                  </label>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                    <label className="md:w-32 md:flex-shrink-0 text-xs font-medium text-gray-500">Country</label>
                    <div className="w-full md:flex-1"><CountrySelect value={form.destinationCountry} onChange={v => setForm(p => ({ ...p, destinationCountry: v, destinationProvince: '', destinationCity: '' }))} /></div>
                  </div>
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                    <label className="md:w-32 md:flex-shrink-0 text-xs font-medium text-gray-500">Zip / Postal Code</label>
                    <div className="relative w-full md:flex-1">
                      <input type="text" value={form.destinationPostal}
                        onChange={e => handlePostalChange('destination', form.destinationCountry, e.target.value)}
                        placeholder="e.g. V6B 1A1 (optional)"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50/60 focus:outline-none focus:border-[#1B2B6B] focus:bg-white focus:ring-2 focus:ring-[#1B2B6B]/10 transition-colors" />
                      {postalLookingUp === 'destination' && <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 animate-spin" />}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                    <label className="md:w-32 md:flex-shrink-0 text-xs font-medium text-gray-500">City</label>
                    <div className="w-full md:flex-1"><CityInput value={form.destinationCity} onChange={v => setField('destinationCity', v)} country={form.destinationCountry} /></div>
                  </div>
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                    <label className="md:w-32 md:flex-shrink-0 text-xs font-medium text-gray-500">Province / State</label>
                    <div className="w-full md:flex-1">
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
          </div>

          {/* ── Package Details ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
            <div className="flex flex-col md:grid md:grid-cols-[auto_1fr_auto] items-start md:items-center gap-3 md:gap-4 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-100 text-purple-700 shrink-0">
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </span>
                <span className="font-bold text-[#1B2B6B] text-sm">Package Details</span>
              </div>
              <div className="flex items-center justify-start md:justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500 font-medium">Packaging Type</label>
                  <select value={packagingType} onChange={e => {
                    const val = e.target.value;
                    setPackagingType(val);
                    if (val === 'Envelope' || val === 'Pak') setPackages([newPkg()]);
                  }}
                    className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-gray-50/60 transition-colors">
                    {PACKAGING_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex items-center bg-gray-100 rounded-full p-0.5">
                  {(['I', 'M'] as const).map(u => (
                    <button key={u} type="button"
                      onClick={() => setForm(p => ({ ...p, weightUnit: u === 'I' ? 'lbs' : 'kg', dimensionUnit: u === 'I' ? 'in' : 'cm' }))}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        (u === 'I' ? form.weightUnit === 'lbs' : form.weightUnit === 'kg')
                          ? 'bg-[#1B2B6B] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                      }`}>
                      {u === 'I' ? 'Imperial' : 'Metric'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="hidden md:block" />
            </div>

            {isPak && (
              <div className="px-6 py-4">
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Weight ({form.weightUnit})</label>
                <input type="number" value={packages[0]?.weight ?? ''}
                  onChange={e => updatePkg(packages[0].id, 'weight', e.target.value)}
                  placeholder={form.weightUnit === 'lbs' ? 'Lbs' : 'Kg'} min="0.1" step="0.1" required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors" />
              </div>
            )}

            {!hideDims && <div className="px-6 py-4 md:overflow-x-auto">
              {/* Header (desktop) */}
              <div className="hidden md:grid gap-2 mb-2 min-w-[800px]"
                style={{ gridTemplateColumns: hideDims ? '2rem 1fr 6rem 1fr 4.5rem' : `2rem 1fr 1fr 1fr 1fr 1fr${isPallet ? ' 5rem' : ''} 1fr 6rem 1fr 4.5rem` }}>
                <span className="text-xs font-semibold text-gray-400 text-center">#</span>
                {!hideDims && <span className="text-xs font-semibold text-gray-500 text-center">L ({form.dimensionUnit})</span>}
                {!hideDims && <span className="text-xs font-semibold text-gray-500 text-center">W ({form.dimensionUnit})</span>}
                {!hideDims && <span className="text-xs font-semibold text-gray-500 text-center">H ({form.dimensionUnit})</span>}
                <span className="text-xs font-semibold text-gray-500 text-center">Weight ({form.weightUnit})</span>
                {!hideDims && <span className="text-xs font-semibold text-gray-500 text-center">Vol. Weight ({form.weightUnit})</span>}
                {isPallet && <span className="text-xs font-semibold text-gray-500 text-center">Freight Class</span>}
                <span className="text-xs font-semibold text-gray-500 text-center">Insurance ($)</span>
                <span className="text-xs font-semibold text-gray-500 text-center">Signature</span>
                <span className="text-xs font-semibold text-gray-500 text-center">Description</span>
                <span />
              </div>

              {/* Rows (desktop grid) */}
              <div className="hidden md:block space-y-2 min-w-[800px]">
                {packages.map((pkg, idx) => {
                  const divisor = form.dimensionUnit === 'cm' ? 5000 : 166;
                  const volWeight = (Number(pkg.length) || 0) * (Number(pkg.width) || 0) * (Number(pkg.height) || 0) / divisor;
                  return (
                  <div key={pkg.id} className="grid gap-2 items-center bg-gray-50/70 rounded-xl px-2 py-2.5 border border-gray-100"
                    style={{ gridTemplateColumns: hideDims ? '2rem 1fr 6rem 1fr 4.5rem' : `2rem 1fr 1fr 1fr 1fr 1fr${isPallet ? ' 5rem' : ''} 1fr 6rem 1fr 4.5rem` }}>
                    <span className="flex items-center justify-center w-5 h-5 mx-auto rounded-full bg-white text-gray-400 text-[10px] font-bold">{idx + 1}</span>
                    {(hideDims ? (['weight'] as const) : (['length','width','height','weight'] as const)).map(f => (
                      <input key={f} type="number" value={pkg[f]}
                        onChange={e => updatePkg(pkg.id, f, e.target.value)}
                        placeholder={f[0].toUpperCase()} min="1" step="0.1"
                        required={idx === 0}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors text-center" />
                    ))}
                    {!hideDims && <span className="text-sm text-gray-500 text-center">{volWeight > 0 ? volWeight.toFixed(2) : '—'}</span>}
                    {isPallet && (
                      <select value={pkg.freightClass}
                        onChange={e => updatePkg(pkg.id, 'freightClass', e.target.value)}
                        required={idx === 0}
                        className="border border-gray-200 rounded-lg px-1 py-1.5 text-sm focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors text-center">
                        <option value="">Select</option>
                        {FREIGHT_CLASSES.map(fc => <option key={fc} value={fc}>{fc}</option>)}
                      </select>
                    )}
                    <input type="number" value={pkg.insuranceAmount}
                      onChange={e => updatePkg(pkg.id, 'insuranceAmount', e.target.value)}
                      placeholder="0.00" min="0" step="0.01"
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors text-center" />
                    <select value={pkg.specialHandling ? 'Yes' : 'No'}
                      onChange={e => updatePkg(pkg.id, 'specialHandling', e.target.value === 'Yes')}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors text-center">
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                    <input type="text" value={pkg.description}
                      onChange={e => updatePkg(pkg.id, 'description', e.target.value)}
                      placeholder="Description"
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors" />
                    <div className="flex items-center gap-0.5">
                      <button type="button" title="Add" onClick={addPkg}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#1B2B6B] hover:bg-white transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" title="Duplicate" onClick={() => dupPkg(pkg)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#1B2B6B] hover:bg-white transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {packages.length > 1 && (
                        <button type="button" title="Remove" onClick={() => removePkg(pkg.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>

              {/* Cards (mobile) */}
              <div className="md:hidden space-y-3">
                {packages.map((pkg, idx) => {
                  const divisor = form.dimensionUnit === 'cm' ? 5000 : 166;
                  const volWeight = (Number(pkg.length) || 0) * (Number(pkg.width) || 0) * (Number(pkg.height) || 0) / divisor;
                  return (
                  <div key={pkg.id} className="bg-gray-50/70 rounded-xl p-3 border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-gray-400 text-[10px] font-bold">{idx + 1}</span>
                      <div className="flex items-center gap-0.5">
                        <button type="button" title="Add" onClick={addPkg}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#1B2B6B] hover:bg-white transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" title="Duplicate" onClick={() => dupPkg(pkg)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#1B2B6B] hover:bg-white transition-colors">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {packages.length > 1 && (
                          <button type="button" title="Remove" onClick={() => removePkg(pkg.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className={hideDims ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-4 gap-2'}>
                      {(hideDims ? (['weight'] as const) : (['length','width','height','weight'] as const)).map(f => (
                        <div key={f}>
                          <label className="text-[11px] text-gray-400 block mb-0.5">
                            {f === 'weight' ? `Weight (${form.weightUnit})` : `${f[0].toUpperCase()} (${form.dimensionUnit})`}
                          </label>
                          <input type="number" value={pkg[f]}
                            onChange={e => updatePkg(pkg.id, f, e.target.value)}
                            min="1" step="0.1" required={f === 'weight' && idx === 0}
                            className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors text-center" />
                        </div>
                      ))}
                    </div>
                    {!hideDims && (
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-0.5">Vol. Weight ({form.weightUnit})</label>
                        <div className="border border-gray-200 rounded px-2 py-1.5 text-sm w-full text-center text-gray-500 bg-white">{volWeight > 0 ? volWeight.toFixed(2) : '—'}</div>
                      </div>
                    )}
                    {isPallet && (
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-0.5">Freight Class</label>
                        <select value={pkg.freightClass}
                          onChange={e => updatePkg(pkg.id, 'freightClass', e.target.value)}
                          required={idx === 0}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors text-center">
                          <option value="">Select</option>
                          {FREIGHT_CLASSES.map(fc => <option key={fc} value={fc}>{fc}</option>)}
                        </select>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-0.5">Insurance ($)</label>
                        <input type="number" value={pkg.insuranceAmount}
                          onChange={e => updatePkg(pkg.id, 'insuranceAmount', e.target.value)}
                          min="0" step="0.01"
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors text-center" />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-0.5">Signature</label>
                        <select value={pkg.specialHandling ? 'Yes' : 'No'}
                          onChange={e => updatePkg(pkg.id, 'specialHandling', e.target.value === 'Yes')}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors text-center">
                          <option>No</option>
                          <option>Yes</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-0.5">Description</label>
                      <input type="text" value={pkg.description}
                        onChange={e => updatePkg(pkg.id, 'description', e.target.value)}
                        placeholder="Description"
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors" />
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>}
          </div>

          {/* ── Submit ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-gray-400 hidden sm:block">
              Select <span className="text-[#FF6B00] font-semibold">Get Quote</span> to view available pricing and carrier options for the selected route
            </p>
            <button type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 bg-[#1B2B6B] hover:bg-[#14204f] hover:shadow-lg hover:-translate-y-0.5 text-white font-bold text-sm px-10 py-3 rounded-xl transition-all shadow-sm disabled:opacity-60 disabled:hover:translate-y-0 w-full sm:w-auto sm:ml-auto">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Getting Rates...</> : 'Get Quote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
