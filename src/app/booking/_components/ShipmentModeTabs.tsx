'use client';
import { useRouter } from 'next/navigation';

const TABS = [
  { key: 'single', label: 'Single Shipment', href: '/booking', badge: null },
  { key: 'bulk', label: 'Bulk Shipping', href: '/booking/bulk', badge: 'BETA' },
] as const;

export function ShipmentModeTabs({ mode }: { mode: 'single' | 'bulk' }) {
  const router = useRouter();
  return (
    <div className="bg-brand-navy shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex gap-1">
        {TABS.map(t => {
          const active = mode === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => router.push(t.href)}
              className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-colors border-b-2 ${
                active
                  ? 'text-white border-brand-orange bg-white/5'
                  : 'text-white/55 border-transparent hover:text-white/85 hover:bg-white/5'
              }`}
            >
              {t.label}
              {t.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide leading-none ${
                    active ? 'bg-brand-orange text-white' : 'bg-white/15 text-white/70'
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
