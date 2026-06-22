'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, ArrowRight, ArrowLeft, MailCheck } from 'lucide-react';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-white rounded-xl p-2 shadow-md">
            <Image src="/images/logo.png" alt="Pilot Courier" width={56} height={56} className="h-10 w-auto block" />
          </div>
        </Link>
        <div>
          <h2 className="font-display font-800 text-4xl text-white mb-4 leading-tight">
            Forgot your<br />password?
          </h2>
          <p className="text-white/70">No worries. Enter your email and we'll send you a link to reset it.</p>
        </div>
        <p className="text-white/40 text-sm">© {new Date().getFullYear()} Pilot Courier. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="Pilot Courier" width={56} height={56} className="h-12 w-auto" />
            </Link>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <MailCheck className="w-7 h-7 text-green-600" />
              </div>
              <h1 className="font-display font-800 text-2xl text-brand-navy mb-2">Check your email</h1>
              <p className="text-gray-500 text-sm mb-8">
                If an account exists for <strong>{email}</strong>, we've sent a link to reset your password. The link expires in 1 hour.
              </p>
              <Link href="/auth/login" className="btn-primary w-full py-3.5 inline-flex justify-center">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="font-display font-800 text-2xl text-brand-navy mb-1">Reset your password</h1>
                <p className="text-gray-500 text-sm">Enter the email associated with your account and we'll send you a reset link.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="input-label">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field"
                    required
                  />
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5">
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-navy">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </>
          )}

          <div className="mt-4 text-center">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
