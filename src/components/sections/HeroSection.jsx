// components/sections/HeroSection.tsx
'use client';
import Image from 'next/image';
import Globe from '@/components/sections/Globe';
import OrbitPlane from '@/components/sections/OrbitPlane';
import { ShieldCheck, Tag, Gauge } from 'lucide-react';

const carriers = [
  { name: 'UPS', logo: '/carriers/ups.svg', className: 'h-11 w-auto' },
  { name: 'FedEx', logo: '/carriers/fedex.svg', className: 'h-8 w-auto' },
  { name: 'DHL', logo: '/carriers/dhl.svg', className: 'h-8 w-auto' },
  { name: 'Purolator', logo: '/carriers/purolator.svg', className: 'h-8 w-auto' },
];

export default function HeroSection() {
  return (

    <>
      <section className="relative overflow-hidden bg-gray-50 mt-16 pt-20 pb-16 md:py-36 lg:py-48 min-h-[560px] md:min-h-[650px] lg:min-h-[720px]">
        <div className="absolute inset-0 z-0 ">
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
          {/* OrbitPlane renders only the track + plane now, stacked above the globe so it's always visible in front of it */}
          {/* <div className="absolute inset-0 z-10">
            <OrbitPlane size={200} className="lg:hidden" />
            <OrbitPlane size={260} className="hidden lg:block" />
          </div> */}
        </div>

        {/* Mobile-only white fade so text stays readable over the image */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-white/90 via-white/70 to-transparent md:hidden" />

        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
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
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-3 md:mb-6">
              <span className="block">Save on Shipping</span>
              <span className="block">
                with Top <span className="text-[#1B2B6B]">Carriers</span>
              </span>
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-white py-6 md:py-8 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-semibold tracking-[0.08em] uppercase text-gray-400 leading-[1.4] mb-4 md:mb-6">
            Trusted by Shippers. Powered by Leading Carriers.
          </p>
          <ul className="flex flex-wrap items-end justify-center gap-3 sm:gap-4 md:gap-6">
            {carriers.map(({ name, logo, className }) => (
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