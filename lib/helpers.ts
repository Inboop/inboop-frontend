import { formatDistanceToNow, format } from 'date-fns';
import {
  IntentType,
  IntentLabel,
  LeadStatus,
  LeadSource,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  MessageDirection,
  SenderType,
} from '@/types';

export function formatMessageTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const daysDiff = diff / (1000 * 60 * 60 * 24);

  if (daysDiff < 1) {
    // Today - show time like "10:30 AM"
    return format(date, 'h:mm a');
  } else if (daysDiff < 7) {
    // This week - show day and time like "Mon 10:30 AM"
    return format(date, 'EEE h:mm a');
  } else {
    // Older - show date like "Dec 12, 2024"
    return format(date, 'MMM d, yyyy');
  }
}

// Legacy intent colors
export function getIntentColor(intent: IntentType): string {
  const colors: Record<IntentType, string> = {
    Inquiry: 'bg-blue-50 text-blue-700 border border-blue-200',
    Order: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Payment: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    Delivery: 'bg-purple-50 text-purple-700 border border-purple-200',
    Issue: 'bg-red-50 text-red-700 border border-red-200',
    Other: 'bg-gray-50 text-gray-700 border border-gray-200',
  };
  return colors[intent];
}

// New AI intent label colors
export function getIntentLabelColor(intent: IntentLabel): string {
  const colors: Record<IntentLabel, string> = {
    BUYING: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    SUPPORT: 'bg-amber-50 text-amber-700 border border-amber-200',
    BROWSING: 'bg-blue-50 text-blue-700 border border-blue-200',
    SPAM: 'bg-red-50 text-red-700 border border-red-200',
    OTHER: 'bg-gray-50 text-gray-700 border border-gray-200',
  };
  return colors[intent];
}

export function getIntentLabelDisplayName(intent: IntentLabel): string {
  const names: Record<IntentLabel, string> = {
    BUYING: 'Buying',
    SUPPORT: 'Support',
    BROWSING: 'Browsing',
    SPAM: 'Spam',
    OTHER: 'Other',
  };
  return names[intent];
}

export function getLeadStatusColor(status: LeadStatus): string {
  const colors: Record<LeadStatus, string> = {
    'New': 'bg-blue-100 text-blue-700 border border-blue-200',
    'Contacted': 'bg-amber-100 text-amber-700 border border-amber-200',
    'Qualified': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    'Negotiating': 'bg-orange-100 text-orange-700 border border-orange-200',
    'Converted': 'bg-purple-100 text-purple-700 border border-purple-200',
    'Closed': 'bg-slate-100 text-slate-700 border border-slate-200',
    'Lost': 'bg-rose-100 text-rose-600 border border-rose-200',
    'Spam': 'bg-red-100 text-red-600 border border-red-200',
  };
  return colors[status];
}

export function getLeadStatusDot(status: LeadStatus): string {
  const colors: Record<LeadStatus, string> = {
    'New': 'bg-blue-500',
    'Contacted': 'bg-amber-500',
    'Qualified': 'bg-emerald-500',
    'Negotiating': 'bg-orange-500',
    'Converted': 'bg-purple-500',
    'Closed': 'bg-slate-400',
    'Lost': 'bg-rose-500',
    'Spam': 'bg-red-500',
  };
  return colors[status];
}

// Check if lead status is terminal (no further transitions)
export function isTerminalLeadStatus(status: LeadStatus): boolean {
  return status === 'Converted' || status === 'Closed' || status === 'Lost';
}

// Get available status transitions for a lead
export function getLeadStatusTransitions(currentStatus: LeadStatus): LeadStatus[] {
  if (isTerminalLeadStatus(currentStatus)) {
    return []; // No transitions from terminal states
  }
  // From NEW, can go to any terminal state
  return ['Converted', 'Closed', 'Lost'];
}

// Lead source helpers
export function getLeadSourceColor(source: LeadSource): string {
  const colors: Record<LeadSource, string> = {
    AI: 'bg-violet-100 text-violet-700 border border-violet-200',
    MANUAL: 'bg-gray-100 text-gray-700 border border-gray-200',
  };
  return colors[source];
}

export function getLeadSourceDisplayName(source: LeadSource): string {
  const names: Record<LeadSource, string> = {
    AI: 'AI Detected',
    MANUAL: 'Manual',
  };
  return names[source];
}

export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    'NEW': 'bg-gray-400 text-white',
    'PENDING': 'bg-amber-500 text-white',
    'CONFIRMED': 'bg-blue-500 text-white',
    'PROCESSING': 'bg-indigo-500 text-white',
    'SHIPPED': 'bg-purple-500 text-white',
    'DELIVERED': 'bg-emerald-500 text-white',
    'CANCELLED': 'bg-rose-500 text-white',
  };
  return colors[status];
}

export function getOrderStatusDisplayName(status: OrderStatus): string {
  const names: Record<OrderStatus, string> = {
    NEW: 'New',
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  };
  return names[status];
}

// Payment status helpers
export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    UNPAID: 'bg-amber-100 text-amber-700 border border-amber-200',
    PAID: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    REFUNDED: 'bg-rose-100 text-rose-700 border border-rose-200',
  };
  return colors[status];
}

export function getPaymentStatusDisplayName(status: PaymentStatus): string {
  const names: Record<PaymentStatus, string> = {
    UNPAID: 'Unpaid',
    PAID: 'Paid',
    REFUNDED: 'Refunded',
  };
  return names[status];
}

// Payment method helpers
export function getPaymentMethodDisplayName(method: PaymentMethod): string {
  const names: Record<PaymentMethod, string> = {
    ONLINE: 'Online',
    COD: 'Cash on Delivery',
    MANUAL: 'Manual',
    BANK_TRANSFER: 'Bank Transfer',
  };
  return names[method];
}

// Message direction helpers
export function isInboundMessage(direction?: MessageDirection, isFromCustomer?: boolean): boolean {
  if (direction) {
    return direction === 'INBOUND';
  }
  return isFromCustomer === true;
}

export function isOutboundMessage(direction?: MessageDirection, isFromCustomer?: boolean): boolean {
  if (direction) {
    return direction === 'OUTBOUND';
  }
  return isFromCustomer === false;
}

export function getSenderTypeDisplayName(senderType: SenderType): string {
  const names: Record<SenderType, string> = {
    CUSTOMER: 'Customer',
    BUSINESS: 'Business',
    SYSTEM: 'System',
  };
  return names[senderType];
}

export function getInitials(name: string): string {
  return name
    .split(/[_\s]/)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  // Add more currencies as needed
  return `${currency} ${amount.toLocaleString()}`;
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Under an hour - show minutes
  if (minutes < 60) {
    return minutes <= 1 ? 'Just now' : `${minutes}m ago`;
  }

  // Under 24 hours - show hours
  if (hours < 24) {
    return `${hours}h ago`;
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${format(date, 'h:mm a')}`;
  }

  // Within a week - show days ago
  if (days < 7) {
    return `${days}d ago`;
  }

  // Older than a week - show date
  return format(date, 'MMM d');
}

// Format intent confidence as percentage
export function formatConfidence(confidence?: number): string {
  if (confidence === undefined || confidence === null) {
    return '';
  }
  return `${Math.round(confidence * 100)}%`;
}
