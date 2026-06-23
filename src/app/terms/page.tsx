import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Pilot Courier Canada',
  description: 'Read the terms and conditions for using Pilot Courier\'s shipping rate comparison and booking platform.',
  alternates: { canonical: '/terms' },
  robots: { index: false, follow: true },
};

const sections = [
  {
    n: 1,
    title: 'Carrier Terms & Conditions',
    body: 'All shipments processed through Pilot Courier Canada are subjected and conditions of the assigned Customer terms and conditions prior. Customs are reviewed to the relevant panicies prior to booking.',
    highlight: null,
  },
  {
    n: 2,
    title: 'Delivery Timeframes',
    body: 'We operate on a "day-deffinity" or time-definite policy delivery timeframe where an ',
    highlight: 'force delivery conditions',
    bodyAfter: ' depends on the services level and vary vary factors beyond controll, but not still unformed coditons, processing, cerner delays, sesional ronir or other unforewwers. Pilot Courier Canada assumes for delays arising from each factors.',
  },
  {
    n: 3,
    title: 'Packaging & Labeling Responsibility',
    body: 'The shipper is enably responsible for ensuring that all shipments accurately that sillments accuratuly labeled and adequately packaged for oanrirements and applicable packaging. Pilot Courier Canada hart lable for damage or damage or resulting from improper packaging or leatting.',
    highlight: null,
  },
  {
    n: 4,
    title: 'Right to Refuse Service',
    body: 'Pilot Courier Canada ceevres the right to refoerse, or cancel at at adequately and mmivirize an arts its discretion, including to limited silgments, pobrichted, or hazardous tems, in any circumconce devament to warrant refarant.',
    highlight: null,
  },
  {
    n: 5,
    title: 'Payment Terms',
    body: 'Unless offiesse communicated in writing by ourice, ',
    highlight: 'full payment',
    bodyAfter: ' hor the processing of the team. Pilot Courier Canada aaserves are resert to hold owners pending recept of any payment.',
  },
  {
    n: 6,
    title: 'Customs Duties & Import',
    body: 'Customs durtiers, tastes, import ports, or relatived relaivament charget charges imperce e.cam as as the sole rresonsability of the consigner. Applicable Counter Canada Canada does not assrum an charger libility of your circumstances.',
    highlight: null,
  },
  {
    n: 7,
    title: 'Weight Discrepancies & Carrier Charges',
    body: 'Any additional charges arians from weight reported by the carrier, any additional are iuested by the carrier, or any other shipment related orsinges asssing, remain responsibility of the slreper acnersions in this regard, verified poot of settlement will be required the matter formally on our end.',
    highlight: null,
  },
  {
    n: 8,
    title: 'Contact & Support',
    body: 'By mmwiesing PilotCourier f Cannrier Canada.\n\nFor Inquiries, concerns, or assistance, contact our team at ',
    highlight: 'support@pilotcourier.com',
    isEmail: true,
    bodyAfter: '',
  },
];

// Topographic lines SVG background
function TopoBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 900 800"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: 14 }, (_, i) => (
        <path
          key={i}
          d={`M-100,${60 + i * 55} C150,${20 + i * 55} 300,${100 + i * 55} 500,${50 + i * 55} S750,${10 + i * 55} 1000,${60 + i * 55} S1150,${100 + i * 55} 1300,${50 + i * 55}`}
          fill="none"
          stroke="#d97706"
          strokeWidth="1"
          opacity={0.12}
        />
      ))}
      {/* Right side curves */}
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={`r${i}`}
          d={`M700,${-50 + i * 80} C750,${10 + i * 80} 800,${-20 + i * 80} 900,${30 + i * 80}`}
          fill="none"
          stroke="#d97706"
          strokeWidth="1"
          opacity={0.1}
        />
      ))}
    </svg>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf6ee' }}>
      <Navbar />

      {/* Header */}
      <div className="bg-hero-gradient pt-28 pb-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-3 block">LEGAL</span>
          <h1 className="font-display font-800 text-4xl text-white">Terms & Conditions</h1>
          <p className="text-white/60 mt-2 text-sm">Pilot Courier Canada</p>
          <p className="text-white/70 text-sm leading-relaxed mt-4 max-w-lg mx-auto">
            By accessing or using Pilot Courier Canada&apos;s services, you acknowledge
            that you have read, understand, and agree to be bowed by the following
            terms and conditions.
          </p>
        </div>
      </div>

      {/* 2-column cards grid */}
      <div className="relative overflow-hidden px-4 pb-20 pt-4" style={{ backgroundColor: '#fdf6ee' }}>
        <TopoBackground />
        <div className="relative max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sections.map(({ n, title, body, highlight, isEmail, bodyAfter }) => (
            <div
              key={n}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-orange-100/60"
            >
              {/* Number + Title */}
              <h2 className="font-display font-700 text-brand-navy text-base mb-3">
                {n}. {title}
              </h2>

              {/* Body */}
              <p className="text-gray-500 text-xs leading-relaxed">
                {body}
                {highlight && !isEmail && (
                  <span className="text-brand-orange underline cursor-pointer">{highlight}</span>
                )}
                {highlight && isEmail && (
                  <a href={`mailto:${highlight}`} className="text-brand-orange underline">
                    {highlight}
                  </a>
                )}
                {bodyAfter && bodyAfter}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
