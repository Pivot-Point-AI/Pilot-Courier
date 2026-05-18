'use client';
import { useState } from 'react';

const NETPARCEL_CARRIERS = [
  'Asendia','Canada Post','Canpar','DayAndRoss','DHL','FedEx',
  'Freight','GLS Canada','ICS','Koorier','Loomis',
  'net Parcel','netParcel','netParcel Freight','Polaris',
  'Purolator','UPS','USPS','USPS GDE',
];

const CARRIER_COLORS: Record<string, string> = {
  UPS: 'bg-yellow-600', FEDEX: 'bg-purple-700', DHL: 'bg-red-600',
  PUROLATOR: 'bg-purple-800', ICS: 'bg-blue-700', 'CANADA POST': 'bg-red-700',
  CANPAR: 'bg-orange-600', LOOMIS: 'bg-orange-700', DAYANDROOS: 'bg-yellow-700',
};

function CarrierLogo({ name }: { name: string }) {
  const key = name.toUpperCase().replace(/\s/g, '');
  const color = CARRIER_COLORS[name.toUpperCase()] || CARRIER_COLORS[key] || 'bg-gray-500';
  return (
    <span className={`inline-flex items-center justify-center px-3 py-1 rounded text-white text-xs font-bold ${color}`}>
      {name.slice(0, 8)}
    </span>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`relative w-10 h-5 rounded-full transition-colors ${on ? 'bg-green-500' : 'bg-gray-300'}`}>
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

export default function CarriersPage() {
  const [activeTab, setActiveTab] = useState<'netparcel' | 'yours'>('netparcel');
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(NETPARCEL_CARRIERS.map(c => [c, true]))
  );

  const toggle = (c: string) => setEnabled(p => ({ ...p, [c]: !p[c] }));

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Manage Carriers</h2>
        <button className="px-4 py-1.5 text-xs font-semibold rounded text-white bg-[#00529B] hover:bg-[#00529B]/90">
          Add New Carrier +
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-5">
        {[['netparcel', 'netParcel Carriers'], ['yours', 'Your Carrier Accounts']].map(([val, label]) => (
          <button key={val} onClick={() => setActiveTab(val as any)}
            className={`px-4 py-3 text-xs font-medium border-b-2 transition-all ${activeTab === val ? 'border-[#00529B] text-[#00529B]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'netparcel' && (
        <div>
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 items-center px-5 py-2 border-b border-gray-50">
            <span className="text-xs font-semibold text-gray-500">Name</span>
            <span className="text-xs font-semibold text-gray-500 w-32 text-center" />
            <span className="text-xs font-semibold text-gray-500 w-16 text-right">Active</span>
          </div>
          <div className="divide-y divide-gray-50">
            {NETPARCEL_CARRIERS.map(carrier => (
              <div key={carrier} className="grid grid-cols-[1fr_auto_auto] gap-x-6 items-center px-5 py-3 hover:bg-gray-50 transition-colors">
                <span className="text-sm text-gray-700">{carrier}</span>
                <div className="w-32 flex justify-center"><CarrierLogo name={carrier} /></div>
                <div className="w-16 flex justify-end"><Toggle on={enabled[carrier]} onChange={() => toggle(carrier)} /></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'yours' && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-400 text-sm">No personal carrier accounts connected yet.</p>
          <button className="mt-4 px-5 py-2 text-sm font-semibold rounded text-white bg-[#00529B] hover:bg-[#00529B]/90">
            Add Carrier Account +
          </button>
        </div>
      )}
    </div>
  );
}
