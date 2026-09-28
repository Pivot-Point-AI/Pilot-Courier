// Logos arrive at wildly different aspect ratios — a square mark like Canada
// Post next to a 8:1 lockup like USPS. Sizing them all to "fit the box" makes
// the wide ones look shrunken, so each logo is capped by the preset that suits
// its shape and the wells stay identical instead.
type Fit = 'mark' | 'wordmark' | 'wide';

const FIT: Record<Fit, { maxW: number; maxH: number }> = {
  mark:     { maxW: 88, maxH: 88 },  // square-ish: driven by height
  wordmark: { maxW: 96, maxH: 72 },  // horizontal lockup: driven by width
  wide:     { maxW: 100, maxH: 64 }, // very wide lockup: needs the extra width
};

type CarrierDef = {
  key: string;
  label: string;
  match: RegExp;
  logo?: string;
  fit?: Fit;
  maxW?: number;
  maxH?: number;
  color?: string;
};

// netParcel returns the carrier inside the service name ("Canada Post Expedited
// Parcel", "Canpar Ground"), and the API only keeps its first word, so both
// arrive as "Canada"/"Canpar". Match on carrier + service together and keep the
// specific names ahead of the ones they share a prefix with.
const CARRIERS: CarrierDef[] = [
  { key: 'canadapost', label: 'Canada Post', match: /canada\s*post/i, logo: '/carriers/canadapost.svg', fit: 'mark' },
  { key: 'canpar',     label: 'Canpar',      match: /canpar/i,        logo: '/carriers/canpar.png',     fit: 'wordmark' },
  { key: 'purolator',  label: 'Purolator',   match: /purolator/i,     logo: '/carriers/purolator.svg',  fit: 'wordmark', maxW: 100 },
  { key: 'fedex',      label: 'FedEx',       match: /fed\s*ex/i,      logo: '/carriers/fedex.svg',      fit: 'wordmark' },
  { key: 'ups',        label: 'UPS',         match: /\bups\b/i,       logo: '/carriers/ups.svg',        fit: 'mark' },
  { key: 'dhl',        label: 'DHL',         match: /\bdhl\b/i,       logo: '/carriers/dhl.svg',        fit: 'wordmark' },
  { key: 'usps',       label: 'USPS',        match: /\busps\b/i,      logo: '/carriers/usps.svg',       fit: 'wide' },
  { key: 'ics',        label: 'ICS',         match: /\bics\b/i,       logo: '/carriers/ics.png',        fit: 'mark' },
  // No asset on file yet — these render as a wordmark tile in the carrier's
  // colour. Drop an image in /public/carriers and add `logo` + `fit` to switch.
  { key: 'loomis',     label: 'Loomis',      match: /loomis/i,                color: '#C2410C' },
  { key: 'gls',        label: 'GLS',         match: /\bgls\b/i,               color: '#1B2B6B' },
  { key: 'asendia',    label: 'Asendia',     match: /asendia/i,               color: '#E4002B' },
  { key: 'dayandross', label: 'Day & Ross',  match: /day\s*(and|&)?\s*ross/i, color: '#B45309' },
  { key: 'polaris',    label: 'Polaris',     match: /polaris/i,               color: '#0F766E' },
  { key: 'koorier',    label: 'Koorier',     match: /koorier/i,               color: '#7C3AED' },
  { key: 'netparcel',  label: 'netParcel',   match: /net\s*parcel/i,          color: '#1B2B6B' },
];

export function resolveCarrier(carrier?: string, service?: string): CarrierDef {
  const haystack = `${carrier || ''} ${service || ''}`.trim();
  return (
    CARRIERS.find(c => c.match.test(haystack)) || {
      key: 'other',
      label: (carrier || service || 'Carrier').split(' ').slice(0, 2).join(' '),
      match: /$^/,
      color: '#4B5563',
    }
  );
}

/**
 * Carrier badge for rate rows and shipment lists. The logo sits directly on the
 * surface — a bordered well around it just reads as an empty image placeholder —
 * with a fixed-width slot so the service names still line up down the column.
 */
export default function CarrierLogo({
  carrier,
  service,
  className = 'w-24 h-10',
}: {
  carrier?: string;
  service?: string;
  className?: string;
}) {
  const c = resolveCarrier(carrier, service);
  const preset = FIT[c.fit || 'wordmark'];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg overflow-hidden flex-shrink-0 ${className}`}
      title={c.label}
    >
      {c.logo ? (
        <img
          src={c.logo}
          alt={c.label}
          draggable={false}
          className="object-contain select-none"
          style={{ maxWidth: `${c.maxW ?? preset.maxW}%`, maxHeight: `${c.maxH ?? preset.maxH}%` }}
        />
      ) : (
        <span
          className="flex items-center justify-center w-full h-full px-1 text-white font-bold leading-none tracking-tight text-center"
          style={{ backgroundColor: c.color, fontSize: c.label.length <= 4 ? 14 : c.label.length <= 7 ? 12 : 10 }}
        >
          {c.label}
        </span>
      )}
    </span>
  );
}
