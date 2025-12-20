'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Package,
  Truck,
  Clock,
  DollarSign,
  ChevronDown,
  ArrowUpRight,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  X,
  Link2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminUser } from '@/lib/isAdmin';
import { ChannelType } from '@/types';
import { getChannelIcon } from '@/components/shared/ChannelIcons';
import {
  OrderStatus,
  ORDER_STATUSES,
  OrderStatusBadge,
  getStatusDotColor,
  getStatusLabel,
} from '@/components/orders/OrderStatusBadge';
import { OrderDetailsDrawer } from '@/components/orders/OrderDetailsDrawer';
import { CreateOrderDrawer } from '@/components/orders/CreateOrderDrawer';
import { mockExtendedOrders, ExtendedOrder } from '@/lib/orders.mock';
import { toast } from '@/stores/useToastStore';
import { useOrderStore } from '@/stores/useOrderStore';

// Sort options
type SortOption = 'updated_desc' | 'updated_asc' | 'amount_desc' | 'amount_asc' | 'created_desc' | 'created_asc';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'updated_desc', label: 'Updated (Newest)' },
  { value: 'updated_asc', label: 'Updated (Oldest)' },
  { value: 'amount_desc', label: 'Amount (High to Low)' },
  { value: 'amount_asc', label: 'Amount (Low to High)' },
  { value: 'created_desc', label: 'Created (Newest)' },
  { value: 'created_asc', label: 'Created (Oldest)' },
];

const PAGE_SIZE = 10;

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerHandle: string;
  channel: ChannelType;
  status: OrderStatus;
  totalAmount: number;
  items: number;
  createdAt: Date;
  updatedAt: Date;
}

// Transform extended orders to match our list interface
const transformToListOrder = (o: ExtendedOrder): Order => ({
  id: o.id,
  orderNumber: o.orderNumber,
  customerName: o.customer.name,
  customerHandle: o.customer.handle,
  channel: o.customer.channel,
  status: o.status,
  totalAmount: o.totals.total,
  items: o.items.length,
  createdAt: o.createdAt,
  updatedAt: o.updatedAt,
});

// Deep clone mock orders for state management
const cloneMockOrders = (): ExtendedOrder[] => {
  return mockExtendedOrders.map((o) => ({
    ...o,
    customer: { ...o.customer },
    items: o.items.map((i) => ({ ...i })),
    totals: { ...o.totals },
    address: { ...o.address },
    timeline: o.timeline.map((t) => ({ ...t })),
  }));
};

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = isAdminUser(user?.email);

  // Use order store for shared state
  const { orders: extendedOrders, isLoading, fetchOrders, addOrder, updateOrderStatus } = useOrderStore();

  // Local UI state
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updated_desc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Conversation filter from URL
  const conversationFilter = searchParams.get('conversation');

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  // Close sort dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Derive list orders from extended orders
  const orders = useMemo(() => {
    return extendedOrders.map(transformToListOrder);
  }, [extendedOrders]);

  // Drawer state - driven by URL query param
  const selectedOrderId = searchParams.get('order');
  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return null;
    return extendedOrders.find(o => o.orderNumber === selectedOrderId) || null;
  }, [selectedOrderId, extendedOrders]);

  // Open drawer by updating URL
  const openOrder = useCallback((orderNumber: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('order', orderNumber);
    router.push(`/orders?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  // Close drawer by removing URL param
  const closeOrder = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('order');
    const newUrl = params.toString() ? `/orders?${params.toString()}` : '/orders';
    router.push(newUrl, { scroll: false });
  }, [router, searchParams]);

  // Clear conversation filter
  const clearConversationFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('conversation');
    const newUrl = params.toString() ? `/orders?${params.toString()}` : '/orders';
    router.push(newUrl, { scroll: false });
  }, [router, searchParams]);

  // Handle status update
  const handleUpdateStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus, getStatusLabel(newStatus));
    toast.success('Order status updated');
  }, [updateOrderStatus]);

  // Handle create order
  const handleCreateOrder = useCallback((newOrder: ExtendedOrder) => {
    addOrder(newOrder);
    setIsCreateDrawerOpen(false);
    toast.success('Order created');
    // Navigate to the new order
    openOrder(newOrder.orderNumber);
  }, [addOrder, openOrder]);

  // Get existing order numbers for ID generation
  const existingOrderNumbers = useMemo(() => {
    return extendedOrders.map((o) => o.orderNumber);
  }, [extendedOrders]);

  // Fetch orders on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders(isAdmin ? cloneMockOrders() : []);
    }, 500);
    return () => clearTimeout(timer);
  }, [isAdmin, fetchOrders]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'NEW' || o.status === 'PENDING').length;
    const shipped = orders.filter(o => o.status === 'SHIPPED').length;
    const delivered = orders.filter(o => o.status === 'DELIVERED').length;
    // Exclude cancelled orders from revenue
    const totalRevenue = orders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return { total, pending, shipped, delivered, totalRevenue };
  }, [orders]);

  // Filter orders with extended field matching
  const filteredOrders = useMemo(() => {
    return extendedOrders.filter((order) => {
      const matchesStatus = !selectedStatus || order.status === selectedStatus;
      const matchesConversation = !conversationFilter || order.conversationId === conversationFilter;

      if (!debouncedSearchQuery) return matchesStatus && matchesConversation;

      const query = debouncedSearchQuery.toLowerCase();
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.handle.toLowerCase().includes(query) ||
        (order.customer.email?.toLowerCase().includes(query) ?? false) ||
        (order.customer.phone?.toLowerCase().includes(query) ?? false) ||
        order.items.some((item) => item.name.toLowerCase().includes(query));

      return matchesStatus && matchesSearch && matchesConversation;
    });
  }, [extendedOrders, selectedStatus, debouncedSearchQuery, conversationFilter]);

  // Sort filtered orders
  const sortedOrders = useMemo(() => {
    const sorted = [...filteredOrders];

    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'updated_desc':
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        case 'updated_asc':
          return a.updatedAt.getTime() - b.updatedAt.getTime();
        case 'amount_desc':
          return b.totals.total - a.totals.total;
        case 'amount_asc':
          return a.totals.total - b.totals.total;
        case 'created_desc':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'created_asc':
          return a.createdAt.getTime() - b.createdAt.getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [filteredOrders, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / PAGE_SIZE);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedOrders.slice(start, start + PAGE_SIZE);
  }, [sortedOrders, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, debouncedSearchQuery, sortBy]);

  // Check if any filters are active
  const hasActiveFilters = selectedStatus !== null || debouncedSearchQuery !== '';

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedStatus(null);
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

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
            onClick={() => setIsCreateDrawerOpen(true)}
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
              placeholder="Search orders, customers, items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E]/20 focus:border-[#2F5D3E] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
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
            {ORDER_STATUSES.map((status) => (
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
                <span className={cn('w-2 h-2 rounded-full', getStatusDotColor(status))} />
                {getStatusLabel(status)}
              </button>
            ))}

            {/* Sort Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-3 md:px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 transition-all duration-150 ease-out whitespace-nowrap flex-shrink-0"
              >
                <span className="hidden sm:inline">
                  {SORT_OPTIONS.find((o) => o.value === sortBy)?.label || 'Sort'}
                </span>
                <span className="sm:hidden">Sort</span>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 transition-transform duration-200',
                    showSortDropdown && 'rotate-180'
                  )}
                />
              </button>

              {showSortDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortDropdown(false);
                      }}
                      className={cn(
                        'w-full px-4 py-2.5 text-sm text-left transition-colors',
                        sortBy === option.value
                          ? 'bg-gray-100 text-gray-900 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conversation Filter Banner */}
        {conversationFilter && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl">
            <Link2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="text-sm text-blue-700 font-medium">Filtered by conversation</span>
            <button
              onClick={clearConversationFilter}
              className="ml-auto flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Table Header - Hidden on mobile */}
        <div className="hidden md:block py-2.5 bg-white border-b border-gray-200 mx-4 md:mx-8">
          <div className="grid grid-cols-[1fr_100px_100px_120px_100px_32px] gap-4 text-xs font-medium uppercase tracking-wider px-4">
            <div className="text-gray-700">Order</div>
            <div className="text-gray-700">Status</div>
            <div className="text-gray-500">Items</div>
            <div className="text-gray-500">Amount</div>
            <div className="text-gray-400">Date</div>
            <div></div>
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
          ) : sortedOrders.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium">No orders match your filters</p>
              <p className="text-sm text-gray-500 mt-1 mb-4">Try adjusting your search or filters</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2 py-2">
              {paginatedOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => openOrder(order.orderNumber)}
                  className="group md:grid md:grid-cols-[1fr_100px_100px_120px_100px_32px] gap-4 px-4 py-3 items-center cursor-pointer rounded-xl bg-white border border-gray-100 hover:bg-gray-50/50 hover:shadow-md hover:border-gray-200 transition-all duration-150 ease-out"
                >
                  {/* Order Info with Channel Icon */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-gray-900 text-sm">{order.orderNumber}</p>
                        <span className="flex-shrink-0">
                          {getChannelIcon(order.customer.channel, 14)}
                        </span>
                        {order.conversationId && (
                          <span
                            className="flex-shrink-0"
                            title="Linked to conversation"
                          >
                            <Link2 className="w-3.5 h-3.5 text-blue-500" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{order.customer.handle}</p>
                    </div>
                  </div>

                  {/* Status - using OrderStatusBadge component */}
                  <div className="hidden md:block">
                    <OrderStatusBadge status={order.status} />
                  </div>

                  {/* Items */}
                  <div className="hidden md:block">
                    <p className="text-sm text-gray-600">{order.items.length} items</p>
                  </div>

                  {/* Amount */}
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">${order.totals.total.toLocaleString()}</p>
                  </div>

                  {/* Date */}
                  <div className="hidden md:block">
                    <p className="text-xs text-gray-400">
                      {order.createdAt.toLocaleDateString()}
                    </p>
                  </div>

                  {/* Hover Arrow - Visual only */}
                  <div className="hidden md:flex items-center justify-end">
                    <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Table Footer with Pagination */}
        {sortedOrders.length > 0 && (
          <div className="px-4 md:px-8 py-3 bg-white border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{' '}
              <span className="font-medium text-gray-900">
                {Math.min((currentPage - 1) * PAGE_SIZE + 1, sortedOrders.length)}
              </span>
              -
              <span className="font-medium text-gray-900">
                {Math.min(currentPage * PAGE_SIZE, sortedOrders.length)}
              </span>{' '}
              of <span className="font-medium text-gray-900">{sortedOrders.length}</span> orders
            </p>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    'p-2 rounded-lg border transition-colors',
                    currentPage === 1
                      ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-sm text-gray-600 min-w-[80px] text-center">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={cn(
                    'p-2 rounded-lg border transition-colors',
                    currentPage === totalPages
                      ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Details Drawer */}
      <OrderDetailsDrawer
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={closeOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Create Order Drawer */}
      <CreateOrderDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onCreate={handleCreateOrder}
        existingOrderNumbers={existingOrderNumbers}
      />
    </div>
  );
}
