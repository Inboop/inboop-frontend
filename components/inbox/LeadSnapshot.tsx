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
} from "lucide-react";
import { Facebook } from "lucide-react";
import { Conversation } from "@/types";
import { useState } from "react";

interface LeadSnapshotProps {
  conversation: Conversation | null;
}

export function LeadSnapshot({
  conversation,
}: LeadSnapshotProps) {
  const [intent, setIntent] = useState("Order");
  const [leadStatus, setLeadStatus] = useState("Hot Lead");
  const [notes, setNotes] = useState(
    "Customer interested in summer collection. Prefers size M. Follow up after sending photos.",
  );

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
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-sm text-gray-500 uppercase tracking-wide mb-4">
          Lead Snapshot
        </h2>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mb-3">
            <span className="text-white text-xl">
              {getInitials(conversation.customerName)}
            </span>
          </div>
          <h3 className="text-lg text-gray-900 mb-1">
            {conversation.customerName || conversation.customerHandle}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {isWhatsApp ? (
              <>
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span>WhatsApp</span>
              </>
            ) : isFacebook ? (
              <>
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>Facebook</span>
              </>
            ) : (
              <>
                <Instagram className="w-4 h-4 text-pink-500" />
                <span>Instagram</span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">
              Intent
            </label>
            <div className="relative">
              <select
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg text-sm appearance-none cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              >
                <option>Query</option>
                <option>Order</option>
                <option>Lead</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">
              Lead Status
            </label>
            <div className="relative">
              <select
                value={leadStatus}
                onChange={(e) => setLeadStatus(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg text-sm appearance-none cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              >
                <option>Cold Lead</option>
                <option>Warm Lead</option>
                <option>Hot Lead</option>
                <option>Converted</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-4">
          Quick Insights
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">
                Orders
              </span>
            </div>
            <div className="text-gray-900">3</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">
                Last Reply
              </span>
            </div>
            <div className="text-gray-900">2m ago</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">
                Lead Value
              </span>
            </div>
            <div className="text-gray-900">$267.00</div>
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-4">
          Actions
        </h3>
        <div className="space-y-2">
          <button className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-out flex items-center justify-center gap-2">
            <ExternalLink className="w-4 h-4" />
            View Lead
          </button>
          <button className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 ease-out flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Create Order
          </button>
          <button className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-out flex items-center justify-center gap-2">
            <Star className="w-4 h-4" />
            Mark as VIP
          </button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-3">
          Internal Notes
        </h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all resize-none"
          rows={5}
          placeholder="Add internal notes about this lead..."
        />
        <button className="mt-3 w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-out">
          Save Notes
        </button>
      </div>
    </div>
  );
}
