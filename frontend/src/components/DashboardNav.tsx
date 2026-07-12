'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldIcon } from '@/components/icons';

// Top navigation bar shown on every dashboard page (wired in via
// app/dashboard/layout.tsx). Each tab maps to a route under /dashboard.
const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Proposal', href: '/dashboard/proposals' },
  { label: 'Clients', href: '/dashboard/clients' },
  { label: 'Templates', href: '/dashboard/templates' },
  { label: 'Reports', href: '/dashboard/reports' },
  { label: 'Settings', href: '/dashboard/settings' },
];

export default function DashboardNav() {
  // Current URL path, used to highlight the active tab
  const pathname = usePathname();

  return (
    <nav className="bg-gray-200 border-b border-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Brand: logo badge plus company name, links back to the dashboard */}
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-700 border-2 border-blue-900 flex items-center justify-center shrink-0">
            <ShieldIcon className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-black text-lg leading-tight">
            TECH<br />SQUAD
          </span>
        </Link>

        {/* Nav tabs: the tab matching the current path is highlighted blue */}
        <div className="flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={
                pathname === item.href
                  ? 'font-bold text-blue-600'
                  : 'font-bold text-gray-800 hover:text-blue-600'
              }
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Signed-in user's initials (static until real auth exists) */}
        <div className="w-12 h-12 rounded-full bg-blue-950 flex items-center justify-center">
          <span className="text-white font-bold text-lg">TQ</span>
        </div>

      </div>
    </nav>
  );
}
