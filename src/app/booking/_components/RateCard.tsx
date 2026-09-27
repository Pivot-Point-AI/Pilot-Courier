import { formatDeliveryDate } from '@/lib/rate-display';
import type { Rate } from '@/lib/api';

export function RateCard({ rate, selected, onSelect }: { rate: Rate; selected: boolean; onSelect: () => void }) {
  const carrierColor: Record<string, string> = {
    UPS: 'bg-yellow-600', PUROLATOR: 'bg-purple-700', DHL: 'bg-red-600', FEDEX: 'bg-purple-900', ICS: 'bg-blue-700',
  };
  const initials = rate.carrierName.slice(0, 3).toUpperCase();
  const bg = carrierColor[rate.carrierName.toUpperCase()] || 'bg-gray-600';

  return (
    <label className={`flex flex-wrap sm:flex-nowrap items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${selected ? 'border-brand-orange bg-orange-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
      <input type="radio" checked={selected} onChange={onSelect} className="sr-only" />
      <div className={`w-10 h-10 rounded-lg ${bg} text-white flex items-center justify-center font-bold text-xs flex-shrink-0`}>{initials}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm">{rate.serviceName}</p>
        <p className="text-xs text-gray-400">{rate.transitDays} business day{rate.transitDays !== 1 ? 's' : ''}{rate.estimatedDelivery ? ` · Est. ${formatDeliveryDate(rate.estimatedDelivery)}` : ''}</p>
      </div>
      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end">
        <div className="flex items-center gap-2">
          {rate.isCheapest && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Cheapest in {rate.currency}</span>}
          {rate.isFastest && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Fastest</span>}
          {rate.isBestValue && !rate.isCheapest && !rate.isFastest && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Best Value in {rate.currency}</span>}
        </div>
        <p className="font-bold text-lg text-brand-navy">${rate.totalCharge.toFixed(2)} <span className="text-xs font-normal text-gray-400">{rate.currency}</span></p>
        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${selected ? 'border-brand-orange bg-brand-orange' : 'border-gray-300'}`}>
          {selected && <div className="w-2.5 h-2.5 bg-white rounded-full m-auto mt-0.5" />}
        </div>
      </div>
    </label>
  );
}
