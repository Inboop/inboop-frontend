'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLeadStore } from '@/stores/useLeadStore';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminUser } from '@/lib/isAdmin';
import {
  Search,
  Filter,
  Plus,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  X,
  MessageSquare,
  ShoppingCart,
  Save,
  Trash2,
} from 'lucide-react';
import { getChannelIcon } from '@/components/shared/ChannelIcons';
import { Lead, LeadStatus, IntentType } from '@/types';
import { cn } from '@/lib/utils';
import {
  formatRelativeTime,
  getLeadStatusColor,
  getLeadStatusDot,
  getIntentColor,
  getInitials,
  formatCurrency,
  formatMessageTime,
} from '@/lib/helpers';
import { Skeleton, SkeletonCard, SkeletonLeadRow, SkeletonDetailPanel } from '@/components/ui/skeleton';

const statusFilters: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

export default function LeadsPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { leads, deleteLead, updateLead, isLoading, fetchLeads } = useLeadStore();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const isAdmin = isAdminUser(user?.email);

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads(isAdmin);
  }, [fetchLeads, isAdmin]);

  // Check for selected lead from URL query params
  useEffect(() => {
    const selectedFromUrl = searchParams.get('selected');
    if (selectedFromUrl) {
      const leadExists = leads.some(l => l.id === selectedFromUrl);
      if (leadExists) {
        setSelectedLeadId(selectedFromUrl);
      }
    }
  }, [searchParams, leads]);

  // Handle delete lead
  const handleDeleteLead = (leadId: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      deleteLead(leadId);
      if (selectedLeadId === leadId) {
        setSelectedLeadId(null);
      }
    }
  };

  // Handle update lead value
  const handleUpdateLeadValue = (leadId: string, value: number | undefined) => {
    updateLead(leadId, { value });
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = leads.length;
    const newThisWeek = leads.filter(l => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return l.createdAt > weekAgo;
    }).length;
    const qualified = leads.filter(l => l.status === 'Qualified').length;
    const converted = leads.filter(l => l.status === 'Converted').length;
    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;
    const totalValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);

    return { total, newThisWeek, qualified, conversionRate, totalValue };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus = !selectedStatus || lead.status === selectedStatus;
      const matchesSearch = !searchQuery ||
        lead.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.customerHandle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [leads, selectedStatus, searchQuery]);

  const selectedLead = selectedLeadId
    ? leads.find((l) => l.id === selectedLeadId) || null
    : null;

  const getPlatformBorderColor = (channel: string) => {
    switch (channel) {
      case 'instagram':
        return 'border-l-pink-500';
      case 'whatsapp':
        return 'border-l-green-600';
      case 'messenger':
        return 'border-l-blue-600';
      default:
        return 'border-l-gray-400';
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#F8F9FA]">
      {/* Page Header */}
      <div className="px-4 md:px-8 pt-4 md:pt-6 pb-4">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Leads</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">Track, qualify, and convert your leads</p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-150 ease-out shadow-md hover:shadow-lg hover:brightness-110 hover:-translate-y-[1px]"
            style={{
              background: 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)',
            }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Lead</span>
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              {/* Total Leads */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-[2px] cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    12%
                  </span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">{metrics.total}</p>
                <p className="text-sm text-gray-500 mt-0.5">Total Leads</p>
              </div>

              {/* New This Week */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-[2px] cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    8%
                  </span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">{metrics.newThisWeek}</p>
                <p className="text-sm text-gray-500 mt-0.5">New This Week</p>
              </div>

              {/* Qualified */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-[2px] cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-2xl font-semibold text-gray-900">{metrics.qualified}</p>
                <p className="text-sm text-gray-500 mt-0.5">Qualified Leads</p>
              </div>

              {/* Conversion Rate */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-[2px] cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                    <ArrowDownRight className="w-3 h-3" />
                    3%
                  </span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">{metrics.conversionRate}%</p>
                <p className="text-sm text-gray-500 mt-0.5">Conversion Rate</p>
              </div>
            </>
          )}
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E]/20 focus:border-[#2F5D3E] transition-all"
            />
          </div>

          {/* Status Filter Pills - Scrollable on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            <button
              onClick={() => setSelectedStatus(null)}
              className={cn(
                'px-3 md:px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ease-out whitespace-nowrap flex-shrink-0',
                !selectedStatus
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300'
              )}
            >
              All
            </button>
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={cn(
                  'px-3 md:px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ease-out flex items-center gap-2 whitespace-nowrap flex-shrink-0',
                  selectedStatus === status
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300'
                )}
              >
                <span className={cn('w-2 h-2 rounded-full', getLeadStatusDot(status))} />
                {status}
              </button>
            ))}

            {/* More Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 md:px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 transition-all duration-150 ease-out whitespace-nowrap flex-shrink-0"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', showFilters && 'rotate-180')} />
            </button>
          </div>
        </div>
      </div>

      {/* Master-Detail Layout - Only for table area */}
      <div className="flex-1 overflow-hidden flex relative">
        {/* Table Section */}
        <div className="flex-1 flex flex-col min-w-0 md:border-r border-gray-200 bg-gray-50">
          {/* Table Header - Hidden on mobile */}
          <div className="hidden md:block py-2.5 bg-white border-b border-gray-200">
            <div className="p-2">
              <div className="grid grid-cols-[1fr_90px_80px_1fr_70px] gap-4 text-xs font-medium uppercase tracking-wider px-4 ml-[3px]">
                <div className="text-gray-700">Lead</div>
                <div className="text-gray-700">Status</div>
                <div className="text-gray-500">Type</div>
                <div className="text-gray-400">Last Activity</div>
                <div className="text-gray-400">Assigned</div>
              </div>
            </div>
          </div>

            {/* Table Body */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-2 space-y-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonLeadRow key={i} />
                  ))}
                </div>
              ) : leads.length === 0 ? (
                <div className="py-16 text-center px-4">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#2F5D3E]/10 to-[#2F5D3E]/5 flex items-center justify-center">
                    <Target className="w-10 h-10 text-[#2F5D3E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads yet</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                    Connect your Instagram account and start receiving DMs to see leads here automatically.
                  </p>
                  <a
                    href="/settings?tab=integrations"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-150 ease-out shadow-md hover:shadow-lg hover:brightness-110"
                    style={{
                      background: 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)',
                    }}
                  >
                    Connect Instagram
                  </a>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-medium">No leads match your filters</p>
                  <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {filteredLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className={cn(
                        'md:grid md:grid-cols-[1fr_90px_80px_1fr_70px] gap-4 px-4 py-3 items-center cursor-pointer rounded-lg border-l-[3px] transition-all duration-150 ease-out',
                        selectedLeadId === lead.id
                          ? `bg-white shadow-md ${getPlatformBorderColor(lead.channel)}`
                          : 'bg-transparent hover:bg-white hover:shadow-sm hover:-translate-y-[1px] border-l-transparent'
                      )}
                    >
                      {/* Lead Info - Primary emphasis */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex-shrink-0">
                          {lead.profilePicture ? (
                            <img
                              src={lead.profilePicture}
                              alt={lead.customerName || lead.customerHandle}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#2F5D3E] flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {getInitials(lead.customerName || lead.customerHandle)}
                              </span>
                            </div>
                          )}
                          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
                            {getChannelIcon(lead.channel, 14)}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 truncate text-sm">
                              {lead.customerName || lead.customerHandle}
                            </p>
                            {/* Status badge - Mobile only inline */}
                            <span className={cn(
                              'md:hidden inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold',
                              getLeadStatusColor(lead.status)
                            )}>
                              {lead.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">@{lead.customerHandle}</p>
                          {/* Last message preview - Mobile only */}
                          <p className="md:hidden text-xs text-gray-400 truncate mt-1">{lead.lastMessageSnippet}</p>
                        </div>
                      </div>

                      {/* Status - Primary emphasis - Hidden on mobile */}
                      <div className="hidden md:block">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold',
                          getLeadStatusColor(lead.status)
                        )}>
                          {lead.status}
                        </span>
                      </div>

                      {/* Intent Type - Secondary emphasis - Hidden on mobile */}
                      <div className="hidden md:block">
                        <span className={cn(
                          'inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
                          getIntentColor(lead.intent)
                        )}>
                          {lead.intent}
                        </span>
                      </div>

                      {/* Last Activity - De-emphasized - Hidden on mobile */}
                      <div className="hidden md:block min-w-0">
                        <p className="text-sm text-gray-500 truncate">{lead.lastMessageSnippet}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(lead.lastMessageTime)}</p>
                      </div>

                      {/* Assigned To - De-emphasized - Hidden on mobile */}
                      <div className="hidden md:block">
                        {lead.assignedTo ? (
                          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center" title={lead.assignedTo}>
                            <span className="text-xs font-medium text-gray-500">
                              {lead.assignedTo[0]}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          {/* Table Footer */}
          {filteredLeads.length > 0 && (
            <div className="px-4 md:px-5 py-3 bg-white border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">{filteredLeads.length}</span> of{' '}
                <span className="font-medium text-gray-900">{leads.length}</span> leads
              </p>
            </div>
          )}
        </div>

        {/* Detail Panel - Desktop: side panel, Mobile: full-screen overlay */}
        <div className={cn(
          'bg-white overflow-hidden',
          // Desktop styles
          'hidden md:block md:w-[calc(25%-12px)] md:min-w-[320px] md:flex-shrink-0',
          // Mobile styles - full screen overlay when lead selected
          selectedLead && 'fixed inset-0 z-50 block md:relative md:inset-auto'
        )}>
            {isLoading ? (
              <SkeletonDetailPanel />
            ) : selectedLead ? (
              <div
                key={selectedLead.id}
                className="h-full animate-in fade-in slide-in-from-right-2 duration-200 ease-out"
              >
                <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedLeadId(null)} onDelete={handleDeleteLead} onUpdateValue={handleUpdateLeadValue} />
              </div>
            ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-600 font-medium">No lead selected</p>
              <p className="text-sm text-gray-400 mt-1">Click on a lead to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Timeline Note Interface
interface TimelineNote {
  id: string;
  text: string;
  agentName: string;
  agentInitial: string;
  timestamp: Date;
}

// Generate mock timeline notes for a lead
const getMockTimelineNotes = (leadId: string): TimelineNote[] => {
  const mockNotes: Record<string, TimelineNote[]> = {
    'l1': [
      { id: 'n1', text: 'Customer asked about size M availability. Sent catalog link.', agentName: 'You', agentInitial: 'Y', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
    ],
    'l2': [
      { id: 'n2', text: 'VIP customer - prioritize responses. Has ordered 5+ times.', agentName: 'Alex', agentInitial: 'A', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
      { id: 'n3', text: 'Delivery confirmed. Customer satisfied.', agentName: 'Sarah', agentInitial: 'S', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    ],
    'l3': [
      { id: 'n4', text: 'Bulk order placed. Applied 15% discount as discussed.', agentName: 'Sarah', agentInitial: 'S', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
      { id: 'n5', text: 'Payment confirmed via bank transfer.', agentName: 'Alex', agentInitial: 'A', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
      { id: 'n6', text: 'Order shipped. Tracking shared with customer.', agentName: 'You', agentInitial: 'Y', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12) },
    ],
    'l7': [
      { id: 'n7', text: 'Potential reseller from UK. Interested in wholesale pricing.', agentName: 'Sarah', agentInitial: 'S', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72) },
      { id: 'n8', text: 'Sent wholesale catalog and MOQ details.', agentName: 'Sarah', agentInitial: 'S', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
    ],
  };
  return mockNotes[leadId] || [];
};

// Inline Lead Detail Panel Component
function LeadDetailPanel({ lead, onClose, onDelete, onUpdateValue }: { lead: Lead; onClose: () => void; onDelete: (id: string) => void; onUpdateValue: (id: string, value: number | undefined) => void }) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [labels, setLabels] = useState<string[]>(lead.labels || []);
  const [newLabel, setNewLabel] = useState('');
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [originalStatus, setOriginalStatus] = useState<LeadStatus>(lead.status);
  const [originalLabels, setOriginalLabels] = useState<string[]>(lead.labels || []);

  // Lead value editing state
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [valueInput, setValueInput] = useState(lead.value?.toString() || '');

  // Timeline notes state
  const [timelineNotes, setTimelineNotes] = useState<TimelineNote[]>(() => getMockTimelineNotes(lead.id));
  const [newNote, setNewNote] = useState('');

  // Update state when lead changes
  useEffect(() => {
    setStatus(lead.status);
    setOriginalStatus(lead.status);
    setLabels(lead.labels || []);
    setOriginalLabels(lead.labels || []);
    setShowLabelInput(false);
    setNewLabel('');
    setTimelineNotes(getMockTimelineNotes(lead.id));
    setNewNote('');
    setIsEditingValue(false);
    setValueInput(lead.value?.toString() || '');
  }, [lead.id, lead.value]);

  const labelsChanged = JSON.stringify(labels.sort()) !== JSON.stringify(originalLabels.sort());
  const hasChanges = status !== originalStatus || labelsChanged;

  const handleValueSave = () => {
    const numValue = valueInput.trim() ? parseFloat(valueInput.replace(/[^0-9.]/g, '')) : undefined;
    onUpdateValue(lead.id, numValue);
    setIsEditingValue(false);
  };

  const handleValueKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleValueSave();
    } else if (e.key === 'Escape') {
      setValueInput(lead.value?.toString() || '');
      setIsEditingValue(false);
    }
  };

  const handleAddLabel = () => {
    const trimmedLabel = newLabel.trim();
    if (trimmedLabel && !labels.includes(trimmedLabel)) {
      setLabels([...labels, trimmedLabel]);
    }
    setNewLabel('');
    setShowLabelInput(false);
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    setLabels(labels.filter(l => l !== labelToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLabel();
    } else if (e.key === 'Escape') {
      setNewLabel('');
      setShowLabelInput(false);
    }
  };

  const handleSave = () => {
    console.log('Saving changes:', { status, labels });
    setOriginalStatus(status);
    setOriginalLabels([...labels]);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note: TimelineNote = {
      id: `n${Date.now()}`,
      text: newNote.trim(),
      agentName: 'You',
      agentInitial: 'Y',
      timestamp: new Date(),
    };
    setTimelineNotes([note, ...timelineNotes]);
    setNewNote('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Lead Details</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6">
        {/* Lead Header */}
        <div className="flex items-center gap-4 pb-5">
          <div className="relative">
            {lead.profilePicture ? (
              <img
                src={lead.profilePicture}
                alt={lead.customerName || lead.customerHandle}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#2F5D3E] flex items-center justify-center ring-2 ring-gray-100">
                <span className="text-white text-lg font-medium">
                  {getInitials(lead.customerName || lead.customerHandle)}
                </span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm ring-2 ring-white">
              {getChannelIcon(lead.channel, 16)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {lead.customerName || lead.customerHandle}
            </h3>
            <p className="text-sm text-gray-500 truncate">@{lead.customerHandle}</p>
          </div>
        </div>

        {/* Quick Tags */}
        <div className="pb-6">
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
              <span
                key={label}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-100 transition-all duration-150 ease-out"
              >
                {label}
                <button
                  onClick={() => handleRemoveLabel(label)}
                  className="w-4 h-4 rounded hover:bg-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {showLabelInput ? (
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (newLabel.trim()) {
                    handleAddLabel();
                  } else {
                    setShowLabelInput(false);
                  }
                }}
                placeholder="Tag name"
                autoFocus
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg w-24 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E]/20 focus:border-[#2F5D3E] transition-all duration-150"
              />
            ) : (
              <button
                onClick={() => setShowLabelInput(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-gray-400 text-xs font-medium rounded-lg border border-dashed border-gray-200 hover:border-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-all duration-150 ease-out"
              >
                <Plus className="w-3 h-3" />
                Add tag
              </button>
            )}
          </div>
        </div>

        {/* Key Metrics - 2 column grid */}
        <div className="grid grid-cols-2 gap-3 pb-6">
          <div className="p-3 bg-gray-50/80 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Lead Value</p>
            {isEditingValue ? (
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-900">$</span>
                <input
                  type="text"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  onBlur={handleValueSave}
                  onKeyDown={handleValueKeyDown}
                  autoFocus
                  placeholder="0"
                  className="w-full text-lg font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E] focus:border-[#2F5D3E]"
                />
              </div>
            ) : (
              <p
                onClick={() => setIsEditingValue(true)}
                className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-[#2F5D3E] transition-colors"
                title="Click to edit"
              >
                {lead.value ? `$${lead.value.toLocaleString()}` : '—'}
              </p>
            )}
          </div>
          <div className="p-3 bg-gray-50/80 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Type</p>
            <span className={cn(
              'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
              getIntentColor(lead.intent)
            )}>
              {lead.intent}
            </span>
          </div>
          <div className="p-3 bg-gray-50/80 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Created</p>
            <p className="text-sm font-medium text-gray-700">
              {formatRelativeTime(lead.createdAt)}
            </p>
          </div>
          <div className="p-3 bg-gray-50/80 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Last Activity</p>
            <p className="text-sm font-medium text-gray-700">
              {formatRelativeTime(lead.lastMessageTime)}
            </p>
          </div>
        </div>

        {/* Status & Assignment */}
        <div className="pb-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as LeadStatus)}
              className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E]/20 transition-all cursor-pointer"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
              Assigned To
            </label>
            {lead.assignedTo ? (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[#2F5D3E]/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-[#2F5D3E]">
                    {lead.assignedTo[0]}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">{lead.assignedTo}</span>
              </div>
            ) : (
              <button className="w-full p-3 bg-gray-50 rounded-xl text-sm text-gray-400 text-left hover:bg-gray-100 transition-colors">
                Click to assign...
              </button>
            )}
          </div>
        </div>

        {/* Timeline Notes */}
        <div className="pb-6">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-3">
            Notes
          </label>

          {/* Add Note Input */}
          <div className="flex gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-[#2F5D3E] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-medium">Y</span>
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
                placeholder="Add a note..."
                className="flex-1 px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E]/20 transition-all duration-150"
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="px-3 py-2 bg-[#2F5D3E] text-white rounded-lg text-sm font-medium hover:bg-[#234430] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 ease-out"
              >
                Add
              </button>
            </div>
          </div>

          {/* Notes Timeline */}
          {timelineNotes.length > 0 ? (
            <div className="space-y-3">
              {timelineNotes.map((note) => (
                <div key={note.id} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-xs font-medium">{note.agentInitial}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-gray-700">{note.agentName}</span>
                      <span className="text-xs text-gray-400">{formatRelativeTime(note.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{note.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">No notes yet. Add one above.</p>
          )}
        </div>
      </div>

      {/* Sticky Footer Actions */}
      <div className="px-6 py-4 bg-white border-t border-gray-100 space-y-3">
        {hasChanges && (
          <button
            onClick={handleSave}
            className="w-full py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-150 ease-out shadow-sm hover:shadow-md hover:brightness-110 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)',
            }}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (lead.conversationId) {
                router.push(`/inbox?conversation=${lead.conversationId}`);
              } else {
                router.push('/inbox');
              }
            }}
            className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-150 ease-out flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Open Chat
          </button>
          <button
            onClick={() => {
              router.push(`/orders?create=true&leadId=${lead.id}`);
            }}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-white transition-all duration-150 ease-out flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:brightness-110"
            style={{
              background: 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)',
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            Create Order
          </button>
        </div>
        <button
          onClick={() => onDelete(lead.id)}
          className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 rounded-xl text-sm font-medium text-red-600 hover:text-red-700 transition-all duration-150 ease-out flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Lead
        </button>
      </div>
    </div>
  );
}
