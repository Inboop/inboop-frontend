'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Inbox, Users, ShoppingBag, BarChart3, Settings } from 'lucide-react';

const navItems = [
  { name: 'Inbox', href: '/inbox', icon: Inbox },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Orders', href: '/orders', icon: ShoppingBag },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
            <span className="text-white text-lg">I</span>
          </div>
          <span className="text-xl text-black">Inboop</span>
        </div>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-all duration-200 ease-out ${
                isActive
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:translate-x-1 hover:shadow-sm'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
            <span className="text-white text-sm">JD</span>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-900">John Doe</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}
