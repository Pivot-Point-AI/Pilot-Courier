import type { Metadata } from 'next';
import QuoteClient from './QuoteClient';

export const metadata: Metadata = {
  title: 'Get a Shipping Quote — Pilot Courier Canada',
  description: 'Compare real-time shipping quotes from UPS, FedEx, DHL, Purolator and more carriers in seconds. Find the cheapest rate for your shipment.',
  alternates: { canonical: '/quote' },
  openGraph: {
    title: 'Get a Shipping Quote — Pilot Courier Canada',
    description: 'Compare real-time shipping quotes from top carriers in seconds.',
    url: '/quote',
  },
};

export default function QuotePage() {
  return <QuoteClient />;
}
