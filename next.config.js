/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ship.netparcel.com', 'api.pilotcourier.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://pilot-courier-ackend.vercel.app/api',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  },
};

module.exports = nextConfig;
