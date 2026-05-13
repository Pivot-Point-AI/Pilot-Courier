'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Package, Eye, EyeOff, Loader2, ArrowRight, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.'); return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.'); return;
    }
    if (!agreed) {
      toast.error('Please accept the Terms of Service.'); return;
    }
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password });
      toast.success('Account created! Welcome to Pilot Courier.');
      router.push('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-brand-orange rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-800 text-xl text-white">PILOT <span className="text-brand-orange">COURIER</span></span>
        </Link>
        <div>
          <h2 className="font-display font-800 text-4xl text-white mb-4">Join thousands of smart shippers.</h2>
          <p className="text-white/60 text-sm">Create your free account and start saving on shipping today. No commitments, no hidden fees.</p>
        </div>
        <p className="text-white/40 text-sm">© {new Date().getFullYear()} Pilot Courier.</p>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-brand-orange rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-800 text-xl text-brand-navy">PILOT <span className="text-brand-orange">COURIER</span></span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-display font-800 text-2xl text-brand-navy mb-1">Create your account</h1>
            <p className="text-gray-500 text-sm">Free forever. No credit card required.</p>
          </div>

          {/* NetParcel Sign-up note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 flex items-start gap-2">
            <Package className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              Pilot Courier uses NetParcel for carrier integrations. You may also{' '}
              <a href="https://ship.netparcel.com/sign-up.action" target="_blank" rel="noopener noreferrer" className="font-semibold underline inline-flex items-center gap-0.5">
                register on NetParcel <ExternalLink className="w-3 h-3" />
              </a>{' '}
              directly for additional features.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="input-label">First Name</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" className="input-field" required />
              </div>
              <div>
                <label className="input-label">Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Smith" className="input-field" required />
              </div>
            </div>
            <div>
              <label className="input-label">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" className="input-field" required />
            </div>
            <div>
              <label className="input-label">Phone Number</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 416 555 0100" className="input-field" required />
            </div>
            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" className="input-field pr-11" required minLength={8} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="input-label">Confirm Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" className="input-field" required />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 accent-brand-orange" />
              <span className="text-xs text-gray-500">
                I agree to the{' '}
                <Link href="/terms" className="text-brand-orange hover:underline font-medium">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-brand-orange hover:underline font-medium">Privacy Policy</Link>.
              </span>
            </label>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5">
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-brand-orange font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
