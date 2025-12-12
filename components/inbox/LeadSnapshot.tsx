'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Clock,
  DollarSign,
  ExternalLink,
  Plus,
  Star,
  ChevronDown,
} from 'lucide-react';
import { Lead, ChannelType, IntentType, LeadStatus } from '@/types';

interface LeadSnapshotProps {
  lead: Lead | null;
}

// Instagram gradient icon
const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="ig-gradient-lead" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFDC80" />
        <stop offset="25%" stopColor="#F77737" />
        <stop offset="50%" stopColor="#E1306C" />
        <stop offset="75%" stopColor="#C13584" />
        <stop offset="100%" stopColor="#833AB4" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-gradient-lead)" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" stroke="url(#ig-gradient-lead)" strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig-gradient-lead)" />
  </svg>
);

// WhatsApp icon
const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
      fill="#25D366"
    />
    <path
      d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.66 0-3.203-.51-4.484-1.375l-3.016.896.896-3.016A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"
      fill="#25D366"
    />
  </svg>
);

// Facebook Messenger icon
const MessengerIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="msg-gradient-lead" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0099FF" />
        <stop offset="100%" stopColor="#A033FF" />
      </linearGradient>
    </defs>
    <path
      d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.13.26.35.27.57l.05 1.78c.02.63.67 1.04 1.24.79l1.99-.88c.17-.07.36-.09.54-.05.91.25 1.87.38 2.77.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2z"
      fill="url(#msg-gradient-lead)"
    />
    <path
      d="M6.53 14.75l2.68-4.26c.43-.68 1.35-.85 1.98-.36l2.13 1.6c.2.15.47.15.67 0l2.87-2.18c.38-.29.88.14.63.54l-2.68 4.26c-.43.68-1.35.85-1.98.36l-2.13-1.6c-.2-.15-.47-.15-.67 0l-2.87 2.18c-.38.29-.88-.14-.63-.54z"
      fill="white"
    />
  </svg>
);

const getChannelIcon = (channel: ChannelType) => {
  switch (channel) {
    case 'instagram':
      return <InstagramIcon size={16} />;
    case 'whatsapp':
      return <WhatsAppIcon size={16} />;
    case 'messenger':
      return <MessengerIcon size={16} />;
  }
};

const intentOptions: IntentType[] = ['Order', 'Query', 'Lead'];
const statusOptions: LeadStatus[] = ['New Lead', 'Hot Lead', 'Warm Lead', 'Cold Lead', 'Converted', 'Lost'];

// Editable field component
interface EditableFieldProps {
  value: string | number;
  onSave: (value: number) => void;
  prefix?: string;
  min?: number;
}

function EditableField({ value, onSave, prefix = '', min = 0 }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));

  const handleSave = () => {
    setIsEditing(false);
    const numValue = Math.max(min, Number(editValue) || 0);
    setEditValue(String(numValue));
    onSave(numValue);
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(String(value));
    }
  };

  if (isEditing) {
    return (
      <input
        type="number"
        min={min}
        step="any"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="text-xl font-semibold text-gray-900 bg-white border border-blue-500 rounded px-1 w-full focus:outline-none"
      />
    );
  }

  return (
    <p
      onClick={() => setIsEditing(true)}
      className="text-xl font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 rounded px-1 -mx-1 transition-colors"
    >
      {prefix}{value}
    </p>
  );
}

export default function LeadSnapshot({ lead }: LeadSnapshotProps) {
  const [intent, setIntent] = useState<IntentType>(lead?.intent || 'Order');
  const [status, setStatus] = useState<LeadStatus>(lead?.status || 'New Lead');
  const [notes, setNotes] = useState(lead?.notes || '');
  const [orders, setOrders] = useState(lead?.orders || 0);
  const [leadValue, setLeadValue] = useState(lead?.leadValue || 0);

  // Update state when lead changes
  useEffect(() => {
    if (lead) {
      setIntent(lead.intent);
      setStatus(lead.status);
      setNotes(lead.notes);
      setOrders(lead.orders);
      setLeadValue(lead.leadValue);
    }
  }, [lead]);

  if (!lead) {
    return (
      <div className="w-[320px] border-l border-gray-200 bg-white flex items-center justify-center">
        <p className="text-gray-500 text-sm">Select a conversation to view lead details</p>
      </div>
    );
  }

  return (
    <div className="w-[320px] border-l border-gray-200 bg-white flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="p-6 text-center border-b border-gray-100">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Lead Snapshot</p>

        {/* Avatar */}
        <div className="w-20 h-20 bg-[#1a1f2e] rounded-full flex items-center justify-center text-white text-2xl font-semibold mx-auto mb-3">
          {lead.initials}
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-1">{lead.name}</h2>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          {getChannelIcon(lead.channel)}
          <span className="text-sm capitalize">{lead.channel}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 space-y-5">
          {/* Intent */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
              Intent
            </label>
            <div className="relative">
              <select
                value={intent}
                onChange={(e) => setIntent(e.target.value as IntentType)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {intentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Lead Status */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
              Lead Status
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Quick Insights - Editable */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-3">
              Quick Insights
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <ShoppingCart size={14} />
                  <span className="text-xs">Orders</span>
                </div>
                <EditableField
                  value={orders}
                  min={0}
                  onSave={(val) => setOrders(val)}
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Clock size={14} />
                  <span className="text-xs">Last Reply</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{lead.lastReply}</p>
              </div>
              <div className="col-span-2 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <DollarSign size={14} />
                  <span className="text-xs">Lead Value</span>
                </div>
                <EditableField
                  value={leadValue.toFixed(2)}
                  prefix="$"
                  min={0}
                  onSave={(val) => setLeadValue(val)}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-3">
              Actions
            </label>
            <div className="space-y-2">
              <button className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
                <ExternalLink size={16} />
                View Lead
              </button>
              <button className="w-full px-4 py-2.5 bg-[#1a8f6c] text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#167a5c] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <Plus size={16} />
                Create Order
              </button>
              <button className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
                <Star size={16} />
                Mark as VIP
              </button>
            </div>
          </div>

        {/* Internal Notes */}
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
            Internal Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this lead..."
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 hover:shadow-sm transition-all duration-200">
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
}
