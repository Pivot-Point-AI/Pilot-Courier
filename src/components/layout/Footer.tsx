'use client';

import Link from 'next/link';

const footerLinks = {
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact' },
    { href: '/terms', label: 'Terms of Use' },
  ],
  support: [
    { href: '/contact', label: 'Help Center' },
    { href: '/track', label: 'Track Shipment' },
    { href: '/terms', label: 'Terms of Use' },
    { href: '/privacy', label: 'Privacy Policy' },
  ],
  services: [
    { href: '/quote', label: 'Get Shipping Rates' },
    { href: '/track', label: 'Track Shipment' },
    { href: '/how-it-works', label: 'International Shipping' },
  ],
};

const FacebookIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#6b7280" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#6b7280" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.213 5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#6b7280" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 font-sans">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-2 lg:grid-cols-[220px_1fr_1fr_1fr_240px] gap-x-6 gap-y-8 lg:gap-12 py-12 lg:py-20">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 lg:col-span-1 pr-0 lg:pr-4">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <svg width="28" height="21" viewBox="0 0 38 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 15L37 3L30 15L37 27L1 15Z" fill="#1B2B6B" />
                <path d="M1 15L37 3L24 15L37 27L1 15Z" fill="#FF6B00" />
              </svg>
              <span className="font-extrabold text-base text-gray-900">
                PILOT <span className="text-orange-500">COURIER</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-snug mb-3 max-w-[220px] lg:max-w-[190px]">
              Your reliable companion for smarter shipping.
            </p>
            <div className="flex items-center gap-2">
              {[FacebookIcon, TwitterIcon, LinkedinIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 bg-gray-100 hover:bg-orange-500 rounded-lg flex items-center justify-center transition"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Company — col 1 on mobile */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.12em] text-gray-400 uppercase mb-3">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-gray-600 hover:text-blue-700 transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support — col 2 on mobile */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.12em] text-gray-400 uppercase mb-3">
              Support
            </h4>
            <ul className="space-y-2">
              {footerLinks.support.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-gray-600 hover:text-blue-700 transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services — col 1 on mobile */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.12em] text-gray-400 uppercase mb-3">
              Services
            </h4>
            <ul className="space-y-2">
              {footerLinks.services.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-gray-600 hover:text-blue-700 transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Updated — col 2 on mobile, then full width row below Services */}
          <div className="col-span-1 lg:col-span-1">
            <h4 className="text-xs font-bold tracking-[0.12em] text-gray-400 uppercase mb-2">
              Stay Updated
            </h4>
            <p className="text-sm text-gray-500 leading-snug mb-3">
              Get shipping rates, updates, and promotions.
            </p>
            <form className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="h-10 lg:h-12 w-full lg:w-[160px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="h-10 lg:h-12 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Pilot Courier. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {['Privacy', 'Terms', 'Contact'].map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase()}`}
                className="text-sm text-gray-500 hover:text-blue-700 transition"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}