'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Inbox, Target, ShoppingBag, BarChart3, Settings, Users, X } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';

// TODO: Get unread counts from stores/API
const getUnreadCounts = () => {
  // Return 0 for all counts until real data is available
  return { Inbox: 0, Orders: 0 };
};

const navItems = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Inbox', href: '/inbox', icon: Inbox },
  { name: 'Leads', href: '/leads', icon: Target },
  { name: 'Orders', href: '/orders', icon: ShoppingBag },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Team', href: '/team', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const unreadCounts = getUnreadCounts();
  const { isOpen, isMobile, close } = useSidebar();

  const handleNavClick = () => {
    if (isMobile) {
      close();
    }
  };

  // Desktop sidebar
  if (!isMobile) {
    return (
      <div className="hidden md:flex w-20 bg-[#212121] flex-col">
        <nav className="flex-1 px-3 pt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const unreadCount = unreadCounts[item.name as keyof typeof unreadCounts] || 0;

            return (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  href={item.href}
                  className={`w-full flex items-center justify-center h-12 mb-1 rounded-lg transition-all relative ${
                    isActive
                      ? 'bg-[#2F5D3E] text-white shadow-sm'
                      : 'text-[#CCCCCC] hover:bg-[#2d2d2d] hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-[#2F5D3E] rounded-full flex items-center justify-center text-[10px] font-medium text-white px-1">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Tooltip */}
                {hoveredItem === item.name && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#2d2d2d] text-white text-sm rounded-lg whitespace-nowrap z-50 pointer-events-none">
                    <div className="flex items-center gap-2">
                      {item.name}
                      {unreadCount > 0 && (
                        <span className="text-xs text-[#CCCCCC]">({unreadCount} unread)</span>
                      )}
                    </div>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#2d2d2d]"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Settings button at bottom */}
        <div className="px-3 pb-3">
          <div
            className="relative"
            onMouseEnter={() => setHoveredItem('Settings')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              href="/settings"
              className={`w-full flex items-center justify-center h-12 rounded-lg transition-all ${
                pathname === '/settings' || pathname?.startsWith('/settings/')
                  ? 'bg-[#2F5D3E] text-white shadow-sm'
                  : 'text-[#CCCCCC] hover:bg-[#2d2d2d] hover:text-white'
              }`}
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* Tooltip */}
            {hoveredItem === 'Settings' && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#2d2d2d] text-white text-sm rounded-lg whitespace-nowrap z-50 pointer-events-none">
                Settings
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#2d2d2d]"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Mobile sidebar (slide-out drawer)
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={close}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#212121] z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-[#3d3d3d]">
          <span className="text-[#2F5D3E] font-semibold text-lg">Menu</span>
          <button
            onClick={close}
            className="w-9 h-9 rounded-lg hover:bg-[#2d2d2d] transition-colors flex items-center justify-center text-[#CCCCCC]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const unreadCount = unreadCounts[item.name as keyof typeof unreadCounts] || 0;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#2F5D3E] text-white'
                    : 'text-[#CCCCCC] hover:bg-[#2d2d2d] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {unreadCount > 0 && (
                  <span className="ml-auto min-w-[20px] h-5 bg-[#2F5D3E] rounded-full flex items-center justify-center text-xs font-medium text-white px-1.5">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Settings at bottom */}
        <div className="p-4 border-t border-[#3d3d3d]">
          <Link
            href="/settings"
            onClick={handleNavClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              pathname === '/settings' || pathname?.startsWith('/settings/')
                ? 'bg-[#2F5D3E] text-white'
                : 'text-[#CCCCCC] hover:bg-[#2d2d2d] hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </>
  );
}
