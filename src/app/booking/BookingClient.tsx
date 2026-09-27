'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { prepareRates, formatDeliveryDate } from '@/lib/rate-display';
import { shipmentApi, paymentApi } from '@/lib/api';
import type { Rate, Address } from '@/lib/api';
import { Loader2, CheckCircle2, Download, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';
import { Elements } from '@stripe/react-stripe-js';

import { getStripePromise } from './_lib/stripe';
import { type PkgRow, type ProductRow, mkPkg, mkProduct, EMPTY } from './_lib/types';
import { StepBar } from './_components/StepBar';
import { ShipmentModeTabs } from './_components/ShipmentModeTabs';
import { ShipmentDetailsStep } from './_components/ShipmentDetailsStep';
import { RateCard } from './_components/RateCard';
import { StripePaymentForm } from './_components/StripePaymentForm';

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BookingClient() {
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
  const [packagingType, setPackagingType] = useState('My Packaging');

  // Product Information (customs invoice) — required for international shipments
  const [products, setProducts] = useState<ProductRow[]>([mkProduct()]);
  const [taxType, setTaxType] = useState('None');
  const [invoiceCurrency, setInvoiceCurrency] = useState<'CAD' | 'USD'>('CAD');

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

  // Keep selectedRate in sync with the current service and currency so a stale
  // object from an earlier fetch/resume never shows a different price than the rates list.
  useEffect(() => {
    if (!rates.length) return;
    setSelectedRate(prev => {
      const match = prev && rates.find(r => r.serviceCode === prev.serviceCode && r.currency === prev.currency && r.carrierId === prev.carrierId);
      return match || rates.find(r => r.isCheapest) || rates[0];
    });
  }, [rates]);

  // Booking result
  const [bookLoading, setBookLoading] = useState(false);
  const [createdId, setCreatedId] = useState('');
  const [createdNumber, setCreatedNumber] = useState('');
  const [labelBase64, setLabelBase64] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [amountDue, setAmountDue] = useState<{ amount: number; currency: string } | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem('pc_redirect_after_login', '/booking');
      router.push('/auth/login?next=/booking');
      return;
    }

    // Pre-fill from quote form if coming from quick quote or a resumed saved quote
    const savedForm = sessionStorage.getItem('pc_quote_form');
    const savedRate = sessionStorage.getItem('pc_selected_rate');
    const savedRates = sessionStorage.getItem('pc_booking_rates');

    if (savedForm) {
      const f = JSON.parse(savedForm);
      setShipper(prev => ({
        ...prev,
        postalCode: f.originPostal || '',
        city: f.originCity || '',
        province: f.originProvince || '',
        country: f.originCountry || prev.country || 'CA',
        isResidential: f.originResidential || false,
        addressType: f.shipperType === 'business' ? 'business' : 'consumer',
        name: f.originName || prev.name,
        company: f.originCompany || prev.company,
        street: f.originStreet || prev.street,
        street2: f.originStreet2 || prev.street2,
        phone: f.originPhone || prev.phone,
        email: f.originEmail || prev.email,
      }));
      setRecipient(prev => ({
        ...prev,
        postalCode: f.destinationPostal || '',
        city: f.destinationCity || '',
        province: f.destinationProvince || '',
        country: f.destinationCountry || 'CA',
        isResidential: f.destinationResidential || false,
        addressType: f.consigneeType === 'business' ? 'business' : 'consumer',
        name: f.destinationName || prev.name,
        company: f.destinationCompany || prev.company,
        street: f.destinationStreet || prev.street,
        street2: f.destinationStreet2 || prev.street2,
        phone: f.destinationPhone || prev.phone,
        email: f.destinationEmail || prev.email,
      }));
      if (f.weightUnit) setWeightUnit(f.weightUnit);
      if (f.dimensionUnit) setDimUnit(f.dimensionUnit);
      if (f.packages?.length) {
        setPackages(f.packages.map((p: any) => ({
          id: p.id || Math.random().toString(36).slice(2),
          length: String(p.length || ''), width: String(p.width || ''), height: String(p.height || ''),
          weight: String(p.weight || ''), insuranceAmount: String(p.insuranceAmount || '0.00'),
          specialHandling: p.specialHandling || false, description: p.description || '', freightClass: p.freightClass || '',
        })));
      } else if (f.length || f.width || f.height || f.weight) {
        // Flat rate-request shape (e.g. resumed from a saved quote) — rebuild a single package row
        setPackages([{
          id: Math.random().toString(36).slice(2),
          length: String(f.length ?? '1'), width: String(f.width ?? '1'), height: String(f.height ?? '1'),
          weight: String(f.weight ?? '1'), insuranceAmount: String(f.insuranceAmount ?? '0.00'),
          specialHandling: !!f.specialHandling, description: f.description || '', freightClass: f.freightClass || '',
        }]);
      }
    }

    // Resumed detailed quote — skip straight to the rates step with the previously fetched rates
    if (savedRates) {
      try {
        const parsedRates = prepareRates(JSON.parse(savedRates));
        if (parsedRates?.length) {
          setRates(prepareRates(parsedRates));
          setSelectedRate(parsedRates.find((r: Rate) => r.isCheapest) || parsedRates[0]);
          setStep(1);
        }
      } catch {}
      sessionStorage.removeItem('pc_booking_rates');
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

  const isInternational = !!shipper.country && !!recipient.country && shipper.country !== recipient.country;

  const updateProduct = (id: string, field: keyof ProductRow, value: any) =>
    setProducts(p => p.map(row => row.id === id ? { ...row, [field]: value } : row));
  const addProduct = () => setProducts(p => [...p, mkProduct(shipper.country)]);
  const removeProduct = (id: string) => setProducts(p => p.length > 1 ? p.filter(row => row.id !== id) : p);
  const productTotal = (row: ProductRow) => (parseFloat(row.quantity) || 0) * (parseFloat(row.unitPrice) || 0);
  const invoiceTotal = products.reduce((sum, row) => sum + productTotal(row), 0);

  const swapAddresses = () => {
    const tmp = { ...shipper };
    setShipper({ ...recipient });
    setRecipient(tmp);
  };

  const validateStep0 = () => {
    if (packagingType === 'Pallet' && packages.some(p => !p.freightClass)) { toast.error('Please select a freight class for each pallet.'); return false; }
    const reqFields = ['street', 'city', 'postalCode', 'country', 'name', 'phone'];
    for (const f of reqFields) {
      if (!(shipper as any)[f]) { toast.error(`Shipping From: ${f.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`); return false; }
      if (!(recipient as any)[f]) { toast.error(`Shipping To: ${f.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`); return false; }
    }
    if (packagingType !== 'Envelope') {
      const first = packages[0];
      if (!first.weight || !first.length || !first.width || !first.height) {
        toast.error('Please complete package dimensions and weight for at least one package.');
        return false;
      }
      if (isInternational) {
        for (const p of products) {
          if (!p.description || !p.madeIn || !p.unitPrice) {
            toast.error('Please complete all product information (description, made in, unit price) for customs.');
            return false;
          }
        }
      }
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
        shipperType: shipper.addressType || 'consumer',
        consigneeType: recipient.addressType || 'consumer',
        packagingType,
        originName: shipper.name,
        originCompany: shipper.company,
        originStreet: shipper.street,
        originStreet2: shipper.street2,
        originPhone: shipper.phone,
        originEmail: shipper.email,
        destinationPostal: recipient.postalCode,
        destinationCity: recipient.city,
        destinationProvince: recipient.province,
        destinationCountry: recipient.country,
        destinationResidential: recipient.isResidential,
        destinationName: recipient.name,
        destinationCompany: recipient.company,
        destinationStreet: recipient.street,
        destinationStreet2: recipient.street2,
        destinationPhone: recipient.phone,
        destinationEmail: recipient.email,
        weight: parseFloat(first.weight),
        weightUnit,
        length: parseFloat(first.length),
        width: parseFloat(first.width),
        height: parseFloat(first.height),
        dimensionUnit: dimUnit,
        description: first.description || 'Package',
        insuranceAmount: parseFloat(first.insuranceAmount) || 0,
        specialHandling: first.specialHandling,
        packages: packages.map(p => ({
          length: p.length, width: p.width, height: p.height, weight: p.weight,
          insuranceAmount: p.insuranceAmount, specialHandling: p.specialHandling, description: p.description, freightClass: p.freightClass,
        })),
        quoteType: 'detailed',
        pickupMethod,
        pickupLocation,
        pickupInstructions,
        readyHour, readyMin, closeHour, closeMin,
        specialServices: {
          signatureRequired: signatureType === 'signature_required',
          adultSignature: signatureType === 'adult_signature',
          saturdayDelivery,
          holdForPickup,
        },
      } as any);
      setRates(prepareRates(data.rates || []));
      if (data.rates?.length) setSelectedRate(prepareRates(data.rates)[0]);
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
        freightClass: p.freightClass,
        quantity: 1,
      }));

      const customsInvoice = packagingType !== 'Envelope' && isInternational ? {
        taxType,
        currency: invoiceCurrency,
        products: products.map(p => ({
          quantity: parseFloat(p.quantity) || 1,
          description: p.description,
          hsCode: p.hsCode,
          madeIn: p.madeIn,
          cusma: p.cusma,
          section232: p.section232,
          unitPrice: parseFloat(p.unitPrice) || 0,
          totalPrice: productTotal(p),
        })),
        totalValue: invoiceTotal,
      } : undefined;

      const { data: bookData } = await shipmentApi.book({
        shipper, recipient,
        parcels: pkgList,
        packagingType,
        customsInvoice,
        selectedRate,
        shipmentType: isInternational ? 'international' : 'domestic',
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
      // Fetch Stripe payment intent
      const { data: intentData } = await paymentApi.createStripeIntent(bookData.shipmentId);
      setClientSecret(intentData.clientSecret);
      setAmountDue({ amount: intentData.amount, currency: intentData.currency });
      setStep(3);
    } catch (err: any) {
      const data = err?.response?.data;
      // The server re-prices every booking. If the price moved (or the service is
      // gone) it sends fresh rates; the rates effect re-selects the same service.
      if (err?.response?.status === 409 && data?.rates?.length) {
        setRates(prepareRates(data.rates));
        if (data.code === 'RATE_UNAVAILABLE') setStep(1);
      }
      toast.error(data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookLoading(false);
    }
  };

  const handleConfirmPayment = async (transactionId: string) => {
    if (!createdId) return;
    setBookLoading(true);
    try {
      const { data } = await shipmentApi.confirmPayment(createdId, {
        method: 'stripe',
        transactionId,
      });
      if (data.shipment?.labelBase64) setLabelBase64(data.shipment.labelBase64);
      if (data.shipment?.trackingNumber) setTrackingNumber(data.shipment.trackingNumber);
      setStep(4);
      toast.success(data.shipment?.labelBase64 ? 'Payment successful! Label is ready.' : data.message || 'Payment successful!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to generate label.');
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

      <div className="pt-24">
        <ShipmentModeTabs mode="single" />
        <StepBar current={step} />

        <div className="max-w-6xl mx-auto px-4 py-6">

          {/* ── STEP 0: SHIPMENT DETAILS ─────────────────────────────────── */}
          {step === 0 && (
            <ShipmentDetailsStep
              router={router}
              shipper={shipper} recipient={recipient}
              updateShipper={updateShipper} updateRecipient={updateRecipient}
              swapAddresses={swapAddresses}
              isInternational={isInternational}
              packages={packages} setPackages={setPackages}
              packagingType={packagingType} setPackagingType={setPackagingType}
              dimUnit={dimUnit} setDimUnit={setDimUnit}
              weightUnit={weightUnit} setWeightUnit={setWeightUnit}
              addPkg={addPkg} dupPkg={dupPkg} removePkg={removePkg} updatePkg={updatePkg}
              products={products}
              updateProduct={updateProduct} addProduct={addProduct} removeProduct={removeProduct}
              productTotal={productTotal} invoiceTotal={invoiceTotal}
              taxType={taxType} setTaxType={setTaxType}
              invoiceCurrency={invoiceCurrency} setInvoiceCurrency={setInvoiceCurrency}
              pickupMethod={pickupMethod} setPickupMethod={setPickupMethod}
              pickupDate={pickupDate} setPickupDate={setPickupDate}
              pickupLocation={pickupLocation} setPickupLocation={setPickupLocation}
              pickupInstructions={pickupInstructions} setPickupInstructions={setPickupInstructions}
              readyHour={readyHour} setReadyHour={setReadyHour}
              readyMin={readyMin} setReadyMin={setReadyMin}
              closeHour={closeHour} setCloseHour={setCloseHour}
              closeMin={closeMin} setCloseMin={setCloseMin}
              signatureType={signatureType} setSignatureType={setSignatureType}
              saturdayDelivery={saturdayDelivery} setSaturdayDelivery={setSaturdayDelivery}
              holdForPickup={holdForPickup} setHoldForPickup={setHoldForPickup}
              references={references} setReferences={setReferences}
              validateStep0={validateStep0}
              handleGetQuote={handleGetQuote}
              quoteLoading={quoteLoading}
            />
          )}

          {/* ── STEP 1: GET QUOTE ────────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Available Rates</h2>
                  <p className="text-sm text-gray-400">
                    {shipper.city || shipper.postalCode} → {recipient.city || recipient.postalCode} · {totalWeight.toFixed(2)} {weightUnit} · {packages.length} pkg
                  </p>
                </div>
                <button onClick={() => setStep(0)} className="text-sm text-brand-navy hover:underline flex items-center gap-1 self-start sm:self-auto">
                  ← Edit Details
                </button>
              </div>

              {rates.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                  <p className="text-gray-400">No rates found for this route. Please adjust your shipment details.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {new Set(rates.map(r => r.currency)).size > 1 && <p className="text-sm text-gray-600">Rates are grouped by currency. Prices and value badges compare services within the same currency; no currency conversion is applied.</p>}
                  {rates.map(rate => (
                    <RateCard key={`${rate.carrierId}-${rate.serviceCode}-${rate.currency}`} rate={rate} selected={selectedRate?.serviceCode === rate.serviceCode && selectedRate?.carrierId === rate.carrierId && selectedRate?.currency === rate.currency} onSelect={() => setSelectedRate(rate)} />
                  ))}
                </div>
              )}

              {selectedRate && (
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-sm text-gray-600">
                    Selected: <span className="font-semibold text-brand-navy">{selectedRate.carrierName} — {selectedRate.serviceName}</span>
                    <span className="ml-3 font-bold text-brand-orange">${selectedRate.totalCharge.toFixed(2)} {selectedRate.currency}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={() => setStep(0)} className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded text-gray-600 hover:border-brand-navy hover:text-brand-navy transition-all bg-white">
                      ← Back
                    </button>
                    <button onClick={() => setStep(2)} className="px-6 py-2 text-sm font-semibold rounded text-white bg-brand-navy hover:bg-brand-navy/90 transition-all flex items-center justify-center gap-2">
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-brand-navy text-lg">{selectedRate.carrierName} — {selectedRate.serviceName}</p>
                    <p className="text-sm text-gray-500">{selectedRate.transitDays} business days · Est. {selectedRate.estimatedDelivery ? formatDeliveryDate(selectedRate.estimatedDelivery) : 'Pending'}</p>
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
                    <div key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-1.5 text-sm text-gray-600">
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
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button onClick={() => setStep(1)} className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded text-gray-600 hover:border-brand-navy hover:text-brand-navy transition-all bg-white order-2 sm:order-1">
                  ← Back
                </button>
                <button
                  onClick={handleBook}
                  disabled={bookLoading}
                  className="px-6 py-2.5 text-sm font-semibold rounded text-white bg-brand-orange hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60 order-1 sm:order-2"
                >
                  {bookLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <>Proceed to Payment <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: PAYMENT ── */}
          {step === 3 && clientSecret && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h2 className="text-lg font-semibold text-gray-700">Complete Payment</h2>
                <p className="text-sm text-gray-400">Order: <span className="font-mono font-semibold text-brand-navy">{createdNumber}</span></p>
              </div>
              <Elements stripe={getStripePromise()} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                <StripePaymentForm
                  amount={amountDue?.amount ?? selectedRate?.totalCharge ?? 0}
                  currency={amountDue?.currency || selectedRate?.currency || 'CAD'}
                  onSuccess={handleConfirmPayment}
                  onBack={() => setStep(2)}
                />
              </Elements>
            </div>
          )}

          {/* ── STEP 4: VIEW & PRINT LABEL ───────────────────────────────── */}
          {step === 4 && (
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

                <div className="flex flex-wrap gap-3 justify-center mt-6">
                  {labelBase64 ? (
                    <button onClick={downloadLabel} className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded text-white bg-brand-navy hover:bg-brand-navy/90 transition-all">
                      <Download className="w-4 h-4" /> Download Label (PDF)
                    </button>
                  ) : (
                    <p className="text-sm text-gray-400">Label is being generated…</p>
                  )}
                  {trackingNumber && (
                    <a href={`/track?number=${trackingNumber}`} className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded border border-gray-300 text-gray-600 hover:border-brand-navy hover:text-brand-navy transition-all">
                      Track Shipment
                    </a>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3 justify-center">
                  <button onClick={() => { setStep(0); setCreatedId(''); setCreatedNumber(''); setTrackingNumber(''); setLabelBase64(''); setClientSecret(''); setAmountDue(null); setRates([]); setSelectedRate(null); setPackages([mkPkg()]); }} className="text-sm text-brand-orange hover:underline">
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