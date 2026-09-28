import type { Address } from '@/lib/api';
import type { PkgRow, ProductRow } from './types';

// Booking drafts and pickup preferences are kept in this browser, keyed per user so
// accounts sharing a computer never see each other's data. Storage can be unavailable
// (private mode, blocked site data), so every access is guarded.
export const draftKey = (userId: string) => `pc_booking_draft:${userId}`;
export const pickupPrefKey = (userId: string) => `pc_pickup_preference:${userId}`;

// Bump when the draft shape changes; drafts from another version are not offered.
export const DRAFT_VERSION = 1;

export interface BookingDraft {
  version: number;
  savedAt: string;
  shipper: Address; recipient: Address;
  saveShipperToBook: boolean; saveRecipientToBook: boolean; notifyRecipient: boolean;
  packages: PkgRow[]; packagingType: string; weightUnit: 'lbs' | 'kg'; dimUnit: 'in' | 'cm';
  products: ProductRow[]; taxType: string; taxId: string; invoiceCurrency: 'CAD' | 'USD';
  pickupMethod: 'schedule_pickup' | 'drop_off'; pickupLocation: string; pickupInstructions: string;
  readyHour: string; readyMin: string; closeHour: string; closeMin: string;
  signatureType: string; saturdayDelivery: boolean; holdForPickup: boolean;
  references: { name: string; value: string }[];
}

export interface PickupPreference {
  location: string; instructions: string;
  readyHour: string; readyMin: string; closeHour: string; closeMin: string;
}

export function readLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeLocal(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeLocal(key: string): void {
  try { localStorage.removeItem(key); } catch {}
}
