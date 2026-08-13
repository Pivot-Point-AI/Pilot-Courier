import type { Metadata } from 'next';
import BulkClient from './BulkClient';

export const metadata: Metadata = {
  title: 'Bulk Shipping — Pilot Courier Canada',
  description: 'Upload a CSV of orders and manage bulk shipments with Pilot Courier Canada.',
  alternates: { canonical: '/booking/bulk' },
};

export default function BulkShippingPage() {
  return <BulkClient />;
}
