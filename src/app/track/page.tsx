import type { Metadata } from 'next';
import TrackClient from './TrackClient';

export const metadata: Metadata = {
  title: 'Track Your Shipment — Pilot Courier Canada',
  description: 'Track your package in real time across UPS, FedEx, DHL, Purolator and other top carriers — all from one place.',
  alternates: { canonical: '/track' },
  openGraph: {
    title: 'Track Your Shipment — Pilot Courier Canada',
    description: 'Track your package in real time across all major carriers from one place.',
    url: '/track',
  },
};

export default function TrackPage() {
  return <TrackClient />;
}
