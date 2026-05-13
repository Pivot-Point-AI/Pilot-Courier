'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { shipmentApi } from '@/lib/api';
import type { Rate, Address } from '@/lib/api';
import { ArrowLeft, ArrowRight, User, MapPin, Package, Loader2, CheckCircle2, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_ADDRESS: Address = {
  name: '', company: '', street: '', city: '',
  province: '', postalCode: '', country: 'CA', phone: '', email: '',
};

const CA_PROVINCES = ['AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT'];

function AddressForm({
  title, address, onChange, color
}: {
  title: string;
  address: Address;
  onChange: (field: string, value: string) => void;
  color: 'green' | 'red';
}) {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${color === 'green' ? 'bg-green-500' : 'bg-red-500'}`} />
        <h3 className="font-display font-700 text-brand-navy text-lg">{title}</h3>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="input-label">Full Name *</label>
          <input type="text" value={address.name} onChange={e => onChange('name', e.target.value)} placeholder="John Smith" className="input-field" required />
        </div>
        <div>
          <label className="input-label">Company (Optional)</label>
          <input type="text" value={address.company || ''} onChange={e => onChange('company', e.target.value)} placeholder="Company Inc." className="input-field" />
        </div>
        <div className="sm:col-span-2">
          <label className="input-label">Street Address *</label>
          <input type="text" value={address.street} onChange={e => onChange('street', e.target.value)} placeholder="123 Main Street" className="input-field" required />
        </div>
        <div>
          <label className="input-label">City *</label>
          <input type="text" value={address.city} onChange={e => onChange('city', e.target.value)} placeholder="Toronto" className="input-field" required />
        </div>
        <div>
          <label className="input-label">Province *</label>
          <select value={address.province} onChange={e => onChange('province', e.target.value)} className="select-field" required>
            <option value="">Select Province</option>
            {CA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="input-label">Postal Code *</label>
          <input type="text" value={address.postalCode} onChange={e => onChange('postalCode', e.target.value)} placeholder="M5V 2T6" className="input-field" required />
        </div>
        <div>
          <label className="input-label">Country *</label>
          <input type="text" value={address.country} onChange={e => onChange('country', e.target.value)} placeholder="CA" className="input-field" required />
        </div>
        <div>
          <label className="input-label">Phone Number *</label>
          <input type="tel" value={address.phone} onChange={e => onChange('phone', e.target.value)} placeholder="+1 416 555 0100" className="input-field" required />
        </div>
        <div>
          <label className="input-label">Email</label>
          <input type="email" value={address.email || ''} onChange={e => onChange('email', e.target.value)} placeholder="john@example.com" className="input-field" />
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);
  const [quoteForm, setQuoteForm] = useState<any>(null);
  const [shipper, setShipper] = useState<Address>({ ...EMPTY_ADDRESS });
  const [recipient, setRecipient] = useState<Address>({ ...EMPTY_ADDRESS });
  const [declaredValue, setDeclaredValue] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [createdShipmentId, setCreatedShipmentId] = useState('');
  const [createdShipmentNumber, setCreatedShipmentNumber] = useState('');

  useEffect(() => {
    const rate = sessionStorage.getItem('pc_selected_rate');
    const form = sessionStorage.getItem('pc_quote_form');
    if (!rate) { router.push('/quote'); return; }
    setSelectedRate(JSON.parse(rate));
    if (form) {
      const f = JSON.parse(form);
      setQuoteForm(f);
      setShipper(prev => ({ ...prev, postalCode: f.originPostal, city: f.originCity || '', province: f.originProvince || '' }));
      setRecipient(prev => ({ ...prev, postalCode: f.destinationPostal, city: f.destinationCity || '', province: f.destinationProvince || '', country: f.destinationCountry || 'CA' }));
    }
  }, [router]);

  const updateShipper = (field: string, value: string) => setShipper(prev => ({ ...prev, [field]: value }));
  const updateRecipient = (field: string, value: string) => setRecipient(prev => ({ ...prev, [field]: value }));

  const validateAddresses = () => {
    const required = ['name', 'street', 'city', 'province', 'postalCode', 'country', 'phone'];
    for (const field of required) {
      if (!(shipper as any)[field]) { toast.error(`Shipper ${field} is required.`); return false; }
      if (!(recipient as any)[field]) { toast.error(`Recipient ${field} is required.`); return false; }
    }
    if (!guestEmail && !shipper.email) { toast.error('Please provide a contact email for notifications.'); return false; }
    return true;
  };

  const handleBook = async () => {
    if (!validateAddresses()) return;
    setLoading(true);
    try {
      const { data } = await shipmentApi.book({
        shipper,
        recipient,
        parcels: [{
          weight: parseFloat(quoteForm?.weight || '1'),
          weightUnit: quoteForm?.weightUnit || 'kg',
          length: parseFloat(quoteForm?.length || '1'),
          width: parseFloat(quoteForm?.width || '1'),
          height: parseFloat(quoteForm?.height || '1'),
          dimensionUnit: quoteForm?.dimensionUnit || 'cm',
          description: quoteForm?.description || 'Package',
          declaredValue: declaredValue ? parseFloat(declaredValue) : undefined,
          quantity: 1,
        }],
        selectedRate,
        shipmentType: quoteForm?.shipmentType || 'domestic',
        guestEmail: guestEmail || shipper.email,
        guestPhone: guestPhone || shipper.phone,
      });

      setCreatedShipmentId(data.shipmentId);
      setCreatedShipmentNumber(data.shipmentNumber);
      sessionStorage.setItem('pc_booking_id', data.shipmentId);
      sessionStorage.setItem('pc_booking_number', data.shipmentNumber);
      setStep(3);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            {step > 1 && step < 3 ? (
              <button onClick={() => setStep(s => s - 1)} className="btn-ghost p-2">
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={() => router.back()} className="btn-ghost p-2">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="font-display font-800 text-2xl text-brand-navy">Book Your Shipment</h1>
              <p className="text-sm text-gray-500">Step {step} of 3</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {['Addresses', 'Review', 'Payment'].map((label, i) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-brand-orange text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {step > i + 1 ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm font-semibold hidden sm:block ${step === i + 1 ? 'text-brand-navy' : 'text-gray-400'}`}>{label}</span>
                {i < 2 && <div className={`flex-1 h-0.5 ${step > i + 1 ? 'bg-green-400' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {/* Selected Rate Summary */}
          {selectedRate && (
            <div className="bg-orange-50 border border-brand-orange/20 rounded-2xl p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Selected Service</p>
                <p className="font-display font-700 text-brand-navy">{selectedRate.carrierName} — {selectedRate.serviceName}</p>
              </div>
              <div className="text-right">
                <p className="font-display font-800 text-xl text-brand-orange">${selectedRate.totalCharge.toFixed(2)}</p>
                <p className="text-xs text-gray-400">{selectedRate.transitDays} day{selectedRate.transitDays !== 1 ? 's' : ''}</p>
              </div>
            </div>
          )}

          {/* Step 1: Addresses */}
          {step === 1 && (
            <div className="space-y-5">
              <AddressForm title="Sender (From)" address={shipper} onChange={updateShipper} color="green" />
              <AddressForm title="Recipient (To)" address={recipient} onChange={updateRecipient} color="red" />

              {/* Guest contact for notifications */}
              <div className="card p-6 space-y-4">
                <h3 className="font-display font-700 text-brand-navy">Notification Contact</h3>
                <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3 mb-3">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-700">We'll send booking confirmation and tracking updates to this email and phone.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Contact Email *</label>
                    <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="your@email.com" className="input-field" />
                  </div>
                  <div>
                    <label className="input-label">Contact Phone</label>
                    <input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="+1 416 555 0100" className="input-field" />
                  </div>
                  <div>
                    <label className="input-label">Declared Value (CAD, optional)</label>
                    <input type="number" value={declaredValue} onChange={e => setDeclaredValue(e.target.value)} placeholder="e.g. 100.00" min="0" step="0.01" className="input-field" />
                  </div>
                </div>
              </div>

              <button onClick={() => setStep(2)} className="btn-primary w-full text-base py-4">
                Review Shipment <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Shipper Summary */}
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <h3 className="font-700 text-brand-navy">Sender</h3>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-800">{shipper.name} {shipper.company && `(${shipper.company})`}</p>
                  <p>{shipper.street}, {shipper.city}, {shipper.province} {shipper.postalCode}</p>
                  <p>{shipper.phone} · {shipper.email}</p>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <h3 className="font-700 text-brand-navy">Recipient</h3>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-800">{recipient.name} {recipient.company && `(${recipient.company})`}</p>
                  <p>{recipient.street}, {recipient.city}, {recipient.province} {recipient.postalCode}, {recipient.country}</p>
                  <p>{recipient.phone} · {recipient.email}</p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="card p-6">
                <h3 className="font-700 text-brand-navy mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  {[
                    ['Carrier', `${selectedRate?.carrierName} — ${selectedRate?.serviceName}`],
                    ['Transit Time', `${selectedRate?.transitDays} business days`],
                    ['Package', `${quoteForm?.weight}${quoteForm?.weightUnit} · ${quoteForm?.length}×${quoteForm?.width}×${quoteForm?.height}${quoteForm?.dimensionUnit}`],
                    ...(declaredValue ? [['Declared Value', `$${parseFloat(declaredValue).toFixed(2)} CAD`]] : []),
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-semibold text-gray-800">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 pt-3">
                    <span className="font-700 text-brand-navy text-base">Total</span>
                    <span className="font-display font-800 text-xl text-brand-orange">${selectedRate?.totalCharge.toFixed(2)} {selectedRate?.currency}</span>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                <p className="text-xs font-bold text-yellow-800 mb-1">Cancellation Policy</p>
                <p className="text-xs text-yellow-700 leading-relaxed">
                  Full refund if cancelled same day and documents unused. After 24 hours or if pickup has occurred, a written request is required. A $25 fee applies if cancelled upon driver arrival.
                </p>
              </div>

              <button onClick={handleBook} disabled={loading} className="btn-primary w-full text-base py-4">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating Shipment...</> : <>Confirm & Proceed to Payment <ArrowRight className="w-5 h-5" /></>}
              </button>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="card p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-display font-700 text-xl text-brand-navy mb-2">Shipment Created!</h3>
                <p className="text-gray-500 text-sm mb-4">Your shipment <strong className="text-brand-navy">{createdShipmentNumber}</strong> is ready. Complete payment to generate your label.</p>
              </div>

              <PaymentSection
                shipmentId={createdShipmentId}
                shipmentNumber={createdShipmentNumber}
                amount={selectedRate?.totalCharge || 0}
                currency={selectedRate?.currency || 'CAD'}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ── Payment Section ──────────────────────────────────────────────────────────
function PaymentSection({ shipmentId, shipmentNumber, amount, currency }: {
  shipmentId: string; shipmentNumber: string; amount: number; currency: string;
}) {
  const router = useRouter();
  const [method, setMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });

  const { paymentApi, shipmentApi } = require('@/lib/api');

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      // In production, use Stripe Elements / PaymentIntent.
      // For demo/MVP: simulate with confirm-payment endpoint
      await shipmentApi.confirmPayment(shipmentId, {
        method: 'stripe',
        transactionId: `pi_${Date.now()}_demo`,
      });
      toast.success('Payment successful! Label generated.');
      router.push(`/booking/success?shipmentId=${shipmentId}&number=${shipmentNumber}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'stripe', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex', icon: '💳' },
    { id: 'paypal', label: 'PayPal', sub: 'Pay with your PayPal account', icon: '🅿' },
  ];

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h3 className="font-display font-700 text-brand-navy mb-4">Select Payment Method</h3>
        <div className="space-y-3">
          {paymentMethods.map(m => (
            <label key={m.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${method === m.id ? 'border-brand-orange bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}>
              <input type="radio" name="paymentMethod" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id as any)} className="sr-only" />
              <span className="text-2xl">{m.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800">{m.label}</p>
                <p className="text-xs text-gray-400">{m.sub}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${method === m.id ? 'border-brand-orange bg-brand-orange' : 'border-gray-300'}`}>
                {method === m.id && <div className="w-2.5 h-2.5 bg-white rounded-full m-auto mt-0.5" />}
              </div>
            </label>
          ))}
        </div>
      </div>

      {method === 'stripe' && (
        <div className="card p-6 space-y-4">
          <h3 className="font-700 text-brand-navy mb-1">Card Details</h3>
          <div>
            <label className="input-label">Cardholder Name</label>
            <input type="text" value={cardDetails.name} onChange={e => setCardDetails(p => ({ ...p, name: e.target.value }))} placeholder="John Smith" className="input-field" />
          </div>
          <div>
            <label className="input-label">Card Number</label>
            <input type="text" value={cardDetails.number} onChange={e => setCardDetails(p => ({ ...p, number: e.target.value }))} placeholder="4242 4242 4242 4242" maxLength={19} className="input-field font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Expiry Date</label>
              <input type="text" value={cardDetails.expiry} onChange={e => setCardDetails(p => ({ ...p, expiry: e.target.value }))} placeholder="MM/YY" maxLength={5} className="input-field" />
            </div>
            <div>
              <label className="input-label">CVC</label>
              <input type="text" value={cardDetails.cvc} onChange={e => setCardDetails(p => ({ ...p, cvc: e.target.value }))} placeholder="123" maxLength={4} className="input-field" />
            </div>
          </div>
        </div>
      )}

      {/* Order Total */}
      <div className="bg-brand-navy rounded-2xl p-5 flex items-center justify-between text-white">
        <div>
          <p className="text-white/60 text-sm">Amount Due</p>
          <p className="font-display font-800 text-2xl">${amount.toFixed(2)} <span className="text-sm font-normal text-white/60">{currency}</span></p>
        </div>
        <button onClick={handleStripePayment} disabled={loading} className="btn-primary text-sm px-6 py-3">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : 'Pay Now 🔒'}
        </button>
      </div>

      <p className="text-xs text-center text-gray-400">
        🔒 Payments are processed securely via Stripe. Your card info is never stored on our servers.
      </p>
    </div>
  );
}
