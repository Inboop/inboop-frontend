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
  AlertCircle,
  RefreshCw,
  User,
  Users,
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
import * as ordersApi from '@/lib/ordersApi';

// Page size options
const PAGE_SIZE_OPTIONS = [20, 50, 100] as const;
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

// Payment status options
const PAYMENT_STATUSES: ordersApi.PaymentStatus[] = ['UNPAID', 'PAID', 'REFUNDED'];

// Channel options
const CHANNELS: ordersApi.ChannelType[] = ['INSTAGRAM', 'WHATSAPP', 'MESSENGER'];

// Assignee filter options
type AssigneeFilter = 'any' | 'me' | 'unassigned';
const ASSIGNEE_OPTIONS: { value: AssigneeFilter; label: string; icon: React.ReactNode }[] = [
  { value: 'any', label: 'All', icon: <Users className="w-3.5 h-3.5" /> },
  { value: 'me', label: 'Mine', icon: <User className="w-3.5 h-3.5" /> },
  { value: 'unassigned', label: 'Unassigned', icon: <User className="w-3.5 h-3.5 opacity-50" /> },
];

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

// Format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Get payment status styles
function getPaymentStatusStyle(status: ordersApi.PaymentStatus | null): {
  bg: string;
  text: string;
  label: string;
} {
  switch (status) {
    case 'PAID':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Paid' };
    case 'REFUNDED':
      return { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Refunded' };
    case 'UNPAID':
    default:
      return { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Unpaid' };
  }
}

// Get channel label
function getChannelLabel(channel: ordersApi.ChannelType): string {
  switch (channel) {
    case 'INSTAGRAM':
      return 'Instagram';
    case 'WHATSAPP':
      return 'WhatsApp';
    case 'MESSENGER':
      return 'Messenger';
    default:
      return channel;
  }
}

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = isAdminUser(user?.email);

  // Use order store for mock data (backward compatible)
  const {
    orders: extendedOrders,
    isLoading: storeLoading,
    fetchOrders,
    addOrder,
    updateOrderStatus,
    useApi,
    setUseApi,
  } = useOrderStore();

  // API state
  const [apiOrders, setApiOrders] = useState<ordersApi.OrderListItem[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Read filters from URL
  const urlStatus = searchParams.get('status') as OrderStatus | null;
  const urlPaymentStatus = searchParams.get('paymentStatus') as ordersApi.PaymentStatus | null;
  const urlChannel = searchParams.get('channel') as ordersApi.ChannelType | null;
  const urlAssignedTo = (searchParams.get('assignedTo') || 'any') as AssigneeFilter;
  const urlQuery = searchParams.get('q') || '';
  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  const urlPageSize = (parseInt(searchParams.get('pageSize') || '20', 10) || 20) as PageSize;
  const conversationFilter = searchParams.get('conversation');

  // Local search input state (for debouncing)
  const [searchInput, setSearchInput] = useState(urlQuery);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Dropdown states
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [showPageSizeDropdown, setShowPageSizeDropdown] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const paymentDropdownRef = useRef<HTMLDivElement>(null);
  const channelDropdownRef = useRef<HTMLDivElement>(null);
  const pageSizeDropdownRef = useRef<HTMLDivElement>(null);

  // Drawer state
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const selectedOrderId = searchParams.get('order');

  // Enable API mode by default for authenticated users
  useEffect(() => {
    if (user && !useApi) {
      setUseApi(true);
    }
  }, [user, useApi, setUseApi]);

  // Update URL with filters
  const updateFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === 'any') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Reset to page 1 when filters change (except for page/pageSize changes)
      if (!('page' in updates) && !('pageSize' in updates)) {
        params.delete('page');
      }

      const newUrl = params.toString() ? `/orders?${params.toString()}` : '/orders';
      router.push(newUrl, { scroll: false });
    },
    [router, searchParams]
  );

  // Sync debounced search to URL
  useEffect(() => {
    if (debouncedSearch !== urlQuery) {
      updateFilters({ q: debouncedSearch || null });
    }
  }, [debouncedSearch, urlQuery, updateFilters]);

  // Fetch orders from API
  const fetchOrdersFromApi = useCallback(async () => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setApiLoading(true);
    setApiError(null);

    try {
      const params: ordersApi.ListOrdersParams = {
        page: urlPage,
        pageSize: urlPageSize,
        sort: 'createdAt_desc',
      };

      if (urlStatus) params.status = urlStatus as ordersApi.OrderStatus;
      if (urlPaymentStatus) params.paymentStatus = urlPaymentStatus;
      if (urlChannel) params.channel = urlChannel;
      if (urlAssignedTo && urlAssignedTo !== 'any') params.assignedTo = urlAssignedTo;
      if (urlQuery) params.q = urlQuery;

      const response = await ordersApi.listOrders(params);

      // Only update state if this request wasn't aborted
      if (!controller.signal.aborted) {
        setApiOrders(response.items);
        setTotalItems(response.totalItems);
        setTotalPages(response.totalPages);
        setApiLoading(false);
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error('Failed to fetch orders:', error);
        setApiError(error instanceof Error ? error.message : 'Failed to fetch orders');
        setApiLoading(false);
      }
    }
  }, [urlPage, urlPageSize, urlStatus, urlPaymentStatus, urlChannel, urlAssignedTo, urlQuery]);

  // Fetch on mount and when filters change
  useEffect(() => {
    if (useApi && user) {
      fetchOrdersFromApi();
    } else if (!useApi) {
      // Fallback to mock data
      const timer = setTimeout(() => {
        fetchOrders(isAdmin ? cloneMockOrders() : []);
      }, 500);
      return () => clearTimeout(timer);
    }

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [useApi, user, fetchOrdersFromApi, fetchOrders, isAdmin]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target as Node)) {
        setShowPaymentDropdown(false);
      }
      if (channelDropdownRef.current && !channelDropdownRef.current.contains(event.target as Node)) {
        setShowChannelDropdown(false);
      }
      if (pageSizeDropdownRef.current && !pageSizeDropdownRef.current.contains(event.target as Node)) {
        setShowPageSizeDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get selected order for drawer
  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return null;
    return extendedOrders.find((o) => o.orderNumber === selectedOrderId) || null;
  }, [selectedOrderId, extendedOrders]);

  // Open/close drawer
  const openOrder = useCallback(
    (orderNumber: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('order', orderNumber);
      router.push(`/orders?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

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
  const handleUpdateStatus = useCallback(
    (orderId: string, newStatus: OrderStatus) => {
      updateOrderStatus(orderId, newStatus, getStatusLabel(newStatus));
      toast.success('Order status updated');
    },
    [updateOrderStatus]
  );

  // Handle create order
  const handleCreateOrder = useCallback(
    (newOrder: ExtendedOrder) => {
      addOrder(newOrder);
      setIsCreateDrawerOpen(false);
      toast.success('Order created');
      openOrder(newOrder.orderNumber);
    },
    [addOrder, openOrder]
  );

  // Get existing order numbers
  const existingOrderNumbers = useMemo(() => {
    return extendedOrders.map((o) => o.orderNumber);
  }, [extendedOrders]);

  // Calculate metrics (from mock data or API data)
  const metrics = useMemo(() => {
    if (useApi) {
      // For API mode, we show total from API
      return {
        total: totalItems,
        pending: 0, // Would need separate API call for these
        shipped: 0,
        delivered: 0,
        totalRevenue: 0,
      };
    }

    const total = extendedOrders.length;
    const pending = extendedOrders.filter(
      (o) => o.status === 'NEW' || o.status === 'PENDING'
    ).length;
    const shipped = extendedOrders.filter((o) => o.status === 'SHIPPED').length;
    const delivered = extendedOrders.filter((o) => o.status === 'DELIVERED').length;
    const totalRevenue = extendedOrders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totals.total, 0);

    return { total, pending, shipped, delivered, totalRevenue };
  }, [useApi, totalItems, extendedOrders]);

  // Determine if we have active filters
  const hasActiveFilters =
    urlStatus !== null ||
    urlPaymentStatus !== null ||
    urlChannel !== null ||
    urlAssignedTo !== 'any' ||
    urlQuery !== '';

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchInput('');
    router.push('/orders', { scroll: false });
  }, [router]);

  // Loading state
  const isLoading = useApi ? apiLoading : storeLoading;

  // Determine which orders to display
  const displayOrders = useApi ? apiOrders : extendedOrders;

  return (
    <div className="flex h-full flex-col bg-[#F8F9FA]">
      {/* Page Header */}
      <div className="px-4 md:px-8 pt-4 md:pt-6 pb-4">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Orders</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Track and manage your customer orders
            </p>
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
          {isLoading && !hasActiveFilters ? (
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
        <div className="flex flex-col gap-3">
          {/* Row 1: Search + Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, customers..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E]/20 focus:border-[#2F5D3E] transition-all"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="relative" ref={statusDropdownRef}>
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                  urlStatus
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                )}
              >
                {urlStatus ? (
                  <>
                    <span className={cn('w-2 h-2 rounded-full', getStatusDotColor(urlStatus))} />
                    {getStatusLabel(urlStatus)}
                  </>
                ) : (
                  'Status'
                )}
                <ChevronDown
                  className={cn('w-4 h-4 transition-transform', showStatusDropdown && 'rotate-180')}
                />
              </button>

              {showStatusDropdown && (
                <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      updateFilters({ status: null });
                      setShowStatusDropdown(false);
                    }}
                    className={cn(
                      'w-full px-4 py-2.5 text-sm text-left transition-colors',
                      !urlStatus ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                    )}
                  >
                    All Statuses
                  </button>
                  {ORDER_STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateFilters({ status });
                        setShowStatusDropdown(false);
                      }}
                      className={cn(
                        'w-full px-4 py-2.5 text-sm text-left flex items-center gap-2 transition-colors',
                        urlStatus === status ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                      )}
                    >
                      <span className={cn('w-2 h-2 rounded-full', getStatusDotColor(status))} />
                      {getStatusLabel(status)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Status Dropdown */}
            <div className="relative" ref={paymentDropdownRef}>
              <button
                onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                  urlPaymentStatus
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                )}
              >
                {urlPaymentStatus
                  ? getPaymentStatusStyle(urlPaymentStatus).label
                  : 'Payment'}
                <ChevronDown
                  className={cn('w-4 h-4 transition-transform', showPaymentDropdown && 'rotate-180')}
                />
              </button>

              {showPaymentDropdown && (
                <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      updateFilters({ paymentStatus: null });
                      setShowPaymentDropdown(false);
                    }}
                    className={cn(
                      'w-full px-4 py-2.5 text-sm text-left transition-colors',
                      !urlPaymentStatus ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                    )}
                  >
                    All Payments
                  </button>
                  {PAYMENT_STATUSES.map((ps) => {
                    const style = getPaymentStatusStyle(ps);
                    return (
                      <button
                        key={ps}
                        onClick={() => {
                          updateFilters({ paymentStatus: ps });
                          setShowPaymentDropdown(false);
                        }}
                        className={cn(
                          'w-full px-4 py-2.5 text-sm text-left flex items-center gap-2 transition-colors',
                          urlPaymentStatus === ps ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                        )}
                      >
                        <span className={cn('w-2 h-2 rounded-full', style.bg)} />
                        {style.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Channel Dropdown */}
            <div className="relative" ref={channelDropdownRef}>
              <button
                onClick={() => setShowChannelDropdown(!showChannelDropdown)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                  urlChannel
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                )}
              >
                {urlChannel ? getChannelLabel(urlChannel) : 'Channel'}
                <ChevronDown
                  className={cn('w-4 h-4 transition-transform', showChannelDropdown && 'rotate-180')}
                />
              </button>

              {showChannelDropdown && (
                <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      updateFilters({ channel: null });
                      setShowChannelDropdown(false);
                    }}
                    className={cn(
                      'w-full px-4 py-2.5 text-sm text-left transition-colors',
                      !urlChannel ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                    )}
                  >
                    All Channels
                  </button>
                  {CHANNELS.map((ch) => (
                    <button
                      key={ch}
                      onClick={() => {
                        updateFilters({ channel: ch });
                        setShowChannelDropdown(false);
                      }}
                      className={cn(
                        'w-full px-4 py-2.5 text-sm text-left flex items-center gap-2 transition-colors',
                        urlChannel === ch ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                      )}
                    >
                      {getChannelIcon(ch.toLowerCase() as ChannelType, 16)}
                      {getChannelLabel(ch)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Assignee Chips */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              {ASSIGNEE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFilters({ assignedTo: option.value })}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    urlAssignedTo === option.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
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
        {/* Table Header */}
        <div className="hidden md:block py-2.5 bg-white border-b border-gray-200 mx-4 md:mx-8">
          <div className="grid grid-cols-[minmax(200px,2fr)_100px_100px_100px_100px_100px_100px_32px] gap-4 text-xs font-medium uppercase tracking-wider px-4">
            <div className="text-gray-700">Order</div>
            <div className="text-gray-700">Channel</div>
            <div className="text-gray-700">Status</div>
            <div className="text-gray-700">Payment</div>
            <div className="text-gray-500">Total</div>
            <div className="text-gray-500">Assignee</div>
            <div className="text-gray-400">Updated</div>
            <div></div>
          </div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8">
          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-2 py-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="hidden md:grid md:grid-cols-[minmax(200px,2fr)_100px_100px_100px_100px_100px_100px_32px] gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div>
                        <Skeleton className="w-24 h-4 mb-2" />
                        <Skeleton className="w-32 h-3" />
                      </div>
                    </div>
                    <Skeleton className="w-16 h-5 rounded-full" />
                    <Skeleton className="w-20 h-6 rounded-md" />
                    <Skeleton className="w-16 h-5 rounded-full" />
                    <Skeleton className="w-16 h-4" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-16 h-3" />
                    <div />
                  </div>
                  {/* Mobile skeleton */}
                  <div className="md:hidden flex items-center gap-4">
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
          ) : apiError ? (
            /* Error State */
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-gray-900 font-medium">Failed to load orders</p>
              <p className="text-sm text-gray-500 mt-1 mb-4 max-w-sm mx-auto">{apiError}</p>
              <button
                onClick={fetchOrdersFromApi}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          ) : displayOrders.length === 0 && !hasActiveFilters ? (
            /* Empty State - No Orders at All */
            <div className="py-16 text-center px-4">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#2F5D3E]/10 to-[#2F5D3E]/5 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-[#2F5D3E]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                Orders will appear here when customers make purchases through your connected
                channels.
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
          ) : displayOrders.length === 0 && hasActiveFilters ? (
            /* Empty State - No Results */
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium">No orders match your filters</p>
              <p className="text-sm text-gray-500 mt-1 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear filters
              </button>
            </div>
          ) : (
            /* Order Rows */
            <div className="space-y-2 py-2">
              {useApi
                ? apiOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => openOrder(order.orderNumber)}
                      className="group md:grid md:grid-cols-[minmax(200px,2fr)_100px_100px_100px_100px_100px_100px_32px] gap-4 px-4 py-3 items-center cursor-pointer rounded-xl bg-white border border-gray-100 hover:bg-gray-50/50 hover:shadow-md hover:border-gray-200 transition-all duration-150 ease-out"
                    >
                      {/* Order Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-gray-900 text-sm">
                              {order.orderNumber}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {order.customerName || order.customerHandle || 'Unknown customer'}
                          </p>
                        </div>
                      </div>

                      {/* Channel */}
                      <div className="hidden md:flex items-center gap-1.5">
                        {order.channel &&
                          getChannelIcon(order.channel.toLowerCase() as ChannelType, 16)}
                        <span className="text-xs text-gray-500">
                          {order.channel ? getChannelLabel(order.channel) : '-'}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="hidden md:block">
                        <OrderStatusBadge status={order.orderStatus as OrderStatus} />
                      </div>

                      {/* Payment Status */}
                      <div className="hidden md:block">
                        {order.paymentStatus && (
                          <span
                            className={cn(
                              'inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
                              getPaymentStatusStyle(order.paymentStatus).bg,
                              getPaymentStatusStyle(order.paymentStatus).text
                            )}
                          >
                            {getPaymentStatusStyle(order.paymentStatus).label}
                          </span>
                        )}
                      </div>

                      {/* Total */}
                      <div className="hidden md:block">
                        <p className="text-sm font-medium text-gray-900">
                          ${(order.totalAmount || 0).toLocaleString()}
                        </p>
                      </div>

                      {/* Assignee */}
                      <div className="hidden md:block">
                        {order.assignedToUserName ? (
                          <div
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600"
                            title={order.assignedToUserName}
                          >
                            {order.assignedToUserName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Last Updated */}
                      <div className="hidden md:block">
                        <p className="text-xs text-gray-400">
                          {formatRelativeTime(new Date(order.lastUpdatedAt))}
                        </p>
                      </div>

                      {/* Hover Arrow */}
                      <div className="hidden md:flex items-center justify-end">
                        <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                      </div>

                      {/* Mobile: Status badge */}
                      <div className="md:hidden mt-2 flex items-center gap-2">
                        <OrderStatusBadge status={order.orderStatus as OrderStatus} />
                        {order.paymentStatus && (
                          <span
                            className={cn(
                              'inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
                              getPaymentStatusStyle(order.paymentStatus).bg,
                              getPaymentStatusStyle(order.paymentStatus).text
                            )}
                          >
                            {getPaymentStatusStyle(order.paymentStatus).label}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                : /* Mock data mode - use ExtendedOrder type */
                  extendedOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => openOrder(order.orderNumber)}
                      className="group md:grid md:grid-cols-[minmax(200px,2fr)_100px_100px_100px_100px_100px_100px_32px] gap-4 px-4 py-3 items-center cursor-pointer rounded-xl bg-white border border-gray-100 hover:bg-gray-50/50 hover:shadow-md hover:border-gray-200 transition-all duration-150 ease-out"
                    >
                      {/* Order Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-gray-900 text-sm">
                              {order.orderNumber}
                            </p>
                            {order.conversationId && (
                              <span className="flex-shrink-0" title="Linked to conversation">
                                <Link2 className="w-3.5 h-3.5 text-blue-500" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{order.customer.handle}</p>
                        </div>
                      </div>

                      {/* Channel */}
                      <div className="hidden md:flex items-center gap-1.5">
                        {getChannelIcon(order.customer.channel, 16)}
                        <span className="text-xs text-gray-500 capitalize">
                          {order.customer.channel}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="hidden md:block">
                        <OrderStatusBadge status={order.status} />
                      </div>

                      {/* Payment Status */}
                      <div className="hidden md:block">
                        <span
                          className={cn(
                            'inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          )}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>

                      {/* Total */}
                      <div className="hidden md:block">
                        <p className="text-sm font-medium text-gray-900">
                          ${order.totals.total.toLocaleString()}
                        </p>
                      </div>

                      {/* Assignee */}
                      <div className="hidden md:block">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-300" />
                        </div>
                      </div>

                      {/* Last Updated */}
                      <div className="hidden md:block">
                        <p className="text-xs text-gray-400">
                          {formatRelativeTime(order.updatedAt)}
                        </p>
                      </div>

                      {/* Hover Arrow */}
                      <div className="hidden md:flex items-center justify-end">
                        <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                      </div>

                      {/* Mobile: badges */}
                      <div className="md:hidden mt-2 flex items-center gap-2">
                        <OrderStatusBadge status={order.status} />
                        <span
                          className={cn(
                            'inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          )}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </div>

        {/* Table Footer with Pagination */}
        {displayOrders.length > 0 && (
          <div className="px-4 md:px-8 py-3 bg-white border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500">
                Showing{' '}
                <span className="font-medium text-gray-900">
                  {useApi
                    ? Math.min((urlPage - 1) * urlPageSize + 1, totalItems)
                    : Math.min(1, displayOrders.length)}
                </span>
                -
                <span className="font-medium text-gray-900">
                  {useApi
                    ? Math.min(urlPage * urlPageSize, totalItems)
                    : displayOrders.length}
                </span>{' '}
                of{' '}
                <span className="font-medium text-gray-900">
                  {useApi ? totalItems : displayOrders.length}
                </span>{' '}
                orders
              </p>

              {/* Page Size Selector */}
              <div className="relative hidden sm:block" ref={pageSizeDropdownRef}>
                <button
                  onClick={() => setShowPageSizeDropdown(!showPageSizeDropdown)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {urlPageSize} per page
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 transition-transform',
                      showPageSizeDropdown && 'rotate-180'
                    )}
                  />
                </button>

                {showPageSizeDropdown && (
                  <div className="absolute bottom-full mb-2 left-0 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          updateFilters({ pageSize: size.toString(), page: '1' });
                          setShowPageSizeDropdown(false);
                        }}
                        className={cn(
                          'w-full px-4 py-2 text-sm text-left transition-colors',
                          urlPageSize === size ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                        )}
                      >
                        {size} per page
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pagination Controls */}
            {(useApi ? totalPages > 1 : false) && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateFilters({ page: String(urlPage - 1) })}
                  disabled={urlPage === 1}
                  className={cn(
                    'p-2 rounded-lg border transition-colors',
                    urlPage === 1
                      ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-sm text-gray-600 min-w-[80px] text-center">
                  Page {urlPage} of {totalPages}
                </span>

                <button
                  onClick={() => updateFilters({ page: String(urlPage + 1) })}
                  disabled={urlPage === totalPages}
                  className={cn(
                    'p-2 rounded-lg border transition-colors',
                    urlPage === totalPages
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
