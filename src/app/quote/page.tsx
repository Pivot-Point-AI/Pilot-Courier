'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { shipmentApi } from '@/lib/api';
import { MapPin, Package, ArrowRight, Loader2, Info, Plus, Trash2, Copy, Home } from 'lucide-react';
import toast from 'react-hot-toast';

interface PackageRow {
  id: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  insuranceAmount: string;
  specialHandling: boolean;
  description: string;
}

const newPkg = (): PackageRow => ({
  id: Math.random().toString(36).slice(2),
  length: '', width: '', height: '', weight: '',
  insuranceAmount: '0.00', specialHandling: false, description: '',
});

const CA_PROVINCES = ['AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT'];

export default function QuotePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    originPostal: '', originCity: '', originProvince: '', originCountry: 'CA',
    originResidential: false,
    destinationPostal: '', destinationCity: '', destinationProvince: '', destinationCountry: 'CA',
    destinationResidential: false,
    weightUnit: 'lbs' as 'kg' | 'lbs',
    dimensionUnit: 'in' as 'cm' | 'in',
    shipmentType: 'domestic',
    packagingType: 'My Packaging',
  });
  const [packages, setPackages] = useState<PackageRow[]>([newPkg()]);

  const setField = (field: string, value: any) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setField(name, val);
    if (name === 'shipmentType') {
      setField('destinationCountry', value === 'international' ? 'US' : 'CA');
    }
  };

  const updatePkg = (id: string, field: keyof PackageRow, value: any) =>
    setPackages((p) => p.map((pkg) => pkg.id === id ? { ...pkg, [field]: value } : pkg));

  const addPkg = () => setPackages((p) => [...p, newPkg()]);
  const dupPkg = (pkg: PackageRow) => setPackages((p) => [...p, { ...pkg, id: Math.random().toString(36).slice(2) }]);
  const removePkg = (id: string) => setPackages((p) => p.length > 1 ? p.filter((pkg) => pkg.id !== id) : p);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate at least first package
    const first = packages[0];
    if (!first.weight || !first.length || !first.width || !first.height) {
      toast.error('Please fill in all package dimensions and weight.');
      return;
    }
    setLoading(true);
    try {
      // Use first package for rate request (multi-package rates use the first package weight/dims)
      const { data } = await shipmentApi.getRates({
        originPostal: form.originPostal,
        originCity: form.originCity,
        originProvince: form.originProvince,
        originCountry: form.originCountry,
        originResidential: form.originResidential,
        destinationPostal: form.destinationPostal,
        destinationCity: form.destinationCity,
        destinationProvince: form.destinationProvince,
        destinationCountry: form.destinationCountry,
        destinationResidential: form.destinationResidential,
        weight: parseFloat(first.weight),
        weightUnit: form.weightUnit,
        length: parseFloat(first.length),
        width: parseFloat(first.width),
        height: parseFloat(first.height),
        dimensionUnit: form.dimensionUnit,
        description: first.description || 'Package',
        insuranceAmount: parseFloat(first.insuranceAmount) || 0,
        specialHandling: first.specialHandling,
      } as any);

      sessionStorage.setItem('pc_rates', JSON.stringify(data.rates));
      sessionStorage.setItem('pc_quote_form', JSON.stringify({ ...form, packages }));
      router.push('/quote/results');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to fetch rates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-3 block">INSTANT QUOTE</span>
            <h1 className="font-display font-800 text-3xl sm:text-4xl text-brand-navy mb-3">
              Get Your Shipping Quote
            </h1>
            <p className="text-gray-500">Compare real-time rates from UPS, Purolator, DHL, FedEx and more.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipment Type */}
            <div className="card p-6">
              <h3 className="font-display font-700 text-brand-navy mb-4 flex items-center gap-2">
                <span className="step-circle text-sm w-7 h-7">1</span> Shipment Type
              </h3>
              <div className="flex gap-4">
                {['domestic', 'international'].map((type) => (
                  <label key={type} className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.shipmentType === type ? 'border-brand-orange bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="shipmentType" value={type} checked={form.shipmentType === type} onChange={handleChange} className="sr-only" />
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${form.shipmentType === type ? 'border-brand-orange bg-brand-orange' : 'border-gray-300'}`}>
                      {form.shipmentType === type && <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5" />}
                    </div>
                    <span className={`font-semibold capitalize text-sm ${form.shipmentType === type ? 'text-brand-orange' : 'text-gray-600'}`}>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Origin / Destination */}
            <div className="card p-6">
              <h3 className="font-display font-700 text-brand-navy mb-5 flex items-center gap-2">
                <span className="step-circle text-sm w-7 h-7">2</span> Addresses
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Origin */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                      <span className="text-sm font-bold text-gray-700">Shipping From</span>
                    </div>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        name="originResidential"
                        checked={form.originResidential}
                        onChange={handleChange}
                        className="w-3.5 h-3.5 accent-brand-orange"
                      />
                      <span className="text-xs text-gray-500 flex items-center gap-1"><Home className="w-3 h-3" /> Residential</span>
                    </label>
                  </div>
                  <div>
                    <label className="input-label">Postal Code *</label>
                    <input type="text" name="originPostal" value={form.originPostal} onChange={handleChange} placeholder="e.g. M5V 2T6" className="input-field" required />
                  </div>
                  <div>
                    <label className="input-label">City</label>
                    <input type="text" name="originCity" value={form.originCity} onChange={handleChange} placeholder="Toronto" className="input-field" />
                  </div>
                  <div>
                    <label className="input-label">Province / State</label>
                    <select name="originProvince" value={form.originProvince} onChange={handleChange} className="select-field">
                      <option value="">Select Province</option>
                      {CA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                {/* Destination */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                      <span className="text-sm font-bold text-gray-700">Shipping To</span>
                    </div>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        name="destinationResidential"
                        checked={form.destinationResidential}
                        onChange={handleChange}
                        className="w-3.5 h-3.5 accent-brand-orange"
                      />
                      <span className="text-xs text-gray-500 flex items-center gap-1"><Home className="w-3 h-3" /> Residential</span>
                    </label>
                  </div>
                  <div>
                    <label className="input-label">Postal Code *</label>
                    <input type="text" name="destinationPostal" value={form.destinationPostal} onChange={handleChange} placeholder="e.g. V6B 1A1" className="input-field" required />
                  </div>
                  <div>
                    <label className="input-label">City</label>
                    <input type="text" name="destinationCity" value={form.destinationCity} onChange={handleChange} placeholder="Vancouver" className="input-field" />
                  </div>
                  {form.shipmentType === 'domestic' ? (
                    <div>
                      <label className="input-label">Province / State</label>
                      <select name="destinationProvince" value={form.destinationProvince} onChange={handleChange} className="select-field">
                        <option value="">Select Province</option>
                        {CA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="input-label">Country</label>
                      <input type="text" name="destinationCountry" value={form.destinationCountry} onChange={handleChange} placeholder="US" className="input-field" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-700 text-brand-navy flex items-center gap-2">
                  <span className="step-circle text-sm w-7 h-7">3</span> Package Details
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Unit:</span>
                    <select name="weightUnit" value={form.weightUnit} onChange={handleChange} className="select-field py-1 text-xs w-16">
                      <option value="lbs">lbs</option>
                      <option value="kg">kg</option>
                    </select>
                    <select name="dimensionUnit" value={form.dimensionUnit} onChange={handleChange} className="select-field py-1 text-xs w-16">
                      <option value="in">in</option>
                      <option value="cm">cm</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Package table header */}
              <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 mb-2 px-1">
                <span className="text-xs font-semibold text-gray-400">Description</span>
                <span className="text-xs font-semibold text-gray-400">L ({form.dimensionUnit})</span>
                <span className="text-xs font-semibold text-gray-400">W ({form.dimensionUnit})</span>
                <span className="text-xs font-semibold text-gray-400">H ({form.dimensionUnit})</span>
                <span className="text-xs font-semibold text-gray-400">Weight ({form.weightUnit})</span>
                <span className="text-xs font-semibold text-gray-400">Insur. ($)</span>
                <span className="text-xs font-semibold text-gray-400 text-center">SH</span>
              </div>

              <div className="space-y-3">
                {packages.map((pkg, idx) => (
                  <div key={pkg.id} className="grid sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 items-center bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 w-5 flex-shrink-0">{String(idx + 1).padStart(2, '0')}.</span>
                      <input
                        type="text"
                        value={pkg.description}
                        onChange={(e) => updatePkg(pkg.id, 'description', e.target.value)}
                        placeholder="e.g. Electronics"
                        className="input-field text-sm py-2"
                      />
                    </div>
                    <input type="number" value={pkg.length} onChange={(e) => updatePkg(pkg.id, 'length', e.target.value)} placeholder="L" min="1" step="0.1" className="input-field text-sm py-2 text-center" required={idx === 0} />
                    <input type="number" value={pkg.width} onChange={(e) => updatePkg(pkg.id, 'width', e.target.value)} placeholder="W" min="1" step="0.1" className="input-field text-sm py-2 text-center" required={idx === 0} />
                    <input type="number" value={pkg.height} onChange={(e) => updatePkg(pkg.id, 'height', e.target.value)} placeholder="H" min="1" step="0.1" className="input-field text-sm py-2 text-center" required={idx === 0} />
                    <input type="number" value={pkg.weight} onChange={(e) => updatePkg(pkg.id, 'weight', e.target.value)} placeholder="Wt" min="0.1" step="0.01" className="input-field text-sm py-2 text-center" required={idx === 0} />
                    <input type="number" value={pkg.insuranceAmount} onChange={(e) => updatePkg(pkg.id, 'insuranceAmount', e.target.value)} placeholder="0.00" min="0" step="0.01" className="input-field text-sm py-2 text-center" />
                    <div className="flex items-center gap-1.5 justify-center">
                      <label title="Special Handling" className="relative">
                        <input
                          type="checkbox"
                          checked={pkg.specialHandling}
                          onChange={(e) => updatePkg(pkg.id, 'specialHandling', e.target.checked)}
                          className="w-4 h-4 accent-brand-orange"
                        />
                      </label>
                      <button type="button" title="Duplicate" onClick={() => dupPkg(pkg)} className="p-1 text-gray-400 hover:text-brand-orange transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {packages.length > 1 && (
                        <button type="button" title="Remove" onClick={() => removePkg(pkg.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4">
                <button type="button" onClick={addPkg} className="flex items-center gap-1.5 text-sm text-brand-orange hover:text-orange-700 font-semibold transition-colors">
                  <Plus className="w-4 h-4" /> Add Package
                </button>
                <p className="text-xs text-gray-400">{packages.length} package{packages.length > 1 ? 's' : ''} · SH = Special Handling</p>
              </div>

              <div className="mt-4 flex items-start gap-2 bg-blue-50 rounded-xl p-3">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  Rates are calculated using actual or volumetric weight (L×W×H÷5000 for cm or ÷139 for in), whichever is greater. Insurance value covers declared value of goods.
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base gap-3"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Getting Rates...</>
              ) : (
                <><MapPin className="w-5 h-5" /> Get Quote <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
