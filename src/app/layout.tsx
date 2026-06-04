import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'Pilot Courier — Save on Shipping with Top Carriers',
    template: '%s | Pilot Courier',
  },
  description: 'Compare real-time rates from UPS, FedEx, DHL, Purolator and more. Book shipments, generate labels, and track packages — all in one place.',
  keywords: ['courier', 'shipping', 'rates', 'UPS', 'FedEx', 'DHL', 'Purolator', 'Canada shipping', 'courier aggregator'],
  openGraph: {
    title: 'Pilot Courier — Save on Shipping',
    description: 'Compare real-time rates from top carriers. Ship smarter, pay less.',
    type: 'website',
    locale: 'en_CA',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
<html lang="en" className={inter.variable}>
        <body className="font-sans antialiased bg-white text-gray-900">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0c2461',
              color: '#fff',
              borderRadius: '10px',
              fontFamily: 'var(--font-inter)',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: { primary: '#f97316', secondary: '#fff' },
            },
            error: {
              style: { background: '#dc2626' },
            },
          }}
        />
      </body>
    </html>
  );
}
