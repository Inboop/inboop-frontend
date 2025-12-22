'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ShoppingCart, ChevronRight, Package, RefreshCw, Plus } from 'lucide-react';
import { Conversation } from '@/types';
import * as ordersApi from '@/lib/ordersApi';
import { OrderStatusBadge, OrderStatus } from '@/components/orders/OrderStatusBadge';
import { OrderDetailsDrawer } from '@/components/orders/OrderDetailsDrawer';
import { CreateOrderDrawer, CreateOrderInitialValues } from '@/components/orders/CreateOrderDrawer';
import { cn } from '@/lib/utils';

interface ConversationOrdersProps {
  conversation: Conversation | null;
}

// Format currency
function formatCurrency(amount: number, currency?: string | null): string {
  const symbol = currency === 'INR' ? '₹' : '$';
  return `${symbol}${amount.toLocaleString()}`;
}

// Format relative date
function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Skeleton loader for order item
function OrderItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      <div className="w-8 h-8 rounded-lg bg-gray-200" />
      <div className="flex-1 min-w-0">
        <div className="h-3.5 w-16 bg-gray-200 rounded mb-1.5" />
        <div className="h-3 w-20 bg-gray-200 rounded" />
      </div>
      <div className="text-right">
        <div className="h-3.5 w-12 bg-gray-200 rounded mb-1" />
        <div className="h-3 w-14 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function ConversationOrders({ conversation }: ConversationOrdersProps) {
  const [orders, setOrders] = useState<ordersApi.OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  // Track which conversation we've fetched orders for
  const fetchedForRef = useRef<string | null>(null);

  // Fetch orders for the conversation
  const fetchOrders = useCallback(async () => {
    if (!conversation) return;

    // Skip if already fetched for this conversation (lazy load, no refetch on messages)
    if (fetchedForRef.current === conversation.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Search by customer handle to find related orders
      const response = await ordersApi.listOrders({
        q: conversation.customerHandle,
        pageSize: 10,
        sort: 'createdAt_desc',
      });

      setOrders(response.items);
      fetchedForRef.current = conversation.id;
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [conversation]);

  // Fetch when conversation changes
  useEffect(() => {
    if (conversation) {
      fetchOrders();
    } else {
      setOrders([]);
      fetchedForRef.current = null;
    }
  }, [conversation?.id, fetchOrders]);

  // Handle order click
  const handleOrderClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsDrawerOpen(true);
  };

  // Handle drawer close
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedOrderId(null);
  };

  // Handle order updated (refresh the list)
  const handleOrderUpdated = useCallback(() => {
    // Force refetch
    fetchedForRef.current = null;
    fetchOrders();
  }, [fetchOrders]);

  // Force refresh handler
  const handleRefresh = () => {
    fetchedForRef.current = null;
    fetchOrders();
  };

  // Handle create order button
  const handleCreateOrder = () => {
    setIsCreateDrawerOpen(true);
  };

  // Handle order created - open the new order in details drawer
  const handleOrderCreated = (orderId: number) => {
    setIsCreateDrawerOpen(false);
    // Refresh orders list
    fetchedForRef.current = null;
    fetchOrders();
    // Open the new order in details drawer
    setSelectedOrderId(orderId);
    setIsDrawerOpen(true);
  };

  // Build initial values for create drawer
  const getCreateOrderInitialValues = (): CreateOrderInitialValues | undefined => {
    if (!conversation) return undefined;
    return {
      conversationId: parseInt(conversation.id, 10),
      customer: {
        name: conversation.customerName || undefined,
        handle: conversation.customerHandle,
      },
      channel: conversation.channel,
    };
  };

  if (!conversation) return null;

  // Get summary stats
  const orderCount = orders.length;
  const mostRecentOrder = orders[0];

  return (
    <>
      <div className="p-4 border-b border-gray-200">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5" />
            Orders
          </h3>
          <div className="flex items-center gap-1">
            {!isLoading && orders.length > 0 && (
              <button
                onClick={handleRefresh}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title="Refresh orders"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
            <button
              onClick={handleCreateOrder}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              title="Create order"
            >
              <Plus className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-1">
            <OrderItemSkeleton />
            <OrderItemSkeleton />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-3 bg-red-50 rounded-lg border border-red-100">
            <p className="text-xs text-red-600 mb-2">{error}</p>
            <button
              onClick={handleRefresh}
              className="text-xs text-red-700 font-medium hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="text-center py-6">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-1">No orders yet</p>
            <p className="text-xs text-gray-400">
              Orders from this customer will appear here
            </p>
          </div>
        )}

        {/* Orders Summary & List */}
        {!isLoading && !error && orders.length > 0 && (
          <div className="space-y-2">
            {/* Summary Stats */}
            <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-lg font-semibold text-gray-900">{orderCount}</span>
                  <span className="text-xs text-gray-500">{orderCount === 1 ? 'order' : 'orders'}</span>
                </div>
                {mostRecentOrder && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500">Latest:</span>
                    <OrderStatusBadge
                      status={mostRecentOrder.orderStatus as OrderStatus}
                      size="small"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Orders List (compact) */}
            <div className="rounded-lg border border-gray-200 overflow-hidden divide-y divide-gray-100">
              {orders.slice(0, 5).map((order) => (
                <button
                  key={order.id}
                  onClick={() => handleOrderClick(order.id)}
                  className="w-full flex items-center gap-3 p-3 bg-white hover:bg-gray-50 transition-colors text-left group"
                >
                  {/* Order Icon */}
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                    <Package className="w-4 h-4 text-gray-500" />
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {order.orderNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <OrderStatusBadge
                        status={order.orderStatus as OrderStatus}
                        size="small"
                      />
                    </div>
                  </div>

                  {/* Amount & Date */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalAmount || 0, order.currency)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatRelativeDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Chevron */}
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>

            {/* View All Link (if more than 5 orders) */}
            {orders.length > 5 && (
              <a
                href={`/orders?q=${encodeURIComponent(conversation.customerHandle)}`}
                className="block text-center py-2 text-xs text-[#2F5D3E] font-medium hover:underline"
              >
                View all {orders.length} orders →
              </a>
            )}
          </div>
        )}
      </div>

      {/* Order Details Drawer */}
      <OrderDetailsDrawer
        orderId={selectedOrderId}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onOrderUpdated={handleOrderUpdated}
      />

      {/* Create Order Drawer */}
      <CreateOrderDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onOrderCreated={handleOrderCreated}
        initialValues={getCreateOrderInitialValues()}
      />
    </>
  );
}
