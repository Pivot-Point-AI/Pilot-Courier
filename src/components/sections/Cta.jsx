import React from 'react';
import Link from 'next/link';
import Image from 'next/image';


const CtaSection = () => {
  return (
    <section className="relative overflow-hidden border-y border-[#d7dff0] bg-[linear-gradient(135deg,#102f79_0%,#13439a_55%,#11357f_100%)]">
      <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.95)_1px,transparent_0)] [background-size:20px_20px]" />

      <div className="relative mx-auto max-w-[1180px] px-4 sm:px-8 lg:px-10 py-12 sm:py-16">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="pr-0 sm:pr-8 lg:pr-2">
            <h2 className="text-white font-extrabold text-[28px] sm:text-[30px] tracking-[0.01em] leading-[1.05] mb-1">
              Ready to Save on Shipping?
            </h2>
            <p className="text-white/80 text-[15px] sm:text-[16px] leading-[1.25]">
              Join thousands of smart shippers today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3 lg:mr-[180px] xl:mr-[230px] flex-shrink-0 w-full sm:w-auto">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center h-12 px-6 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors duration-200 min-w-[138px] w-full sm:w-auto"
            >
              Get Started
            </Link>
            <Link
              href="/track"
              className="inline-flex items-center justify-center h-12 px-6 rounded-lg border border-gray-300 text-white text-sm font-semibold hover:bg-white hover:text-[#123b8f] transition-colors duration-200 min-w-[146px] w-full sm:w-auto"
            >
              Track a Shipment
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden sm:block pointer-events-none select-none absolute right-2 sm:right-6 lg:right-10 bottom-0 h-[110px] w-[130px] sm:h-[140px] sm:w-[165px] lg:h-[158px] lg:w-[188px]">
        <Image
          src="/images/cta34.png"
          alt=""
          fill
          className="object-contain object-right-bottom opacity-100"
        />
      </div>
    </section>
  );
};

export default CtaSection;