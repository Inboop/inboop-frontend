'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Inbox, Users, ShoppingBag, BarChart3, Settings, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockConversations, mockOrders } from '@/lib/mockData';

// Calculate unread counts
const getUnreadCounts = () => {
  const inboxUnread = mockConversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const ordersUnread = mockOrders.filter((o) => o.status === 'Pending').length;
  return { Inbox: inboxUnread, Orders: ordersUnread };
};

const navItems = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Inbox', href: '/inbox', icon: Inbox },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Orders', href: '/orders', icon: ShoppingBag },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Team', href: '/team', icon: UserPlus },
];

const getInitials = (name?: string) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const unreadCounts = getUnreadCounts();

  return (
    <div className="w-20 bg-[#212121] flex flex-col">
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

      {/* User profile at bottom */}
      <div className="p-3 border-t border-[#3d3d3d]">
        <div
          className="relative"
          onMouseEnter={() => setHoveredItem('Profile')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="w-full h-12 rounded-lg hover:bg-[#2d2d2d] cursor-pointer transition-colors flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#2F5D3E] flex items-center justify-center">
              <span className="text-white text-sm font-medium">{getInitials(user?.name)}</span>
            </div>
          </div>

          {/* Tooltip */}
          {hoveredItem === 'Profile' && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#2d2d2d] text-white text-sm rounded-lg whitespace-nowrap z-50 pointer-events-none">
              <div>{user?.name || 'Guest'}</div>
              <div className="text-xs text-[#CCCCCC]">Admin</div>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#2d2d2d]"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
