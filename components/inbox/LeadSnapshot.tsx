import {
  Instagram,
  MessageCircle,
  ChevronDown,
  ExternalLink,
  Plus,
  Star,
  Clock,
  DollarSign,
  Send,
  Calendar,
  Tag,
  FileText,
  Bell,
  X,
  ArrowLeft,
  User,
} from "lucide-react";
import { Facebook } from "lucide-react";
import { Conversation, ConversationStatus, LeadStatus, IntentType } from "@/types";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLeadStore } from "@/stores/useLeadStore";
import { ConversationOrders } from "./ConversationOrders";

interface LeadSnapshotProps {
  conversation: Conversation | null;
  onVIPChange?: (isVIP: boolean) => void;
   onStatusChange?: (status: LeadStatus) => void;
}

export function LeadSnapshot({
  conversation,
  onVIPChange,
  onStatusChange,
}: LeadSnapshotProps) {
  const router = useRouter();
  const { leads, addLead, getLead, updateLead } = useLeadStore();

  // Get the most recent lead associated with this conversation
  // A conversation can have multiple leads over time, we find the most recent one
  const lead = conversation
    ? leads.find(l => l.conversationId === conversation.id)
    : null;

  // Get status from lead, default to 'New'
  const [status, setStatus] = useState<LeadStatus>(lead?.status ?? 'New');
  const [leadValue, setLeadValue] = useState(lead?.value?.toString() || "0");
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [tags, setTags] = useState<string[]>(lead?.labels || []);
  const [newTag, setNewTag] = useState("");

  // Create Lead Form State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    status: 'New' as LeadStatus,
    value: '',
    notes: '',
    labels: [] as string[],
  });
  const [newFormTag, setNewFormTag] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Update state when conversation/lead changes
  useEffect(() => {
    if (lead) {
      setStatus(lead.status);
      setLeadValue(lead.value?.toString() || "0");
      setTags(lead.labels || []);
    } else {
      // Reset to defaults when no lead is found
      setStatus('New');
      setLeadValue("0");
      setTags([]);
    }
    // Reset create form when conversation changes
    setShowCreateForm(false);
    setCreateFormData({
      status: 'New',
      value: '',
      notes: '',
      labels: [],
    });
    setNewFormTag("");
  }, [lead?.id, conversation?.id]);

  const handleCreateLead = () => {
    if (!conversation) return;

    setIsCreating(true);

    // Generate a new lead ID
    const newLeadId = `l${Date.now()}`;

    // Create the new lead object
    const newLead = {
      id: newLeadId,
      channel: conversation.channel,
      customerHandle: conversation.customerHandle,
      customerName: conversation.customerName,
      profilePicture: conversation.profilePicture,
      intent: conversation.intent,
      status: createFormData.status,
      lastMessageTime: conversation.lastMessageTime,
      lastMessageSnippet: conversation.lastMessage,
      createdAt: new Date(),
      notes: createFormData.notes || undefined,
      conversationId: conversation.id,
      labels: createFormData.labels.length > 0 ? createFormData.labels : undefined,
      value: createFormData.value ? parseFloat(createFormData.value) : undefined,
    };

    // Add to leads store (in real app, this would be an API call)
    addLead(newLead);

    // Simulate a small delay for UX
    setTimeout(() => {
      setIsCreating(false);
      // Redirect to leads page with the new lead selected
      router.push(`/leads?selected=${newLeadId}`);
    }, 500);
  };

  const addFormTag = () => {
    if (newFormTag.trim() && !createFormData.labels.includes(newFormTag.trim())) {
      setCreateFormData({
        ...createFormData,
        labels: [...createFormData.labels, newFormTag.trim()],
      });
      setNewFormTag("");
    }
  };

  const removeFormTag = (tagToRemove: string) => {
    setCreateFormData({
      ...createFormData,
      labels: createFormData.labels.filter(tag => tag !== tagToRemove),
    });
  };

  // Get VIP status from conversation
  const isVIP = conversation?.isVIP ?? false;

  const handleVIPToggle = () => {
    onVIPChange?.(!isVIP);
  };

  const handleViewLead = () => {
    // Use the already computed lead from the component
    if (lead) {
      router.push(`/leads?selected=${lead.id}`);
    } else {
      // If no lead exists, just go to leads page
      router.push('/leads');
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  if (!conversation) {
    return null;
  }

  const isWhatsApp = conversation.channel === "whatsapp";
  const isFacebook = conversation.channel === "messenger";

  // Get initials from customer name
  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Create Lead Form View
  if (showCreateForm) {
    return (
      <div className="h-full bg-white overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setShowCreateForm(false)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Create Lead</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Create a lead for {conversation.customerName || conversation.customerHandle}
          </p>
        </div>

        {/* Form */}
        <div className="flex-1 p-4 space-y-4">
          {/* Customer Info (Read-only) */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {conversation.profilePicture ? (
              <img
                src={conversation.profilePicture}
                alt={conversation.customerName || conversation.customerHandle}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">
                  {getInitials(conversation.customerName)}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {conversation.customerName || conversation.customerHandle}
              </p>
              <p className="text-xs text-gray-500">{conversation.customerHandle}</p>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
              Status
            </label>
            <div className="relative">
              <select
                value={createFormData.status}
                onChange={(e) => setCreateFormData({ ...createFormData, status: e.target.value as LeadStatus })}
                className="w-full px-3 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm appearance-none cursor-pointer hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2F5D3E] focus:border-[#2F5D3E]"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Lead Value */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
              Lead Value
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                value={createFormData.value}
                onChange={(e) => setCreateFormData({ ...createFormData, value: e.target.value })}
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E] focus:border-[#2F5D3E] transition-all"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {createFormData.labels.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  {tag}
                  <button
                    onClick={() => removeFormTag(tag)}
                    className="hover:text-gray-900 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFormTag}
                onChange={(e) => setNewFormTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFormTag();
                  }
                }}
                placeholder="Add tag..."
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E] focus:border-[#2F5D3E] transition-all"
              />
              <button
                onClick={addFormTag}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
              Notes
            </label>
            <textarea
              value={createFormData.notes}
              onChange={(e) => setCreateFormData({ ...createFormData, notes: e.target.value })}
              placeholder="Add any notes about this lead..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E] focus:border-[#2F5D3E] transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleCreateLead}
            disabled={isCreating}
            className="w-full py-2.5 bg-[#2F5D3E] text-white rounded-lg text-sm font-medium hover:bg-[#234430] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                Create Lead
              </>
            )}
          </button>
          <button
            onClick={() => setShowCreateForm(false)}
            disabled={isCreating}
            className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xs text-gray-500 uppercase tracking-wide mb-3">
          Lead Snapshot
        </h2>

        <div className="flex items-center gap-3 mb-4">
          {conversation.profilePicture ? (
            <img
              src={conversation.profilePicture}
              alt={conversation.customerName || conversation.customerHandle}
              className="w-11 h-11 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">
                {getInitials(conversation.customerName)}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {conversation.customerName || conversation.customerHandle}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
              {isWhatsApp ? (
                <>
                  <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                  <span>WhatsApp</span>
                </>
              ) : isFacebook ? (
                <>
                  <Facebook className="w-3.5 h-3.5 text-blue-600" />
                  <span>Facebook</span>
                </>
              ) : (
                <>
                  <Instagram className="w-3.5 h-3.5 text-pink-500" />
                  <span>Instagram</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Only show status if lead exists */}
        {lead && (
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide mb-1.5 block">
              Status
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => {
                  const newStatus = e.target.value as LeadStatus;
                  setStatus(newStatus);
                  onStatusChange?.(newStatus);
                }}
                className="w-full px-3 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg text-sm appearance-none cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2F5D3E] focus:border-[#2F5D3E]"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* AI Insight */}
        <div className="mt-3 p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs">🧠</span>
            <span className="text-xs font-medium text-emerald-700">AI Insight</span>
          </div>
          <p className="text-xs text-emerald-600">
            {conversation.intent === 'Order' && 'High purchase intent · Likely to convert'}
            {conversation.intent === 'Inquiry' && 'Product interest detected · Respond quickly'}
            {conversation.intent === 'Payment' && 'Payment discussion · Close to conversion'}
            {conversation.intent === 'Delivery' && 'Post-purchase · Ensure satisfaction'}
            {conversation.intent === 'Issue' && 'Needs attention · Prioritize response'}
            {conversation.intent === 'Other' && 'Gathering information · Build rapport'}
          </p>
        </div>
      </div>

      {/* Orders Section */}
      <ConversationOrders conversation={conversation} />

      <div className="p-4 border-b border-gray-200">
        <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-3">
          Quick Insights
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">Last Reply</span>
            </div>
            <div className="text-gray-900 text-sm font-medium">2m ago</div>
          </div>
          <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">Lead Value</span>
            </div>
            {isEditingValue ? (
              <div className="flex items-center">
                <span className="text-gray-900 text-sm font-medium">$</span>
                <input
                  type="text"
                  value={leadValue}
                  onChange={(e) => setLeadValue(e.target.value)}
                  onBlur={() => {
                    setIsEditingValue(false);
                    // Update the lead in the store
                    if (lead) {
                      const numValue = leadValue.trim() ? parseFloat(leadValue.replace(/[^0-9.]/g, '')) : undefined;
                      updateLead(lead.id, { value: numValue });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsEditingValue(false);
                      // Update the lead in the store
                      if (lead) {
                        const numValue = leadValue.trim() ? parseFloat(leadValue.replace(/[^0-9.]/g, '')) : undefined;
                        updateLead(lead.id, { value: numValue });
                      }
                    }
                  }}
                  autoFocus
                  className="w-full text-gray-900 text-sm font-medium bg-white border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E] focus:border-[#2F5D3E]"
                  placeholder="0.00"
                />
              </div>
            ) : (
              <div
                onClick={() => lead && setIsEditingValue(true)}
                className={`text-gray-900 text-sm font-medium ${lead ? 'cursor-pointer hover:text-gray-600' : ''} transition-colors`}
              >
                ${leadValue}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-3">
          Actions
        </h3>
        <div className="space-y-2">
          <button className="w-full px-3 py-2 bg-[#2F5D3E] text-white rounded-lg text-sm hover:bg-[#234430] transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Create Order
          </button>
          <button className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            Send Template
          </button>
          <button className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            <Bell className="w-4 h-4" />
            Schedule Follow-up
          </button>
          {lead ? (
            <button
              onClick={handleViewLead}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Lead Profile
            </button>
          ) : (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Lead
            </button>
          )}
        </div>

        {/* VIP Toggle */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className={`w-4 h-4 ${isVIP ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
              <span className="text-sm text-gray-700">VIP Customer</span>
            </div>
            <button
              onClick={handleVIPToggle}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                isVIP ? 'bg-[#2F5D3E]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  isVIP ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2">
          Tags
        </h3>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="hover:text-gray-900 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add tag..."
            className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D3E] focus:border-[#2F5D3E] transition-all"
          />
          <button
            onClick={addTag}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
