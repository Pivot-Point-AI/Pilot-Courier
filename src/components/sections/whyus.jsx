import React from 'react';
import { TrendingDown, Zap, Globe, Shield, Clock, DollarSign } from 'lucide-react';

const features = [
    { icon: TrendingDown, title: 'Lowest Rates Guaranteed', desc: 'Access negotiated carrier rates unavailable to individual shippers. Save up to 70%.', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Zap, title: 'Instant Label Generation', desc: 'Book your shipment and download your label in seconds — no waiting, no calls.', color: 'text-[#FF6B00]', bg: 'bg-orange-50' },
    { icon: Globe, title: 'Domestic & International', desc: 'Ship across Canada or around the world with the same simple platform.', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Shield, title: 'Easy & Secure', desc: 'Your shipments and payments are protected with industry-leading security.', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Clock, title: 'Real-Time Tracking', desc: 'Track every shipment live across all carriers from a single dashboard.', color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { icon: DollarSign, title: 'Transparent Pricing', desc: 'No hidden fees, no surprises. What you see is what you pay.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

const WhyUsSection = () => {
  return (
    <section className="py-4 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-2">
            <span className="text-[#FF6B00] text-[11px] font-bold tracking-[0.2em] uppercase mb-3 block">
              WHY CHOOSE US?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2B6B] mb-3">
              Smarter Shipping. Better Experience.
            </h2>
            {/* <p className="text-gray-500 text-sm max-w-xs mx-auto">
              Everything you need to ship smarter and save more.
            </p> */}
          </div>

          {/* <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all duration-300 group">
                <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="font-extrabold text-[#1B2B6B] text-base mb-1.5">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div> */}
        </div>
      </section>
  );
};

export default WhyUsSection;