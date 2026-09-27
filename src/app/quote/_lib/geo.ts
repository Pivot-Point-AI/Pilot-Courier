import { API_URL } from './constants';

// ── Geo lookup helpers ────────────────────────────────────────────────────────
export async function lookupPostal(country: string, postal: string): Promise<{ city: string; province: string; approximate?: boolean; cities?: string[] } | null> {
  try {
    const r = await fetch(`${API_URL}/geo/postal?country=${country}&postal=${encodeURIComponent(postal)}`);
    const data = await r.json();
    return data || null;
  } catch { return null; }
}

export async function fetchProvinces(country: string): Promise<{ label: string; value: string }[]> {
  try {
    const r = await fetch(`${API_URL}/geo/provinces?country=${country}`);
    const data = await r.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}
