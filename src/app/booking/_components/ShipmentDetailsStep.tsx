'use client';
import { Loader2, ArrowLeftRight, Plus, Copy, CopyPlus, Trash2, Package, ShoppingCart } from 'lucide-react';
import type { Address } from '@/lib/api';
import { FREIGHT_CLASSES } from '../../quote/_lib/constants';
import { ALL_COUNTRIES, PACKAGING_TYPES, MAX_PACKAGES, TAX_TYPES, HOURS, MINS, PICKUP_LOCS, CUSMA_COUNTRIES } from '../_lib/constants';
import type { PkgRow, ProductRow } from '../_lib/types';
import { volumetricWeight } from '@/lib/dim-weight';
import { inp, lbl, req } from './styles';
import { AddressPanel } from './AddressPanel';
import { Dropdown, type DropdownOption } from './Dropdown';

// Package Details header row
const hdrLbl = 'text-xs font-medium text-gray-500 whitespace-nowrap';
const UNIT_OPTIONS: DropdownOption<'cm' | 'in'>[] = [{ value: 'cm', label: 'cm / kg' }, { value: 'in', label: 'in / lbs' }];
const PACKAGING_OPTIONS: DropdownOption<string>[] = PACKAGING_TYPES.map(t => ({ value: t, label: t }));
const QTY_OPTIONS: DropdownOption<number>[] = Array.from({ length: MAX_PACKAGES }, (_, i) => ({ value: i + 1, label: String(i + 1) }));

// Package table columns, shared by the header and every row: row no. | 8 shrinkable field columns | actions.
// The actions column fits all four 22px icon buttons plus gaps, so the table never overflows its card.
const pkgGrid = 'grid-cols-[1.5rem_repeat(8,minmax(0,1fr))_6.25rem] gap-2';

// Product table columns, shared by the header and every row: row no. | 6 field columns | CUSMA checkbox | actions.
// Fixed-width no./checkbox/actions tracks keep the header and rows aligned instead of each auto-sizing independently.
const productGrid = 'grid-cols-[1.5rem_1fr_1.4fr_1fr_1fr_4rem_1fr_1fr_2.5rem] gap-2';

export function ShipmentDetailsStep(props: {
  router: { push: (href: string) => void };
  shipper: Address; recipient: Address;
  updateShipper: (f: string, v: any) => void; updateRecipient: (f: string, v: any) => void;
  swapAddresses: () => void;
  isInternational: boolean;
  saveShipperToBook: boolean; setSaveShipperToBook: (v: boolean) => void;
  saveRecipientToBook: boolean; setSaveRecipientToBook: (v: boolean) => void;
  notifyRecipient: boolean; setNotifyRecipient: (v: boolean) => void;

  packages: PkgRow[]; setPackages: React.Dispatch<React.SetStateAction<PkgRow[]>>;
  packagingType: string; setPackagingType: (v: string) => void;
  dimUnit: 'in' | 'cm'; setDimUnit: (v: 'in' | 'cm') => void;
  weightUnit: 'lbs' | 'kg'; setWeightUnit: (v: 'lbs' | 'kg') => void;
  addPkg: () => void; sameAsAbove: (id: string) => void; allTheSame: (id: string) => void; removePkg: (id: string) => void;
  updatePkg: (id: string, field: keyof PkgRow, value: any) => void;

  products: ProductRow[];
  updateProduct: (id: string, field: keyof ProductRow, value: any) => void;
  addProduct: () => void; removeProduct: (id: string) => void;
  productTotal: (row: ProductRow) => number; invoiceTotal: number;
  taxType: string; setTaxType: (v: string) => void;
  taxId: string; setTaxId: (v: string) => void;
  invoiceCurrency: 'CAD' | 'USD'; setInvoiceCurrency: (v: 'CAD' | 'USD') => void;

  pickupMethod: 'schedule_pickup' | 'drop_off'; setPickupMethod: (v: 'schedule_pickup' | 'drop_off') => void;
  pickupDate: string; setPickupDate: (v: string) => void;
  pickupLocation: string; setPickupLocation: (v: string) => void;
  pickupInstructions: string; setPickupInstructions: (v: string) => void;
  readyHour: string; setReadyHour: (v: string) => void;
  readyMin: string; setReadyMin: (v: string) => void;
  closeHour: string; setCloseHour: (v: string) => void;
  closeMin: string; setCloseMin: (v: string) => void;
  savePickupPref: boolean; setSavePickupPref: (v: boolean) => void;
  signatureType: string; setSignatureType: (v: string) => void;
  saturdayDelivery: boolean; setSaturdayDelivery: (v: boolean) => void;
  holdForPickup: boolean; setHoldForPickup: (v: boolean) => void;
  references: { name: string; value: string }[]; setReferences: (v: { name: string; value: string }[]) => void;

  handleSaveDraft: () => void;
  handleGetQuote: () => void;
  quoteLoading: boolean;
}) {
  const {
    router, shipper, recipient, updateShipper, updateRecipient, swapAddresses, isInternational,
    saveShipperToBook, setSaveShipperToBook, saveRecipientToBook, setSaveRecipientToBook, notifyRecipient, setNotifyRecipient,
    packages, setPackages, packagingType, setPackagingType, dimUnit, setDimUnit, weightUnit, setWeightUnit,
    addPkg, sameAsAbove, allTheSame, removePkg, updatePkg,
    products, updateProduct, addProduct, removeProduct, productTotal, invoiceTotal,
    taxType, setTaxType, taxId, setTaxId, invoiceCurrency, setInvoiceCurrency,
    pickupMethod, setPickupMethod, pickupDate, setPickupDate, pickupLocation, setPickupLocation,
    pickupInstructions, setPickupInstructions, readyHour, setReadyHour, readyMin, setReadyMin,
    closeHour, setCloseHour, closeMin, setCloseMin, savePickupPref, setSavePickupPref, signatureType, setSignatureType,
    saturdayDelivery, setSaturdayDelivery, holdForPickup, setHoldForPickup, references, setReferences,
    handleSaveDraft, handleGetQuote, quoteLoading,
  } = props;

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h1 className="text-lg font-semibold text-gray-700">Provide Complete Details To Get A Quote</h1>
        <button onClick={() => router.push('/quote')} className="text-xs text-brand-navy hover:underline self-start sm:self-auto">Switch to Quick Quote ↗</button>
      </div>

      {/* Address panels side by side */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch gap-0 relative">
          <AddressPanel title="Shipping From" color="red" address={shipper} onChange={updateShipper} typeLabel="Shipper Type"
            saveToBook={saveShipperToBook} onSaveToBookChange={setSaveShipperToBook} />
          {/* Swap button */}
          <div className="flex items-center justify-center py-2 md:pt-12 md:px-2 flex-shrink-0">
            <button
              onClick={swapAddresses}
              title="Swap addresses"
              className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-400 hover:border-brand-orange hover:text-brand-orange transition-all shadow-sm"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 rotate-90 md:rotate-0" />
            </button>
          </div>
          <AddressPanel title="Shipping To" color="blue" address={recipient} onChange={updateRecipient} typeLabel="Consignee Type"
            saveToBook={saveRecipientToBook} onSaveToBookChange={setSaveRecipientToBook}
            confirmEmail={notifyRecipient} onConfirmEmailChange={setNotifyRecipient} />
        </div>
      </div>

      {/* Package Details */}
      {/* No overflow-hidden here: the header dropdowns open past the card's edge */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50/60 rounded-t-lg">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-brand-orange/10 text-brand-orange flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4" />
            </span>
            <span className="font-semibold text-gray-700 text-sm">Package Details</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {packagingType !== 'Envelope' && (
              <div className="flex items-center gap-2">
                <span className={hdrLbl}>Select Unit</span>
                <Dropdown label="Select unit" className="w-28" options={UNIT_OPTIONS} value={dimUnit} onChange={u => {
                  setDimUnit(u); setWeightUnit(u === 'cm' ? 'kg' : 'lbs');
                }} />
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className={hdrLbl}>Packaging Type</span>
              <Dropdown label="Packaging type" className="w-36" options={PACKAGING_OPTIONS} value={packagingType} onChange={setPackagingType} />
            </div>
            <div className="flex items-center gap-2">
              <span className={hdrLbl}>Quantity</span>
              <Dropdown label="Quantity" className="w-20" options={QTY_OPTIONS} value={packages.length} onChange={n => {
                if (n > packages.length) for (let i = packages.length; i < n; i++) addPkg();
                else setPackages(p => p.slice(0, n));
              }} />
            </div>
          </div>
        </div>

        {packagingType === 'Envelope' ? (
          <div className="px-4 py-4 text-sm text-gray-600">
            Envelope can only contain documents weighing upto 0.45kg or 1lb. If you are shipping non-documents, please change packaging type to "My Packaging"
          </div>
        ) : (
        <div className="p-4 overflow-x-auto">
          {/* Table header (desktop) */}
          <div className={`hidden md:grid ${pkgGrid} mb-2`}>
            <span className="text-xs text-gray-400" />
            <span className="text-xs text-gray-400">Dimensions L × W × H ({dimUnit})</span>
            <span className="text-xs text-gray-400" />
            <span className="text-xs text-gray-400" />
            <span className="text-xs text-gray-400">Weight ({weightUnit})</span>
            <span className="text-xs text-gray-400">Vol. Weight ({weightUnit})</span>
            <span className="text-xs text-gray-400">Insurance Val ($)</span>
            <span className="text-xs text-gray-400">Special Handling</span>
            <span className="text-xs text-gray-400">Description</span>
            <span className="text-xs text-gray-400" />
          </div>

          {/* Package rows (desktop grid) */}
          <div className="hidden md:block space-y-2">
            {packages.map((pkg, idx) => {
              const volWeight = volumetricWeight(pkg.length, pkg.width, pkg.height, dimUnit);
              return (
              <div key={pkg.id} className={`grid ${pkgGrid} items-center`}>
                <span className="text-xs text-gray-400 font-mono">{String(idx + 1).padStart(2, '0')}.</span>
                <input type="number" value={pkg.length} onChange={e => updatePkg(pkg.id, 'length', e.target.value)} placeholder="L" min="0.01" step="0.01" className={`${inp} text-center`} />
                <input type="number" value={pkg.width} onChange={e => updatePkg(pkg.id, 'width', e.target.value)} placeholder="W" min="0.01" step="0.01" className={`${inp} text-center`} />
                <input type="number" value={pkg.height} onChange={e => updatePkg(pkg.id, 'height', e.target.value)} placeholder="H" min="0.01" step="0.01" className={`${inp} text-center`} />
                <input type="number" value={pkg.weight} onChange={e => updatePkg(pkg.id, 'weight', e.target.value)} placeholder="1" min="0.01" step="0.01" className={`${inp} text-center`} required={idx === 0} />
                <span className="text-sm text-gray-500 text-center">{volWeight > 0 ? volWeight.toFixed(2) : '—'}</span>
                <input type="number" value={pkg.insuranceAmount} onChange={e => updatePkg(pkg.id, 'insuranceAmount', e.target.value)} placeholder="0.00" min="0" step="0.01" className={`${inp} text-center`} />
                <select value={pkg.specialHandling ? 'yes' : 'no'} onChange={e => updatePkg(pkg.id, 'specialHandling', e.target.value === 'yes')} className={inp}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
                <input type="text" value={pkg.description} onChange={e => updatePkg(pkg.id, 'description', e.target.value)} placeholder="Description" className={inp} />
                <div className="flex items-center gap-1">
                  <button type="button" onClick={addPkg} title="Add row" className="p-1 text-gray-400 hover:text-brand-navy transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => sameAsAbove(pkg.id)} disabled={idx === 0} title="Same as Above" className="p-1 text-gray-400 hover:text-brand-navy disabled:opacity-40 disabled:hover:text-gray-400 disabled:cursor-not-allowed transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => allTheSame(pkg.id)} title="All the Same" className="p-1 text-gray-400 hover:text-brand-navy transition-colors">
                    <CopyPlus className="w-3.5 h-3.5" />
                  </button>
                  {packages.length > 1 && (
                    <button type="button" onClick={() => removePkg(pkg.id)} title="Remove" className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              );
            })}
          </div>

          {/* Package cards (mobile) */}
          <div className="md:hidden space-y-3">
            {packages.map((pkg, idx) => {
              const volWeight = volumetricWeight(pkg.length, pkg.width, pkg.height, dimUnit);
              return (
              <div key={pkg.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono">Package {String(idx + 1).padStart(2, '0')}</span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={addPkg} title="Add row" className="p-1 text-gray-400 hover:text-brand-navy transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => sameAsAbove(pkg.id)} disabled={idx === 0} title="Same as Above" className="p-1 text-gray-400 hover:text-brand-navy disabled:opacity-40 disabled:hover:text-gray-400 disabled:cursor-not-allowed transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => allTheSame(pkg.id)} title="All the Same" className="p-1 text-gray-400 hover:text-brand-navy transition-colors">
                      <CopyPlus className="w-3.5 h-3.5" />
                    </button>
                    {packages.length > 1 && (
                      <button type="button" onClick={() => removePkg(pkg.id)} title="Remove" className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-0.5">L ({dimUnit})</label>
                    <input type="number" value={pkg.length} onChange={e => updatePkg(pkg.id, 'length', e.target.value)} min="0.01" step="0.01" className={`${inp} text-center`} />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-0.5">W ({dimUnit})</label>
                    <input type="number" value={pkg.width} onChange={e => updatePkg(pkg.id, 'width', e.target.value)} min="0.01" step="0.01" className={`${inp} text-center`} />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-0.5">H ({dimUnit})</label>
                    <input type="number" value={pkg.height} onChange={e => updatePkg(pkg.id, 'height', e.target.value)} min="0.01" step="0.01" className={`${inp} text-center`} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-0.5">Weight ({weightUnit})</label>
                    <input type="number" value={pkg.weight} onChange={e => updatePkg(pkg.id, 'weight', e.target.value)} min="0.01" step="0.01" className={`${inp} text-center`} required={idx === 0} />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-0.5">Vol. Weight ({weightUnit})</label>
                    <div className={`${inp} text-center text-gray-500`}>{volWeight > 0 ? volWeight.toFixed(2) : '—'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-0.5">Insurance Val ($)</label>
                    <input type="number" value={pkg.insuranceAmount} onChange={e => updatePkg(pkg.id, 'insuranceAmount', e.target.value)} min="0" step="0.01" className={`${inp} text-center`} />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-0.5">Special Handling</label>
                    <select value={pkg.specialHandling ? 'yes' : 'no'} onChange={e => updatePkg(pkg.id, 'specialHandling', e.target.value === 'yes')} className={inp}>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 block mb-0.5">Description</label>
                  <input type="text" value={pkg.description} onChange={e => updatePkg(pkg.id, 'description', e.target.value)} placeholder="Description" className={`${inp} w-full`} />
                </div>
              </div>
              );
            })}
          </div>
        </div>
        )}
      </div>

      {packagingType === 'Pallet' && <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
        {packages.map((pkg, index) => <label key={pkg.id} className="flex items-center gap-3 text-sm">Pallet {index + 1} freight class
          <select className={inp} value={pkg.freightClass || ''} onChange={e => updatePkg(pkg.id, 'freightClass', e.target.value)} required>
            <option value="">Select freight class</option>
            {FREIGHT_CLASSES.map(value => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>)}
      </div>}

      {/* Product Information (customs invoice) — only needed when shipping between different countries */}
      {packagingType !== 'Envelope' && isInternational && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50/60 rounded-t-lg">
            <span className="w-8 h-8 rounded-lg bg-brand-orange/10 text-brand-orange flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-4 h-4" />
            </span>
            <span className="font-semibold text-gray-700 text-sm">Product Information</span>
          </div>

          <div className="p-4 overflow-x-auto">
            {/* Table header (desktop) */}
            <div className={`hidden md:grid ${productGrid} mb-2 px-1`}>
              <span />
              <span className="text-xs font-medium text-gray-500 text-center">Quantity{req}</span>
              <span className="text-xs font-medium text-gray-500">Description{req}</span>
              <span className="text-xs font-medium text-brand-navy underline cursor-pointer">HS Code{req}</span>
              <span className="text-xs font-medium text-gray-500">Made In{req}</span>
              <span className="text-xs font-medium text-gray-500 text-center">CUSMA?</span>
              <span className="text-xs font-medium text-gray-500 text-center">Unit Price${req}</span>
              <span className="text-xs font-medium text-gray-500 text-center">Total$</span>
              <span />
            </div>

            <div className="hidden md:block space-y-2">
              {products.map((p, idx) => (
                <div key={p.id} className={`grid ${productGrid} items-center rounded-md px-1 py-1 hover:bg-gray-50/80 transition-colors`}>
                  <span className="text-xs text-gray-400 font-mono">{String(idx + 1).padStart(2, '0')}.</span>
                  <input type="number" value={p.quantity} onChange={e => updateProduct(p.id, 'quantity', e.target.value)} min="1" step="1" className={`${inp} text-center`} />
                  <input type="text" value={p.description} onChange={e => updateProduct(p.id, 'description', e.target.value)} placeholder="Description" className={inp} />
                  <input type="text" value={p.hsCode} onChange={e => updateProduct(p.id, 'hsCode', e.target.value)} placeholder="HS Code" className={inp} />
                  <select value={p.madeIn} onChange={e => updateProduct(p.id, 'madeIn', e.target.value)} className={inp}>
                    <option value="">Select</option>
                    {ALL_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                  <input type="checkbox" checked={p.cusma} disabled={!CUSMA_COUNTRIES.includes(p.madeIn)}
                    title={CUSMA_COUNTRIES.includes(p.madeIn) ? undefined : 'CUSMA only applies to goods Made In the US, Canada or Mexico'}
                    onChange={e => updateProduct(p.id, 'cusma', e.target.checked)} className="w-4 h-4 accent-brand-navy justify-self-center disabled:opacity-40 disabled:cursor-not-allowed" />
                  <input type="number" value={p.unitPrice} onChange={e => updateProduct(p.id, 'unitPrice', e.target.value)} min="0" step="0.01" className={`${inp} text-center`} />
                  <span className="text-sm text-gray-600 text-center">{productTotal(p).toFixed(2)}</span>
                  <div className="flex items-center gap-1 justify-end">
                    {idx === products.length - 1 && (
                      <button type="button" onClick={addProduct} title="Add row" className="p-1 text-gray-400 hover:text-brand-navy transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {products.length > 1 && (
                      <button type="button" onClick={() => removeProduct(p.id)} title="Remove" className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Product cards (mobile) */}
            <div className="md:hidden space-y-3">
              {products.map((p, idx) => (
                <div key={p.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono">Product {String(idx + 1).padStart(2, '0')}</span>
                    <div className="flex items-center gap-1">
                      {idx === products.length - 1 && (
                        <button type="button" onClick={addProduct} title="Add row" className="p-1 text-gray-400 hover:text-brand-navy transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {products.length > 1 && (
                        <button type="button" onClick={() => removeProduct(p.id)} title="Remove" className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-0.5">Quantity{req}</label>
                      <input type="number" value={p.quantity} onChange={e => updateProduct(p.id, 'quantity', e.target.value)} min="1" step="1" className={`${inp} text-center`} />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-0.5">HS Code{req}</label>
                      <input type="text" value={p.hsCode} onChange={e => updateProduct(p.id, 'hsCode', e.target.value)} placeholder="HS Code" className={inp} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-0.5">Description{req}</label>
                    <input type="text" value={p.description} onChange={e => updateProduct(p.id, 'description', e.target.value)} placeholder="Description" className={`${inp} w-full`} />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-0.5">Made In{req}</label>
                    <select value={p.madeIn} onChange={e => updateProduct(p.id, 'madeIn', e.target.value)} className={`${inp} w-full`}>
                      <option value="">Select</option>
                      {ALL_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                  </div>
                  <label className={`flex items-center gap-2 text-xs text-gray-500 select-none ${CUSMA_COUNTRIES.includes(p.madeIn) ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}`}
                    title={CUSMA_COUNTRIES.includes(p.madeIn) ? undefined : 'CUSMA only applies to goods Made In the US, Canada or Mexico'}>
                    <input type="checkbox" checked={p.cusma} disabled={!CUSMA_COUNTRIES.includes(p.madeIn)} onChange={e => updateProduct(p.id, 'cusma', e.target.checked)} className="accent-brand-navy" /> CUSMA?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-0.5">Unit Price${req}</label>
                      <input type="number" value={p.unitPrice} onChange={e => updateProduct(p.id, 'unitPrice', e.target.value)} min="0" step="0.01" className={`${inp} text-center`} />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-0.5">Total$</label>
                      <div className={`${inp} text-center text-gray-500`}>{productTotal(p).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tax ID + total */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-600">Tax Type:</label>
                  <select value={taxType} onChange={e => setTaxType(e.target.value)} className={`${inp} w-36`}>
                    {TAX_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  {taxType && (
                    <input type="text" value={taxId} onChange={e => setTaxId(e.target.value)} placeholder="Tax ID" className={`${inp} w-36`} />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50/80 border border-gray-100 rounded-lg px-3 py-1.5">
                <span className="text-sm font-semibold text-gray-700">Total value:</span>
                <span className="text-sm font-semibold text-brand-navy">{invoiceTotal.toFixed(2)}</span>
                <select value={invoiceCurrency} onChange={e => setInvoiceCurrency(e.target.value as 'CAD' | 'USD')} className={`${inp} w-20`}>
                  <option value="CAD">CAD</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Pick Up Date</label>
                  <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} className={inp} min={new Date().toISOString().split('T')[0]} />
                </div>
                {pickupMethod === 'schedule_pickup' && (
                  <div>
                    <label className={lbl}>Pickup Location</label>
                    <select value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} className={inp}>
                      {PICKUP_LOCS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {pickupMethod === 'schedule_pickup' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}>Earliest Time Ready</label>
                      <div className="grid grid-cols-2 gap-1">
                        <select value={readyHour} onChange={e => setReadyHour(e.target.value)} className={inp}>
                          {HOURS.map(h => <option key={h}>{h}</option>)}
                        </select>
                        <select value={readyMin} onChange={e => setReadyMin(e.target.value)} className={inp}>
                          {MINS.map(m => <option key={m}>{m}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Latest Time Ready</label>
                      <div className="grid grid-cols-2 gap-1">
                        <select value={closeHour} onChange={e => setCloseHour(e.target.value)} className={inp}>
                          {HOURS.map(h => <option key={h}>{h}</option>)}
                        </select>
                        <select value={closeMin} onChange={e => setCloseMin(e.target.value)} className={inp}>
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
                    <input type="checkbox" checked={savePickupPref} onChange={e => setSavePickupPref(e.target.checked)} className="accent-brand-navy" />
                    Save Pickup Preference (in this browser, when the shipment is booked)
                  </label>
                </>
              )}
            </div>

            {/* Right: References + signature + saturday + hold */}
            <div className="space-y-3">
              {/* References */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">References</label>
                <div className="space-y-2">
                  {references.map((ref, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2">
                      <input type="text" value={ref.name} onChange={e => { const r = [...references]; r[i] = { ...r[i], name: e.target.value }; setReferences(r); }} placeholder="Reference name" className={`${inp} flex-1 bg-white`} />
                      <input type="text" value={ref.value} onChange={e => { const r = [...references]; r[i] = { ...r[i], value: e.target.value }; setReferences(r); }} placeholder="Value" className={`${inp} flex-1 bg-white`} />
                      <button
                        type="button"
                        onClick={() => setReferences(references.filter((_, idx) => idx !== i))}
                        title="Remove reference"
                        disabled={references.length <= 1}
                        className="p-1.5 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-400 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                {references.length < 3 && (
                  <button
                    type="button"
                    onClick={() => setReferences([...references, { name: '', value: '' }])}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-navy hover:text-brand-orange transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Reference
                  </button>
                )}
              </div>

              {/* Signature */}
              <div>
                <label className={lbl}>Signature Type</label>
                <select value={signatureType} onChange={e => setSignatureType(e.target.value)} className={inp}>
                  <option value="none">Choose an Option for Signature</option>
                  <option value="not_required">Signature Not Required</option>
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
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-gray-500">
          Select <button onClick={handleGetQuote} className="text-brand-orange font-semibold hover:underline">Get Quote</button> to view available pricing and carrier options for the route selected
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSaveDraft}
            className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded text-gray-600 hover:border-brand-navy hover:text-brand-navy transition-all bg-white"
          >
            Save Shipment
          </button>
          <button
            onClick={handleGetQuote}
            disabled={quoteLoading}
            className="px-6 py-2 text-sm font-semibold rounded text-white bg-brand-navy hover:bg-brand-navy/90 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {quoteLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Getting Rates...</> : 'Get Quote'}
          </button>
        </div>
      </div>
    </div>
  );
}
