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

const siteUrl = 'https://pilotcourier.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Pilot Courier — Save on Shipping with Top Carriers',
    template: '%s | Pilot Courier',
  },
  description: 'Compare real-time rates from UPS, FedEx, DHL, Purolator and more. Book shipments, generate labels, and track packages — all in one place.',
  keywords: ['courier', 'shipping', 'rates', 'UPS', 'FedEx', 'DHL', 'Purolator', 'Canada shipping', 'courier aggregator'],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'Pilot Courier — Save on Shipping',
    description: 'Compare real-time rates from top carriers. Ship smarter, pay less.',
    url: siteUrl,
    siteName: 'Pilot Courier',
    type: 'website',
    locale: 'en_CA',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pilot Courier — Save on Shipping with Top Carriers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pilot Courier — Save on Shipping',
    description: 'Compare real-time rates from top carriers. Ship smarter, pay less.',
    images: ['/images/og-image.jpg'],
  },
  icons: {
    icon: '/images/logo.png',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Pilot Courier',
  url: siteUrl,
  logo: `${siteUrl}/images/logo.png`,
  description: 'Compare real-time shipping rates from UPS, FedEx, DHL, Purolator and more. Book shipments, generate labels, and track packages.',
  areaServed: 'CA',
  sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
<html lang="en" className={inter.variable}>
        <body className="font-sans antialiased bg-white text-gray-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
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
