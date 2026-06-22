'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Rate } from '@/lib/api';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

// Carrier logo renderers
function CarrierLogo({ name }: { name: string }) {
  const upper = name.toUpperCase();

  if (upper.includes('UPS')) return (
    <div className="flex items-center justify-center w-14 h-10">
      <div className="bg-[#351C15] rounded px-2 py-1 flex items-center justify-center w-12 h-9">
        <span className="text-[#FFB500] font-black text-sm tracking-tight leading-none">UPS</span>
      </div>
    </div>
  );

  if (upper.includes('DHL')) return (
    <div className="flex items-center justify-center w-14 h-10">
      <div className="bg-[#D40511] rounded px-2 py-0.5 flex items-center justify-center w-12">
        <span className="text-[#FFCC00] font-black text-sm tracking-wider leading-none">DHL</span>
      </div>
    </div>
  );

  if (upper.includes('FEDEX') || upper.includes('FED')) return (
    <div className="flex items-center justify-center w-14 h-10">
      <div className="flex items-center">
        <span className="font-black text-sm text-[#4D148C] leading-none">Fed</span>
        <span className="font-black text-sm text-[#FF6600] leading-none">Ex</span>
      </div>
    </div>
  );

  if (upper.includes('PUROLATOR')) return (
    <div className="flex items-center justify-center w-14 h-10">
      <div className="flex flex-col items-center leading-none">
        <div className="flex gap-0.5 mb-0.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1 h-2 bg-[#00529B]" style={{ opacity: 1 - i * 0.15 }} />
          ))}
        </div>
        <span className="text-[#00529B] font-bold text-[9px] tracking-tight">PUROLATOR</span>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center w-14 h-10">
      <span className="text-gray-600 font-bold text-xs">{name.slice(0, 6)}</span>
    </div>
  );
}

export default function QuoteResultsPage() {
  const router = useRouter();
  const [rates, setRates] = useState<Rate[]>([]);
  const [selected, setSelected] = useState<Rate | null>(null);
  const [quoteForm, setQuoteForm] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('pc_rates');
    const form = sessionStorage.getItem('pc_quote_form');
    if (!stored) { router.push('/quote'); return; }
    const parsed = JSON.parse(stored);
    setRates(parsed);
    if (form) setQuoteForm(JSON.parse(form));
  }, [router]);

  const handleSelect = (rate: Rate) => {
    setSelected(rate);
    sessionStorage.setItem('pc_selected_rate', JSON.stringify(rate));
    router.push('/booking');
  };

  if (!rates.length) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {/* Main card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">

            {/* Card header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
              <h1 className="text-xl font-semibold text-gray-800">
                {rates.length} Services Available for Your Shipment
              </h1>
            </div>

            {/* Shipping details accordion */}
            {quoteForm && (
              <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-2 text-[#00529B] text-sm font-medium hover:underline"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Shipping Details
                  {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="px-4 py-1.5 text-xs font-medium border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {showDetails ? 'Hide Details' : 'Show Details'}
                  </button>
                  <button
                    onClick={() => router.push('/quote')}
                    className="px-4 py-1.5 text-xs font-medium border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}

            {/* Shipping details expanded */}
            {showDetails && quoteForm && (
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">From</p>
                  <p className="font-medium text-gray-700">{quoteForm.originPostal}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">To</p>
                  <p className="font-medium text-gray-700">{quoteForm.destinationPostal}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Weight</p>
                  <p className="font-medium text-gray-700">{quoteForm.weight} {quoteForm.weightUnit}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Dimensions (cm)</p>
                  <p className="font-medium text-gray-700">{quoteForm.length} × {quoteForm.width} × {quoteForm.height}</p>
                </div>
              </div>
            )}

            {/* Table header */}
            <div className="grid grid-cols-[40px_1fr_80px_120px_140px_110px] items-center px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span></span>
              <span>Service</span>
              <span></span>
              <span className="text-center">Business Days</span>
              <span className="text-center">Your Price</span>
              <span></span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100">
              {rates.map((rate, idx) => {
                const isSelected = selected?.serviceCode === rate.serviceCode && selected?.carrierId === rate.carrierId;

                return (
                  <div
                    key={`${rate.carrierId}-${rate.serviceCode}`}
                    className={`grid grid-cols-[40px_1fr_80px_120px_140px_110px] items-center px-6 py-4 transition-colors ${
                      isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Row number */}
                    <span className="text-gray-400 text-sm font-medium">{idx + 1}</span>

                    {/* Service name + badges */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800 text-sm">{rate.serviceName}</span>
                        {rate.isCheapest && (
                          <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                            Cheapest
                          </span>
                        )}
                        {rate.isFastest && (
                          <span className="bg-blue-100 text-blue-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                            Fastest
                          </span>
                        )}
                        {rate.isBestValue && !rate.isCheapest && !rate.isFastest && (
                          <span className="bg-purple-100 text-purple-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                            Best Value
                          </span>
                        )}
                      </div>
                      {rate.estimatedDelivery && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Est. {new Date(rate.estimatedDelivery).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                        </p>
                      )}
                    </div>

                    {/* Carrier logo */}
                    <div className="flex justify-center">
                      <CarrierLogo name={rate.carrierName} />
                    </div>

                    {/* Business days */}
                    <div className="text-center text-sm text-gray-600">
                      {rate.transitDays} day{rate.transitDays !== 1 ? 's' : ''}
                    </div>

                    {/* Price */}
                    <div className="text-center">
                      <span className="text-xs text-gray-400 mr-1">{rate.currency}</span>
                      <span className="text-[#1a73e8] font-bold text-base">${rate.totalCharge.toFixed(2)}</span>
                    </div>

                    {/* Select button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSelect(rate)}
                        className="bg-[#00529B] hover:bg-[#003f7a] text-white text-sm font-semibold px-5 py-2 rounded transition-colors whitespace-nowrap"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
