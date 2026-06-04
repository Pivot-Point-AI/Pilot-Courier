'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CheckCircle2, Download, Package, Printer, ArrowRight } from 'lucide-react';

function BookingSuccessContent() {
  const params = useSearchParams();
  const shipmentId = params.get('shipmentId');
  const number = params.get('number');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('pc_booking_number');
    if (stored) setTrackingNumber(stored);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center shadow-orange">
              <Package className="w-5 h-5 text-white" />
            </div>
          </div>

          <h1 className="font-display font-800 text-3xl text-brand-navy mb-3">
            Shipment Confirmed!
          </h1>
          <p className="text-gray-500 mb-2">Your booking is confirmed and your label is ready.</p>

          {number && (
            <div className="inline-flex items-center gap-2 bg-orange-50 text-brand-orange font-semibold text-sm px-4 py-2 rounded-full mb-8">
              <Package className="w-4 h-4" />
              Shipment #{number}
            </div>
          )}

          <div className="card p-6 text-left mb-6 space-y-3">
            <p className="font-700 text-brand-navy mb-3">What's Next?</p>
            {[
              { step: '1', text: 'Check your email — your label and confirmation have been sent.' },
              { step: '2', text: 'Print your shipping label and attach it securely to your package.' },
              { step: '3', text: 'Drop off at the carrier location or schedule a pickup.' },
              { step: '4', text: 'Track your shipment in real-time using your tracking number.' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="step-circle w-7 h-7 text-sm flex-shrink-0">{step}</div>
                <p className="text-sm text-gray-600 mt-0.5">{text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/track?number=${trackingNumber}`} className="btn-primary flex-1 justify-center text-sm py-3">
              Track Shipment <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/quote" className="btn-secondary flex-1 justify-center text-sm py-3">
              New Shipment
            </Link>
          </div>

          <div className="mt-6 text-xs text-gray-400">
            Need help? Contact us at{' '}
            <a href="mailto:support@pilotcourier.com" className="text-brand-orange hover:underline">
              support@pilotcourier.com
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
}
