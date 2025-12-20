'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Plus, Minus, Trash2, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChannelType } from '@/types';
import { getChannelIcon } from '@/components/shared/ChannelIcons';
import { PaymentStatus, ExtendedOrder, OrderItem, OrderCustomer, OrderAddress, OrderTotals, OrderTimelineEvent } from '@/lib/orders.mock';
import { OrderStatus } from './OrderStatusBadge';

// Initial values for prefilling from conversation
export interface CreateOrderInitialValues {
  conversationId?: string;
  customer?: {
    name?: string;
    handle?: string;
    email?: string;
    phone?: string;
  };
  channel?: ChannelType;
}

interface CreateOrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (order: ExtendedOrder) => void;
  existingOrderNumbers: string[];
  initialValues?: CreateOrderInitialValues;
}

// Form item type
interface FormItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

// Channel options
const CHANNELS: { value: ChannelType; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'messenger', label: 'Facebook' },
];

// Payment status options
const PAYMENT_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: 'paid', label: 'Paid' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'cod', label: 'COD' },
];

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Section Header Component
function SectionHeader({ title, required }: { title: string; required?: boolean }) {
  return (
    <div className="flex items-center gap-1 mb-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
      {required && <span className="text-red-500 text-xs">*</span>}
    </div>
  );
}

// Format currency
function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function CreateOrderDrawer({ isOpen, onClose, onCreate, existingOrderNumbers, initialValues }: CreateOrderDrawerProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerHandle, setCustomerHandle] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [channel, setChannel] = useState<ChannelType>('instagram');
  const [items, setItems] = useState<FormItem[]>([
    { id: generateId(), name: '', quantity: 1, price: 0 },
  ]);
  const [address, setAddress] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('unpaid');

  // Track if we're linked to a conversation
  const linkedConversationId = initialValues?.conversationId;

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Apply initial values when drawer opens
  useEffect(() => {
    if (isOpen && initialValues) {
      if (initialValues.customer?.name) setCustomerName(initialValues.customer.name);
      if (initialValues.customer?.handle) setCustomerHandle(initialValues.customer.handle);
      if (initialValues.customer?.email) setCustomerEmail(initialValues.customer.email);
      if (initialValues.customer?.phone) setCustomerPhone(initialValues.customer.phone);
      if (initialValues.channel) setChannel(initialValues.channel);
    }
  }, [isOpen, initialValues]);

  // Reset form
  const resetForm = useCallback(() => {
    setCustomerName('');
    setCustomerHandle('');
    setCustomerEmail('');
    setCustomerPhone('');
    setChannel('instagram');
    setItems([{ id: generateId(), name: '', quantity: 1, price: 0 }]);
    setAddress('');
    setPaymentStatus('unpaid');
    setErrors({});
    setIsSubmitting(false);
  }, []);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const total = subtotal; // No shipping/discount for now

  // Add item
  const addItem = () => {
    setItems([...items, { id: generateId(), name: '', quantity: 1, price: 0 }]);
  };

  // Remove item
  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  // Update item
  const updateItem = (id: string, field: keyof FormItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Increment/decrement quantity
  const adjustQuantity = (id: string, delta: number) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!channel) {
      newErrors.channel = 'Channel is required';
    }

    const validItems = items.filter((item) => item.name.trim());
    if (validItems.length === 0) {
      newErrors.items = 'At least one item with a name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generate next order number
  const generateOrderNumber = (): string => {
    const existingNumbers = existingOrderNumbers
      .map((num) => {
        const match = num.match(/ORD-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => n > 0);

    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 1000;
    return `ORD-${maxNumber + 1}`;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);

    // Simulate brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    const now = new Date();
    const orderNumber = generateOrderNumber();

    // Build order items
    const orderItems: OrderItem[] = items
      .filter((item) => item.name.trim())
      .map((item) => ({
        id: generateId(),
        name: item.name.trim(),
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price,
      }));

    // Build customer
    const customer: OrderCustomer = {
      name: customerName.trim(),
      handle: customerHandle.trim() || customerName.trim().toLowerCase().replace(/\s+/g, '_'),
      email: customerEmail.trim() || undefined,
      phone: customerPhone.trim() || undefined,
      channel,
    };

    // Build address
    const orderAddress: OrderAddress = {
      street: address.trim() || 'Address not provided',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    };

    // Build totals
    const orderTotals: OrderTotals = {
      subtotal,
      shipping: 0,
      discount: 0,
      total,
    };

    // Build timeline
    const timeline: OrderTimelineEvent[] = [
      {
        id: generateId(),
        status: 'NEW' as OrderStatus,
        label: 'Order created',
        description: linkedConversationId ? 'Order created from conversation' : 'Order created manually',
        timestamp: now,
      },
    ];

    // Build order
    const newOrder: ExtendedOrder = {
      id: generateId(),
      orderNumber,
      status: 'NEW' as OrderStatus,
      customer,
      items: orderItems,
      totals: orderTotals,
      address: orderAddress,
      timeline,
      paymentMethod: paymentStatus === 'cod' ? 'COD' : 'Pending',
      paymentStatus,
      conversationId: linkedConversationId || null,
      createdAt: now,
      updatedAt: now,
    };

    onCreate(newOrder);
    resetForm();
    setIsSubmitting(false);
  };

  // Handle close
  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isSubmitting, onClose, resetForm]);

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

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={handleClose}
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
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create order</h2>
              {linkedConversationId && (
                <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                  <Link2 className="w-3 h-3" />
                  Linked to conversation
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 rounded-lg hover:bg-gray-200/80 transition-colors -mr-2"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Customer Section */}
          <div className="px-6 py-5 border-b border-gray-100">
            <SectionHeader title="Customer" required />

            <div className="space-y-3">
              {/* Name */}
              <div>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer name"
                  className={cn(
                    'w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E]/20 focus:border-[#2F5D3E] transition-all',
                    errors.customerName ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                  )}
                />
                {errors.customerName && (
                  <p className="mt-1 text-xs text-red-500">{errors.customerName}</p>
                )}
              </div>

              {/* Handle */}
              <input
                type="text"
                value={customerHandle}
                onChange={(e) => setCustomerHandle(e.target.value)}
                placeholder="Handle (optional)"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E]/20 focus:border-[#2F5D3E] transition-all"
              />

              {/* Email & Phone row */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Email (optional)"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E]/20 focus:border-[#2F5D3E] transition-all"
                />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Phone (optional)"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E]/20 focus:border-[#2F5D3E] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Channel Section */}
          <div className="px-6 py-5 border-b border-gray-100">
            <SectionHeader title="Channel" required />

            <div className="flex gap-2">
              {CHANNELS.map((ch) => (
                <button
                  key={ch.value}
                  onClick={() => setChannel(ch.value)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 transition-all',
                    channel === ch.value
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  {getChannelIcon(ch.value, 16)}
                  <span className="text-sm font-medium text-gray-700">{ch.label}</span>
                </button>
              ))}
            </div>
            {errors.channel && (
              <p className="mt-2 text-xs text-red-500">{errors.channel}</p>
            )}
          </div>

          {/* Items Section */}
          <div className="px-6 py-5 border-b border-gray-100">
            <SectionHeader title="Items" required />

            {errors.items && (
              <p className="mb-3 text-xs text-red-500">{errors.items}</p>
            )}

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                >
                  {/* Item name */}
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    placeholder="Item name"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E]/20 focus:border-[#2F5D3E] transition-all"
                  />

                  {/* Qty and Price row */}
                  <div className="flex items-center gap-3 mt-3">
                    {/* Quantity stepper */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => adjustQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                          item.quantity <= 1
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        )}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => adjustQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price input */}
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={item.price || ''}
                        onChange={(e) =>
                          updateItem(item.id, 'price', Math.max(0, parseFloat(e.target.value) || 0))
                        }
                        placeholder="0"
                        min="0"
                        className="w-full pl-7 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E]/20 focus:border-[#2F5D3E] transition-all"
                      />
                    </div>

                    {/* Remove button */}
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Add item button */}
              <button
                onClick={addItem}
                className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add item
              </button>
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-500">Free</span>
              </div>
              <div className="flex justify-between text-sm font-semibold mt-2 pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Section */}
          <div className="px-6 py-5 border-b border-gray-100">
            <SectionHeader title="Shipping address" />

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter shipping address (optional)"
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E]/20 focus:border-[#2F5D3E] transition-all resize-none"
            />
          </div>

          {/* Payment Section */}
          <div className="px-6 py-5">
            <SectionHeader title="Payment" required />

            <div className="flex gap-2">
              {PAYMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPaymentStatus(opt.value)}
                  className={cn(
                    'flex-1 py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all',
                    paymentStatus === opt.value
                      ? 'border-gray-900 bg-gray-50 text-gray-900'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {paymentStatus === 'unpaid' && (
              <p className="mt-3 text-xs text-gray-500 bg-amber-50 px-3 py-2 rounded-lg">
                You can send a payment link from Inbox later
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition-all',
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'
              )}
              style={{
                background: 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)',
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create order'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
