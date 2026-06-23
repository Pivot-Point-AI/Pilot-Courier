import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Pilot Courier Canada',
  description: 'Learn about Pilot Courier, Canada\'s shipping rate comparison platform connecting businesses with UPS, FedEx, DHL, Purolator and more.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Us — Pilot Courier Canada',
    description: 'Learn about Pilot Courier, Canada\'s shipping rate comparison platform.',
    url: '/about',
  },
};


// Canada outline SVG (simplified)
const CanadaMapBg = () => (
  <svg
    className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none"
    viewBox="0 0 900 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
  >
    {/* Simplified Canada-like outline */}
    <path
      d="M80,180 L120,160 L140,130 L160,120 L180,100 L210,90 L240,95 L260,80 L280,70 L310,65 L340,60 L370,55 L400,50 L430,55 L460,50 L490,45 L520,50 L550,55 L580,60 L610,65 L640,70 L660,80 L680,90 L700,100 L720,115 L740,130 L750,150 L760,165 L770,180 L780,195 L775,215 L760,230 L745,245 L730,255 L715,265 L700,260 L685,255 L670,265 L655,275 L640,270 L625,280 L610,290 L595,285 L580,295 L565,305 L550,300 L535,295 L520,305 L505,315 L490,320 L475,330 L460,340 L445,345 L430,350 L415,360 L400,370 L385,365 L370,360 L355,350 L340,355 L325,345 L310,335 L295,330 L280,325 L265,315 L250,310 L235,305 L220,295 L205,290 L190,285 L175,280 L160,270 L145,265 L130,255 L115,245 L100,235 L85,220 L80,205 L80,180Z"
      stroke="#92400e"
      strokeWidth="2"
      fill="#fde68a"
      fillOpacity="0.3"
    />
    {/* Great Lakes simplified */}
    <ellipse cx="540" cy="290" rx="30" ry="15" fill="#bfdbfe" fillOpacity="0.5" />
    <ellipse cx="590" cy="300" rx="20" ry="10" fill="#bfdbfe" fillOpacity="0.5" />
    {/* Heart marker */}
    <text x="430" y="210" fontSize="28" fill="#f97316" opacity="0.6">♥</text>
    {/* Maple leaf */}
    <text x="370" y="300" fontSize="40" fill="#dc2626" opacity="0.15">🍁</text>
  </svg>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9f5f0' }}>
      <Navbar />

      {/* ── HERO — warm cream / parchment ─────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-28 pb-16 px-4"
        style={{ background: 'linear-gradient(135deg, #fdf8f0 0%, #fef3e2 50%, #fdf0e8 100%)' }}
      >
        <CanadaMapBg />

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-4 block">OUR STORY</span>
          <h1 className="font-display font-800 text-4xl sm:text-5xl text-brand-navy mb-5 leading-tight">
            A Promise Born from Loss
          </h1>
          <p className="text-gray-600 text-base max-w-xl mx-auto leading-relaxed">
            Founded on the conviction that no one should ever have to wonder where — and why —<br className="hidden sm:block" /> their shipments are lost.
          </p>
        </div>
      </section>

      {/* ── STORY SECTION — warm cream bg continuing ───────────────────── */}
      <section
        className="py-16 px-4"
        style={{ background: 'linear-gradient(180deg, #fdf0e8 0%, #fdf8f0 100%)' }}
      >
        <div className="max-w-3xl mx-auto space-y-10">

          {/* 1977 paragraph */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
              📷
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed text-base">
                In 1977, a young Army Lieutenant carefully packed two heartfelt gifts — a handmade purse adorned with white zircon stones and a pair of elegantly decorated shoes — to be shipped to a bride and groom in London.{' '}
                <strong className="text-brand-navy">They never arrived.</strong>{' '}
                That loss left a mark that wouldn&apos;t fade.
              </p>
            </div>
          </div>

          {/* Illustrated shoes / gifts */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
              👟
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed text-base">
                Decades later, upon retirement, that same officer turned disappointment into purpose. In{' '}
                <strong className="text-brand-navy">June 2007</strong>, Pilot Courier was founded on a single, unwavering conviction:{' '}
                <em className="text-brand-orange font-semibold not-italic">
                  no one should ever have to wonder where and why the shipments are lost.
                </em>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO WE ARE ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-3 block">WHO WE ARE</span>
              <h2 className="font-display font-800 text-3xl sm:text-4xl text-brand-navy mb-6 leading-tight">
                Canada&apos;s Courier Aggregator
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  We are a Canadian courier aggregator connecting individuals and businesses to a trusted network of global carriers — offering{' '}
                  <strong className="text-brand-navy">up to 70% off standard shipping rates</strong>{' '}
                  without compromising on quality or reliability.
                </p>
                <p>
                  From envelopes to freight, we handle shipments to over{' '}
                  <strong className="text-brand-navy">66,000 destinations worldwide</strong>{' '}
                  via air and ocean.
                </p>
                <p>
                  We don&apos;t just compete with FedEx, UPS, DHL, and Purolator — we outperform them where it matters most. Same reliability, same service standards, same speed — at a fraction of the cost.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-5 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-brand-orange" />
                <span>Mississauga, Ontario, Canada</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: '70%',  label: 'Savings vs standard rates', icon: '🏷️' },
                { stat: '66K+', label: 'Destinations worldwide',    icon: '🌐' },
                { stat: '4.99', label: 'Customer satisfaction',     icon: '⭐' },
                { stat: '2007', label: 'Founded in Canada',         icon: '🧭' },
              ].map(({ stat, label, icon }) => (
                <div key={label} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center hover:border-brand-orange hover:shadow-sm transition-all">
                  <div className="text-2xl mb-2">{icon}</div>
                  <p className="font-display font-800 text-2xl text-brand-orange mb-1">{stat}</p>
                  <p className="text-xs text-gray-500 font-medium leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────────────────────── */}
      <section className="relative py-20 px-4 overflow-hidden" style={{ backgroundColor: '#fdf6ee' }}>
        {/* Topographic wavy lines background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 900 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          {[0,30,60,90,120,150,180,210].map((offset, i) => (
            <path key={i}
              d={`M-100,${120+offset} C100,${80+offset} 200,${160+offset} 400,${110+offset} S600,${70+offset} 900,${120+offset} S1100,${160+offset} 1200,${110+offset}`}
              fill="none" stroke="#d97706" strokeWidth="1.2" opacity={0.25 - i * 0.02}
            />
          ))}
          {[0,30,60,90].map((offset, i) => (
            <path key={`r${i}`}
              d={`M-100,${320+offset} C150,${280+offset} 300,${360+offset} 500,${310+offset} S700,${270+offset} 1000,${320+offset}`}
              fill="none" stroke="#d97706" strokeWidth="1" opacity={0.2 - i * 0.02}
            />
          ))}
        </svg>

        <div className="relative max-w-4xl mx-auto text-center mb-14">
          <span className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-3 block">WHAT DRIVES US</span>
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-brand-navy mb-4">Our Values</h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed text-sm">
            Our 4.89 customer satisfaction using isn&apos;t a marketing figure — It&apos;s the result of a team that generally cares about every parns, and passes through our hands.
          </p>
        </div>

        {/* Row 1: 3 values */}
        <div className="relative max-w-3xl mx-auto grid grid-cols-3 gap-8 mb-10">
          {/* Speed */}
          <div className="flex flex-col items-center text-center gap-3">
            <svg viewBox="0 0 56 56" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="27" stroke="#f97316" strokeWidth="1.5" opacity="0.2"/>
              <path d="M28 8 L32 22 L44 18 L34 28 L44 32 L30 34 L28 48 L24 34 L12 38 L22 28 L12 22 L26 24 Z" fill="none" stroke="#f97316" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M22 28 Q28 20 34 28 Q28 36 22 28Z" fill="#f97316" opacity="0.15"/>
            </svg>
            <div>
              <p className="font-bold text-brand-navy text-sm">Speed</p>
              <p className="text-gray-400 text-xs mt-0.5">Because timing matters.</p>
            </div>
          </div>

          {/* Trust */}
          <div className="flex flex-col items-center text-center gap-3">
            <svg viewBox="0 0 56 56" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="27" stroke="#f97316" strokeWidth="1.5" opacity="0.2"/>
              <path d="M28 40 C28 40 14 32 14 22 C14 17 18 14 22 14 C24.5 14 27 15.5 28 18 C29 15.5 31.5 14 34 14 C38 14 42 17 42 22 C42 32 28 40 28 40Z" fill="#f97316" opacity="0.2" stroke="#f97316" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <div>
              <p className="font-bold text-brand-navy text-sm">Trust</p>
              <p className="text-gray-400 text-xs mt-0.5">Because your shipment is<br/>never just a package.</p>
            </div>
          </div>

          {/* Innovation */}
          <div className="flex flex-col items-center text-center gap-3">
            <svg viewBox="0 0 56 56" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="27" stroke="#f59e0b" strokeWidth="1.5" opacity="0.2"/>
              <path d="M28 12 C22 12 16 17 16 23 C16 27 18 30 22 32 L22 38 L34 38 L34 32 C38 30 40 27 40 23 C40 17 34 12 28 12Z" fill="#fbbf24" opacity="0.2" stroke="#f59e0b" strokeWidth="2"/>
              <line x1="22" y1="40" x2="34" y2="40" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
              <line x1="23" y1="43" x2="33" y2="43" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
              <line x1="28" y1="38" x2="28" y2="20" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
            </svg>
            <div>
              <p className="font-bold text-brand-navy text-sm">Innovation</p>
              <p className="text-gray-400 text-xs mt-0.5">Because logistics should<br/>work charter.</p>
            </div>
          </div>
        </div>

        {/* Row 2: 2 values centered */}
        <div className="relative max-w-3xl mx-auto grid grid-cols-2 gap-8 max-w-md mx-auto">
          {/* Customer Care */}
          <div className="flex flex-col items-center text-center gap-3">
            <svg viewBox="0 0 56 56" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="27" stroke="#f97316" strokeWidth="1.5" opacity="0.2"/>
              <circle cx="24" cy="22" r="5" fill="#f97316" opacity="0.2" stroke="#f97316" strokeWidth="1.5"/>
              <circle cx="36" cy="22" r="5" fill="#f97316" opacity="0.2" stroke="#f97316" strokeWidth="1.5"/>
              <path d="M16 40 C16 33 20 30 24 30 M40 40 C40 33 36 30 36 30 M24 30 C24 30 28 34 36 30" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M28 36 L28 44" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div>
              <p className="font-bold text-brand-navy text-sm">Customer Care</p>
              <p className="text-gray-400 text-xs mt-0.5">Because people come<br/>before persons.</p>
            </div>
          </div>

          {/* Affordability */}
          <div className="flex flex-col items-center text-center gap-3">
            <svg viewBox="0 0 56 56" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="27" stroke="#f97316" strokeWidth="1.5" opacity="0.2"/>
              <ellipse cx="28" cy="20" rx="12" ry="5" fill="#f97316" opacity="0.2" stroke="#f97316" strokeWidth="1.8"/>
              <path d="M16 20 L16 28 C16 31 21.4 33 28 33 C34.6 33 40 31 40 28 L40 20" stroke="#f97316" strokeWidth="1.8"/>
              <path d="M16 28 L16 36 C16 39 21.4 41 28 41 C34.6 41 40 39 40 36 L40 28" stroke="#f97316" strokeWidth="1.8"/>
            </svg>
            <div>
              <p className="font-bold text-brand-navy text-sm">Affordability</p>
              <p className="text-gray-400 text-xs mt-0.5">Because gover servics<br/>shouldn&apos;t cost a parure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-brand-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-4 block">OUR MISSION</span>
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-white mb-6 leading-tight">
            To simplify global shipping for businesses and individuals —{' '}
            <span className="text-brand-orange">one delivery at a time.</span>
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            At Pilot Courier Canada, we don&apos;t just move packages.{' '}
            <strong className="text-white">Your parcels are our priority.</strong>
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/quote" className="btn-primary py-4 px-8 text-base gap-2">
              Get a Quote <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-xl transition-colors text-base border border-white/20">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
