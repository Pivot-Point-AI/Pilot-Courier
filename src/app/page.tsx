// app/page.tsx
'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import WhyUsSection from '@/components/sections/whyus';
import HowItWorksSection from '@/components/sections/howItWorks';
import CtaSection from '@/components/sections/Cta';



export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <WhyUsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}