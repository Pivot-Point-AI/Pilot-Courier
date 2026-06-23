import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Pilot Courier — Compare & Book Shipping Rates Across Canada',
  description: 'Compare real-time shipping rates from UPS, FedEx, DHL, Purolator and more. Book shipments, generate labels, and track packages — all in one place.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Pilot Courier — Compare & Book Shipping Rates Across Canada',
    description: 'Compare real-time shipping rates from top carriers. Ship smarter, pay less.',
    url: '/',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
