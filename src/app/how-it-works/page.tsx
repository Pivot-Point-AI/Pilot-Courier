import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Package, Search, CreditCard, Truck, MapPin, CheckCircle2, ArrowRight, Zap, DollarSign, Globe } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'How It Works' };

const steps = [
  {
    step: '01',
    title: 'Enter Shipment Details',
    desc: 'Tell us where you\'re shipping from and to, your package weight and dimensions. It takes less than 60 seconds.',
    icon: Package,
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    step: '02',
    title: 'Compare Real-Time Rates',
    desc: 'We instantly fetch live rates from UPS, FedEx, DHL, Purolator and more. See the cheapest, fastest, and best-value options side by side.',
    icon: Search,
    color: 'bg-orange-50',
    iconColor: 'text-brand-orange',
  },
  {
    step: '03',
    title: 'Book & Pay Securely',
    desc: 'Select the carrier that works best for you. Pay securely with Stripe, PayPal or other methods. No hidden fees.',
    icon: CreditCard,
    color: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    step: '04',
    title: 'Get Your Label',
    desc: 'Your shipping label is generated instantly. Download, print, and attach it to your package.',
    icon: CheckCircle2,
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    step: '05',
    title: 'Drop Off or Schedule Pickup',
    desc: 'Drop your package at the nearest carrier location or schedule a pickup at your door.',
    icon: Truck,
    color: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
  },
  {
    step: '06',
    title: 'Track Every Step',
    desc: 'Follow your shipment in real time. You and your recipient get automatic email and SMS updates along the way.',
    icon: MapPin,
    color: 'bg-pink-50',
    iconColor: 'text-pink-600',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-hero-gradient pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-3 block">HOW IT WORKS</span>
          <h1 className="font-display font-800 text-4xl sm:text-5xl text-white mb-5">
            Simple Shipping in 6 Steps
          </h1>
          <p className="text-white/70 text-lg">
            From quote to delivered — here's exactly how Pilot Courier works.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="section bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            {steps.map(({ step, title, desc, icon: Icon, color, iconColor }, i) => (
              <div key={step} className="card p-6 md:p-8 flex gap-6 items-start hover:shadow-card-hover transition-shadow">
                <div className="flex-shrink-0">
                  <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${iconColor}`} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-gray-300 font-mono">STEP {step}</span>
                    {i === 0 && <span className="badge badge-orange">Start Here</span>}
                  </div>
                  <h3 className="font-display font-700 text-xl text-brand-navy mb-2">{title}</h3>
                  <p className="text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carriers */}
      <section className="section bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display font-800 text-3xl text-brand-navy mb-3">Powered by Top Carriers</h2>
          <p className="text-gray-500 mb-10">We integrate with leading carriers so you always get the best rates and service.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: 'UPS', color: '#351C15', desc: 'Ground, Express, International' },
              { name: 'FedEx', color: '#4D148C', desc: 'Express, Ground, International' },
              { name: 'DHL', color: '#D40511', desc: 'Express, International' },
              { name: 'Purolator', color: '#5F1070', desc: 'Domestic Canada, Express' },
            ].map(({ name, color, desc }) => (
              <div key={name} className="card p-6 text-center hover:shadow-card-hover transition-shadow">
                <div className="h-12 flex items-center justify-center mb-3">
                  <span className="font-display font-800 text-2xl" style={{ color }}>{name}</span>
                </div>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display font-800 text-3xl text-brand-navy mb-10 text-center">Common Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How do I get better rates than going directly to a carrier?',
                a: 'Pilot Courier aggregates shipment volume across thousands of customers, allowing us to negotiate significantly discounted rates with carriers — rates that individual businesses and consumers can\'t access on their own.',
              },
              {
                q: 'What payment methods are accepted?',
                a: 'We accept credit/debit cards (Visa, Mastercard) via Stripe, PayPal, Wise, and Remitly for international customers.',
              },
              {
                q: 'What is the cancellation policy?',
                a: 'A full refund applies if cancelled on the same day and shipping documents are unused. After 24 hours or if the shipment has been picked up, a written request is required. If cancelled upon driver arrival, a $25 fee applies to cover transportation costs.',
              },
              {
                q: 'Can I ship internationally?',
                a: 'Yes! Select "International" when getting your quote. We support shipments to most countries via our integrated carriers.',
              },
              {
                q: 'How does tracking work?',
                a: 'Once your label is generated, you receive a tracking number. You can track your shipment on our Track page or directly on the carrier\'s website. You\'ll also receive automatic email/SMS updates at key milestones.',
              },
            ].map(({ q, a }) => (
              <details key={q} className="card p-5 group">
                <summary className="font-semibold text-brand-navy cursor-pointer flex items-center justify-between gap-3 list-none">
                  {q}
                  <ArrowRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-3 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-3">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-hero-gradient">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display font-800 text-3xl text-white mb-4">Ready to Start Shipping?</h2>
          <p className="text-white/70 mb-8">Get your first quote in under a minute. No account required.</p>
          <Link href="/quote" className="btn-primary text-base px-10 py-4">
            Get a Free Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
