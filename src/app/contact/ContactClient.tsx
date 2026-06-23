'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Send, Loader2, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-hero-gradient pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-3 block">GET IN TOUCH</span>
          <h1 className="font-display font-800 text-4xl text-white mb-4">We&apos;re Here to Help</h1>
          <p className="text-white/70">
            We&apos;re here to help with any shipping inquiries, quotes, or support you need.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Form */}
            <div className="card p-8">
              <h2 className="font-display font-700 text-xl text-brand-navy mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Your Name</label>
                    <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Smith" className="input-field" required />
                  </div>
                  <div>
                    <label className="input-label">Email Address</label>
                    <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" className="input-field" required />
                  </div>
                </div>
                <div>
                  <label className="input-label">Subject</label>
                  <input type="text" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="How can we help?" className="input-field" required />
                </div>
                <div>
                  <label className="input-label">Message</label>
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={5} placeholder="Describe your inquiry..." className="input-field resize-none" required />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <h2 className="font-display font-700 text-xl text-brand-navy">Contact Information</h2>
              <div className="space-y-5">
                {[
                  {
                    icon: Phone, label: 'Phone',
                    content: (
                      <>
                        <a href="tel:6477017778" className="font-semibold text-brand-navy hover:text-brand-orange transition-colors block">647-701-7778</a>
                        <a href="tel:18882001845" className="font-semibold text-brand-navy hover:text-brand-orange transition-colors block">1-888-200-1845</a>
                      </>
                    ),
                  },
                  {
                    icon: Mail, label: 'Email',
                    content: <a href="mailto:support@pilotcourier.com" className="font-semibold text-brand-navy hover:text-brand-orange transition-colors">support@pilotcourier.com</a>,
                  },
                  {
                    icon: Clock, label: 'Office Hours',
                    content: <p className="font-semibold text-brand-navy">Monday – Friday, 9:00 AM – 6:00 PM</p>,
                  },
                  {
                    icon: MapPin, label: 'Administrative Head Office',
                    content: (
                      <>
                        <p className="font-semibold text-brand-navy">350 Burnhamthorpe Road West, Unit #200</p>
                        <p className="text-gray-600 text-sm">Mississauga, ON L5B 3J1</p>
                      </>
                    ),
                  },
                ].map(({ icon: Icon, label, content }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
                      {content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Warning note */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-800 space-y-1.5">
                    <p className="font-semibold">Please Note:</p>
                    <p>1. This is our Canadian administrative head office for staff only. <strong>Parcels are not accepted at this location.</strong></p>
                    <p>2. We offer complimentary pickup service. If you&apos;d prefer to drop off yourself, simply Google the nearest drop-off location for the courier being used in your city. Or just give us a call — we&apos;re always happy to help.</p>
                  </div>
                </div>
              </div>

              <div className="bg-brand-navy rounded-2xl p-6 text-white">
                <p className="font-display font-700 text-lg mb-1">For the fastest service</p>
                <p className="text-white/60 text-sm mb-4">Please have your tracking number or booking reference ready when you reach out.</p>
                <a href="tel:6477017778" className="btn-primary text-sm py-2.5 px-5 inline-flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
