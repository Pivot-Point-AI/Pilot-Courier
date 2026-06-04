'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { shipmentApi } from '@/lib/api';
import { Search, Package, Truck, CheckCircle2, MapPin, Clock, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_STEPS = [
  { key: 'paid', label: 'Order Confirmed', icon: CheckCircle2 },
  { key: 'label_generated', label: 'Label Generated', icon: Package },
  { key: 'pickup_scheduled', label: 'Pickup Scheduled', icon: Clock },
  { key: 'in_transit', label: 'In Transit', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

const STATUS_ORDER = STATUS_STEPS.map(s => s.key);

function getStepIndex(status: string) {
  const idx = STATUS_ORDER.indexOf(status);
  return idx === -1 ? 0 : idx;
}

function TrackPageContent() {
  const searchParams = useSearchParams();
  const [trackingInput, setTrackingInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const numberParam = searchParams.get('number');
    if (numberParam) {
      setTrackingInput(numberParam);
      handleTrack(numberParam);
    }
  }, [searchParams]);

  const handleTrack = async (number?: string) => {
    const num = number || trackingInput.trim();
    if (!num) { toast.error('Please enter a tracking number.'); return; }

    setLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const { data } = await shipmentApi.track(num);
      setTrackingData(data.tracking);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Tracking number not found. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = trackingData ? getStepIndex(trackingData.status) : -1;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-hero-gradient pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-3 block">TRACK SHIPMENT</span>
          <h1 className="font-display font-800 text-3xl sm:text-4xl text-white mb-4">
            Where's My Package?
          </h1>
          <p className="text-white/70 mb-8">Enter your tracking number to get real-time updates.</p>

          <div className="flex gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={trackingInput}
                onChange={e => setTrackingInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTrack()}
                placeholder="Enter tracking number..."
                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-900 placeholder:text-gray-400 text-sm font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
            <button
              onClick={() => handleTrack()}
              disabled={loading}
              className="btn-primary px-6 py-4 whitespace-nowrap"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Track'}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        {error && (
          <div className="card p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="font-700 text-gray-800 mb-1">Shipment Not Found</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        )}

        {trackingData && (
          <div className="space-y-5">
            {/* Status Card */}
            <div className="card p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Tracking Number</p>
                  <p className="font-display font-700 text-lg text-brand-navy">{trackingData.trackingNumber}</p>
                </div>
                <span className={`status-${trackingData.status}`}>
                  {trackingData.status?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                </span>
              </div>

              {/* Route */}
              {trackingData.shipper && trackingData.recipient && (
                <div className="flex items-center gap-3 mb-6 bg-gray-50 rounded-xl p-4">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1" />
                    <p className="text-xs font-semibold text-gray-700">{trackingData.shipper.city}</p>
                    <p className="text-xs text-gray-400">{trackingData.shipper.province}</p>
                  </div>
                  <div className="flex-1 relative">
                    <div className="h-0.5 bg-gray-200 w-full" />
                    <Truck className="w-5 h-5 text-brand-orange absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-0.5" />
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1" />
                    <p className="text-xs font-semibold text-gray-700">{trackingData.recipient.city}</p>
                    <p className="text-xs text-gray-400">{trackingData.recipient.province}</p>
                  </div>
                </div>
              )}

              {/* Carrier info */}
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                {trackingData.carrier && (
                  <div>
                    <p className="text-gray-400 text-xs">Carrier</p>
                    <p className="font-semibold text-gray-800">{trackingData.carrier}</p>
                  </div>
                )}
                {trackingData.serviceName && (
                  <div>
                    <p className="text-gray-400 text-xs">Service</p>
                    <p className="font-semibold text-gray-800">{trackingData.serviceName}</p>
                  </div>
                )}
                {trackingData.estimatedDelivery && (
                  <div>
                    <p className="text-gray-400 text-xs">Est. Delivery</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(trackingData.estimatedDelivery).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>

              {/* Progress Steps */}
              <div className="space-y-3">
                {STATUS_STEPS.map(({ key, label, icon: Icon }, i) => {
                  const isDone = i <= currentStep;
                  const isCurrent = i === currentStep;
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isCurrent ? 'bg-brand-orange text-white shadow-orange'
                        : isDone ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-300'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${isDone ? 'text-gray-800' : 'text-gray-300'}`}>{label}</p>
                        {isCurrent && <p className="text-xs text-brand-orange font-medium animate-pulse">In Progress</p>}
                      </div>
                      {isDone && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status History */}
            {trackingData.statusHistory?.length > 0 && (
              <div className="card p-6">
                <h3 className="font-display font-700 text-brand-navy mb-4">Activity History</h3>
                <div className="space-y-3">
                  {[...trackingData.statusHistory].reverse().map((event: any, i: number) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <div className="w-2 h-2 bg-brand-orange rounded-full mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-800 capitalize">
                          {event.status.replace(/_/g, ' ')}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {new Date(event.timestamp).toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {event.note && <p className="text-gray-500 text-xs mt-0.5">{event.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && !trackingData && !error && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">Enter a tracking number to see shipment status.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <TrackPageContent />
    </Suspense>
  );
}
