'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Rate } from '@/lib/api';
import { ArrowLeft, MapPin, Scale, Box, Sparkles, Clock } from 'lucide-react';

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

  useEffect(() => {
    const stored = sessionStorage.getItem('pc_rates');
    const form = sessionStorage.getItem('pc_quote_form');
    if (!stored) { router.push('/quote'); return; }
    const parsed = JSON.parse(stored);
    setRates(parsed);
    if (form) setQuoteForm(JSON.parse(form));
  }, [router]);

  const firstPkg = quoteForm?.packages?.[0];
  const isEnvelope = quoteForm?.packagingType === 'Envelope';
  const isPak = quoteForm?.packagingType === 'Pak';
  const hasDims = !isEnvelope && !isPak;
  const displayWeight = quoteForm?.weight ?? firstPkg?.weight;
  const displayWeightUnit = quoteForm?.weightUnit;
  const displayLength = quoteForm?.length ?? firstPkg?.length;
  const displayWidth = quoteForm?.width ?? firstPkg?.width;
  const displayHeight = quoteForm?.height ?? firstPkg?.height;

  const handleSelect = (rate: Rate) => {
    setSelected(rate);
    sessionStorage.setItem('pc_selected_rate', JSON.stringify(rate));
    router.push('/booking');
  };

  if (!rates.length) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#fafbfc]">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
        <div className="absolute inset-0 rounded-full border-4 border-[#1B2B6B] border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-gray-400 font-medium">Fetching your rates…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Back */}
          <button
            onClick={() => router.push('/quote')}
            className="group inline-flex items-center gap-2 text-gray-500 hover:text-[#1B2B6B] text-sm font-semibold mb-6 pl-1 transition-colors"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200 group-hover:border-[#1B2B6B]/30 group-hover:bg-blue-50/60 shadow-sm transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
            </span>
            Back to Quote
          </button>

          {/* Header banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B2B6B] via-[#1B2B6B] to-[#0f1a4a] px-6 sm:px-8 py-7 mb-5 shadow-lg shadow-blue-900/10">
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5" />
            <div className="absolute -right-2 bottom-0 w-24 h-24 rounded-full bg-[#FF6B00]/10" />
            <div className="relative flex items-center gap-2 text-[#FFB27A] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Your Quote is Ready
            </div>
            <h1 className="relative text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {rates.length} Service{rates.length !== 1 ? 's' : ''} Available
            </h1>
            <p className="relative text-sm text-blue-100/70 mt-1.5">Compare rates and transit times below, then select a service to continue.</p>
          </div>

          {/* Shipping details */}
          {quoteForm && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 sm:px-8 py-5 mb-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-800 text-sm font-semibold">
                  <MapPin className="w-4 h-4 text-[#FF6B00]" />
                  Shipping Details
                </div>
                <button
                  onClick={() => router.push('/quote')}
                  className="px-3.5 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  Edit
                </button>
              </div>
              <div className={`grid grid-cols-2 gap-4 ${!hasDims && isEnvelope ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
                <div className="flex items-start gap-2.5 rounded-xl bg-gray-50/80 px-3.5 py-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-[#1B2B6B] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wide mb-0.5">From</p>
                    <p className="font-semibold text-gray-800 truncate">{quoteForm.originPostal || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl bg-gray-50/80 px-3.5 py-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#FF6B00] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wide mb-0.5">To</p>
                    <p className="font-semibold text-gray-800 truncate">{quoteForm.destinationPostal || '—'}</p>
                  </div>
                </div>
                {!isEnvelope && (
                  <div className="flex items-start gap-2.5 rounded-xl bg-gray-50/80 px-3.5 py-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-700 shrink-0">
                      <Scale className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wide mb-0.5">Weight</p>
                      <p className="font-semibold text-gray-800 truncate">{displayWeight ? `${displayWeight} ${displayWeightUnit || ''}` : '—'}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2.5 rounded-xl bg-gray-50/80 px-3.5 py-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 text-purple-700 shrink-0">
                    <Box className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wide mb-0.5">Packaging</p>
                    <p className="font-semibold text-gray-800 truncate">
                      {!hasDims
                        ? (isEnvelope ? 'Envelope' : 'Pak')
                        : (displayLength && displayWidth && displayHeight ? `${displayLength} × ${displayWidth} × ${displayHeight} ${quoteForm.dimensionUnit || 'cm'}` : '—')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rate cards */}
          <div className="space-y-3">
            {rates.map((rate, idx) => {
              const isSelected = selected?.serviceCode === rate.serviceCode && selected?.carrierId === rate.carrierId;

              return (
                <div
                  key={`${rate.carrierId}-${rate.serviceCode}`}
                  className={`group bg-white rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-[#1B2B6B] ring-2 ring-[#1B2B6B]/10 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 px-5 sm:px-7 py-5">

                    {/* Carrier + service */}
                    <div className="flex items-center gap-4 sm:w-[280px] shrink-0">
                      <div className="flex items-center justify-center w-16 h-14 rounded-xl bg-gray-50 border border-gray-100 shrink-0">
                        <CarrierLogo name={rate.carrierName} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="font-bold text-gray-800 text-sm leading-tight">{rate.serviceName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {rate.isCheapest && (
                            <span className="bg-green-50 text-green-700 ring-1 ring-inset ring-green-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              Cheapest
                            </span>
                          )}
                          {rate.isFastest && (
                            <span className="bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              Fastest
                            </span>
                          )}
                          {rate.isBestValue && !rate.isCheapest && !rate.isFastest && (
                            <span className="bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              Best Value
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Transit */}
                    <div className="flex items-center gap-2 sm:w-[160px] shrink-0">
                      <Clock className="w-4 h-4 text-gray-300 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          {rate.transitDays} business day{rate.transitDays !== 1 ? 's' : ''}
                        </p>
                        {rate.estimatedDelivery && (
                          <p className="text-xs text-gray-400">
                            Est. {new Date(rate.estimatedDelivery).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden sm:block flex-1" />

                    {/* Price + select */}
                    <div className="flex items-center justify-between sm:justify-end gap-5 sm:gap-6">
                      <div className="text-right">
                        <span className="text-[11px] text-gray-400 font-medium mr-1">{rate.currency}</span>
                        <span className="text-[#1B2B6B] font-bold text-xl tracking-tight">${rate.totalCharge.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => handleSelect(rate)}
                        className="bg-[#1B2B6B] hover:bg-[#14204f] hover:shadow-lg hover:-translate-y-0.5 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all whitespace-nowrap shadow-sm"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
