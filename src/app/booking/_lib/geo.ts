import { API_URL } from './constants';

export async function fetchProvinces(country: string): Promise<{ label: string; value: string }[]> {
  try {
    const r = await fetch(`${API_URL}/geo/provinces?country=${country}`);
    const data = await r.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}
