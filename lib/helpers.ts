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
    Inquiry: 'bg-blue-500 text-white border-blue-600',
    Order: 'bg-emerald-500 text-white border-emerald-600',
    Payment: 'bg-amber-500 text-white border-amber-600',
    Delivery: 'bg-purple-500 text-white border-purple-600',
    Issue: 'bg-rose-500 text-white border-rose-600',
    Other: 'bg-slate-500 text-white border-slate-600',
  };
  return colors[intent];
}

export function getLeadStatusColor(status: LeadStatus): string {
  const colors: Record<LeadStatus, string> = {
    'New': 'bg-blue-500 text-white',
    'In Progress': 'bg-amber-500 text-white',
    'Converted': 'bg-emerald-500 text-white',
    'Closed': 'bg-slate-500 text-white',
  };
  return colors[status];
}

export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    'Pending': 'bg-amber-500 text-white',
    'Paid': 'bg-blue-500 text-white',
    'Shipped': 'bg-emerald-500 text-white',
    'Cancelled': 'bg-rose-500 text-white',
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
