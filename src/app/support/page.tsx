import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Phone, Mail, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Support — Pilot Courier Canada' };

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-hero-gradient pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-3 block">SUPPORT</span>
          <h1 className="font-display font-800 text-4xl text-white mb-4">We&apos;re Here to Help</h1>
          <p className="text-white/70">
            Have a question about your shipment, need a quote, or just not sure where to start? Our team is ready to assist.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Phone */}
          <div className="card p-8 flex items-start gap-6">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Phone className="w-7 h-7 text-brand-orange" />
            </div>
            <div>
              <h3 className="font-display font-700 text-xl text-brand-navy mb-1">Call Us</h3>
              <div className="flex flex-wrap gap-4 mb-2">
                <a href="tel:6477017778" className="font-semibold text-brand-orange hover:underline text-lg">647-701-7778</a>
                <span className="text-gray-300">|</span>
                <a href="tel:18882001845" className="font-semibold text-brand-orange hover:underline text-lg">1-888-200-1845</a>
              </div>
              <p className="text-gray-500 text-sm">Monday – Friday, 9:00 AM – 6:00 PM</p>
            </div>
          </div>

          {/* Email */}
          <div className="card p-8 flex items-start gap-6">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-7 h-7 text-brand-orange" />
            </div>
            <div>
              <h3 className="font-display font-700 text-xl text-brand-navy mb-1">Email Us</h3>
              <a href="mailto:support@pilotcourier.com" className="font-semibold text-brand-orange hover:underline text-lg">
                support@pilotcourier.com
              </a>
              <p className="text-gray-500 text-sm mt-1">We respond to all emails within 24 business hours.</p>
            </div>
          </div>

          {/* Tip */}
          <div className="bg-brand-navy rounded-2xl p-8 text-white">
            <h3 className="font-display font-700 text-xl mb-3">For the Fastest Service</h3>
            <p className="text-white/70 mb-5">
              Please have your <strong className="text-white">tracking number</strong> or <strong className="text-white">booking reference</strong> ready when you reach out.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="tel:6477017778" className="btn-primary py-3 px-6 gap-2 text-sm">
                <Phone className="w-4 h-4" /> Call Now
              </a>
              <Link href="/track" className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm flex items-center gap-2">
                Track a Shipment <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Ticket link */}
          <div className="card p-6 flex items-center justify-between">
            <div>
              <p className="font-semibold text-brand-navy">Submit a Support Ticket</p>
              <p className="text-gray-500 text-sm">Logged in? Create a formal support ticket and track its progress.</p>
            </div>
            <Link href="/account/tickets" className="btn-primary text-sm py-2.5 px-5 flex-shrink-0 gap-1.5">
              Open Ticket <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
