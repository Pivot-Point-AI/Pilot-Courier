import React from 'react';
import { Calculator, Box, MapPin } from 'lucide-react';

const howItWorks = [
  {
    step: '1',
    title: 'Get a Quote',
    desc: 'Enter your shipment details and compare rates.',
    icon: Calculator,
    iconColor: 'text-blue-700',
    iconBg: 'bg-blue-50',
  },
  {
    step: '2',
    title: 'Choose & Book',
    desc: 'Select the best option for your shipment.',
    icon: Box,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50',
  },
  {
    step: '3',
    title: 'Ship & Track',
    desc: 'Print your label and track every step.',
    icon: MapPin,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-12 md:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block rounded-xl bg-blue-50 text-blue-700 text-xs font-normal leading-[1.4] px-4 py-2 mb-4">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl md:text-4xl leading-[1.2] font-bold text-gray-900 mb-4">
            Shipping in 3 Simple Steps
          </h2>
          <p className="text-base font-normal text-gray-600 leading-[1.6] max-w-xl mx-auto">
            Get started in minutes and ship with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorks.map(({ step, title, desc, icon: Icon, iconColor, iconBg }) => (
            <div key={step} className="relative bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-md transition border border-gray-200 h-full">
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-blue-700 text-white text-sm font-semibold flex items-center justify-center">
                {step}
              </div>
              <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center mx-auto mb-6`}>
                <Icon className={`w-8 h-8 ${iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 leading-[1.3] mb-3">{title}</h3>
              <p className="text-base font-normal text-gray-600 leading-[1.6] max-w-xs mx-auto">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;