'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Rate } from '@/lib/api';
import {
  CheckCircle2, Clock, DollarSign, Zap, Star,
  ArrowRight, ArrowLeft, Package, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const carrierColors: Record<string, string> = {
  UPS: '#351C15', FEDEX: '#4D148C', DHL: '#D40511', PUROLATOR: '#5F1070',
};

const carrierLogoBg: Record<string, string> = {
  UPS: 'bg-yellow-600', FEDEX: 'bg-purple-700', DHL: 'bg-red-600', PUROLATOR: 'bg-purple-800',
};

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

    // Auto-select cheapest
    const cheapest = parsed.find((r: Rate) => r.isCheapest);
    if (cheapest) setSelected(cheapest);
  }, [router]);

  const handleProceed = () => {
    if (!selected) { toast.error('Please select a shipping option.'); return; }
    sessionStorage.setItem('pc_selected_rate', JSON.stringify(selected));
    router.push('/booking');
  };

  if (!rates.length) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => router.back()} className="btn-ghost p-2 text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display font-800 text-2xl text-brand-navy">Available Rates</h1>
              <p className="text-gray-500 text-sm">
                {quoteForm && `${quoteForm.originPostal} → ${quoteForm.destinationPostal} · ${quoteForm.weight} ${quoteForm.weightUnit}`}
              </p>
            </div>
          </div>

          {/* Badge summary */}
          <div className="flex flex-wrap gap-2 mb-6 ml-12">
            <span className="badge badge-success">
              <CheckCircle2 className="w-3 h-3 mr-1" /> {rates.length} rates found
            </span>
            <span className="badge badge-info">
              <DollarSign className="w-3 h-3 mr-1" /> Best rate from ${Math.min(...rates.map(r => r.totalCharge)).toFixed(2)}
            </span>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-5">
            {[
              { label: 'Cheapest', color: 'bg-green-100 text-green-700', icon: DollarSign },
              { label: 'Fastest', color: 'bg-blue-100 text-blue-700', icon: Zap },
              { label: 'Best Value', color: 'bg-purple-100 text-purple-700', icon: Star },
            ].map(({ label, color, icon: Icon }) => (
              <span key={label} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>
                <Icon className="w-3 h-3" /> {label}
              </span>
            ))}
          </div>

          {/* Rate Cards */}
          <div className="space-y-3 mb-6">
            {rates.map((rate) => {
              const isSelected = selected?.serviceCode === rate.serviceCode && selected?.carrierId === rate.carrierId;
              const carrierKey = rate.carrierId.toUpperCase();

              return (
                <div
                  key={`${rate.carrierId}-${rate.serviceCode}`}
                  onClick={() => setSelected(rate)}
                  className={`relative bg-white rounded-2xl border-2 cursor-pointer transition-all duration-200 p-5 ${
                    isSelected
                      ? 'border-brand-orange shadow-orange'
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-card'
                  }`}
                >
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex gap-1.5">
                    {rate.isCheapest && (
                      <span className="badge bg-green-100 text-green-700 text-xs">
                        <DollarSign className="w-3 h-3 mr-0.5" /> Cheapest
                      </span>
                    )}
                    {rate.isFastest && (
                      <span className="badge bg-blue-100 text-blue-700 text-xs">
                        <Zap className="w-3 h-3 mr-0.5" /> Fastest
                      </span>
                    )}
                    {rate.isBestValue && !rate.isCheapest && !rate.isFastest && (
                      <span className="badge bg-purple-100 text-purple-700 text-xs">
                        <Star className="w-3 h-3 mr-0.5" /> Best Value
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Carrier Logo */}
                    <div className={`w-14 h-14 ${carrierLogoBg[carrierKey] || 'bg-gray-700'} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-xs font-bold tracking-tight">{rate.carrierName}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 pr-20">
                      <p className="font-display font-700 text-base text-brand-navy">{rate.serviceName}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          {rate.transitDays} business day{rate.transitDays !== 1 ? 's' : ''}
                        </div>
                        {rate.estimatedDelivery && (
                          <span className="text-xs text-gray-400">Est. {new Date(rate.estimatedDelivery).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-display font-800 text-2xl text-brand-navy">
                        ${rate.totalCharge.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">{rate.currency}</p>
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-1/2 left-4 -translate-y-1/2 w-1 h-10 bg-brand-orange rounded-full" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Proceed Button */}
          {selected && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Selected Service</p>
                  <p className="font-display font-700 text-brand-navy">{selected.carrierName} — {selected.serviceName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-display font-800 text-2xl text-brand-orange">${selected.totalCharge.toFixed(2)}</p>
                </div>
              </div>
              <button onClick={handleProceed} className="btn-primary w-full text-base py-3.5">
                Proceed to Booking <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                No credit card required yet. Book now and pay securely.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
