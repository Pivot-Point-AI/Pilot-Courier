'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { shipmentApi } from '@/lib/api';
import type { Rate, Address } from '@/lib/api';
import { Loader2, CheckCircle2, ArrowLeftRight, Plus, Copy, Trash2, Download, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';

// ─── Styles ──────────────────────────────────────────────────────────────────
const inp = 'w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20 bg-white placeholder:text-gray-300';
const lbl = 'block text-xs text-gray-500 mb-0.5';
const req = <span className="text-red-500">*</span>;

// ─── Types ────────────────────────────────────────────────────────────────────
interface PkgRow {
  id: string;
  length: string; width: string; height: string;
  weight: string;
  insuranceAmount: string;
  specialHandling: boolean;
  description: string;
}

const mkPkg = (): PkgRow => ({
  id: Math.random().toString(36).slice(2),
  length: '', width: '', height: '', weight: '',
  insuranceAmount: '0.00', specialHandling: false, description: '',
});

const EMPTY: Address = {
  name: '', company: '', street: '', street2: '',
  city: '', province: '', postalCode: '', country: 'CA',
  phone: '', email: '', isResidential: false,
};

const PROVINCES = ['AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT'];
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINS = ['00', '15', '30', '45'];
const PICKUP_LOCS = ['Front Door','Back Door','Side Door','Reception','Mailroom'];

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = ['SHIPMENT DETAILS', 'GET QUOTE', 'REVIEW & PAYMENT', 'VIEW & PRINT LABEL'];

function StepBar({ current }: { current: number }) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex">
          {STEPS.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <div key={label} className="flex-1 flex items-center gap-0">
                <div className={`py-3 px-2 flex items-center gap-2 text-xs font-semibold border-b-2 transition-all w-full justify-center ${active ? 'border-brand-orange text-brand-navy' : done ? 'border-green-500 text-green-600' : 'border-transparent text-gray-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${active ? 'bg-brand-orange text-white' : done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {done ? '✓' : i + 1}
                  </span>
                  <span className="hidden sm:block">{label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Address Panel ────────────────────────────────────────────────────────────
function AddressPanel({ title, color, address, onChange, showConfirmEmail }: {
  title: string; color: 'red' | 'blue';
  address: Address; onChange: (f: string, v: any) => void;
  showConfirmEmail?: boolean;
}) {
  const dot = color === 'red' ? 'bg-brand-orange' : 'bg-brand-navy';
  const hdr = color === 'red' ? 'text-brand-orange' : 'text-brand-navy';
  return (
    <div className="flex-1 min-w-0 border border-gray-200 rounded-lg overflow-hidden">
      <div className={`flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200 ${hdr} font-semibold text-sm`}>
        <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
        {title}
      </div>
      <div className="p-4 space-y-2.5">
        <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
          <input type="checkbox" checked={!!address.isResidential} onChange={e => onChange('isResidential', e.target.checked)} className="accent-brand-navy" />
          Residential
        </label>
        <div>
          <label className={lbl}>Company / Person {req}</label>
          <input className={inp} value={address.company || ''} onChange={e => onChange('company', e.target.value)} placeholder="Company or person name" />
        </div>
        <div>
          <label className={lbl}>Address Line 1 {req}</label>
          <input className={inp} value={address.street} onChange={e => onChange('street', e.target.value)} placeholder="Street address" required />
        </div>
        <div>
          <label className={lbl}>Address Line 2</label>
          <input className={inp} value={address.street2 || ''} onChange={e => onChange('street2', e.target.value)} placeholder="Suite / Unit / Apt" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={lbl}>City {req}</label>
            <input className={inp} value={address.city} onChange={e => onChange('city', e.target.value)} placeholder="City" required />
          </div>
          <div>
            <label className={lbl}>Province / State</label>
            <select className={inp} value={address.province} onChange={e => onChange('province', e.target.value)}>
              <option value="">Select</option>
              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={lbl}>Zip / Postal code</label>
            <input className={inp} value={address.postalCode} onChange={e => onChange('postalCode', e.target.value)} placeholder="Postal code" />
          </div>
          <div>
            <label className={lbl}>Country</label>
            <input className={inp} value={address.country} onChange={e => onChange('country', e.target.value)} placeholder="CA" />
          </div>
        </div>
        <div>
          <label className={lbl}>Attention {req}</label>
          <input className={inp} value={address.name} onChange={e => onChange('name', e.target.value)} placeholder="Contact name" required />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={lbl}>Phone {req}</label>
            <input className={inp} type="tel" value={address.phone} onChange={e => onChange('phone', e.target.value)} placeholder="+1 416 555 0100" required />
          </div>
          <div>
            <label className={lbl}>Email {req}</label>
            <input className={inp} type="email" value={address.email || ''} onChange={e => onChange('email', e.target.value)} placeholder="email@example.com" />
          </div>
        </div>
        <div>
          <label className={lbl}>Instruction</label>
          <input className={inp} placeholder="Delivery instructions (optional)" />
        </div>
        <div className="flex flex-col gap-1.5 pt-1">
          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
            <input type="checkbox" className="accent-brand-navy" />
            Save to Address Book
          </label>
          {showConfirmEmail && (
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
              <input type="checkbox" defaultChecked className="accent-brand-navy" />
              Send Shipping Confirmation E-mail
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Rate card ────────────────────────────────────────────────────────────────
function RateCard({ rate, selected, onSelect }: { rate: Rate; selected: boolean; onSelect: () => void }) {
  const carrierColor: Record<string, string> = {
    UPS: 'bg-yellow-600', PUROLATOR: 'bg-purple-700', DHL: 'bg-red-600', FEDEX: 'bg-purple-900', ICS: 'bg-blue-700',
  };
  const initials = rate.carrierName.slice(0, 3).toUpperCase();
  const bg = carrierColor[rate.carrierName.toUpperCase()] || 'bg-gray-600';

  return (
    <label className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${selected ? 'border-brand-orange bg-orange-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
      <input type="radio" checked={selected} onChange={onSelect} className="sr-only" />
      <div className={`w-10 h-10 rounded-lg ${bg} text-white flex items-center justify-center font-bold text-xs flex-shrink-0`}>{initials}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm">{rate.serviceName}</p>
        <p className="text-xs text-gray-400">{rate.transitDays} business day{rate.transitDays !== 1 ? 's' : ''}{rate.estimatedDelivery ? ` · Est. ${rate.estimatedDelivery}` : ''}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {rate.isCheapest && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Cheapest</span>}
        {rate.isFastest && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Fastest</span>}
        {rate.isBestValue && !rate.isCheapest && !rate.isFastest && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Best Value</span>}
        <p className="font-bold text-lg text-brand-navy">${rate.totalCharge.toFixed(2)} <span className="text-xs font-normal text-gray-400">{rate.currency}</span></p>
        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${selected ? 'border-brand-orange bg-brand-orange' : 'border-gray-300'}`}>
          {selected && <div className="w-2.5 h-2.5 bg-white rounded-full m-auto mt-0.5" />}
        </div>
      </div>
    </label>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BookingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [step, setStep] = useState(0); // 0=details, 1=quote, 2=review, 3=label

  // Addresses
  const [shipper, setShipper] = useState<Address>({ ...EMPTY });
  const [recipient, setRecipient] = useState<Address>({ ...EMPTY });

  // Packages
  const [packages, setPackages] = useState<PkgRow[]>([mkPkg()]);
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [dimUnit, setDimUnit] = useState<'in' | 'cm'>('in');
  const [packagingType] = useState('My Packaging');

  // Pickup & services
  const [pickupMethod, setPickupMethod] = useState<'schedule_pickup' | 'drop_off'>('schedule_pickup');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Front Door');
  const [pickupInstructions, setPickupInstructions] = useState('');
  const [readyHour, setReadyHour] = useState('15');
  const [readyMin, setReadyMin] = useState('30');
  const [closeHour, setCloseHour] = useState('18');
  const [closeMin, setCloseMin] = useState('00');
  const [signatureType, setSignatureType] = useState('none');
  const [saturdayDelivery, setSaturdayDelivery] = useState(false);
  const [holdForPickup, setHoldForPickup] = useState(false);
  const [references, setReferences] = useState([{ name: '', value: '' }]);

  // Quote results
  const [rates, setRates] = useState<Rate[]>([]);
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // Booking result
  const [bookLoading, setBookLoading] = useState(false);
  const [createdId, setCreatedId] = useState('');
  const [createdNumber, setCreatedNumber] = useState('');
  const [labelBase64, setLabelBase64] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem('pc_redirect_after_login', '/booking');
      router.push('/auth/login?next=/booking');
      return;
    }

    // Pre-fill from quote form if coming from quick quote
    const savedForm = sessionStorage.getItem('pc_quote_form');
    const savedRate = sessionStorage.getItem('pc_selected_rate');

    if (savedForm) {
      const f = JSON.parse(savedForm);
      setShipper(prev => ({
        ...prev,
        postalCode: f.originPostal || '',
        city: f.originCity || '',
        province: f.originProvince || '',
        isResidential: f.originResidential || false,
      }));
      setRecipient(prev => ({
        ...prev,
        postalCode: f.destinationPostal || '',
        city: f.destinationCity || '',
        province: f.destinationProvince || '',
        country: f.destinationCountry || 'CA',
        isResidential: f.destinationResidential || false,
      }));
      if (f.weightUnit) setWeightUnit(f.weightUnit);
      if (f.dimensionUnit) setDimUnit(f.dimensionUnit);
      if (f.packages?.length) {
        setPackages(f.packages.map((p: any) => ({
          id: p.id || Math.random().toString(36).slice(2),
          length: String(p.length || ''), width: String(p.width || ''), height: String(p.height || ''),
          weight: String(p.weight || ''), insuranceAmount: String(p.insuranceAmount || '0.00'),
          specialHandling: p.specialHandling || false, description: p.description || '',
        })));
      }
    }

    // Pre-fill user's shipper address if available
    if (user) {
      setShipper(prev => ({
        ...prev,
        name: prev.name || `${user.firstName} ${user.lastName}`,
        email: prev.email || user.email,
        phone: prev.phone || user.phone || '',
      }));
    }

    // Default pickup date to today
    const today = new Date().toISOString().split('T')[0];
    setPickupDate(today);

    // If we have a rate already selected (from quick quote flow), jump to review
    if (savedRate) {
      const rate = JSON.parse(savedRate);
      setSelectedRate(rate);
      // Don't auto-advance; let them fill in the full form first
    }
  }, [isAuthenticated, user]);

  const updateShipper = (f: string, v: any) => setShipper(p => ({ ...p, [f]: v }));
  const updateRecipient = (f: string, v: any) => setRecipient(p => ({ ...p, [f]: v }));

  const updatePkg = (id: string, field: keyof PkgRow, value: any) =>
    setPackages(p => p.map(pkg => pkg.id === id ? { ...pkg, [field]: value } : pkg));
  const addPkg = () => setPackages(p => [...p, mkPkg()]);
  const dupPkg = (pkg: PkgRow) => setPackages(p => [...p, { ...pkg, id: Math.random().toString(36).slice(2) }]);
  const removePkg = (id: string) => setPackages(p => p.length > 1 ? p.filter(pkg => pkg.id !== id) : p);

  const swapAddresses = () => {
    const tmp = { ...shipper };
    setShipper({ ...recipient });
    setRecipient(tmp);
  };

  const validateStep0 = () => {
    const reqFields = ['street', 'city', 'postalCode', 'country', 'name', 'phone'];
    for (const f of reqFields) {
      if (!(shipper as any)[f]) { toast.error(`Shipping From: ${f.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`); return false; }
      if (!(recipient as any)[f]) { toast.error(`Shipping To: ${f.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`); return false; }
    }
    const first = packages[0];
    if (!first.weight || !first.length || !first.width || !first.height) {
      toast.error('Please complete package dimensions and weight for at least one package.');
      return false;
    }
    return true;
  };

  const handleGetQuote = async () => {
    if (!validateStep0()) return;
    setQuoteLoading(true);
    setRates([]);
    setSelectedRate(null);
    try {
      const first = packages[0];
      const { data } = await shipmentApi.getRates({
        originPostal: shipper.postalCode,
        originCity: shipper.city,
        originProvince: shipper.province,
        originCountry: shipper.country,
        originResidential: shipper.isResidential,
        destinationPostal: recipient.postalCode,
        destinationCity: recipient.city,
        destinationProvince: recipient.province,
        destinationCountry: recipient.country,
        destinationResidential: recipient.isResidential,
        weight: parseFloat(first.weight),
        weightUnit,
        length: parseFloat(first.length),
        width: parseFloat(first.width),
        height: parseFloat(first.height),
        dimensionUnit: dimUnit,
        description: first.description || 'Package',
        insuranceAmount: parseFloat(first.insuranceAmount) || 0,
        specialHandling: first.specialHandling,
      } as any);
      setRates(data.rates || []);
      if (data.rates?.length) setSelectedRate(data.rates.find((r: Rate) => r.isCheapest) || data.rates[0]);
      setStep(1);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to fetch rates. Please try again.');
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedRate) { toast.error('Please select a shipping service.'); return; }
    setBookLoading(true);
    try {
      const pkgList = packages.map(p => ({
        weight: parseFloat(p.weight || '1'),
        weightUnit,
        length: parseFloat(p.length || '1'),
        width: parseFloat(p.width || '1'),
        height: parseFloat(p.height || '1'),
        dimensionUnit: dimUnit,
        description: p.description || 'Package',
        insuranceAmount: parseFloat(p.insuranceAmount) || 0,
        specialHandling: p.specialHandling,
        quantity: 1,
      }));

      const { data: bookData } = await shipmentApi.book({
        shipper, recipient,
        parcels: pkgList,
        selectedRate,
        shipmentType: recipient.country !== shipper.country ? 'international' : 'domestic',
        guestEmail: shipper.email,
        guestPhone: shipper.phone,
        pickupDetails: {
          method: pickupMethod,
          location: pickupLocation,
          instructions: pickupInstructions,
          pickupDate,
          readyHour, readyMin, closeHour, closeMin,
        },
        specialServices: {
          saturdayDelivery,
          signatureRequired: signatureType === 'signature_required',
          adultSignature: signatureType === 'adult_signature',
          holdForPickup,
        },
        references: references.filter(r => r.name && r.value).map(r => ({ referenceName: r.name, referenceValue: r.value })),
      });

      setCreatedId(bookData.shipmentId);
      setCreatedNumber(bookData.shipmentNumber);
      setStep(2);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!createdId) return;
    setBookLoading(true);
    try {
      const { data } = await shipmentApi.confirmPayment(createdId, {
        method: 'stripe',
        transactionId: `MANUAL-${Date.now()}`,
      });
      if (data.shipment?.labelBase64) setLabelBase64(data.shipment.labelBase64);
      if (data.shipment?.trackingNumber) setTrackingNumber(data.shipment.trackingNumber);
      setStep(3);
      toast.success('Shipment created! Label is ready.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Payment confirmation failed.');
    } finally {
      setBookLoading(false);
    }
  };

  const downloadLabel = () => {
    if (!labelBase64) return;
    const a = document.createElement('a');
    a.href = labelBase64;
    a.download = `label-${trackingNumber || createdNumber}.pdf`;
    a.click();
  };

  const totalWeight = packages.reduce((s, p) => s + (parseFloat(p.weight) || 0), 0);

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <Navbar />

      <div className="pt-16">
        <StepBar current={step} />

        <div className="max-w-6xl mx-auto px-4 py-6">

          {/* ── STEP 0: SHIPMENT DETAILS ─────────────────────────────────── */}
          {step === 0 && (
            <div className="space-y-4">
              {/* Title */}
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-gray-700">Provide Complete Details To Get A Quote</h1>
                <button onClick={() => router.push('/quote')} className="text-xs text-brand-navy hover:underline">Switch to Quick Quote ↗</button>
              </div>

              {/* Address panels side by side */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-stretch gap-0 relative">
                  <AddressPanel title="Shipping From" color="red" address={shipper} onChange={updateShipper} />
                  {/* Swap button */}
                  <div className="flex items-start justify-center pt-12 px-2 flex-shrink-0">
                    <button
                      onClick={swapAddresses}
                      title="Swap addresses"
                      className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-400 hover:border-brand-orange hover:text-brand-orange transition-all shadow-sm"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <AddressPanel title="Shipping To" color="blue" address={recipient} onChange={updateRecipient} showConfirmEmail />
                </div>
              </div>

              {/* Package Details */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-brand-orange text-white flex items-center justify-center text-xs">📦</span>
                    <span className="font-semibold text-gray-700 text-sm">Package Details</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Packaging Type</span>
                      <select className={`${inp} py-1 text-xs w-36`} value={packagingType} disabled>
                        <option>My Packaging</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Quantity</span>
                      <select className={`${inp} py-1 text-xs w-16`} value={packages.length} onChange={e => {
                        const n = parseInt(e.target.value);
                        if (n > packages.length) for (let i = packages.length; i < n; i++) addPkg();
                        else setPackages(p => p.slice(0, n));
                      }}>
                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-4 overflow-x-auto">
                  {/* Units row */}
                  <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
                    <span className="font-medium">Units:</span>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="radio" checked={dimUnit === 'cm'} onChange={() => { setDimUnit('cm'); setWeightUnit('kg'); }} className="accent-brand-navy" /> cm / kg
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="radio" checked={dimUnit === 'in'} onChange={() => { setDimUnit('in'); setWeightUnit('lbs'); }} className="accent-brand-navy" /> in / lbs
                    </label>
                  </div>

                  {/* Table header */}
                  <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 mb-2 px-2">
                    <span className="text-xs text-gray-400 w-6" />
                    <span className="text-xs text-gray-400">Dimensions L × W × H ({dimUnit})</span>
                    <span className="text-xs text-gray-400" />
                    <span className="text-xs text-gray-400" />
                    <span className="text-xs text-gray-400">Weight ({weightUnit})</span>
                    <span className="text-xs text-gray-400">Insurance Val ($)</span>
                    <span className="text-xs text-gray-400">Special Handling</span>
                    <span className="text-xs text-gray-400">Description</span>
                    <span className="text-xs text-gray-400 w-20" />
                  </div>

                  {/* Package rows */}
                  <div className="space-y-2">
                    {packages.map((pkg, idx) => (
                      <div key={pkg.id} className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 items-center">
                        <span className="text-xs text-gray-400 font-mono w-6">{String(idx + 1).padStart(2, '0')}.</span>
                        <input type="number" value={pkg.length} onChange={e => updatePkg(pkg.id, 'length', e.target.value)} placeholder="L" min="0.1" step="0.1" className={`${inp} text-center`} />
                        <input type="number" value={pkg.width} onChange={e => updatePkg(pkg.id, 'width', e.target.value)} placeholder="W" min="0.1" step="0.1" className={`${inp} text-center`} />
                        <input type="number" value={pkg.height} onChange={e => updatePkg(pkg.id, 'height', e.target.value)} placeholder="H" min="0.1" step="0.1" className={`${inp} text-center`} />
                        <input type="number" value={pkg.weight} onChange={e => updatePkg(pkg.id, 'weight', e.target.value)} placeholder="1" min="0.01" step="0.01" className={`${inp} text-center`} required={idx === 0} />
                        <input type="number" value={pkg.insuranceAmount} onChange={e => updatePkg(pkg.id, 'insuranceAmount', e.target.value)} placeholder="0.00" min="0" step="0.01" className={`${inp} text-center`} />
                        <select value={pkg.specialHandling ? 'yes' : 'no'} onChange={e => updatePkg(pkg.id, 'specialHandling', e.target.value === 'yes')} className={inp}>
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                        <input type="text" value={pkg.description} onChange={e => updatePkg(pkg.id, 'description', e.target.value)} placeholder="Description" className={inp} />
                        <div className="flex items-center gap-1 w-20">
                          <button type="button" onClick={addPkg} title="Add row" className="p-1 text-gray-400 hover:text-brand-navy transition-colors">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => dupPkg(pkg)} title="Duplicate" className="p-1 text-gray-400 hover:text-brand-navy transition-colors">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => dupPkg(pkg)} title="Clone" className="p-1 text-gray-400 hover:text-brand-navy transition-colors">
                            <Copy className="w-3.5 h-3.5 opacity-50" />
                          </button>
                          {packages.length > 1 && (
                            <button type="button" onClick={() => removePkg(pkg.id)} title="Remove" className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Services */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                  <span className="text-brand-orange font-bold text-sm">≡</span>
                  <span className="font-semibold text-gray-700 text-sm">Additional Services</span>
                </div>
                <div className="p-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left: Pickup */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-2 block">How to Ship?</label>
                        <div className="flex gap-4">
                          {[
                            { val: 'schedule_pickup', label: 'Schedule a Pick Up' },
                            { val: 'drop_off', label: 'Drop Off at Carrier' },
                          ].map(({ val, label }) => (
                            <label key={val} className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-600">
                              <input type="radio" checked={pickupMethod === val} onChange={() => setPickupMethod(val as any)} className="accent-brand-navy" />
                              {label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {pickupMethod === 'schedule_pickup' && (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={lbl}>Pick Up Date</label>
                              <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} className={inp} min={new Date().toISOString().split('T')[0]} />
                            </div>
                            <div>
                              <label className={lbl}>Pickup Location</label>
                              <select value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} className={inp}>
                                {PICKUP_LOCS.map(l => <option key={l} value={l}>{l}</option>)}
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={lbl}>Earliest Time Ready</label>
                              <div className="flex gap-1">
                                <select value={readyHour} onChange={e => setReadyHour(e.target.value)} className={`${inp} flex-1`}>
                                  {HOURS.map(h => <option key={h}>{h}</option>)}
                                </select>
                                <select value={readyMin} onChange={e => setReadyMin(e.target.value)} className={`${inp} w-16`}>
                                  {MINS.map(m => <option key={m}>{m}</option>)}
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className={lbl}>Latest Time Ready</label>
                              <div className="flex gap-1">
                                <select value={closeHour} onChange={e => setCloseHour(e.target.value)} className={`${inp} flex-1`}>
                                  {HOURS.map(h => <option key={h}>{h}</option>)}
                                </select>
                                <select value={closeMin} onChange={e => setCloseMin(e.target.value)} className={`${inp} w-16`}>
                                  {MINS.map(m => <option key={m}>{m}</option>)}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className={lbl}>Instructions</label>
                            <input type="text" value={pickupInstructions} onChange={e => setPickupInstructions(e.target.value)} placeholder="Please bring Envelope" className={inp} />
                          </div>
                          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
                            <input type="checkbox" className="accent-brand-navy" />
                            Save Pickup Preference
                          </label>
                        </>
                      )}
                    </div>

                    {/* Right: References + signature + saturday + hold */}
                    <div className="space-y-3">
                      {/* References */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-2 block">References</label>
                        {references.map((ref, i) => (
                          <div key={i} className="flex gap-2 mb-2">
                            <input type="text" value={ref.name} onChange={e => { const r = [...references]; r[i] = { ...r[i], name: e.target.value }; setReferences(r); }} placeholder="Reference name" className={`${inp} flex-1`} />
                            <input type="text" value={ref.value} onChange={e => { const r = [...references]; r[i] = { ...r[i], value: e.target.value }; setReferences(r); }} placeholder="Value" className={`${inp} flex-1`} />
                          </div>
                        ))}
                        {references.length < 3 && (
                          <button type="button" onClick={() => setReferences([...references, { name: '', value: '' }])} className="text-xs text-brand-navy hover:underline">+ Add Reference</button>
                        )}
                      </div>

                      {/* Signature */}
                      <div>
                        <label className={lbl}>Signature Type</label>
                        <select value={signatureType} onChange={e => setSignatureType(e.target.value)} className={inp}>
                          <option value="none">Choose an Option for Signature</option>
                          <option value="signature_required">Signature Required</option>
                          <option value="adult_signature">Adult Signature</option>
                        </select>
                      </div>

                      {/* Toggles */}
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
                          <input type="checkbox" checked={saturdayDelivery} onChange={e => setSaturdayDelivery(e.target.checked)} className="accent-brand-navy" />
                          Saturday Delivery
                        </label>
                        <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
                          <input type="checkbox" checked={holdForPickup} onChange={e => setHoldForPickup(e.target.checked)} className="accent-brand-navy" />
                          Hold For Pickup
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom action bar */}
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Select <button onClick={handleGetQuote} className="text-brand-orange font-semibold hover:underline">Get Quote</button> to view available pricing and carrier options for the route selected
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (!validateStep0()) return;
                      toast.success('Shipment saved as draft.');
                    }}
                    className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded text-gray-600 hover:border-brand-navy hover:text-brand-navy transition-all bg-white"
                  >
                    Save Shipment
                  </button>
                  <button
                    onClick={handleGetQuote}
                    disabled={quoteLoading}
                    className="px-6 py-2 text-sm font-semibold rounded text-white bg-brand-navy hover:bg-brand-navy/90 transition-all flex items-center gap-2 disabled:opacity-60"
                  >
                    {quoteLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Getting Rates...</> : 'Get Quote'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 1: GET QUOTE ────────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Available Rates</h2>
                  <p className="text-sm text-gray-400">
                    {shipper.city || shipper.postalCode} → {recipient.city || recipient.postalCode} · {totalWeight.toFixed(2)} {weightUnit} · {packages.length} pkg
                  </p>
                </div>
                <button onClick={() => setStep(0)} className="text-sm text-brand-navy hover:underline flex items-center gap-1">
                  ← Edit Details
                </button>
              </div>

              {rates.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                  <p className="text-gray-400">No rates found for this route. Please adjust your shipment details.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {rates.map(rate => (
                    <RateCard key={rate.serviceCode} rate={rate} selected={selectedRate?.serviceCode === rate.serviceCode} onSelect={() => setSelectedRate(rate)} />
                  ))}
                </div>
              )}

              {selectedRate && (
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Selected: <span className="font-semibold text-brand-navy">{selectedRate.carrierName} — {selectedRate.serviceName}</span>
                    <span className="ml-3 font-bold text-brand-orange">${selectedRate.totalCharge.toFixed(2)} {selectedRate.currency}</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(0)} className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded text-gray-600 hover:border-brand-navy hover:text-brand-navy transition-all bg-white">
                      ← Back
                    </button>
                    <button onClick={() => setStep(2)} className="px-6 py-2 text-sm font-semibold rounded text-white bg-brand-navy hover:bg-brand-navy/90 transition-all flex items-center gap-2">
                      Review & Payment <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: REVIEW & PAYMENT ─────────────────────────────────── */}
          {step === 2 && selectedRate && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <h2 className="text-lg font-semibold text-gray-700">Review & Payment</h2>

              {/* Rate summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <p className="text-xs text-gray-400 mb-1">Selected Service</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-brand-navy text-lg">{selectedRate.carrierName} — {selectedRate.serviceName}</p>
                    <p className="text-sm text-gray-500">{selectedRate.transitDays} business days · Est. {selectedRate.estimatedDelivery}</p>
                  </div>
                  <p className="font-bold text-2xl text-brand-orange">${selectedRate.totalCharge.toFixed(2)} <span className="text-sm text-gray-400 font-normal">{selectedRate.currency}</span></p>
                </div>
              </div>

              {/* Addresses side by side */}
              <div className="grid md:grid-cols-2 gap-4">
                {[{ label: 'Shipping From', addr: shipper, dot: 'bg-brand-orange' }, { label: 'Shipping To', addr: recipient, dot: 'bg-brand-navy' }].map(({ label, addr, dot }) => (
                  <div key={label} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                      <span className="font-semibold text-sm text-gray-700">{label}</span>
                      {addr.isResidential && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Residential</span>}
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">{addr.company || addr.name}</p>
                    <p className="text-sm text-gray-600">{addr.street}{addr.street2 ? `, ${addr.street2}` : ''}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.province} {addr.postalCode}</p>
                    <p className="text-sm text-gray-600">{addr.country}</p>
                    <p className="text-sm text-gray-500 mt-1">{addr.phone} · {addr.email}</p>
                  </div>
                ))}
              </div>

              {/* Packages summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-sm text-gray-700 mb-3">{packages.length} Package{packages.length > 1 ? 's' : ''} · {totalWeight.toFixed(2)} {weightUnit}</p>
                <div className="divide-y divide-gray-50">
                  {packages.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-4 py-1.5 text-sm text-gray-600">
                      <span className="text-gray-400 text-xs font-mono">#{i + 1}</span>
                      <span>{p.length}×{p.width}×{p.height} {dimUnit}</span>
                      <span>{p.weight} {weightUnit}</span>
                      {parseFloat(p.insuranceAmount) > 0 && <span className="text-blue-600 text-xs">Insured ${p.insuranceAmount}</span>}
                      {p.specialHandling && <span className="text-orange-500 text-xs">Special Handling</span>}
                      {p.description && <span className="text-gray-400 text-xs truncate">{p.description}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pickup summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm">
                <p className="font-semibold text-gray-700 mb-2">Shipping Details</p>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div><span className="text-gray-400">Method:</span> {pickupMethod === 'schedule_pickup' ? `Pickup on ${pickupDate}` : 'Drop Off at Carrier'}</div>
                  {pickupMethod === 'schedule_pickup' && <div><span className="text-gray-400">Window:</span> {readyHour}:{readyMin} – {closeHour}:{closeMin}</div>}
                  {signatureType !== 'none' && <div><span className="text-gray-400">Signature:</span> {signatureType.replace(/_/g, ' ')}</div>}
                  {saturdayDelivery && <div className="text-brand-orange font-medium">Saturday Delivery</div>}
                  {holdForPickup && <div className="text-brand-orange font-medium">Hold For Pickup</div>}
                </div>
              </div>

              {/* Payment action */}
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
                <button onClick={() => setStep(1)} className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded text-gray-600 hover:border-brand-navy hover:text-brand-navy transition-all bg-white">
                  ← Back
                </button>
                <button
                  onClick={handleBook}
                  disabled={bookLoading}
                  className="px-6 py-2.5 text-sm font-semibold rounded text-white bg-brand-orange hover:bg-orange-600 transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {bookLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <>Confirm & Generate Label <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>

              {/* NOTE: In production, replace handleBook + handleConfirmPayment with actual Stripe/PayPal flow */}
            </div>
          )}

          {/* ── STEP 3: VIEW & PRINT LABEL ───────────────────────────────── */}
          {step === 3 && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-9 h-9 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-brand-navy mb-1">Shipment Created!</h2>
                <p className="text-gray-500 text-sm mb-1">Order: <span className="font-mono font-semibold text-brand-navy">{createdNumber}</span></p>
                {trackingNumber && (
                  <p className="text-gray-500 text-sm mb-4">Tracking: <span className="font-mono font-semibold text-brand-orange">{trackingNumber}</span></p>
                )}

                <div className="flex gap-3 justify-center mt-6">
                  {labelBase64 ? (
                    <button onClick={downloadLabel} className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded text-white bg-brand-navy hover:bg-brand-navy/90 transition-all">
                      <Download className="w-4 h-4" /> Download Label (PDF)
                    </button>
                  ) : (
                    <button onClick={handleConfirmPayment} disabled={bookLoading} className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded text-white bg-brand-navy hover:bg-brand-navy/90 transition-all disabled:opacity-60">
                      {bookLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      {bookLoading ? 'Generating Label...' : 'Generate & Download Label'}
                    </button>
                  )}
                  {trackingNumber && (
                    <a href={`/track?number=${trackingNumber}`} className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded border border-gray-300 text-gray-600 hover:border-brand-navy hover:text-brand-navy transition-all">
                      Track Shipment
                    </a>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3 justify-center">
                  <button onClick={() => { setStep(0); setCreatedId(''); setCreatedNumber(''); setTrackingNumber(''); setLabelBase64(''); setRates([]); setSelectedRate(null); setPackages([mkPkg()]); }} className="text-sm text-brand-orange hover:underline">
                    + New Shipment
                  </button>
                  <span className="text-gray-300">·</span>
                  <a href="/account/shipments" className="text-sm text-gray-500 hover:underline">View All Shipments</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
