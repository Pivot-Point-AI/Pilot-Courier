import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach auth token from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('pc_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 - clear token
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('pc_token');
      localStorage.removeItem('pc_user');
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.patch('/auth/profile', data),
  addAddress: (data: any) => api.post('/auth/addresses', data),
};

// ── Shipments ─────────────────────────────────────────────────────────────────
export const shipmentApi = {
  getRates: (data: QuoteFormData) => api.post('/shipments/rates', data),
  book: (data: any) => api.post('/shipments/book', data),
  confirmPayment: (id: string, data: { method: string; transactionId: string }) =>
    api.post(`/shipments/${id}/confirm-payment`, data),
  track: (trackingNumber: string) => api.get(`/shipments/track/${trackingNumber}`),
  cancel: (id: string, reason: string) => api.post(`/shipments/${id}/cancel`, { reason }),
  getMyShipments: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/shipments/my', { params }),
};

// ── Payments ──────────────────────────────────────────────────────────────────
export const paymentApi = {
  createStripeIntent: (shipmentId: string) =>
    api.post('/payments/stripe/intent', { shipmentId }),
  createPayPalOrder: (shipmentId: string) =>
    api.post('/payments/paypal/order', { shipmentId }),
  capturePayPalOrder: (orderId: string, shipmentId: string) =>
    api.post('/payments/paypal/capture', { orderId, shipmentId }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getShipments: (params?: any) => api.get('/admin/shipments', { params }),
  updateStatus: (id: string, status: string, note?: string) =>
    api.patch(`/admin/shipments/${id}/status`, { status, note }),
  overridePrice: (id: string, price: number, note?: string) =>
    api.patch(`/admin/shipments/${id}/price`, { price, note }),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
};

// ── Types ─────────────────────────────────────────────────────────────────────
export interface QuoteFormData {
  originPostal: string;
  destinationPostal: string;
  originCity?: string;
  destinationCity?: string;
  originProvince?: string;
  destinationProvince?: string;
  originCountry?: string;
  destinationCountry?: string;
  weight: number;
  weightUnit?: 'kg' | 'lbs';
  length: number;
  width: number;
  height: number;
  dimensionUnit?: 'cm' | 'in';
  shipmentType?: 'domestic' | 'international';
}

export interface Rate {
  carrierId: string;
  carrierName: string;
  serviceCode: string;
  serviceName: string;
  totalCharge: number;
  currency: string;
  transitDays: number;
  estimatedDelivery?: string;
  isCheapest?: boolean;
  isFastest?: boolean;
  isBestValue?: boolean;
}

export interface Address {
  name: string;
  company?: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
  email?: string;
}
