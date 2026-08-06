// ── Package row ───────────────────────────────────────────────────────────────
export interface PackageRow {
  id: string; length: string; width: string; height: string;
  weight: string; insuranceAmount: string; specialHandling: boolean; description: string;
  freightClass: string;
}

export const newPkg = (): PackageRow => ({
  id: Math.random().toString(36).slice(2),
  length: '1', width: '1', height: '1', weight: '1',
  insuranceAmount: '0.00', specialHandling: false, description: '', freightClass: '',
});
