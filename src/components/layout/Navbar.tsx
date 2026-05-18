'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Bell } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

// ── Authenticated 4-tab navbar (netParcel style) ──────────────────────────────
function AuthNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const tabs = [
    {
      href: '/quote',
      label: 'QUICK QUOTE',
      active: pathname.startsWith('/quote'),
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
          <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      ),
    },
    {
      href: '/booking',
      label: 'RATE & SHIP',
      active: pathname.startsWith('/booking'),
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
    },
    {
      href: '/account/shipments',
      label: 'HISTORY & TRACKING',
      active: pathname.startsWith('/account/shipments') || pathname.startsWith('/track'),
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    {
      href: '/account/payment',
      label: 'MY ACCOUNT',
      active: pathname.startsWith('/account') && !pathname.startsWith('/account/shipments'),
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Top strip: logo + welcome */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-gray-100 bg-white">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <svg width="32" height="26" viewBox="0 0 38 30" fill="none">
            <path d="M1 15L37 3L30 15L37 27L1 15Z" fill="#1B2B6B"/>
            <path d="M1 15L37 3L24 15L37 27L1 15Z" fill="#FF6B00"/>
          </svg>
          <span className="font-extrabold text-sm tracking-tight">
            <span className="text-[#1B2B6B]">PILOT </span>
            <span className="text-[#FF6B00]">COURIER</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Bell */}
          <button className="relative p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-4 h-4" />
          </button>

          {/* User dropdown */}
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setDropOpen(v => !v)}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Welcome, <span className="font-semibold text-gray-800">{user?.firstName}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropOpen && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-700">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                {user?.role === 'admin' && (
                  <Link href="/admin" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50">
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#1B2B6B]" /> Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setDropOpen(false); router.push('/'); }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4-tab navigation */}
      <div className="flex">
        {tabs.map(({ href, label, active, icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 text-xs font-semibold tracking-wide border-b-2 transition-all ${
              active
                ? 'border-[#00529B] text-[#00529B]'
                : 'border-transparent text-gray-500 hover:text-[#00529B] hover:border-gray-300'
            }`}
          >
            {icon}
            <span className="hidden sm:block">{label}</span>
          </Link>
        ))}
      </div>
    </header>
  );
}

// ── Public navbar (for guests) ────────────────────────────────────────────────
function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/track', label: 'Track' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-200 border-b border-gray-100 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <svg width="36" height="28" viewBox="0 0 38 30" fill="none">
              <path d="M1 15L37 3L30 15L37 27L1 15Z" fill="#1B2B6B"/>
              <path d="M1 15L37 3L24 15L37 27L1 15Z" fill="#FF6B00"/>
            </svg>
            <span className="font-extrabold text-[15px] tracking-tight">
              <span className="text-[#1B2B6B]">PILOT </span>
              <span className="text-[#FF6B00]">COURIER</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`px-3.5 py-2 rounded-lg text-[13.5px] font-semibold transition-colors ${
                  pathname === link.href ? 'text-[#FF6B00]' : 'text-gray-700 hover:text-[#1B2B6B] hover:bg-gray-50'
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/auth/login" className="text-[13.5px] font-semibold text-gray-600 hover:text-[#1B2B6B] px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Sign In
            </Link>
            <Link href="/quote" className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white text-[13px] font-bold px-5 py-2.5 rounded-lg transition-colors shadow-sm">
              Get a Quote
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-2 space-y-1 shadow-lg rounded-b-2xl">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-[13.5px] font-semibold transition-colors ${
                  pathname === link.href ? 'bg-orange-50 text-[#FF6B00]' : 'text-gray-700 hover:bg-gray-50'
                }`}>
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                className="block text-center border border-gray-300 text-[13.5px] font-semibold px-6 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Sign In
              </Link>
              <Link href="/quote" onClick={() => setMobileOpen(false)}
                className="block text-center bg-[#FF6B00] hover:bg-[#e55f00] text-white text-[13.5px] font-bold px-6 py-3 rounded-lg transition-colors">
                Get a Quote
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

// ── Main export: auto-switches based on auth ──────────────────────────────────
// Uses a mounted guard so server and client render the same thing initially,
// avoiding the React hydration mismatch caused by localStorage-dependent auth state.
export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => { setMounted(true); }, []);

  // Before mount, always render the public nav (matches server render)
  if (!mounted) return <PublicNavbar />;

  return isAuthenticated ? <AuthNavbar /> : <PublicNavbar />;
}
