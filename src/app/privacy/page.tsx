import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Pilot Courier Canada',
  description: 'Read Pilot Courier\'s privacy policy to understand how we collect, use, and protect your personal information.',
  alternates: { canonical: '/privacy' },
  robots: { index: false, follow: true },
};

function TopoBackground() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1400 900"
      preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i}
          d={`M-100,${50 + i * 55} C200,${10 + i * 55} 400,${90 + i * 55} 700,${40 + i * 55} S1000,${0 + i * 55} 1400,${50 + i * 55} S1600,${90 + i * 55} 1800,${40 + i * 55}`}
          fill="none" stroke="#d97706" strokeWidth="1" opacity={0.1} />
      ))}
    </svg>
  );
}

const leftNav = [
  { n: '01', label: 'Information We\nCollect' },
  { n: '02', label: 'How We User\nInformation' },
  { n: '03', label: 'Data Sharing' },
  { n: '04', label: 'Data Security' },
  { n: '05', label: 'Key Rights at a\nGlance' },
];

const tocItems = [
  { n: 1, label: 'Information We Collect' },
  { n: 2, label: 'How It Works' },
  { n: 3, label: 'How We User Information' },
  { n: 4, label: 'Privacy Policy', active: true },
  { n: 5, label: 'Data Security' },
  { n: 6, label: 'Data Security' },
  { n: 7, label: 'Your Rights' },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf6ee' }}>
      <Navbar />

      {/* Hero */}
      <div className="bg-hero-gradient pt-28 pb-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-3 block">LEGAL</span>
          <h1 className="font-display font-800 text-4xl text-white">Privacy Policy</h1>
          <p className="text-white/60 mt-2 text-sm">Last Updated: May 2026 · Pilot Courier Canada</p>
        </div>
      </div>

      {/* 3-column layout */}
      <div className="relative overflow-hidden px-4 pb-20 pt-4" style={{ backgroundColor: '#fdf6ee' }}>
        <TopoBackground />
        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[200px_1fr_220px] gap-6">

          {/* ── LEFT: numbered nav ── */}
          <div className="hidden lg:flex flex-col gap-3">
            {leftNav.map(({ n, label }) => (
              <div key={n} className="bg-white/70 backdrop-blur-sm border border-orange-100/60 rounded-xl p-4 shadow-sm">
                <p className="text-brand-orange font-display font-800 text-xl leading-none mb-1">{n}.</p>
                <p className="text-brand-navy text-xs font-semibold leading-snug whitespace-pre-line">{label}</p>
              </div>
            ))}
          </div>

          {/* ── CENTER: main content ── */}
          <div className="bg-white/80 backdrop-blur-sm border border-orange-100/60 rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-xs leading-relaxed mb-6">
              At Pilot Courier Canada, we are committed to protecting your personal information and handling it with transparency and care.
            </p>

            <div className="space-y-6">
              {/* Section 1 */}
              <div>
                <h2 className="font-semibold text-brand-navy text-sm mb-2">1. Information We Collect</h2>
                <p className="text-gray-500 text-xs mb-2">We collect only the information necessary to deliver our services, including:</p>
                <ul className="space-y-1 text-xs text-gray-500">
                  <li className="flex items-start gap-2"><span className="text-brand-orange mt-0.5">•</span> Personal identifiers: name, email address, and phone number</li>
                  <li className="flex items-start gap-2"><span className="text-brand-orange mt-0.5">•</span> Shipping and delivery details</li>
                  <li className="flex items-start gap-2"><span className="text-brand-orange mt-0.5">•</span> Inquiry and correspondence information</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="font-semibold text-brand-navy text-sm mb-2">2. How We Use Your Information</h2>
                <p className="text-gray-500 text-xs mb-2">Your information is used solely to:</p>
                <ul className="space-y-1 text-xs text-gray-500">
                  <li className="flex items-start gap-2"><span className="text-brand-orange mt-0.5">•</span> Process and manage shipments on your behalf</li>
                  <li className="flex items-start gap-2"><span className="text-brand-orange mt-0.5">•</span> Respond to customer inquiries and support requests</li>
                  <li className="flex items-start gap-2"><span className="text-brand-orange mt-0.5">•</span> Improve the functionality and experience of our website and services</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="font-semibold text-brand-navy text-sm mb-2">3. Data Sharing</h2>
                <p className="text-gray-500 text-xs leading-relaxed">
                  We do not sell, rent, or share your personal information with third parties, except where required to fulfill your shipment (e.g., assigned carriers) or as required by law.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="font-semibold text-brand-navy text-sm mb-2">4. Data Security</h2>
                <p className="text-gray-500 text-xs leading-relaxed">
                  We take reasonable measures to protect your personal information from unauthorized access, disclosure, or misuse.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="font-semibold text-brand-navy text-sm mb-2">5. Your Rights</h2>
                <p className="text-gray-500 text-xs leading-relaxed">
                  You have the right to request access to, correction of, or deletion of your personal data at any time. To exercise these rights, please contact us at{' '}
                  <a href="mailto:support@pilotcourier.com" className="text-brand-orange underline">support@pilotcourier.com</a>
                  . We will respond to all requests in a timely manner.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: sidebar ── */}
          <div className="flex flex-col gap-4">
            {/* Key Rights at a Glance */}
            <div className="bg-white/80 backdrop-blur-sm border border-orange-100/60 rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-brand-navy text-sm mb-3">Key Rights at a Glance</h3>
              <ul className="space-y-2 text-xs text-gray-500">
                <li className="flex items-start gap-2">
                  <span className="text-brand-orange mt-0.5 flex-shrink-0">•</span>
                  <span>You have the right to request access:</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-orange mt-0.5 flex-shrink-0">•</span>
                  <span>Personeer identifiers: name, and, phone number</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-orange mt-0.5 flex-shrink-0">•</span>
                  <span>Shipping and delivery details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-orange mt-0.5 flex-shrink-0">•</span>
                  <span>Improve and customers and oassle services</span>
                </li>
              </ul>
            </div>

            {/* Table of Contents */}
            <div className="bg-white/80 backdrop-blur-sm border border-orange-100/60 rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-brand-navy text-sm mb-3">Table of Contents</h3>
              <ul className="space-y-1.5">
                {tocItems.map(({ n, label, active }) => (
                  <li key={n} className={`text-xs flex items-start gap-1.5 ${active ? 'text-brand-orange font-semibold' : 'text-gray-500'}`}>
                    <span className="flex-shrink-0">{n}.</span>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3D Shield illustration */}
            <div className="flex justify-center py-2">
              <div className="w-24 h-24 relative">
                {/* Simple shield SVG illustration */}
                <svg viewBox="0 0 100 110" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Shield body */}
                  <path d="M50 5 L90 20 L90 55 C90 78 70 95 50 105 C30 95 10 78 10 55 L10 20 Z"
                    fill="#fde68a" stroke="#f97316" strokeWidth="2"/>
                  {/* Inner shield */}
                  <path d="M50 18 L78 30 L78 55 C78 70 65 82 50 90 C35 82 22 70 22 55 L22 30 Z"
                    fill="#fed7aa" stroke="#f97316" strokeWidth="1.5" opacity="0.7"/>
                  {/* Lock icon */}
                  <rect x="38" y="52" width="24" height="18" rx="3" fill="#f97316" opacity="0.8"/>
                  <path d="M42 52 L42 46 C42 40 58 40 58 46 L58 52" stroke="#f97316" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  <circle cx="50" cy="61" r="3" fill="white"/>
                  {/* Decorative boxes */}
                  <rect x="5" y="70" width="12" height="12" rx="2" fill="#fbbf24" opacity="0.6"/>
                  <rect x="83" y="65" width="10" height="10" rx="2" fill="#f97316" opacity="0.5"/>
                  <rect x="15" y="85" width="8" height="8" rx="2" fill="#fed7aa" opacity="0.8"/>
                </svg>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-white/80 backdrop-blur-sm border border-orange-100/60 rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-brand-navy text-sm mb-1">Need Help?</h3>
              <p className="text-gray-400 text-xs mb-2">Get more informationat contact or contact us.</p>
              <a href="mailto:support@pilotcourier.com" className="text-brand-orange text-xs underline break-all">
                support@pilotcourier.com
              </a>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
