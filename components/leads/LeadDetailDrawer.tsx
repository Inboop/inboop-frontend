'use client';

import { Lead, IntentType, LeadStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, MessageSquare, ShoppingCart, ExternalLink, Save, Instagram, Phone, MessageCircle, Sparkles, User } from 'lucide-react';
import {
  getIntentColor,
  getLeadStatusColor,
  getLeadStatusDot,
  getLeadSourceColor,
  getLeadSourceDisplayName,
  getInitials,
  formatMessageTime,
  isTerminalLeadStatus,
} from '@/lib/helpers';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface LeadDetailDrawerProps {
  lead: Lead | null;
  onClose: () => void;
}

export function LeadDetailDrawer({ lead, onClose }: LeadDetailDrawerProps) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(lead?.status || 'New');
  const [originalStatus, setOriginalStatus] = useState<LeadStatus>(lead?.status || 'New');
  const [notes, setNotes] = useState(lead?.notes || '');
  const [originalNotes, setOriginalNotes] = useState(lead?.notes || '');
  const [isVisible, setIsVisible] = useState(false);

  // Handle open/close animations
  useEffect(() => {
    if (lead) {
      // Small delay to trigger animation
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
    }
  }, [lead]);

  // Update state when lead changes
  useEffect(() => {
    if (lead) {
      setStatus(lead.status);
      setOriginalStatus(lead.status);
      setNotes(lead.notes || '');
      setOriginalNotes(lead.notes || '');
    }
  }, [lead?.id]);

  const hasStatusChanged = status !== originalStatus;
  const hasNotesChanged = notes !== originalNotes;
  const hasChanges = hasStatusChanged || hasNotesChanged;

  const handleSave = () => {
    // TODO: Implement API call to save changes
    console.log('Saving changes:', { status, notes });
    setOriginalStatus(status);
    setOriginalNotes(notes);
  };

  const handleClose = () => {
    onClose();
  };

  const handleOpenChat = () => {
    if (lead?.conversationId) {
      // Navigate to inbox with the conversation selected
      router.push(`/inbox?conversation=${lead.conversationId}`);
    } else {
      // If no conversation linked, just go to inbox
      router.push('/inbox');
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'whatsapp':
        return <Phone className="w-4 h-4" />;
      case 'messenger':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (!lead) return null;

  return (
    <div
      className={cn(
        "w-[420px] bg-white border-l border-gray-200 flex flex-col flex-shrink-0 transition-all duration-300 ease-out",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      )}
    >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Lead Details</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Profile Section */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="relative">
                {lead.profilePicture ? (
                  <img
                    src={lead.profilePicture}
                    alt={lead.customerName || lead.customerHandle}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#2F5D3E] flex items-center justify-center">
                    <span className="text-white text-lg font-medium">
                      {getInitials(lead.customerName || lead.customerHandle)}
                    </span>
                  </div>
                )}
                <div className={cn(
                  'absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white border-2 border-white',
                  lead.channel === 'instagram' && 'bg-gradient-to-br from-purple-500 to-pink-500',
                  lead.channel === 'whatsapp' && 'bg-emerald-500',
                  lead.channel === 'messenger' && 'bg-blue-500',
                )}>
                  {getChannelIcon(lead.channel)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {lead.customerName || lead.customerHandle}
                </h3>
                <p className="text-sm text-gray-500 truncate">@{lead.customerHandle}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Created {formatMessageTime(lead.createdAt)}
                </p>
              </div>
            </div>

            {/* Labels */}
            {lead.labels && lead.labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {lead.labels.map((label) => (
                  <span
                    key={label}
                    className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status & Type Section */}
          <div className="px-6 py-5 border-b border-gray-100 space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                disabled={isTerminalLeadStatus(originalStatus)}
                className={cn(
                  "mt-2 w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D3E]/20 focus:border-[#2F5D3E] transition-all",
                  isTerminalLeadStatus(originalStatus) && "opacity-60 cursor-not-allowed"
                )}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted (Legacy)</option>
                <option value="Qualified">Qualified (Legacy)</option>
                <option value="Negotiating">Negotiating (Legacy)</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
                <option value="Lost">Lost</option>
                <option value="Spam">Spam (Legacy)</option>
              </select>
              {isTerminalLeadStatus(originalStatus) && (
                <p className="mt-1.5 text-xs text-gray-400">
                  This lead is in a terminal state and cannot be changed.
                </p>
              )}
            </div>

            {/* Source Badge */}
            {lead.source && (
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </label>
                <div className="mt-2">
                  <span className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium',
                    getLeadSourceColor(lead.source)
                  )}>
                    {lead.source === 'AI' ? (
                      <Sparkles className="w-3.5 h-3.5" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                    {getLeadSourceDisplayName(lead.source)}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Intent Type
              </label>
              <div className="mt-2">
                <span className={cn(
                  'inline-flex px-3 py-1.5 rounded-lg text-sm font-medium',
                  getIntentColor(lead.intent)
                )}>
                  {lead.intent}
                </span>
              </div>
            </div>

            {lead.assignedTo && (
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {lead.assignedTo[0]}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700">{lead.assignedTo}</span>
                </div>
              </div>
            )}
          </div>

          {/* Last Message Section */}
          <div className="px-6 py-5 border-b border-gray-100">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Message
            </label>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-700">{lead.lastMessageSnippet}</p>
              <p className="text-xs text-gray-400 mt-2">
                {formatMessageTime(lead.lastMessageTime)}
              </p>
            </div>
          </div>

          {/* Notes Section */}
          <div className="px-6 py-5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Notes
            </label>
            <textarea
              placeholder="Add notes about this lead..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="mt-3 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E]/20 focus:border-[#2F5D3E] transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 space-y-3">
          {hasChanges && (
            <button
              onClick={handleSave}
              className="w-full py-2.5 rounded-xl text-white text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)',
              }}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleOpenChat}
              className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Open Chat
            </button>
            <button className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Create Order
            </button>
          </div>
        </div>
    </div>
  );
}
