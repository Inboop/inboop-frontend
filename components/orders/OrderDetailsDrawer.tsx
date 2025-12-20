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
  Zap,
  ExternalLink,
  Link2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ExtendedOrder, OrderTimelineEvent, OrderPriority, PaymentStatus } from '@/lib/orders.mock';
import { OrderStatusBadge, OrderStatus, ORDER_STATUS_CONFIG, getAllowedNextStatuses } from './OrderStatusBadge';
import { StatusUpdateModal } from './StatusUpdateModal';
import { getChannelIcon, getChannelName } from '@/components/shared/ChannelIcons';
import { useState } from 'react';

interface OrderDetailsDrawerProps {
  order: ExtendedOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => void;
}

// Copy toast state
interface CopyState {
  copied: boolean;
  label: string;
}

// Copy to clipboard hook with toast message
function useCopyToClipboard() {
  const [state, setState] = useState<CopyState>({ copied: false, label: '' });

  const copy = useCallback((text: string, label: string = 'Copied') => {
    navigator.clipboard.writeText(text);
    setState({ copied: true, label });
    setTimeout(() => setState({ copied: false, label: '' }), 2000);
  }, []);

  return { ...state, copy };
}

// Priority chip config
const PRIORITY_CONFIG: Record<OrderPriority, { label: string; bgColor: string; textColor: string }> = {
  high: { label: 'High intent', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  medium: { label: 'Medium intent', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
  low: { label: 'Low intent', bgColor: 'bg-gray-100', textColor: 'text-gray-500' },
};

// Payment status badge config
const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; bgColor: string; textColor: string }> = {
  paid: { label: 'Paid', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
  unpaid: { label: 'Unpaid', bgColor: 'bg-red-50', textColor: 'text-red-600' },
  cod: { label: 'COD', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
};

// Format currency
function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

// Format date for timeline
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Format short date for meta row
function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
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

// Priority Chip Component
function PriorityChip({ priority }: { priority: OrderPriority }) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide',
      config.bgColor,
      config.textColor
    )}>
      <Zap className="w-2.5 h-2.5" />
      {config.label}
    </span>
  );
}

// Payment Status Badge Component
function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = PAYMENT_STATUS_CONFIG[status];
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold',
      config.bgColor,
      config.textColor
    )}>
      {config.label}
    </span>
  );
}

// Helper to parse item name and variant
function parseItemName(name: string): { name: string; variant?: string } {
  const match = name.match(/^(.+?)\s*\((.+)\)$/);
  if (match) {
    return { name: match[1].trim(), variant: match[2].trim() };
  }
  return { name };
}

// Copy Toast Component
function CopyToast({ visible, label }: { visible: boolean; label: string }) {
  return (
    <div
      className={cn(
        'fixed top-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg shadow-lg transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      )}
    >
      <span className="flex items-center gap-2">
        <Check className="w-4 h-4 text-emerald-400" />
        {label}
      </span>
    </div>
  );
}

export function OrderDetailsDrawer({ order, isOpen, onClose, onUpdateStatus }: OrderDetailsDrawerProps) {
  const router = useRouter();
  const { copied, label, copy } = useCopyToClipboard();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Check if status can be updated
  const allowedStatuses = order ? getAllowedNextStatuses(order.status) : [];
  const canUpdateStatus = allowedStatuses.length > 0 && !!onUpdateStatus;

  // Handle status update
  const handleStatusUpdate = (newStatus: OrderStatus) => {
    if (order && onUpdateStatus) {
      onUpdateStatus(order.id, newStatus);
      setShowStatusModal(false);
    }
  };

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
            {/* Copy Toast */}
            <CopyToast visible={copied} label={label} />

            {/* Executive Header */}
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
              {/* Top row: Order ID + Close */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{order.orderNumber}</h2>
                  <button
                    onClick={() => copy(order.orderNumber, 'Order ID copied')}
                    className="p-1.5 rounded-lg hover:bg-gray-200/80 transition-colors group"
                    title="Copy order number"
                  >
                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>
                  {order.priority && <PriorityChip priority={order.priority} />}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-200/80 transition-colors -mr-2 -mt-1"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Status + Meta Row */}
              <div className="flex items-center gap-3 mb-3">
                <OrderStatusBadge status={order.status} />
              </div>

              {/* Meta Row: Channel • Payment • Created */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  {getChannelIcon(order.customer.channel, 12)}
                  <span className="capitalize">{getChannelName(order.customer.channel)}</span>
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  {order.paymentMethod}
                </span>
                <span className="text-gray-300">•</span>
                <span>{formatShortDate(order.createdAt)}</span>
              </div>
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
                  {order.conversationId ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = `/inbox?conversation=${order.conversationId}`;
                          onClose();
                          // Use window.location for reliable navigation
                          window.location.href = url;
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View conversation
                      </button>
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/inbox?conversation=${order.conversationId}`;
                          copy(url, 'Conversation link copied');
                        }}
                        className="flex items-center justify-center p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Copy conversation link"
                      >
                        <Link2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      disabled
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
                      title="Not linked to a conversation yet"
                    >
                      <MessageSquare className="w-4 h-4" />
                      View conversation
                    </button>
                  )}
                  {order.customer.phone && (
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                  )}
                </div>
              </div>

              {/* Items Section - Card Layout */}
              <div className="px-6 py-5 border-b border-gray-100">
                <SectionHeader title="Items" icon={Package} />

                {/* Items Card */}
                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  {/* Item List */}
                  <div className="divide-y divide-gray-100">
                    {order.items.map((item) => {
                      const parsed = parseItemName(item.name);
                      return (
                        <div key={item.id} className="flex items-center justify-between px-4 py-3 bg-white">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{parsed.name}</p>
                            {parsed.variant && (
                              <p className="text-xs text-gray-500">{parsed.variant}</p>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 ml-4 whitespace-nowrap">
                            {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Totals - Right Aligned */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="space-y-1.5">
                      <div className="flex justify-end gap-8 text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="text-gray-700 w-24 text-right">{formatCurrency(order.totals.subtotal)}</span>
                      </div>
                      <div className="flex justify-end gap-8 text-sm">
                        <span className="text-gray-500">Shipping</span>
                        <span className="text-gray-700 w-24 text-right">
                          {order.totals.shipping === 0 ? 'Free' : formatCurrency(order.totals.shipping)}
                        </span>
                      </div>
                      {order.totals.discount > 0 && (
                        <div className="flex justify-end gap-8 text-sm">
                          <span className="text-gray-500">Discount</span>
                          <span className="text-emerald-600 w-24 text-right">-{formatCurrency(order.totals.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-end gap-8 text-sm font-semibold pt-2 border-t border-gray-200">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900 w-24 text-right">{formatCurrency(order.totals.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Status Row */}
                  <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
                    <span className="text-sm text-gray-600">Payment</span>
                    <PaymentStatusBadge status={order.paymentStatus} />
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
                      onClick={() => copy(order.trackingId || '', 'Tracking ID copied')}
                      className="p-1.5 rounded-lg hover:bg-purple-100 transition-colors group"
                    >
                      <Copy className="w-4 h-4 text-purple-600 group-hover:text-purple-700" />
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
              {canUpdateStatus ? (
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="w-full py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:brightness-110"
                  style={{
                    background: 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)',
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Update Status
                  </span>
                </button>
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-500">No further actions available</p>
                </div>
              )}
              <button
                disabled
                className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Refund Order
              </button>
            </div>

            {/* Status Update Modal */}
            <StatusUpdateModal
              isOpen={showStatusModal}
              currentStatus={order.status}
              orderNumber={order.orderNumber}
              onClose={() => setShowStatusModal(false)}
              onConfirm={handleStatusUpdate}
            />
          </>
        )}
      </div>
    </>
  );
}