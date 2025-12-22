'use client';

import { useEffect, useCallback, useState } from 'react';
import {
  X,
  Copy,
  Check,
  MessageSquare,
  MapPin,
  Truck,
  Package,
  CreditCard,
  ExternalLink,
  Link2,
  AlertCircle,
  RefreshCw,
  User,
  ChevronDown,
  XCircle,
  CheckCircle,
  Circle,
  Loader2,
  Ban,
  DollarSign,
  UserMinus,
  AlertTriangle,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/stores/useToastStore';
import * as ordersApi from '@/lib/ordersApi';
import {
  OrderStatus,
  OrderStatusBadge,
  getAllowedNextStatuses,
} from './OrderStatusBadge';
import { getChannelIcon, getChannelName } from '@/components/shared/ChannelIcons';
import { ChannelType } from '@/types';

interface OrderDetailsDrawerProps {
  orderId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated?: () => void;
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

// Format currency
function formatCurrency(amount: number, currency?: string | null): string {
  const symbol = currency === 'INR' ? '₹' : '$';
  return `${symbol}${amount.toLocaleString()}`;
}

// Format date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Format relative time
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
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

// Format full timestamp for tooltip
function formatFullTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Payment status config with enhanced styling
const PAYMENT_STATUS_CONFIG: Record<
  ordersApi.PaymentStatus,
  { label: string; bgColor: string; textColor: string; dotColor: string }
> = {
  UNPAID: {
    label: 'Unpaid',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    dotColor: 'bg-amber-500',
  },
  PAID: {
    label: 'Paid',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    dotColor: 'bg-emerald-500',
  },
  REFUNDED: {
    label: 'Refunded',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    dotColor: 'bg-purple-500',
  },
};

// Timeline icon and color mapping
function getTimelineConfig(type: string, actorType: string) {
  // Status changes
  if (type === 'CANCELLED' || type.includes('CANCELLED'))
    return { icon: XCircle, bgColor: 'bg-red-100', textColor: 'text-red-600' };
  if (type === 'DELIVERED' || type.includes('DELIVERED'))
    return { icon: CheckCircle, bgColor: 'bg-emerald-100', textColor: 'text-emerald-600' };
  if (type === 'SHIPPED' || type.includes('SHIPPED'))
    return { icon: Truck, bgColor: 'bg-purple-100', textColor: 'text-purple-600' };
  if (type === 'CONFIRMED' || type.includes('CONFIRMED'))
    return { icon: Check, bgColor: 'bg-blue-100', textColor: 'text-blue-600' };

  // Other actions
  if (type === 'PAYMENT_STATUS_CHANGED' || type.includes('PAYMENT'))
    return { icon: CreditCard, bgColor: 'bg-emerald-100', textColor: 'text-emerald-600' };
  if (type === 'ASSIGNED' || type.includes('ASSIGN'))
    return { icon: User, bgColor: 'bg-indigo-100', textColor: 'text-indigo-600' };
  if (type === 'UNASSIGNED')
    return { icon: UserMinus, bgColor: 'bg-gray-100', textColor: 'text-gray-500' };

  // Actor-based fallback
  if (actorType === 'SYSTEM')
    return { icon: Bot, bgColor: 'bg-gray-100', textColor: 'text-gray-500' };

  return { icon: Circle, bgColor: 'bg-gray-100', textColor: 'text-gray-500' };
}

// Section Header Component
function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
      {title}
    </h3>
  );
}

// Copy Toast Component
function CopyToast({ visible, label }: { visible: boolean; label: string }) {
  return (
    <div
      className={cn(
        'fixed top-6 left-1/2 -translate-x-1/2 z-[70] px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl shadow-xl transition-all duration-200',
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

// Payment Status Badge Component (enhanced)
function PaymentStatusBadge({
  status,
  size = 'default',
}: {
  status: ordersApi.PaymentStatus;
  size?: 'default' | 'small';
}) {
  const config = PAYMENT_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold rounded-md',
        config.bgColor,
        config.textColor,
        size === 'small' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dotColor)} />
      {config.label}
    </span>
  );
}

// Terminal State Banner
function TerminalStateBanner({
  status,
  paymentStatus,
}: {
  status: string;
  paymentStatus?: ordersApi.PaymentStatus | null;
}) {
  const isDelivered = status === 'DELIVERED';
  const isCancelled = status === 'CANCELLED';

  if (!isDelivered && !isCancelled) return null;

  return (
    <div
      className={cn(
        'mx-4 mt-4 p-3 rounded-xl flex items-center gap-3',
        isDelivered ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'
      )}
    >
      {isDelivered ? (
        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium', isDelivered ? 'text-emerald-800' : 'text-red-800')}>
          {isDelivered ? 'Order Delivered' : 'Order Cancelled'}
        </p>
        <p className={cn('text-xs', isDelivered ? 'text-emerald-600' : 'text-red-600')}>
          {isDelivered
            ? paymentStatus === 'PAID'
              ? 'Successfully completed and paid'
              : 'Successfully delivered'
            : 'This order has been cancelled'}
        </p>
      </div>
    </div>
  );
}

// Confirmation Modal Component
function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel,
  confirmVariant = 'danger',
  isLoading,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmVariant?: 'danger' | 'primary';
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onCancel} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-sm mx-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-5 pb-4">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  confirmVariant === 'danger' ? 'bg-red-100' : 'bg-blue-100'
                )}
              >
                <AlertTriangle
                  className={cn(
                    'w-5 h-5',
                    confirmVariant === 'danger' ? 'text-red-600' : 'text-blue-600'
                  )}
                />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{message}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-4 pt-0">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                'flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2',
                confirmVariant === 'danger'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-[#2F5D3E] hover:bg-[#285239]'
              )}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Action Button Component (enhanced)
function ActionButton({
  onClick,
  disabled,
  disabledReason,
  loading,
  variant = 'default',
  children,
  className,
}: {
  onClick: () => void;
  disabled?: boolean;
  disabledReason?: string;
  loading?: boolean;
  variant?: 'default' | 'danger' | 'primary' | 'ghost';
  children: React.ReactNode;
  className?: string;
}) {
  const baseStyles =
    'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:cursor-not-allowed relative group';
  const variantStyles = {
    default:
      'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400',
    danger:
      'bg-white border border-red-200 text-red-600 hover:bg-red-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200',
    primary:
      'bg-gradient-to-b from-[#2F5D3E] to-[#285239] text-white hover:brightness-110 shadow-sm disabled:from-gray-400 disabled:to-gray-500',
    ghost:
      'bg-transparent text-gray-600 hover:bg-gray-100 disabled:text-gray-400',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      title={disabled && disabledReason ? disabledReason : undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}

export function OrderDetailsDrawer({
  orderId,
  isOpen,
  onClose,
  onOrderUpdated,
}: OrderDetailsDrawerProps) {
  const { copied, label, copy } = useCopyToClipboard();
  const [isAnimating, setIsAnimating] = useState(false);

  // Data states
  const [order, setOrder] = useState<ordersApi.OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Action loading states
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Dropdown states
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'cancel' | 'refund' | null;
  }>({ isOpen: false, action: null });

  // Fetch order detail
  const fetchOrder = useCallback(async () => {
    if (!orderId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await ordersApi.getOrder(orderId);
      setOrder(data);
    } catch (err) {
      console.error('Failed to fetch order:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  // Fetch on open
  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrder();
    }
  }, [isOpen, orderId, fetchOrder]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !confirmModal.isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, confirmModal.isOpen]);

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

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside() {
      setShowPaymentDropdown(false);
      setShowAssignDropdown(false);
    }
    if (showPaymentDropdown || showAssignDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showPaymentDropdown, showAssignDropdown]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setOrder(null);
        setError(null);
        setConfirmModal({ isOpen: false, action: null });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const handleTransitionEnd = () => {
    if (!isOpen) {
      setIsAnimating(false);
    }
  };

  // Action handlers with toast feedback
  const handleAction = async (
    actionName: string,
    actionFn: () => Promise<ordersApi.OrderDetail>,
    successMessage: string
  ) => {
    if (!order || actionLoading) return;

    setActionLoading(actionName);
    try {
      const updatedOrder = await actionFn();
      setOrder(updatedOrder);
      onOrderUpdated?.();
      toast.success(successMessage);
    } catch (err) {
      console.error(`Failed to ${actionName}:`, err);
      const errorMsg = err instanceof Error ? err.message : `Failed to ${actionName}`;
      toast.error('Action failed', errorMsg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirm = () =>
    handleAction('confirm', () => ordersApi.confirmOrder(order!.id), 'Order confirmed');

  const handleShip = () =>
    handleAction('ship', () => ordersApi.shipOrder(order!.id), 'Order marked as shipped');

  const handleDeliver = () =>
    handleAction('deliver', () => ordersApi.deliverOrder(order!.id), 'Order marked as delivered');

  const handleCancel = async () => {
    setConfirmModal({ isOpen: false, action: null });
    await handleAction('cancel', () => ordersApi.cancelOrder(order!.id), 'Order cancelled');
  };

  const handleRefund = async () => {
    setConfirmModal({ isOpen: false, action: null });
    await handleAction('refund', () => ordersApi.refundOrder(order!.id), 'Refund issued');
  };

  const handlePaymentStatus = async (status: ordersApi.PaymentStatus) => {
    setShowPaymentDropdown(false);
    const statusLabels = { UNPAID: 'unpaid', PAID: 'paid', REFUNDED: 'refunded' };
    await handleAction(
      'payment',
      () => ordersApi.updatePaymentStatus(order!.id, { paymentStatus: status }),
      `Payment marked as ${statusLabels[status]}`
    );
  };

  const handleAssign = async (userId: number | null) => {
    setShowAssignDropdown(false);
    const message = userId ? 'Order assigned' : 'Order unassigned';
    await handleAction(
      'assign',
      () => ordersApi.assignOrder(order!.id, { assignedToUserId: userId }),
      message
    );
  };

  // Determine allowed actions based on status
  const allowedNextStatuses = order
    ? getAllowedNextStatuses(order.orderStatus as OrderStatus)
    : [];
  const canConfirm = allowedNextStatuses.includes('CONFIRMED');
  const canShip = allowedNextStatuses.includes('SHIPPED');
  const canDeliver = allowedNextStatuses.includes('DELIVERED');
  const canCancel = allowedNextStatuses.includes('CANCELLED');
  const canRefund = order?.paymentStatus === 'PAID';
  const isTerminal =
    order?.orderStatus === 'DELIVERED' || order?.orderStatus === 'CANCELLED';

  // Get primary action
  const getPrimaryAction = () => {
    if (canConfirm) return { action: handleConfirm, label: 'Confirm Order', icon: Check };
    if (canShip) return { action: handleShip, label: 'Mark Shipped', icon: Truck };
    if (canDeliver) return { action: handleDeliver, label: 'Mark Delivered', icon: CheckCircle };
    return null;
  };

  const primaryAction = getPrimaryAction();

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
        onTransitionEnd={handleTransitionEnd}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full sm:w-[600px] bg-white shadow-2xl flex flex-col',
          'transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Copy Toast */}
        <CopyToast visible={copied} label={label} />

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-3">
                <Skeleton className="w-36 h-8 rounded-lg" />
                <div className="flex gap-2">
                  <Skeleton className="w-20 h-6 rounded-md" />
                  <Skeleton className="w-16 h-6 rounded-md" />
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-6">
              <Skeleton className="w-full h-28 rounded-xl" />
              <Skeleton className="w-full h-36 rounded-xl" />
              <Skeleton className="w-full h-24 rounded-xl" />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-gray-900 font-semibold mb-1">Failed to load order</p>
            <p className="text-sm text-gray-500 mb-6 text-center max-w-xs">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={fetchOrder}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Order Content */}
        {order && !isLoading && !error && (
          <>
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100">
              {/* Top row: Order ID + Close */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                      {order.orderNumber}
                    </h2>
                    <button
                      onClick={() => copy(order.orderNumber, 'Order ID copied')}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors group"
                      title="Copy order number"
                    >
                      <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    </button>
                  </div>
                  {/* Status Badges */}
                  <div className="flex items-center gap-2">
                    <OrderStatusBadge status={order.orderStatus as OrderStatus} />
                    {order.paymentStatus && (
                      <PaymentStatusBadge status={order.paymentStatus} />
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 -mt-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Meta Row */}
              <div className="flex items-center gap-3 text-sm text-gray-500">
                {order.channel && (
                  <>
                    <span className="flex items-center gap-1.5">
                      {getChannelIcon(order.channel.toLowerCase() as ChannelType, 14)}
                      <span>{getChannelName(order.channel.toLowerCase() as ChannelType)}</span>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                  </>
                )}
                {order.paymentMethod && (
                  <>
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" />
                      {order.paymentMethod}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                  </>
                )}
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>

            {/* Terminal State Banner */}
            <TerminalStateBanner
              status={order.orderStatus}
              paymentStatus={order.paymentStatus}
            />

            {/* Main Content - Two Column Layout */}
            <div className="flex-1 overflow-hidden flex">
              {/* Left Column - Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Customer Section */}
                <div className="px-6 py-5">
                  <SectionHeader title="Customer" />
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-gray-600">
                        {(order.customerName || order.customerHandle || 'U')
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {order.customerName || 'Unknown'}
                        </p>
                        {order.channel && (
                          <span className="flex-shrink-0">
                            {getChannelIcon(order.channel.toLowerCase() as ChannelType, 14)}
                          </span>
                        )}
                      </div>
                      {order.customerHandle && (
                        <p className="text-sm text-gray-500">@{order.customerHandle}</p>
                      )}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="flex gap-2 mt-4">
                    {order.conversationId ? (
                      <a
                        href={`/inbox?conversation=${order.conversationId}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View conversation
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 text-gray-400 rounded-xl text-sm font-medium cursor-not-allowed"
                        title="Not linked to a conversation"
                      >
                        <MessageSquare className="w-4 h-4" />
                        No conversation
                      </button>
                    )}
                    {order.leadId && (
                      <a
                        href={`/leads?lead=${order.leadId}`}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        <Link2 className="w-4 h-4" />
                        Lead
                      </a>
                    )}
                  </div>

                  {/* Total Amount Card */}
                  <div className="mt-5 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Amount</span>
                      <span className="text-xl font-bold text-gray-900">
                        {formatCurrency(order.totalAmount || 0, order.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-2 bg-gray-50" />

                {/* Items Section */}
                <div className="px-6 py-5">
                  <SectionHeader title="Items" />

                  {order.items.length > 0 ? (
                    <div className="rounded-xl border border-gray-100 overflow-hidden">
                      <div className="divide-y divide-gray-100">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between px-4 py-3.5 bg-white"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <Package className="w-4 h-4 text-gray-400" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.quantity} × {formatCurrency(item.unitPrice, order.currency)}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 ml-4">
                              {formatCurrency(item.lineTotal, order.currency)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Subtotal */}
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-600">Subtotal</span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(
                              order.items.reduce((sum, i) => sum + i.lineTotal, 0),
                              order.currency
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-sm text-gray-400">
                      No items in this order
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-2 bg-gray-50" />

                {/* Shipping Section */}
                <div className="px-6 py-5">
                  <SectionHeader title="Shipping" />

                  {order.shippingAddress &&
                  (order.shippingAddress.line1 || order.shippingAddress.city) ? (
                    <div className="rounded-xl border border-gray-100 p-4 bg-white">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-700 space-y-0.5">
                          {order.shippingAddress.line1 && (
                            <p className="font-medium text-gray-900">
                              {order.shippingAddress.line1}
                            </p>
                          )}
                          {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                          <p>
                            {[
                              order.shippingAddress.city,
                              order.shippingAddress.state,
                              order.shippingAddress.postalCode,
                            ]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                          {order.shippingAddress.country && (
                            <p className="text-gray-500">{order.shippingAddress.country}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center">
                      <MapPin className="w-5 h-5 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No shipping address</p>
                    </div>
                  )}

                  {/* Tracking Info */}
                  {order.tracking && (order.tracking.carrier || order.tracking.trackingId) ? (
                    <div className="mt-3 flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                      <Truck className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        {order.tracking.carrier && (
                          <p className="text-sm font-medium text-gray-900">
                            {order.tracking.carrier}
                          </p>
                        )}
                        {order.tracking.trackingId && (
                          <p className="text-xs text-purple-700 font-mono">
                            {order.tracking.trackingId}
                          </p>
                        )}
                      </div>
                      {order.tracking.trackingUrl ? (
                        <a
                          href={order.tracking.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-purple-600" />
                        </a>
                      ) : order.tracking.trackingId ? (
                        <button
                          onClick={() => copy(order.tracking!.trackingId!, 'Tracking ID copied')}
                          className="p-2 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          <Copy className="w-4 h-4 text-purple-600" />
                        </button>
                      ) : null}
                    </div>
                  ) : order.orderStatus === 'SHIPPED' ? (
                    <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
                      <p className="text-sm text-amber-700">No tracking info added</p>
                    </div>
                  ) : null}
                </div>

                {/* Divider */}
                <div className="h-2 bg-gray-50" />

                {/* Timeline Section */}
                <div className="px-6 py-5">
                  <SectionHeader title="Activity" />

                  {order.timeline.length > 0 ? (
                    <div className="relative">
                      {/* Vertical line */}
                      <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-100" />

                      <div className="space-y-0">
                        {order.timeline
                          .slice()
                          .reverse()
                          .map((event, index, arr) => {
                            const config = getTimelineConfig(event.type, event.actorType);
                            const Icon = config.icon;
                            const isLast = index === arr.length - 1;

                            return (
                              <div key={event.id} className="flex gap-3 relative">
                                {/* Icon */}
                                <div
                                  className={cn(
                                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10',
                                    config.bgColor
                                  )}
                                >
                                  <Icon className={cn('w-4 h-4', config.textColor)} />
                                </div>

                                {/* Content */}
                                <div className={cn('flex-1 min-w-0 pb-5', isLast && 'pb-0')}>
                                  <p className="text-sm font-medium text-gray-900 leading-snug">
                                    {event.description}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {/* Actor badge */}
                                    <span
                                      className={cn(
                                        'text-[10px] font-medium px-1.5 py-0.5 rounded',
                                        event.actorType === 'SYSTEM'
                                          ? 'bg-gray-100 text-gray-500'
                                          : 'bg-blue-50 text-blue-600'
                                      )}
                                    >
                                      {event.actorType === 'USER' && event.actorUserName
                                        ? event.actorUserName
                                        : event.actorType === 'SYSTEM'
                                          ? 'System'
                                          : 'Unknown'}
                                    </span>
                                    <span
                                      className="text-xs text-gray-400 cursor-default"
                                      title={formatFullTimestamp(event.createdAt)}
                                    >
                                      {formatRelativeTime(event.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-sm text-gray-400">
                      No activity yet
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar - Actions */}
              <div className="w-56 border-l border-gray-100 bg-gray-50/80 flex flex-col">
                {/* Assignee Section - At Top */}
                <div className="p-4 border-b border-gray-100 bg-white">
                  <SectionHeader title="Assigned To" />
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAssignDropdown(!showAssignDropdown);
                      }}
                      disabled={!!actionLoading}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-xl text-sm transition-all',
                        order.assignedToUserName
                          ? 'bg-gray-50 hover:bg-gray-100'
                          : 'bg-amber-50 border border-dashed border-amber-200 hover:bg-amber-100'
                      )}
                    >
                      {order.assignedToUserName ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                            {order.assignedToUserName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <span className="text-gray-900 font-medium truncate flex-1 text-left">
                            {order.assignedToUserName}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-amber-600" />
                          </div>
                          <span className="text-amber-700 font-medium flex-1 text-left">
                            Unassigned
                          </span>
                        </>
                      )}
                      {actionLoading === 'assign' ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </button>

                    {showAssignDropdown && (
                      <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                        <button
                          onClick={() => handleAssign(null)}
                          className="w-full px-4 py-3 text-sm text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                        >
                          <UserMinus className="w-4 h-4 text-gray-400" />
                          <span>Unassign</span>
                        </button>
                        <button
                          onClick={() => handleAssign(1)}
                          className="w-full px-4 py-3 text-sm text-left flex items-center gap-3 hover:bg-gray-50 transition-colors border-t border-gray-100"
                        >
                          <User className="w-4 h-4 text-gray-400" />
                          <span>Assign to me</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Primary Action */}
                  {primaryAction && (
                    <div>
                      <SectionHeader title="Next Step" />
                      <ActionButton
                        onClick={primaryAction.action}
                        loading={
                          actionLoading === 'confirm' ||
                          actionLoading === 'ship' ||
                          actionLoading === 'deliver'
                        }
                        disabled={!!actionLoading}
                        variant="primary"
                        className="w-full"
                      >
                        <primaryAction.icon className="w-4 h-4" />
                        {primaryAction.label}
                      </ActionButton>
                    </div>
                  )}

                  {/* Secondary Actions */}
                  {canCancel && (
                    <div>
                      <SectionHeader title="Other Actions" />
                      <ActionButton
                        onClick={() => setConfirmModal({ isOpen: true, action: 'cancel' })}
                        disabled={!!actionLoading}
                        variant="danger"
                        className="w-full"
                      >
                        <Ban className="w-4 h-4" />
                        Cancel Order
                      </ActionButton>
                    </div>
                  )}

                  {/* Payment Section */}
                  <div>
                    <SectionHeader title="Payment" />
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPaymentDropdown(!showPaymentDropdown);
                        }}
                        disabled={!!actionLoading}
                        className="w-full flex items-center justify-between gap-2 p-3 bg-white border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <span className="flex items-center gap-2">
                          {order.paymentStatus ? (
                            <PaymentStatusBadge status={order.paymentStatus} size="small" />
                          ) : (
                            <span className="text-gray-500">Unknown</span>
                          )}
                        </span>
                        {actionLoading === 'payment' ? (
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </button>

                      {showPaymentDropdown && (
                        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                          {(['UNPAID', 'PAID', 'REFUNDED'] as ordersApi.PaymentStatus[]).map(
                            (status) => (
                              <button
                                key={status}
                                onClick={() => handlePaymentStatus(status)}
                                disabled={order.paymentStatus === status}
                                className={cn(
                                  'w-full px-4 py-2.5 text-sm text-left flex items-center gap-3 hover:bg-gray-50 transition-colors',
                                  order.paymentStatus === status && 'bg-gray-50 cursor-default'
                                )}
                              >
                                <span
                                  className={cn(
                                    'w-2 h-2 rounded-full',
                                    PAYMENT_STATUS_CONFIG[status].dotColor
                                  )}
                                />
                                <span className="flex-1">{PAYMENT_STATUS_CONFIG[status].label}</span>
                                {order.paymentStatus === status && (
                                  <Check className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>

                    {/* Refund Button */}
                    {canRefund && (
                      <ActionButton
                        onClick={() => setConfirmModal({ isOpen: true, action: 'refund' })}
                        disabled={!!actionLoading}
                        variant="default"
                        className="w-full mt-2"
                      >
                        <DollarSign className="w-4 h-4" />
                        Issue Refund
                      </ActionButton>
                    )}
                  </div>

                  {/* Terminal State Message */}
                  {isTerminal && !canCancel && (
                    <div className="text-center py-4">
                      <p className="text-xs text-gray-400">
                        {order.orderStatus === 'DELIVERED'
                          ? 'Order completed'
                          : 'Order cancelled'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Notes (if present) */}
                {order.notes && (
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <SectionHeader title="Notes" />
                    <p className="text-sm text-gray-600 leading-relaxed">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen && confirmModal.action === 'cancel'}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmLabel="Cancel Order"
        confirmVariant="danger"
        isLoading={actionLoading === 'cancel'}
        onConfirm={handleCancel}
        onCancel={() => setConfirmModal({ isOpen: false, action: null })}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen && confirmModal.action === 'refund'}
        title="Issue Refund"
        message="Are you sure you want to refund this order? The payment will be returned to the customer."
        confirmLabel="Issue Refund"
        confirmVariant="danger"
        isLoading={actionLoading === 'refund'}
        onConfirm={handleRefund}
        onCancel={() => setConfirmModal({ isOpen: false, action: null })}
      />
    </>
  );
}
