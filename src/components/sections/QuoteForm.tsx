// components/sections/QuoteForm.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight, Loader2, Calculator } from 'lucide-react';

export default function QuoteForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    originPostal: '',
    destinationPostal: '',
    weight: '',
    weightUnit: 'kg',
    length: '',
    width: '',
    height: '',
    shipmentType: 'domestic',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.originPostal ||
      !form.destinationPostal ||
      !form.weight ||
      !form.length ||
      !form.width ||
      !form.height
    ) {
      alert('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      router.push('/quote/results');
    } catch {
      alert('Failed to fetch rates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full h-12 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 ' +
    'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 ' +
    'focus:border-orange-500 transition-colors px-4';

  const labelCls = 'text-sm font-medium text-gray-700 mb-2 block';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 w-full border border-gray-200">
      {/* Card header */}
      <div className="flex items-center gap-4 ">
        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <Calculator className="w-6 h-6 text-blue-700" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 leading-[1.3]">
            Get Your Instant Quote
          </h2>
          <p className="text-base font-normal text-gray-600 leading-[1.6]">Enter your origin postal code to compare rates.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: From | To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-700" />
              <input
                type="text"
                name="originPostal"
                value={form.originPostal}
                onChange={handleChange}
                placeholder="Enter origin postal code"
                required
                className={`${inputCls} pl-10`}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-700" />
              <input
                type="text"
                name="destinationPostal"
                value={form.destinationPostal}
                onChange={handleChange}
                placeholder="Enter destination postal code"
                required
                className={`${inputCls} pl-10`}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Weight + Dimensions + Button */}
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          {/* Package Weight */}
          <div className="w-full md:w-[200px] md:flex-shrink-0">
            <label className={labelCls}>Package Weight</label>
            <div className="flex gap-0 items-end">
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="e.g. 5.00"
                min="0.1"
                step="0.01"
                required
                className={`${inputCls} flex-1 min-w-0 rounded-r-none`}
              />
              <select
                name="weightUnit"
                value={form.weightUnit}
                onChange={handleChange}
                className="w-[64px] h-12 flex-shrink-0 border border-l-0 border-gray-300 rounded-r-lg bg-[#f4f7fc]
                           text-sm text-gray-600 text-center
                           focus:outline-none focus:ring-2 focus:ring-orange-500/30
                           focus:border-orange-500 transition-colors
                           appearance-none cursor-pointer"
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
          </div>

          {/* Package Dimensions + Submit button */}
          <div className="flex-1 min-w-0">
            <label className={labelCls}>Package Dimensions (cm)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end">
              <input
                type="number"
                name="length"
                value={form.length}
                onChange={handleChange}
                placeholder="Length"
                min="1"
                step="0.1"
                required
                className={`${inputCls} min-w-0`}
              />
              <input
                type="number"
                name="width"
                value={form.width}
                onChange={handleChange}
                placeholder="Width"
                min="1"
                step="0.1"
                required
                className={`${inputCls} min-w-0`}
              />
              <input
                type="number"
                name="height"
                value={form.height}
                onChange={handleChange}
                placeholder="Height"
                min="1"
                step="0.1"
                required
                className={`${inputCls} min-w-0`}
              />

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full md:w-auto items-center justify-center gap-2
                           bg-orange-500 hover:bg-orange-600
                           h-12 text-white text-sm font-semibold
                           rounded-lg px-6
                           transition
                           disabled:opacity-70 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading…
                  </>
                ) : (
                  <>
                    Get Quotes
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}