import type { Address } from '@/lib/api';

// ─── Package row ────────────────────────────────────────────────────────────
export interface PkgRow {
  id: string;
  length: string; width: string; height: string;
  weight: string;
  insuranceAmount: string;
  specialHandling: boolean;
  freightClass?: string;
  description: string;
}

export const mkPkg = (): PkgRow => ({
  id: Math.random().toString(36).slice(2),
  length: '1', width: '1', height: '1', weight: '1',
  insuranceAmount: '0.00', specialHandling: false, description: '',
});

// ─── Product row (customs invoice) ──────────────────────────────────────────
export interface ProductRow {
  id: string;
  quantity: string;
  description: string;
  hsCode: string;
  madeIn: string;
  cusma: boolean;
  section232: boolean;
  unitPrice: string;
}

export const mkProduct = (madeIn = ''): ProductRow => ({
  id: Math.random().toString(36).slice(2),
  quantity: '1', description: '', hsCode: '', madeIn,
  cusma: false, section232: false, unitPrice: '0.00',
});

export const EMPTY: Address = {
  name: '', company: '', street: '', street2: '',
  city: '', province: '', postalCode: '', country: '',
  phone: '', email: '', isResidential: false, addressType: 'consumer',
};
