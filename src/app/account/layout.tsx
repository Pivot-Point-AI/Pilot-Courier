'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/lib/store';

const SUB_TABS = [
  { href: '/account/payment',   label: 'Account / Payment' },
  { href: '/account/addresses', label: 'Address Book' },
  { href: '/account/invoices',  label: 'Invoices' },
  { href: '/account/stores',    label: 'Stores' },
  { href: '/account/carriers',  label: 'Carriers' },
  { href: '/account/products',  label: 'Products' },
  { href: '/account/packages',  label: 'Packages' },
  { href: '/account/quotes',    label: 'Saved Quotes' },
  { href: '/account/tickets',   label: 'Tickets' },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, fetchMe } = useAuthStore();

  const isMyAccount = !pathname.startsWith('/account/shipments');

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    fetchMe();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex flex-col pt-20">
      {/* Navbar auto-shows AuthNavbar since user is logged in */}
      <Navbar />

      {/* Sub-nav — only for My Account pages, not History & Tracking */}
      {isMyAccount && (
        <div className="bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex overflow-x-auto -mb-px">
              {SUB_TABS.map(({ href, label }) => {
                const active = pathname === href || (href === '/account/payment' && pathname === '/account');
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex-shrink-0 px-4 py-3 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                      active
                        ? 'text-[#1B2B6B] font-semibold border-[#1B2B6B]'
                        : 'text-gray-500 border-transparent hover:text-[#1B2B6B] hover:border-gray-300'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
