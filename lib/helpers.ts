import { formatDistanceToNow, format } from 'date-fns';
import { IntentType, LeadStatus, OrderStatus } from '@/types';

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

export function getLeadStatusColor(status: LeadStatus): string {
  const colors: Record<LeadStatus, string> = {
    'New': 'bg-blue-100 text-blue-700 border border-blue-200',
    'Contacted': 'bg-amber-100 text-amber-700 border border-amber-200',
    'Qualified': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    'Converted': 'bg-purple-100 text-purple-700 border border-purple-200',
    'Lost': 'bg-slate-100 text-slate-600 border border-slate-200',
  };
  return colors[status];
}

export function getLeadStatusDot(status: LeadStatus): string {
  const colors: Record<LeadStatus, string> = {
    'New': 'bg-blue-500',
    'Contacted': 'bg-amber-500',
    'Qualified': 'bg-emerald-500',
    'Converted': 'bg-purple-500',
    'Lost': 'bg-slate-400',
  };
  return colors[status];
}

export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    'NEW': 'bg-gray-400 text-white',
    'PENDING': 'bg-amber-500 text-white',
    'CONFIRMED': 'bg-blue-500 text-white',
    'SHIPPED': 'bg-purple-500 text-white',
    'DELIVERED': 'bg-emerald-500 text-white',
    'CANCELLED': 'bg-rose-500 text-white',
  };
  return colors[status];
}

export function getInitials(name: string): string {
  return name
    .split(/[_\s]/)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
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
