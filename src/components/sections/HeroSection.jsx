// components/sections/HeroSection.tsx
'use client';
import Image from 'next/image';
import QuoteForm from '@/components/sections/QuoteForm';
import Globe from '@/components/sections/Globe';
import OrbitPlane from '@/components/sections/OrbitPlane';

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
            <span className="inline-block text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase text-[#1B2B6B] bg-white/70 border border-[#bfd0ee] rounded-full px-3 py-1 mb-4 md:mb-5">
              Trusted Worldwide Since 2007
            </span>
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