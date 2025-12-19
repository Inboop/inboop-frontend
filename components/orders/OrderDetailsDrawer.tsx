'use client';

import { useEffect, useCallback } from 'react';
import {
  X,
  Copy,
  Check,
  MessageSquare,
  Phone,
  MapPin,
  Truck,
  Package,
  Clock,
  CreditCard,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExtendedOrder, OrderTimelineEvent } from '@/lib/orders.mock';
import { OrderStatusBadge, OrderStatus, ORDER_STATUS_CONFIG } from './OrderStatusBadge';
import { getChannelIcon } from '@/components/shared/ChannelIcons';
import { formatRelativeTime } from '@/lib/helpers';
import { useState } from 'react';

interface OrderDetailsDrawerProps {
  order: ExtendedOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

// Copy to clipboard hook
function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return { copied, copy };
}

// Format currency
function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

// Format date
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Section Header Component
function SectionHeader({ title, icon: Icon }: { title: string; icon?: React.ElementType }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon className="w-4 h-4 text-gray-400" />}
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
    </div>
  );
}

// Timeline Item Component
function TimelineItem({ event, isLast }: { event: OrderTimelineEvent; isLast: boolean }) {
  const config = ORDER_STATUS_CONFIG[event.status];
  const Icon = config.Icon;

  return (
    <div className="flex gap-3">
      {/* Timeline line and dot */}
      <div className="flex flex-col items-center">
        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', config.bgColor)}>
          <Icon className={cn('w-4 h-4', config.textColor)} />
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
      </div>
      {/* Content */}
      <div className={cn('pb-4', isLast && 'pb-0')}>
        <p className="text-sm font-medium text-gray-900">{event.label}</p>
        {event.description && (
          <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">{formatDate(event.timestamp)}</p>
      </div>
    </div>
  );
}

export function OrderDetailsDrawer({ order, isOpen, onClose }: OrderDetailsDrawerProps) {
  const { copied, copy } = useCopyToClipboard();
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const handleTransitionEnd = () => {
    if (!isOpen) {
      setIsAnimating(false);
    }
  };

  const showTrackingInfo = order && (order.status === 'SHIPPED' || order.status === 'DELIVERED');

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
        onTransitionEnd={handleTransitionEnd}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl flex flex-col',
          'transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        onTransitionEnd={handleTransitionEnd}
      >
        {order && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-gray-900">{order.orderNumber}</h2>
                  <button
                    onClick={() => copy(order.orderNumber)}
                    className="p-1.5 rounded-lg hover:bg-gray-200/80 transition-colors"
                    title="Copy order number"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <span className="text-xs text-gray-400">
                    Updated {formatRelativeTime(order.updatedAt)}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-200/80 transition-colors -mr-2"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {/* Customer Section */}
              <div className="px-6 py-5 border-b border-gray-100">
                <SectionHeader title="Customer" />
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-gray-600">
                      {order.customer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{order.customer.name}</p>
                      <span className="flex-shrink-0">{getChannelIcon(order.customer.channel, 14)}</span>
                    </div>
                    <p className="text-sm text-gray-500">@{order.customer.handle}</p>
                    {order.customer.email && (
                      <p className="text-sm text-gray-500 mt-0.5">{order.customer.email}</p>
                    )}
                    {order.customer.phone && (
                      <p className="text-sm text-gray-500">{order.customer.phone}</p>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </button>
                  {order.customer.phone && (
                    <button
                      disabled
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                  )}
                </div>
              </div>

              {/* Items Section */}
              <div className="px-6 py-5 border-b border-gray-100">
                <SectionHeader title="Items" icon={Package} />
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900 ml-4">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-700">{formatCurrency(order.totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-gray-700">
                      {order.totals.shipping === 0 ? 'Free' : formatCurrency(order.totals.shipping)}
                    </span>
                  </div>
                  {order.totals.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="text-emerald-600">-{formatCurrency(order.totals.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-100">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatCurrency(order.totals.total)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Section */}
              <div className="px-6 py-5 border-b border-gray-100">
                <SectionHeader title="Shipping" icon={MapPin} />
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-900">{order.address.street}</p>
                  <p className="text-sm text-gray-700">
                    {order.address.city}, {order.address.state} {order.address.postalCode}
                  </p>
                  <p className="text-sm text-gray-500">{order.address.country}</p>
                </div>

                {/* Tracking Info */}
                {showTrackingInfo && order.trackingId && (
                  <div className="mt-4 flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                    <Truck className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{order.carrier}</p>
                      <p className="text-xs text-gray-600 font-mono">{order.trackingId}</p>
                    </div>
                    <button
                      onClick={() => copy(order.trackingId || '')}
                      className="p-1.5 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <Copy className="w-4 h-4 text-purple-600" />
                    </button>
                  </div>
                )}
              </div>

              {/* Timeline Section */}
              <div className="px-6 py-5">
                <SectionHeader title="Timeline" icon={Clock} />
                <div className="mt-2">
                  {order.timeline
                    .slice()
                    .reverse()
                    .map((event, index, arr) => (
                      <TimelineItem
                        key={event.id}
                        event={event}
                        isLast={index === arr.length - 1}
                      />
                    ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 space-y-3">
              <button
                disabled
                className="w-full py-2.5 rounded-xl text-white text-sm font-medium cursor-not-allowed opacity-60"
                style={{
                  background: 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)',
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Update Status
                </span>
              </button>
              <button
                disabled
                className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Refund Order
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}