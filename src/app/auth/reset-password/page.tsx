'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.'); return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.'); return;
    }
    setIsLoading(true);
    try {
      await authApi.resetPassword(token, form.password);
      setDone(true);
      toast.success('Password reset successfully!');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'This reset link is invalid or has expired.');
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
            Choose a new<br />password.
          </h2>
          <p className="text-white/70">Make it strong — at least 8 characters.</p>
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

          {!token ? (
            <div className="text-center">
              <h1 className="font-display font-800 text-2xl text-brand-navy mb-2">Invalid Link</h1>
              <p className="text-gray-500 text-sm mb-8">This password reset link is missing or invalid. Please request a new one.</p>
              <Link href="/auth/forgot-password" className="btn-primary w-full py-3.5 inline-flex justify-center">
                Request New Link
              </Link>
            </div>
          ) : done ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <h1 className="font-display font-800 text-2xl text-brand-navy mb-2">Password Reset</h1>
              <p className="text-gray-500 text-sm">Your password has been updated. Redirecting you to sign in...</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="font-display font-800 text-2xl text-brand-navy mb-1">Set a new password</h1>
                <p className="text-gray-500 text-sm">Your new password must be different from your previous one.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="input-label">New Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="••••••••"
                      className="input-field pr-11"
                      required
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="input-label">Confirm New Password</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="••••••••"
                    className="input-field"
                    required
                  />
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5">
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting...</> : <>Reset Password <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/auth/login" className="text-sm text-gray-500 hover:text-brand-navy">Back to Sign In</Link>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-orange" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
