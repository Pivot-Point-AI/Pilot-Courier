import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="bg-hero-gradient pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display font-800 text-4xl text-white">Privacy Policy</h1>
          <p className="text-white/60 mt-2 text-sm">Last updated: January 1, 2024</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-8">
          {[
            { title: '1. Information We Collect', content: 'We collect information you provide directly (name, email, phone, addresses), shipment information (origin, destination, package details), and payment information processed securely through our payment partners. We also collect usage data such as pages visited and features used.' },
            { title: '2. How We Use Your Information', content: 'We use your information to process shipments, generate labels, facilitate tracking, send notifications (email and SMS), improve our services, and communicate with you about your account and shipments.' },
            { title: '3. Information Sharing', content: 'We share necessary shipment information with carrier partners (UPS, FedEx, DHL, Purolator) to process your shipments. We also share information with payment processors to handle transactions. We do not sell your personal information to third parties for marketing purposes.' },
            { title: '4. Data Security', content: 'We implement industry-standard security measures including SSL/TLS encryption, secure password hashing, and access controls to protect your information. Payment data is handled entirely by PCI-compliant payment processors.' },
            { title: '5. Data Retention', content: 'We retain your account information and shipment history for as long as your account is active. You may request deletion of your account and associated data by contacting support@pilotcourier.com.' },
            { title: '6. Cookies', content: 'We use cookies and similar technologies to maintain your session, remember preferences, and analyze usage patterns. You can control cookie settings through your browser, though some features may not function properly without them.' },
            { title: '7. Your Rights', content: 'You have the right to access, correct, or delete your personal information. Canadian residents have additional rights under PIPEDA. To exercise these rights, contact privacy@pilotcourier.com.' },
            { title: '8. Contact', content: 'For privacy-related inquiries, contact our Privacy Officer at privacy@pilotcourier.com or write to Pilot Courier, Toronto, Ontario, Canada.' },
          ].map(({ title, content }) => (
            <div key={title}>
              <h2 className="font-display font-700 text-xl text-brand-navy mb-3">{title}</h2>
              <p className="text-gray-600 leading-relaxed">{content}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
