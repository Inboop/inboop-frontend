import {
  Instagram,
  MessageCircle,
  ChevronDown,
  ExternalLink,
  Plus,
  Star,
  Clock,
  DollarSign,
  ShoppingCart,
  Send,
  Calendar,
  Tag,
  FileText,
  Bell,
  X,
} from "lucide-react";
import { Facebook } from "lucide-react";
import { Conversation, ConversationStatus } from "@/types";
import { useState } from "react";

interface LeadSnapshotProps {
  conversation: Conversation | null;
  onVIPChange?: (isVIP: boolean) => void;
  onStatusChange?: (status: ConversationStatus) => void;
}

export function LeadSnapshot({
  conversation,
  onVIPChange,
  onStatusChange,
}: LeadSnapshotProps) {
  // Get status from conversation, default to 'New'
  const status = conversation?.status ?? 'New';
  const [orders, setOrders] = useState("3");
  const [isEditingOrders, setIsEditingOrders] = useState(false);
  const [leadValue, setLeadValue] = useState("267.00");
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [notes, setNotes] = useState(
    "Customer interested in summer collection. Prefers size M. Follow up after sending photos.",
  );
  const [tags, setTags] = useState<string[]>(["Returning", "Size M"]);
  const [newTag, setNewTag] = useState("");

  // Get VIP status from conversation
  const isVIP = conversation?.isVIP ?? false;

  const handleVIPToggle = () => {
    onVIPChange?.(!isVIP);
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

        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wide mb-1.5 block">
            Status
          </label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => onStatusChange?.(e.target.value as ConversationStatus)}
              className="w-full px-3 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg text-sm appearance-none cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2F5D3E] focus:border-[#2F5D3E]"
            >
              <option value="New">New</option>
              <option value="Active">Active</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-3">
          Quick Insights
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-1.5 mb-1">
              <ShoppingCart className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">Orders</span>
            </div>
            {isEditingOrders ? (
              <input
                type="text"
                value={orders}
                onChange={(e) => setOrders(e.target.value)}
                onBlur={() => setIsEditingOrders(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsEditingOrders(false);
                  }
                }}
                autoFocus
                className="w-full text-gray-900 text-sm font-medium bg-white border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E] focus:border-[#2F5D3E]"
              />
            ) : (
              <div
                onClick={() => setIsEditingOrders(true)}
                className="text-gray-900 text-sm font-medium cursor-pointer hover:text-gray-600 transition-colors"
              >
                {orders || "0"}
              </div>
            )}
          </div>
          <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">Last Reply</span>
            </div>
            <div className="text-gray-900 text-sm font-medium">2m ago</div>
          </div>
          <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 col-span-2">
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
                  onBlur={() => setIsEditingValue(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsEditingValue(false);
                    }
                  }}
                  autoFocus
                  className="w-full text-gray-900 text-sm font-medium bg-white border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E] focus:border-[#2F5D3E]"
                  placeholder="0.00"
                />
              </div>
            ) : (
              <div
                onClick={() => setIsEditingValue(true)}
                className="text-gray-900 text-sm font-medium cursor-pointer hover:text-gray-600 transition-colors"
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
          <button className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            <ExternalLink className="w-4 h-4" />
            View Lead Profile
          </button>
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

      <div className="p-4">
        <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2">
          Internal Notes
        </h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5D3E] focus:border-[#2F5D3E] transition-all resize-none"
          rows={4}
          placeholder="Add internal notes about this lead..."
        />
        <button className="mt-2 w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all">
          Save Notes
        </button>
      </div>
    </div>
  );
}
