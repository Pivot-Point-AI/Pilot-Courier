'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { shipmentApi } from '@/lib/api';
import { MapPin, Package, ArrowRight, Loader2, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QuotePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    originPostal: '', originCity: '', originProvince: '', originCountry: 'CA',
    destinationPostal: '', destinationCity: '', destinationProvince: '', destinationCountry: 'CA',
    weight: '', weightUnit: 'kg',
    length: '', width: '', height: '', dimensionUnit: 'cm',
    shipmentType: 'domestic',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'shipmentType') {
      if (value === 'international') {
        setForm((prev) => ({ ...prev, destinationCountry: 'US', [name]: value }));
      } else {
        setForm((prev) => ({ ...prev, destinationCountry: 'CA', [name]: value }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await shipmentApi.getRates({
        ...form,
        weight: parseFloat(form.weight),
        length: parseFloat(form.length),
        width: parseFloat(form.width),
        height: parseFloat(form.height),
      } as any);

      sessionStorage.setItem('pc_rates', JSON.stringify(data.rates));
      sessionStorage.setItem('pc_quote_form', JSON.stringify(form));
      router.push('/quote/results');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to fetch rates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const provinces = ['AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT'];

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
            <p className="text-gray-500">Compare real-time rates from UPS, FedEx, DHL, Purolator and more.</p>
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
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                    <span className="text-sm font-bold text-gray-700">Origin</span>
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
                    <label className="input-label">Province</label>
                    <select name="originProvince" value={form.originProvince} onChange={handleChange} className="select-field">
                      <option value="">Select Province</option>
                      {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                {/* Destination */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                    <span className="text-sm font-bold text-gray-700">Destination</span>
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
                      <label className="input-label">Province</label>
                      <select name="destinationProvince" value={form.destinationProvince} onChange={handleChange} className="select-field">
                        <option value="">Select Province</option>
                        {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
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
              <h3 className="font-display font-700 text-brand-navy mb-5 flex items-center gap-2">
                <span className="step-circle text-sm w-7 h-7">3</span> Package Details
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Weight *</label>
                  <div className="flex gap-2">
                    <input type="number" name="weight" value={form.weight} onChange={handleChange} placeholder="e.g. 5.0" min="0.1" step="0.01" className="input-field flex-1" required />
                    <select name="weightUnit" value={form.weightUnit} onChange={handleChange} className="select-field w-20">
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="input-label">Dimension Unit</label>
                  <select name="dimensionUnit" value={form.dimensionUnit} onChange={handleChange} className="select-field">
                    <option value="cm">Centimeters (cm)</option>
                    <option value="in">Inches (in)</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Length ({form.dimensionUnit}) *</label>
                  <input type="number" name="length" value={form.length} onChange={handleChange} placeholder="e.g. 30" min="1" className="input-field" required />
                </div>
                <div>
                  <label className="input-label">Width ({form.dimensionUnit}) *</label>
                  <input type="number" name="width" value={form.width} onChange={handleChange} placeholder="e.g. 20" min="1" className="input-field" required />
                </div>
                <div>
                  <label className="input-label">Height ({form.dimensionUnit}) *</label>
                  <input type="number" name="height" value={form.height} onChange={handleChange} placeholder="e.g. 15" min="1" className="input-field" required />
                </div>
                <div>
                  <label className="input-label">Package Description</label>
                  <input type="text" name="description" value={form.description} onChange={handleChange} placeholder="e.g. Electronic device" className="input-field" />
                </div>
              </div>

              {/* Volumetric Weight Info */}
              <div className="mt-4 flex items-start gap-2 bg-blue-50 rounded-xl p-3">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  Rates are calculated using actual or volumetric weight (L×W×H÷5000), whichever is greater.
                </p>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full text-base py-4">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Comparing Rates...</> : <>Compare Rates <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
