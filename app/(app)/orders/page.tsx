'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Package,
  Truck,
  CheckCircle,
  Clock,
  DollarSign,
  ChevronDown,
  ArrowUpRight,
  ShoppingBag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminUser } from '@/lib/isAdmin';
import { mockOrders as mockOrdersData } from '@/lib/mockData';

type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerHandle: string;
  status: OrderStatus;
  totalAmount: number;
  items: number;
  createdAt: Date;
  updatedAt: Date;
}

const statusFilters: OrderStatus[] = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

// Transform mockOrders to match our interface
const transformMockOrders = (): Order[] => {
  return mockOrdersData.map((o, index) => ({
    id: o.id,
    orderNumber: `ORD-${String(index + 1001).padStart(4, '0')}`,
    customerName: o.customerHandle.replace('@', ''),
    customerHandle: o.customerHandle,
    status: o.status as OrderStatus,
    totalAmount: o.amount,
    items: o.items?.split(',').length || 1,
    createdAt: o.createdAt,
    updatedAt: o.createdAt,
  }));
};

const getOrderStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'Pending': return 'bg-amber-50 text-amber-700';
    case 'Confirmed': return 'bg-blue-50 text-blue-700';
    case 'Shipped': return 'bg-purple-50 text-purple-700';
    case 'Delivered': return 'bg-emerald-50 text-emerald-700';
    case 'Cancelled': return 'bg-gray-100 text-gray-600';
  }
};

const getOrderStatusDot = (status: OrderStatus) => {
  switch (status) {
    case 'Pending': return 'bg-amber-500';
    case 'Confirmed': return 'bg-blue-500';
    case 'Shipped': return 'bg-purple-500';
    case 'Delivered': return 'bg-emerald-500';
    case 'Cancelled': return 'bg-gray-400';
  }
};

export default function OrdersPage() {
  const { user } = useAuth();
  const isAdmin = isAdminUser(user?.email);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch orders on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setOrders(isAdmin ? transformMockOrders() : []);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [isAdmin]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'Pending').length;
    const shipped = orders.filter(o => o.status === 'Shipped').length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    return { total, pending, shipped, delivered, totalRevenue };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = !selectedStatus || order.status === selectedStatus;
      const matchesSearch = !searchQuery ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, selectedStatus, searchQuery]);

  return (
    <div className="flex h-full flex-col bg-[#F8F9FA]">
      {/* Page Header */}
      <div className="px-4 md:px-8 pt-4 md:pt-6 pb-4">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Orders</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">Track and manage your customer orders</p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-150 ease-out shadow-md hover:shadow-lg hover:brightness-110 hover:-translate-y-[1px]"
            style={{
              background: 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)',
            }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Order</span>
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              {/* Total Orders */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-[2px] cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                    All time
                  </span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">{metrics.total}</p>
                <p className="text-sm text-gray-500 mt-0.5">Total Orders</p>
              </div>

              {/* Pending */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-[2px] cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
                <p className="text-2xl font-semibold text-gray-900">{metrics.pending}</p>
                <p className="text-sm text-gray-500 mt-0.5">Pending</p>
              </div>

              {/* In Transit */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-[2px] cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-2xl font-semibold text-gray-900">{metrics.shipped}</p>
                <p className="text-sm text-gray-500 mt-0.5">In Transit</p>
              </div>

              {/* Revenue */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-[2px] cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  {metrics.totalRevenue > 0 && (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <ArrowUpRight className="w-3 h-3" />
                      12%
                    </span>
                  )}
                </div>
                <p className="text-2xl font-semibold text-gray-900">
                  ${metrics.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">Total Revenue</p>
              </div>
            </>
          )}
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E]/20 focus:border-[#2F5D3E] transition-all"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            <button
              onClick={() => setSelectedStatus(null)}
              className={cn(
                'px-3 md:px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ease-out whitespace-nowrap flex-shrink-0',
                !selectedStatus
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300'
              )}
            >
              All
            </button>
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={cn(
                  'px-3 md:px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ease-out flex items-center gap-2 whitespace-nowrap flex-shrink-0',
                  selectedStatus === status
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300'
                )}
              >
                <span className={cn('w-2 h-2 rounded-full', getOrderStatusDot(status))} />
                {status}
              </button>
            ))}

            {/* More Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 md:px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 transition-all duration-150 ease-out whitespace-nowrap flex-shrink-0"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', showFilters && 'rotate-180')} />
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Table Header - Hidden on mobile */}
        <div className="hidden md:block py-2.5 bg-white border-b border-gray-200 mx-4 md:mx-8">
          <div className="grid grid-cols-[1fr_100px_100px_120px_100px] gap-4 text-xs font-medium uppercase tracking-wider px-4">
            <div className="text-gray-700">Order</div>
            <div className="text-gray-700">Status</div>
            <div className="text-gray-500">Items</div>
            <div className="text-gray-500">Amount</div>
            <div className="text-gray-400">Date</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8">
          {isLoading ? (
            <div className="space-y-2 py-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="w-32 h-4 mb-2" />
                      <Skeleton className="w-24 h-3" />
                    </div>
                    <Skeleton className="w-20 h-6 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center px-4">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#2F5D3E]/10 to-[#2F5D3E]/5 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-[#2F5D3E]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                Orders will appear here when customers make purchases through your connected channels.
              </p>
              <a
                href="/settings?tab=integrations"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-150 ease-out shadow-md hover:shadow-lg hover:brightness-110"
                style={{
                  background: 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)',
                }}
              >
                Connect Instagram
              </a>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium">No orders match your filters</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-2 py-2">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="md:grid md:grid-cols-[1fr_100px_100px_120px_100px] gap-4 px-4 py-3 items-center cursor-pointer rounded-xl bg-white border border-gray-100 hover:shadow-md hover:-translate-y-[1px] transition-all duration-150 ease-out"
                >
                  {/* Order Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500 truncate">{order.customerName}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="hidden md:block">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold',
                      getOrderStatusColor(order.status)
                    )}>
                      {order.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="hidden md:block">
                    <p className="text-sm text-gray-600">{order.items} items</p>
                  </div>

                  {/* Amount */}
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">${order.totalAmount.toLocaleString()}</p>
                  </div>

                  {/* Date */}
                  <div className="hidden md:block">
                    <p className="text-xs text-gray-400">
                      {order.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Table Footer */}
        {filteredOrders.length > 0 && (
          <div className="px-4 md:px-8 py-3 bg-white border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{filteredOrders.length}</span> of{' '}
              <span className="font-medium text-gray-900">{orders.length}</span> orders
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
