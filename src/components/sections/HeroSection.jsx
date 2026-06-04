// components/sections/HeroSection.tsx
'use client';
import Image from 'next/image';
import { CreditCard, Clock1, BanknoteIcon } from 'lucide-react';
import QuoteForm from '@/components/sections/QuoteForm';

const trustBadges = [
  { icon: BanknoteIcon, title: 'Lowest Rates', sub: 'Compare & Save' },
  { icon: Clock1, title: 'Fast & Reliable', sub: 'Trusted Carriers' },
  { icon: CreditCard, title: 'Easy & Secure', sub: 'Book in Minutes' },
];

const carriers = [
  { name: 'UPS', logo: '/carriers/ups.svg', className: 'h-11 w-auto' },
  { name: 'FedEx', logo: '/carriers/fedex.svg', className: 'h-8 w-auto' },
  { name: 'DHL', logo: '/carriers/dhl.svg', className: 'h-8 w-auto' },
  { name: 'Purolator', logo: '/carriers/purolator.svg', className: 'h-8 w-auto' },
];

export default function HeroSection() {
  return (
    <>
      <section className="relative overflow-hidden bg-gray-50 pt-20 pb-6 md:py-16 lg:py-32 min-h-[400px] md:min-h-[500px] lg:min-h-[560px]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-scene2.png"
            alt="Shipping background"
            fill
            className="object-cover object-[75%_center] md:object-center"
            priority
          />
        </div>

        {/* Mobile-only white fade so text stays readable over the image */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-white/90 via-white/70 to-transparent md:hidden" />

        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-3 md:mb-6">
              <span className="block">Save on Shipping</span>
              <span className="block">with Top Carriers</span>
            </h1>
            <p className="text-sm sm:text-lg font-normal text-gray-800 leading-relaxed max-w-2xl mb-4 md:mb-8">
              Compare real-time rates from UPS, FedEx, DHL{' '}
              <span className="hidden sm:inline"><br /></span>
              and more. Ship smarter. Pay less.
            </p>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
              {trustBadges.map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-1.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#537dcf] border border-[#bfd0ee] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1B2B6B] text-xs sm:text-sm leading-none">{title}</p>
                    <p className="text-gray-600 text-[10px] sm:text-xs mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="max-w-5xl w-full">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-6 md:py-8 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-normal text-gray-500 leading-[1.4] mb-4 md:mb-6">
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