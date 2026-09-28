'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { shipmentApi } from '@/lib/api';
import { Loader2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { isPostalLookupReady, isPostalFormatValid } from '@/lib/postal';

import { fetchProvinces, lookupPostal } from './_lib/geo';
import { type PackageRow, newPkg } from './_lib/types';
import { CountrySelect } from './_components/CountrySelect';
import { ProvinceSelect } from './_components/ProvinceSelect';
import { CityInput } from './_components/CityInput';
import { PinIcon } from './_components/PinIcon';
import { PackageDetailsSection } from './_components/PackageDetailsSection';

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

  const postalRequests = useRef<Record<string, number>>({});
  const [postalChoices, setPostalChoices] = useState<Record<string, string[]>>({});
  const handlePostalChange = async (prefix: 'origin' | 'destination', country: string, postal: string) => {
    const request = (postalRequests.current[prefix] || 0) + 1;
    postalRequests.current[prefix] = request;
    setField(`${prefix}Postal`, postal);
    setPostalChoices(p => ({ ...p, [prefix]: [] }));
    if (!isPostalLookupReady(country, postal)) {
      setPostalLookingUp(null);
      return;
    }
    setPostalLookingUp(prefix);
    const result = await lookupPostal(country, postal);
    if (postalRequests.current[prefix] !== request) return;
    setPostalLookingUp(null);
    if (result) {
      setPostalChoices(p => ({ ...p, [prefix]: result.cities || [] }));
      setForm(p => p[`${prefix}Postal`] !== postal || p[`${prefix}Country`] !== country ? p : ({
        ...p,
        [`${prefix}City`]: result.city || p[`${prefix}City`],
        [`${prefix}Province`]: result.province || p[`${prefix}Province`],
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
      if (packages.some(p => !p.weight)) { toast.error('Please fill in package weight.'); return; }
      if (!isPak && packages.some(p => !p.length || !p.width || !p.height)) {
        toast.error('Please fill in all package dimensions and weight.'); return;
      }
    }
    if (!isPostalFormatValid(form.originCountry, form.originPostal)) {
      toast.error('Origin postal code is incomplete or invalid.'); return;
    }
    if (!isPostalFormatValid(form.destinationCountry, form.destinationPostal)) {
      toast.error('Destination postal code is incomplete or invalid.'); return;
    }
    if (!form.destinationCity.trim()) {
      toast.error('Please enter the destination city.'); return;
    }
    if (!form.originCity.trim()) {
      toast.error('Please enter the origin city.'); return;
    }
    if (!form.originProvince) {
      toast.error('Please select the origin province / state.'); return;
    }
    if (packagingType === 'Pallet' && packages.some(p => !p.freightClass)) {
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
        packages: packages.map(p => ({
          length: parseFloat(p.length) || 0,
          width: parseFloat(p.width) || 0,
          height: parseFloat(p.height) || 0,
          weight: parseFloat(p.weight) || 0,
          insuranceAmount: parseFloat(p.insuranceAmount) || 0,
          description: p.description || 'Package',
          specialHandling: p.specialHandling,
          freightClass: p.freightClass || undefined,
        })),
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
          <p className="text-xs text-gray-500 mb-3">Postal lookup may suggest a nearby area. Please confirm the city and province before getting a quote.</p>

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
                    <div className="w-full md:flex-1">{(postalChoices.origin?.length || 0) > 1 && <select aria-label="Origin city suggestions" className="w-full border rounded p-2 mb-2 text-sm" value="" onChange={e => setField('originCity', e.target.value)}><option value="">Several towns share this postal area — choose your city</option>{postalChoices.origin.map(city => <option key={city}>{city}</option>)}</select>}<CityInput value={form.originCity} onChange={v => setField('originCity', v)} country={form.originCountry} required /></div>
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
                        placeholder="Destination postal code"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50/60 focus:outline-none focus:border-[#1B2B6B] focus:bg-white focus:ring-2 focus:ring-[#1B2B6B]/10 transition-colors" />
                      {postalLookingUp === 'destination' && <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 animate-spin" />}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                    <label className="md:w-32 md:flex-shrink-0 text-xs font-medium text-gray-500">City</label>
                    <div className="w-full md:flex-1">{(postalChoices.destination?.length || 0) > 1 && <select aria-label="Destination city suggestions" className="w-full border rounded p-2 mb-2 text-sm" value="" onChange={e => setField('destinationCity', e.target.value)}><option value="">Several towns share this postal area — choose your city</option>{postalChoices.destination.map(city => <option key={city}>{city}</option>)}</select>}<CityInput value={form.destinationCity} onChange={v => setField('destinationCity', v)} country={form.destinationCountry} /></div>
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
          <PackageDetailsSection
            packagingType={packagingType} setPackagingType={setPackagingType}
            packages={packages} setPackages={setPackages}
            weightUnit={form.weightUnit} dimensionUnit={form.dimensionUnit} setForm={setForm}
            updatePkg={updatePkg} addPkg={addPkg} dupPkg={dupPkg} removePkg={removePkg}
          />

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
