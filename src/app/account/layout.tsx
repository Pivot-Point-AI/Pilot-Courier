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
    <div className="min-h-screen bg-[#f5f6f8] flex flex-col">
      {/* Navbar auto-shows AuthNavbar since user is logged in */}
      <Navbar />

      {/* Dark sub-nav — only for My Account pages, not History & Tracking */}
      {isMyAccount && (
        <div className="bg-[#2e3338] sticky top-[97px] z-40">
          <div className="max-w-7xl mx-auto">
            <div className="flex overflow-x-auto">
              {SUB_TABS.map(({ href, label }) => {
                const active = pathname === href || (href === '/account/payment' && pathname === '/account');
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex-shrink-0 px-5 py-2.5 text-xs font-medium whitespace-nowrap transition-all ${
                      active
                        ? 'text-white font-semibold bg-[#3d4349]'
                        : 'text-gray-400 hover:text-white hover:bg-[#3d4349]'
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
