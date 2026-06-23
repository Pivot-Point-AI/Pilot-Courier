import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us — Pilot Courier Canada',
  description: 'Get in touch with the Pilot Courier team for shipping support, billing questions, or partnership inquiries.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us — Pilot Courier Canada',
    description: 'Get in touch with the Pilot Courier team for shipping support, billing questions, or partnership inquiries.',
    url: '/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
