'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Package, LogOut, LayoutDashboard } from 'lucide-react';
import { clsx } from 'clsx';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/track', label: 'Track' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const pathname = usePathname();

  const isAuthenticated = false;
  const user = null as null | { firstName: string; role: string };
  const logout = () => {};

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!accountOpen) return;
    const handler = () => setAccountOpen(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [accountOpen]);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-200',
        scrolled ? 'shadow-md' : 'shadow-sm',
        'border-b border-gray-100'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 min-w-0">
            <svg width="36" height="28" viewBox="0 0 38 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 15L37 3L30 15L37 27L1 15Z" fill="#1B2B6B" />
              <path d="M1 15L37 3L24 15L37 27L1 15Z" fill="#FF6B00" />
            </svg>
            <span className="font-extrabold text-[14px] sm:text-[18px] tracking-tight leading-none whitespace-nowrap">
              <span className="text-[#1B2B6B]">PILOT </span>
              <span className="text-[#FF6B00]">COURIER</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden lg:flex items-center gap-0">

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'px-3.5 py-2 rounded-lg text-[13.5px] font-semibold transition-colors duration-200',
                  pathname === link.href
                    ? 'text-[#FF6B00]'
                    : 'text-gray-700 hover:text-[#1B2B6B] hover:bg-gray-50'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* My Account dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className={clsx(
                  'flex items-center gap-1 px-3.5 py-2 rounded-lg text-[13.5px] font-semibold transition-colors',
                  accountOpen
                    ? 'text-[#1B2B6B] bg-gray-50'
                    : 'text-gray-700 hover:text-[#1B2B6B] hover:bg-gray-50'
                )}
              >
                My Account
                <ChevronDown
                  className={clsx(
                    'w-3.5 h-3.5 transition-transform duration-200',
                    accountOpen && 'rotate-180'
                  )}
                />
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                  {isAuthenticated && user ? (
                    <>
                      <Link
                        href="/account/shipments"
                        className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50"
                      >
                        <Package className="w-4 h-4 text-[#1B2B6B]" /> My Shipments
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#1B2B6B]" /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={logout}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link
              href="/support"
              className={clsx(
                'px-3.5 py-2 rounded-lg text-[13.5px] font-semibold transition-colors duration-200',
                pathname === '/support'
                  ? 'text-[#FF6B00]'
                  : 'text-gray-700 hover:text-[#1B2B6B] hover:bg-gray-50'
              )}
            >
              Support
            </Link>
          </div>

          {/* ── CTA Button ── */}
          <div className="hidden lg:block">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white text-[13px] font-bold px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-sm"
            >
              Get a Quote
            </Link>
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-2 space-y-1 shadow-lg rounded-b-2xl">
            {[...navLinks, { href: '/support', label: 'Support' }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  'block px-4 py-3 rounded-xl text-[13.5px] font-semibold transition-colors',
                  pathname === link.href
                    ? 'bg-orange-50 text-[#FF6B00]'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-[13.5px] font-semibold text-gray-700 hover:bg-gray-50"
            >
              My Account
            </Link>
            <div className="pt-2">
              <Link
                href="/quote"
                onClick={() => setMobileOpen(false)}
                className="block text-center bg-[#FF6B00] hover:bg-[#e55f00] text-white text-[13.5px] font-bold px-6 py-3 rounded-lg transition-colors"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}