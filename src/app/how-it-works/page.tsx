import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Package, CreditCard, Truck, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works — Pilot Courier Canada',
  description: 'See how Pilot Courier helps you compare carrier rates, book shipments, generate labels, and track packages in a few simple steps.',
  alternates: { canonical: '/how-it-works' },
  openGraph: {
    title: 'How It Works — Pilot Courier Canada',
    description: 'Compare carrier rates, book shipments, generate labels, and track packages in a few simple steps.',
    url: '/how-it-works',
  },
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-hero-gradient pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-3 block">SIMPLE PROCESS</span>
          <h1 className="font-display font-800 text-4xl sm:text-5xl text-white mb-4">
            Shipping Made Simple
          </h1>
          <p className="text-white/70 text-lg">
            No phone tag. No guesswork. Just fast, affordable courier service at your fingertips — in three easy steps.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-16">

          {/* Step 1 */}
          <div className="grid md:grid-cols-[80px_1fr] gap-6 items-start">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-brand-orange flex items-center justify-center shadow-orange">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div className="w-0.5 h-16 bg-gray-200 hidden md:block" />
            </div>
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-brand-orange tracking-widest uppercase bg-orange-50 px-3 py-1 rounded-full">Step 1</span>
                <h2 className="font-display font-700 text-2xl text-brand-navy">Get an Instant Quote</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Just click the <strong>FIND RATES / FIND COST</strong> tab. Tell us about your shipment and we&apos;ll do the heavy lifting.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Enter your origin and destination, and package weight (dimensions are optional for an estimate only but <strong>MUST</strong> for 100% correct rates) and within seconds, our platform pulls live rates from multiple top carriers including FedEx, UPS, DHL, and Purolator. Compare options by price, speed, or best value, and choose the service that works best for you.
              </p>
              <p className="text-gray-500 text-sm bg-blue-50 rounded-xl px-4 py-3">
                No commitments. No hidden fees. Just transparent, real-time pricing — often <strong>up to 70% less</strong> than standard carrier rates.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid md:grid-cols-[80px_1fr] gap-6 items-start">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-brand-navy flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div className="w-0.5 h-16 bg-gray-200 hidden md:block" />
            </div>
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-brand-navy tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full">Step 2</span>
                <h2 className="font-display font-700 text-2xl text-brand-navy">Book & Ship</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Once you&apos;ve selected your preferred option, booking takes just minutes.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Enter your sender and recipient details, confirm your parcel information, and complete your payment securely. Our system instantly creates your shipment with the selected carrier and generates a ready-to-print shipping label with tracking number, also called <strong>AWB</strong> (airway bill or way bill).
              </p>
              <p className="text-gray-500 text-sm bg-green-50 rounded-xl px-4 py-3">
                Your shipment is booked — print the label/shipping documents and make it ready to go. Need a pickup? Select the timings when prompted — <strong>We&apos;ll arrange it for free.</strong>
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid md:grid-cols-[80px_1fr] gap-6 items-start">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-green-700 tracking-widest uppercase bg-green-50 px-3 py-1 rounded-full">Step 3</span>
                <h2 className="font-display font-700 text-2xl text-brand-navy">Track Your Shipment</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Staying informed is effortless.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Once your shipment is booked, you&apos;ll receive a confirmation email with your tracking number (written on each address label under the bar code). Simply click on it and you&apos;ll be taken directly to your carrier&apos;s live tracking page — no searching, no copy-pasting. Real-time updates, right where you need them.
              </p>
              <p className="text-gray-500 text-sm bg-orange-50 rounded-xl px-4 py-3 font-medium">
                One click. Full visibility. Every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-800 text-3xl text-brand-navy mb-4">Ready to Ship?</h2>
          <p className="text-gray-500 mb-8">
            Get an instant quote in seconds. No account required to compare rates.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/quote" className="btn-primary py-4 px-8 text-base gap-2">
              Get a Quote <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="btn-secondary py-4 px-8 text-base">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
