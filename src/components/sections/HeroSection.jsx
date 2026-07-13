// components/sections/HeroSection.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import Globe from '@/components/sections/Globe';
import OrbitPlane from '@/components/sections/OrbitPlane';
import {
  ShieldCheck,
  Tag,
  Gauge,
  MapPin,
  Headphones,
  Clock,
  Globe2,
} from 'lucide-react';

const priceCards = [
  {
    name: 'UPS',
    logo: '/carriers/ups.svg',
    className: 'h-8 w-auto',
    showName: true,
    original: '120.00',
    price: '89.99',
    save: '25%',
    accentFrom: '#4a3418',
    accentTo: '#2a1c0a',
    priceColor: '#2a1c0a',
  },
  {
    name: 'FedEx',
    logo: '/carriers/fedex.svg',
    className: 'h-7 w-auto',
    original: '110.00',
    price: '79.99',
    save: '27%',
    accentFrom: '#6d28d9',
    accentTo: '#4d148c',
    priceColor: '#4d148c',
  },
  {
    name: 'DHL',
    logo: '/carriers/dhl.svg',
    className: 'h-7 w-auto',
    original: '100.00',
    price: '69.99',
    save: '30%',
    accentFrom: '#f6c744',
    accentTo: '#d99a00',
    priceColor: '#c98c00',
  },
  {
    name: 'Purolator',
    logo: '/carriers/purolator.svg',
    className: 'h-7 w-auto',
    original: '95.00',
    price: '64.99',
    save: '32%',
    accentFrom: '#2e56c7',
    accentTo: '#1e3a8a',
    priceColor: '#1e3a8a',
  },
  {
    name: 'Canada Post',
    logo: '/carriers/canadapost.svg',
    className: 'h-8 w-auto',
    showName: true,
    original: '85.00',
    price: '59.99',
    save: '29%',
    accentFrom: '#e6394f',
    accentTo: '#c0102a',
    priceColor: '#c0102a',
    logoColor: '#d0202f',
  },
  {
    name: 'USPS',
    logo: '/carriers/usps.svg',
    className: 'h-7 w-auto',
    original: '90.00',
    price: '54.99',
    save: '39%',
    accentFrom: '#1c2f66',
    accentTo: '#0f1a4a',
    priceColor: '#0f1a4a',
  },
];

export default function HeroSection() {
  return (
    <>
      <section className="relative overflow-hidden bg-gray-50 mt-16 pt-10 pb-14 md:pt-14 md:pb-20 min-h-[500px] md:min-h-[600px]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.webp"
            alt="Shipping background"
            fill
            className="object-cover object-[75%_center] md:object-center"
            priority
          />
        </div>

        {/* Rotating globe motif with an orbiting plane, a subtle accent clear of the background artwork */}
        <div className="hidden md:block absolute z-[1] top-[5%] right-[6%] w-[160px] h-[160px] lg:w-[200px] lg:h-[200px]">
          <Globe className="absolute inset-0 pointer-events-none opacity-100 drop-shadow-[0_0_40px_rgba(23,62,115,0.7)]" />
        </div>

        {/* Mobile-only white fade so text stays readable over the image */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-white/90 via-white/70 to-transparent md:hidden" />

        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 sm:gap-4 bg-white/90 border border-[#e3e9f5] rounded-full pl-2.5 pr-5 py-2.5 mb-4 md:mb-5 shadow-sm">
              <span className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#2c4bb8] to-[#0f1a4a] text-white shrink-0">
                <ShieldCheck className="w-5.5 h-5.5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              </span>
              <span className="w-px h-8 bg-gray-200 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <p className="text-base sm:text-lg font-extrabold text-gray-900 leading-tight whitespace-nowrap">
                  Trusted Worldwide <span className="text-[#2c4bb8]">Since 2007</span>
                </p>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#2c4bb8]" /> Low Rates
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="inline-flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-[#2c4bb8]" /> Speed
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2c4bb8]" /> Reliability
                  </span>
                </div>
              </div>
            </div>



            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6 md:mb-6 mt-3 md:mt-4">
              <span className="block">
                Save Big on{' '}
                <span
                  className="text-[#e0a400]"
                  style={{
                    WebkitTextStroke: '1.5px #0f1a4a',
                    textShadow: '0 2px 6px rgba(0,0,0,0.35)',
                  }}
                >
                  Shipping
                </span>
              </span>
              <span className="block">
                with Top <span className="text-[#2c3fd6]">Carriers!</span>
              </span>
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-w-sm sm:max-w-xl mx-auto sm:mx-0">
             
              {priceCards.map((c) => (
                <div
                  key={c.name}
                  className="relative flex flex-col rounded-xl bg-white border border-gray-100 shadow-md overflow-hidden px-2.5 py-2.5 sm:px-3 sm:py-4"
                >
                  <span
                    className="absolute top-0 inset-x-0 h-1 rounded-t-xl"
                    style={{
                      background: `linear-gradient(90deg, ${c.accentFrom}, ${c.accentTo})`,
                    }}
                  />

                  <div className="flex items-center gap-1.5 h-5 mb-1">
                    {c.logo ? (
                      <img src={c.logo} alt={c.name} className={`${c.className} object-contain`} />
                    ) : (
                      <span
                        className="flex items-center justify-center w-4 h-4 rounded-full text-white text-[8px] font-bold shrink-0"
                        style={{ backgroundColor: c.logoColor }}
                      >
                        {c.name.charAt(0)}
                      </span>
                    )}
                    {c.showName && (
                      <span className="text-[11px] font-extrabold text-gray-900 uppercase tracking-tight leading-tight truncate">
                        {c.name}
                      </span>
                    )}
                  </div>

                  <div className="border-t border-gray-100 mb-1" />

                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wide text-center leading-none">
                    Original Price
                  </p>
                  <p className="text-xs text-gray-400 line-through text-center mb-0.5 leading-none">
                    ${c.original}
                  </p>

                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wide text-center leading-none">
                    Our Price
                  </p>
                  <p
                    className="text-lg sm:text-xl font-extrabold text-center mb-1 leading-none"
                    style={{ color: c.priceColor }}
                  >
                    ${c.price}
                  </p>

                  <div
                    className="flex items-center gap-0.5 rounded-md px-1 py-0.5 shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})` }}
                  >
                    <span className="flex items-center justify-center w-2.5 h-2.5 rounded-full bg-white shrink-0">
                      <Tag className="w-1.5 h-1.5" style={{ color: c.accentTo }} strokeWidth={2.5} />
                    </span>
                    <span className="flex flex-col leading-none text-white">
                      <span className="text-[5px] font-bold uppercase tracking-wide">Save</span>
                      <span className="text-[9px] font-extrabold leading-tight">{c.save}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0f1a4a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-7 flex flex-col lg:flex-row items-center justify-between gap-5">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-10 text-white">
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <Clock className="w-4.5 h-4.5 text-[#8fa3ff]" />
              Fast Delivery Worldwide
            </span>
            <span className="hidden lg:block w-px h-5 bg-white/15" />
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <Globe2 className="w-4.5 h-4.5 text-[#8fa3ff]" />
              Serving 220+ Countries
            </span>
            <span className="hidden lg:block w-px h-5 bg-white/15" />
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <Headphones className="w-4.5 h-4.5 text-[#8fa3ff]" />
              24/7 Support — We&apos;re Here to Help
            </span>
          </div>
          <Link
            href="/quote"
            className="inline-flex items-center justify-center rounded-xl bg-[#3b4fd6] hover:bg-[#4a5ce0] transition-colors text-white font-semibold px-6 py-3 text-sm sm:text-base shrink-0 shadow-lg shadow-black/20"
          >
            Ship Smarter, Save More!
          </Link>
        </div>
      </section>

      <section className="bg-white py-6 md:py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-semibold tracking-[0.08em] uppercase text-gray-400 leading-[1.4] mb-4 md:mb-6">
            Trusted by Shippers. Powered by Leading Carriers.
          </p>
          <ul className="flex flex-wrap items-end justify-center gap-3 sm:gap-4 md:gap-6">
            {[
              { name: 'UPS', logo: '/carriers/ups.svg', className: 'h-11 w-auto' },
              { name: 'FedEx', logo: '/carriers/fedex.svg', className: 'h-8 w-auto' },
              { name: 'DHL', logo: '/carriers/dhl.svg', className: 'h-8 w-auto' },
              { name: 'Purolator', logo: '/carriers/purolator.svg', className: 'h-8 w-auto' },
            ].map(({ name, logo, className }) => (
              <li key={name} className="flex items-end justify-center h-8 sm:h-10 md:h-11 px-1.5 list-none">
                <img src={logo} alt={name} className={`${className} object-contain block`} />
              </li>
            ))}
            <li className="list-none text-blue-700 text-xs sm:text-sm font-medium ml-1">and more...</li>
          </ul>
        </div>
      </section>
    </>
  );
}
