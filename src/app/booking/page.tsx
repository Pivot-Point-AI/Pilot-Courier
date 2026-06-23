import type { Metadata } from 'next';
import BookingClient from './BookingClient';

export const metadata: Metadata = {
  title: 'Book a Shipment — Pilot Courier Canada',
  description: 'Book your shipment with UPS, FedEx, DHL, Purolator and more. Get instant rates, generate labels, and schedule pickup in minutes.',
  alternates: { canonical: '/booking' },
  openGraph: {
    title: 'Book a Shipment — Pilot Courier Canada',
    description: 'Book your shipment with top carriers. Get instant rates, generate labels, and schedule pickup in minutes.',
    url: '/booking',
  },
};

export default function BookingPage() {
  return <BookingClient />;
}
