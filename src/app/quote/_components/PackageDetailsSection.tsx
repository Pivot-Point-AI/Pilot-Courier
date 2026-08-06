'use client';
import { Plus, Copy, Trash2 } from 'lucide-react';
import { PACKAGING_TYPES, FREIGHT_CLASSES } from '../_lib/constants';
import type { PackageRow } from '../_lib/types';
import { newPkg } from '../_lib/types';

export function PackageDetailsSection({
  packagingType, setPackagingType,
  packages, setPackages,
  weightUnit, dimensionUnit, setForm,
  updatePkg, addPkg, dupPkg, removePkg,
}: {
  packagingType: string; setPackagingType: (v: string) => void;
  packages: PackageRow[]; setPackages: React.Dispatch<React.SetStateAction<PackageRow[]>>;
  weightUnit: 'lbs' | 'kg'; dimensionUnit: 'in' | 'cm';
  setForm: React.Dispatch<React.SetStateAction<any>>;
  updatePkg: (id: string, field: keyof PackageRow, value: any) => void;
  addPkg: () => void; dupPkg: (pkg: PackageRow) => void; removePkg: (id: string) => void;
}) {
  const isEnvelope = packagingType === 'Envelope';
  const isPak = packagingType === 'Pak';
  const isPallet = packagingType === 'Pallet';
  const hideDims = isEnvelope || isPak;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
      <div className="flex flex-col md:grid md:grid-cols-[auto_1fr_auto] items-start md:items-center gap-3 md:gap-4 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-100 text-purple-700 shrink-0">
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </span>
          <span className="font-bold text-[#1B2B6B] text-sm">Package Details</span>
        </div>
        <div className="flex items-center justify-start md:justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 font-medium">Packaging Type</label>
            <select value={packagingType} onChange={e => {
              const val = e.target.value;
              setPackagingType(val);
              if (val === 'Envelope' || val === 'Pak') setPackages([newPkg()]);
            }}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-gray-50/60 transition-colors">
              {PACKAGING_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex items-center bg-gray-100 rounded-full p-0.5">
            {(['I', 'M'] as const).map(u => (
              <button key={u} type="button"
                onClick={() => setForm((p: any) => ({ ...p, weightUnit: u === 'I' ? 'lbs' : 'kg', dimensionUnit: u === 'I' ? 'in' : 'cm' }))}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  (u === 'I' ? weightUnit === 'lbs' : weightUnit === 'kg')
                    ? 'bg-[#1B2B6B] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {u === 'I' ? 'Imperial' : 'Metric'}
              </button>
            ))}
          </div>
        </div>
        <div className="hidden md:block" />
      </div>

      {isPak && (
        <div className="px-6 py-4">
          <label className="text-xs font-semibold text-gray-500 block mb-1.5">Weight ({weightUnit})</label>
          <input type="number" value={packages[0]?.weight ?? ''}
            onChange={e => updatePkg(packages[0].id, 'weight', e.target.value)}
            placeholder={weightUnit === 'lbs' ? 'Lbs' : 'Kg'} min="0.1" step="0.1" required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors" />
        </div>
      )}

      {!hideDims && <div className="px-6 py-4 md:overflow-x-auto">
        {/* Header (desktop) */}
        <div className="hidden md:grid gap-2 mb-2 min-w-[800px]"
          style={{ gridTemplateColumns: hideDims ? '2rem 1fr 6rem 1fr 4.5rem' : `2rem 1fr 1fr 1fr 1fr 1fr${isPallet ? ' 5rem' : ''} 1fr 6rem 1fr 4.5rem` }}>
          <span className="text-xs font-semibold text-gray-400 text-center">#</span>
          {!hideDims && <span className="text-xs font-semibold text-gray-500 text-center">L ({dimensionUnit})</span>}
          {!hideDims && <span className="text-xs font-semibold text-gray-500 text-center">W ({dimensionUnit})</span>}
          {!hideDims && <span className="text-xs font-semibold text-gray-500 text-center">H ({dimensionUnit})</span>}
          <span className="text-xs font-semibold text-gray-500 text-center">Weight ({weightUnit})</span>
          {!hideDims && <span className="text-xs font-semibold text-gray-500 text-center">Vol. Weight ({weightUnit})</span>}
          {isPallet && <span className="text-xs font-semibold text-gray-500 text-center">Freight Class</span>}
          <span className="text-xs font-semibold text-gray-500 text-center">Insurance ($)</span>
          <span className="text-xs font-semibold text-gray-500 text-center">Signature</span>
          <span className="text-xs font-semibold text-gray-500 text-center">Description</span>
          <span />
        </div>

        {/* Rows (desktop grid) */}
        <div className="hidden md:block space-y-2 min-w-[800px]">
          {packages.map((pkg, idx) => {
            const divisor = dimensionUnit === 'cm' ? 5000 : 166;
            const volWeight = (Number(pkg.length) || 0) * (Number(pkg.width) || 0) * (Number(pkg.height) || 0) / divisor;
            return (
            <div key={pkg.id} className="grid gap-2 items-center bg-gray-50/70 rounded-xl px-2 py-2.5 border border-gray-100"
              style={{ gridTemplateColumns: hideDims ? '2rem 1fr 6rem 1fr 4.5rem' : `2rem 1fr 1fr 1fr 1fr 1fr${isPallet ? ' 5rem' : ''} 1fr 6rem 1fr 4.5rem` }}>
              <span className="flex items-center justify-center w-5 h-5 mx-auto rounded-full bg-white text-gray-400 text-[10px] font-bold">{idx + 1}</span>
              {(hideDims ? (['weight'] as const) : (['length','width','height','weight'] as const)).map(f => (
                <input key={f} type="number" value={pkg[f]}
                  onChange={e => updatePkg(pkg.id, f, e.target.value)}
                  placeholder={f[0].toUpperCase()} min="1" step="0.1"
                  required={idx === 0}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors text-center" />
              ))}
              {!hideDims && <span className="text-sm text-gray-500 text-center">{volWeight > 0 ? volWeight.toFixed(2) : '—'}</span>}
              {isPallet && (
                <select value={pkg.freightClass}
                  onChange={e => updatePkg(pkg.id, 'freightClass', e.target.value)}
                  required={idx === 0}
                  className="border border-gray-200 rounded-lg px-1 py-1.5 text-sm focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors text-center">
                  <option value="">Select</option>
                  {FREIGHT_CLASSES.map(fc => <option key={fc} value={fc}>{fc}</option>)}
                </select>
              )}
              <input type="number" value={pkg.insuranceAmount}
                onChange={e => updatePkg(pkg.id, 'insuranceAmount', e.target.value)}
                placeholder="0.00" min="0" step="0.01"
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors text-center" />
              <select value={pkg.specialHandling ? 'Yes' : 'No'}
                onChange={e => updatePkg(pkg.id, 'specialHandling', e.target.value === 'Yes')}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors text-center">
                <option>No</option>
                <option>Yes</option>
              </select>
              <input type="text" value={pkg.description}
                onChange={e => updatePkg(pkg.id, 'description', e.target.value)}
                placeholder="Description"
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors" />
              <div className="flex items-center gap-0.5">
                <button type="button" title="Add" onClick={addPkg}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#1B2B6B] hover:bg-white transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button type="button" title="Duplicate" onClick={() => dupPkg(pkg)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#1B2B6B] hover:bg-white transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {packages.length > 1 && (
                  <button type="button" title="Remove" onClick={() => removePkg(pkg.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            );
          })}
        </div>

        {/* Cards (mobile) */}
        <div className="md:hidden space-y-3">
          {packages.map((pkg, idx) => {
            const divisor = dimensionUnit === 'cm' ? 5000 : 166;
            const volWeight = (Number(pkg.length) || 0) * (Number(pkg.width) || 0) * (Number(pkg.height) || 0) / divisor;
            return (
            <div key={pkg.id} className="bg-gray-50/70 rounded-xl p-3 border border-gray-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-gray-400 text-[10px] font-bold">{idx + 1}</span>
                <div className="flex items-center gap-0.5">
                  <button type="button" title="Add" onClick={addPkg}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#1B2B6B] hover:bg-white transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" title="Duplicate" onClick={() => dupPkg(pkg)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#1B2B6B] hover:bg-white transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {packages.length > 1 && (
                    <button type="button" title="Remove" onClick={() => removePkg(pkg.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className={hideDims ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-4 gap-2'}>
                {(hideDims ? (['weight'] as const) : (['length','width','height','weight'] as const)).map(f => (
                  <div key={f}>
                    <label className="text-[11px] text-gray-400 block mb-0.5">
                      {f === 'weight' ? `Weight (${weightUnit})` : `${f[0].toUpperCase()} (${dimensionUnit})`}
                    </label>
                    <input type="number" value={pkg[f]}
                      onChange={e => updatePkg(pkg.id, f, e.target.value)}
                      min="1" step="0.1" required={f === 'weight' && idx === 0}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors text-center" />
                  </div>
                ))}
              </div>
              {!hideDims && (
                <div>
                  <label className="text-[11px] text-gray-400 block mb-0.5">Vol. Weight ({weightUnit})</label>
                  <div className="border border-gray-200 rounded px-2 py-1.5 text-sm w-full text-center text-gray-500 bg-white">{volWeight > 0 ? volWeight.toFixed(2) : '—'}</div>
                </div>
              )}
              {isPallet && (
                <div>
                  <label className="text-[11px] text-gray-400 block mb-0.5">Freight Class</label>
                  <select value={pkg.freightClass}
                    onChange={e => updatePkg(pkg.id, 'freightClass', e.target.value)}
                    required={idx === 0}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors text-center">
                    <option value="">Select</option>
                    {FREIGHT_CLASSES.map(fc => <option key={fc} value={fc}>{fc}</option>)}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-gray-400 block mb-0.5">Insurance ($)</label>
                  <input type="number" value={pkg.insuranceAmount}
                    onChange={e => updatePkg(pkg.id, 'insuranceAmount', e.target.value)}
                    min="0" step="0.01"
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors text-center" />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 block mb-0.5">Signature</label>
                  <select value={pkg.specialHandling ? 'Yes' : 'No'}
                    onChange={e => updatePkg(pkg.id, 'specialHandling', e.target.value === 'Yes')}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors text-center">
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-gray-400 block mb-0.5">Description</label>
                <input type="text" value={pkg.description}
                  onChange={e => updatePkg(pkg.id, 'description', e.target.value)}
                  placeholder="Description"
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:border-[#1B2B6B] focus:ring-2 focus:ring-[#1B2B6B]/10 bg-white transition-colors" />
              </div>
            </div>
            );
          })}
        </div>
      </div>}
    </div>
  );
}
