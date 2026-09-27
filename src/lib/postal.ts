// Keep postal lookup eligibility consistent across the three address forms.
// Canadian FSA fallback requires a full code; other destinations can use
// three-character codes (for example Iceland and Taiwan).
export function isPostalLookupReady(country: string, postal: string): boolean {
  const compact = postal.trim().replace(/\s/g, '');
  if (!country.trim()) return false;
  return country.trim().toUpperCase() === 'CA' ? compact.length === 6 : compact.length >= 3;
}

export function isPostalFormatValid(country: string, postal: string): boolean {
  const compact = postal.trim().replace(/\s/g, '');
  switch (country.trim().toUpperCase()) {
    case 'CA': return /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/.test(compact);
    case 'US': return /^\d{5}(?:-?\d{4})?$/.test(compact);
    default: return compact.length >= 3;
  }
}
