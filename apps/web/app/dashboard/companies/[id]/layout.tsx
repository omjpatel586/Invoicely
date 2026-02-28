'use client';

import {
  ChevronRight,
  LayoutDashboard,
  Menu,
  Package,
  ReceiptText,
  Truck,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const params = useParams();
  const companyId = params.id as string;

  // In a real app, you might fetch this based on companyId, or pass it via state management
  const companyName = 'UJJIVAN SMALL FINANCE BANK LIMITED';

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Dynamically build the URLs using the companyId from the route
  const menuItems = [
    {
      name: 'Overview',
      icon: LayoutDashboard,
      href: `/dashboard/companies/${companyId}`,
    },
    {
      name: 'Products',
      icon: Package,
      href: `/dashboard/companies/${companyId}/products`,
    },
    {
      name: 'Vendors',
      icon: Users,
      href: `/dashboard/companies/${companyId}/vendors`,
    },
    {
      name: 'Sales Bills',
      icon: ReceiptText,
      href: `/dashboard/companies/${companyId}/sales-bills`,
    },
    {
      name: 'E-Way Bills',
      icon: Truck,
      href: `/dashboard/companies/${companyId}/eway-bills`,
    },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-[#0a0a0a] overflow-hidden relative">
      {/* SIDEBAR */}
      <aside
        className={`
          absolute md:relative z-30 h-full flex flex-col 
          border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#141414] 
          transition-all duration-300 ease-in-out
          ${
            isSidebarOpen
              ? 'translate-x-0 w-64'
              : '-translate-x-full md:translate-x-0 w-64 md:w-20'
          }
        `}
      >
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {menuItems.map((item) => {
            // LOGIC: Exact match for the Overview page, otherwise check if the URL starts with the href
            const isActive =
              item.href === `/companies/${companyId}`
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-xl transition-all duration-200 ${
                  isSidebarOpen ? 'px-3 py-3' : 'px-0 py-3 justify-center'
                } ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                title={!isSidebarOpen ? item.name : ''}
              >
                <item.icon
                  className={`shrink-0 transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  } ${isSidebarOpen ? 'w-5 h-5 mr-3' : 'w-6 h-6'}`}
                />

                {/* Sidebar Text */}
                {isSidebarOpen && (
                  <span className="whitespace-nowrap opacity-100 translate-x-0 transition-all duration-300">
                    {item.name}
                  </span>
                )}

                {/* Active Indicator Chevron */}
                {isActive && isSidebarOpen && (
                  <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                )}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* DASHBOARD HEADER */}
        <header className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-[#141414]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center w-1/3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Centered Company Name */}
          <div className="w-1/3 flex justify-center">
            <h1 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white truncate max-w-[200px] md:max-w-md tracking-wide">
              {companyName}
            </h1>
          </div>

          <div className="w-1/3 flex justify-end"></div>
        </header>

        {/* PAGE CONTENT IS INJECTED HERE */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
