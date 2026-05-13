'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Send, Loader2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In production, POST to /api/contact
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="bg-hero-gradient pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-3 block">CONTACT US</span>
          <h1 className="font-display font-800 text-4xl text-white mb-4">We're Here to Help</h1>
          <p className="text-white/70">Have a question or need support? Reach out and we'll get back to you quickly.</p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="max-w-5xl mx-auto px-4">
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
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={5} placeholder="Describe your issue or question..." className="input-field resize-none" required />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-700 text-xl text-brand-navy mb-6">Contact Information</h2>
                <div className="space-y-5">
                  {[
                    { icon: Mail, label: 'Email Support', value: 'support@pilotcourier.com', href: 'mailto:support@pilotcourier.com' },
                    { icon: Phone, label: 'Phone', value: '1-800-123-4567', href: 'tel:+18001234567' },
                    { icon: MapPin, label: 'Head Office', value: 'Toronto, Ontario, Canada', href: null },
                    { icon: Clock, label: 'Support Hours', value: 'Mon–Fri: 9am–6pm EST', href: null },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-brand-orange" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">{label}</p>
                        {href ? (
                          <a href={href} className="font-semibold text-brand-navy hover:text-brand-orange transition-colors">{value}</a>
                        ) : (
                          <p className="font-semibold text-brand-navy">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-brand-navy rounded-2xl p-6 text-white">
                <p className="font-display font-700 text-lg mb-2">Need Urgent Help?</p>
                <p className="text-white/60 text-sm mb-4">For time-sensitive shipment issues, call us directly for immediate assistance.</p>
                <a href="tel:+18001234567" className="btn-primary text-sm py-2.5 px-5 inline-flex">
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
