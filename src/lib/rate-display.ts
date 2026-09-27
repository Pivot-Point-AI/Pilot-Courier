import type { Rate } from './api';

// Also normalize saved quotes so badges from older API responses cannot imply
// that a dollar amount in one currency is cheaper than another currency.
export function prepareRates(rates: Rate[]): Rate[] {
  rates = rates.map(rate => ({ ...rate, currency: (rate.currency || 'CAD').trim().toUpperCase() }));
  const fastestDays = Math.min(...rates.map(r => r.transitDays));
  const currencies = [...new Set(rates.map(r => r.currency))].sort();
  return currencies.flatMap(currency => {
    const group = rates.filter(r => r.currency === currency).sort((a, b) => a.totalCharge - b.totalCharge);
    const best = group.reduce((a, b) => a.totalCharge / Math.max(a.transitDays, 1) < b.totalCharge / Math.max(b.transitDays, 1) ? a : b);
    return group.map((r, i) => ({ ...r, isCheapest: i === 0, isFastest: r.transitDays === fastestDays, isBestValue: r === best }));
  });
}

export function formatDeliveryDate(value: string): string {
  const day = value.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return value;
  const date = new Date(`${day}T12:00:00Z`);
  if (isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== day) return value;
  return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}
