'use client';

import { LucideIcon, Circle, Clock, Check, Truck, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Canonical order status enum
export type OrderStatus = 'NEW' | 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// Status configuration with label, colors, and icon
interface StatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
  dotColor: string;
  Icon: LucideIcon;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  NEW: {
    label: 'New',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    dotColor: 'bg-gray-400',
    Icon: Circle,
  },
  PENDING: {
    label: 'Pending',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    dotColor: 'bg-amber-500',
    Icon: Clock,
  },
  CONFIRMED: {
    label: 'Confirmed',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    dotColor: 'bg-blue-500',
    Icon: Check,
  },
  SHIPPED: {
    label: 'Shipped',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    dotColor: 'bg-purple-500',
    Icon: Truck,
  },
  DELIVERED: {
    label: 'Delivered',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    dotColor: 'bg-emerald-500',
    Icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Cancelled',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    dotColor: 'bg-red-400',
    Icon: XCircle,
  },
};

// All status values for filter iteration
export const ORDER_STATUSES: OrderStatus[] = [
  'NEW',
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

interface OrderStatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
  className?: string;
}

export function OrderStatusBadge({ status, showIcon = true, className }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status];
  const { Icon, label, bgColor, textColor } = config;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold',
        bgColor,
        textColor,
        className
      )}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {label}
    </span>
  );
}

// Helper to get dot color for filter pills
export function getStatusDotColor(status: OrderStatus): string {
  return ORDER_STATUS_CONFIG[status].dotColor;
}

// Helper to get status label
export function getStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_CONFIG[status].label;
}

// Valid status transitions
const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  NEW: ['PENDING', 'CANCELLED'],
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

// Helper to get allowed next statuses
export function getAllowedNextStatuses(currentStatus: OrderStatus): OrderStatus[] {
  return STATUS_TRANSITIONS[currentStatus] || [];
}

// Helper to check if a transition is valid
export function isValidTransition(from: OrderStatus, to: OrderStatus): boolean {
  return STATUS_TRANSITIONS[from]?.includes(to) || false;
}