'use client';
import { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export function StripePaymentForm({ amount, currency, onSuccess, onBack }: {
  amount: number; currency: string;
  onSuccess: (transactionId: string) => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });
    setPaying(false);
    if (error) {
      toast.error(error.message || 'Payment failed. Please try again.');
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700 text-sm">Payment Details</h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Lock className="w-3 h-3" /> Secured by Stripe
          </div>
        </div>
        <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Charge</span>
          <span className="font-bold text-brand-navy text-lg">${amount.toFixed(2)} <span className="text-xs font-normal text-gray-400">{currency}</span></span>
        </div>
        <PaymentElement />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button type="button" onClick={onBack}
          className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded text-gray-600 hover:border-brand-navy hover:text-brand-navy transition-all bg-white order-2 sm:order-1">
          ← Back
        </button>
        <button type="submit" disabled={!stripe || paying}
          className="px-8 py-2.5 text-sm font-semibold rounded text-white bg-brand-orange hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60 order-1 sm:order-2">
          {paying ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <><Lock className="w-4 h-4" /> Pay ${amount.toFixed(2)} {currency}</>}
        </button>
      </div>
    </form>
  );
}
