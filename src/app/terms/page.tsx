import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Use' };

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="bg-hero-gradient pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display font-800 text-4xl text-white">Terms of Use</h1>
          <p className="text-white/60 mt-2 text-sm">Last updated: January 1, 2024</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="prose prose-gray max-w-none space-y-8">
          {[
            {
              title: '1. Acceptance of Terms',
              content: 'By accessing or using the Pilot Courier platform ("Service"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Service.'
            },
            {
              title: '2. Services Description',
              content: 'Pilot Courier is a courier aggregator platform that enables users to compare shipping rates, book shipments, generate labels, and track packages across multiple carrier partners including UPS, FedEx, DHL, and Purolator.'
            },
            {
              title: '3. Cancellation & Refund Policy',
              content: 'A full refund will apply if the shipment is cancelled on the same day it was created and the shipping documents have not been used. After a lapse of 24 hours or once the shipment has been picked up or dropped off, a written request to support@pilotcourier.com will be required to process a refund. If a shipment is cancelled upon or after arrival of the driver for pickup, a $25.00 CAD fee will be deducted to cover transportation expenses.'
            },
            {
              title: '4. User Responsibilities',
              content: 'Users are responsible for providing accurate shipment information including addresses, weights, and dimensions. Inaccurate information may result in additional charges from carriers. Users must comply with all applicable laws regarding prohibited and restricted items.'
            },
            {
              title: '5. Payment Terms',
              content: 'All payments are processed securely via our payment partners (Stripe, PayPal). Pilot Courier does not store your payment card information. Prices are displayed in Canadian Dollars (CAD) unless otherwise indicated.'
            },
            {
              title: '6. Liability',
              content: 'Pilot Courier acts as an intermediary between users and carriers. We are not liable for carrier delays, lost shipments, or damages beyond the declared value. Claims must be submitted within 30 days of the expected delivery date.'
            },
            {
              title: '7. Privacy',
              content: 'Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to the collection and use of your information as outlined in the Privacy Policy.'
            },
            {
              title: '8. Modifications',
              content: 'Pilot Courier reserves the right to modify these Terms at any time. Changes will be effective upon posting to the website. Continued use of the Service constitutes acceptance of modified terms.'
            },
          ].map(({ title, content }) => (
            <div key={title}>
              <h2 className="font-display font-700 text-xl text-brand-navy mb-3">{title}</h2>
              <p className="text-gray-600 leading-relaxed">{content}</p>
            </div>
          ))}

          <div className="border-t border-gray-100 pt-6">
            <p className="text-gray-500 text-sm">
              Questions about these Terms? Contact us at{' '}
              <a href="mailto:legal@pilotcourier.com" className="text-brand-orange hover:underline">legal@pilotcourier.com</a>.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
