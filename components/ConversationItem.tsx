import { Instagram } from 'lucide-react';
import { MessageCircle, Facebook } from 'lucide-react';
import { Conversation, IntentType } from '@/types';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const intentColors: Record<string, string> = {
  Inquiry: 'bg-blue-50 text-blue-700 border-blue-200',
  Order: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Payment: 'bg-amber-50 text-amber-700 border-amber-200',
  Delivery: 'bg-purple-50 text-purple-700 border-purple-200',
  Issue: 'bg-red-50 text-red-700 border-red-200',
  Other: 'bg-gray-50 text-gray-700 border-gray-200',
};

// Get initials from customer name
const getInitials = (name?: string) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  return (
    <div
      onClick={onClick}
      className={`mb-2 p-4 rounded-xl cursor-pointer transition-all ${
        isSelected
          ? 'bg-white shadow-sm border border-gray-300'
          : 'bg-transparent hover:bg-white/60 border border-transparent'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
            <span className="text-white text-sm">{getInitials(conversation.customerName)}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
            {conversation.channel === 'instagram' ? (
              <Instagram className="w-3 h-3 text-pink-500" />
            ) : conversation.channel === 'messenger' ? (
              <Facebook className="w-3 h-3 text-blue-500" />
            ) : (
              <MessageCircle className="w-3 h-3 text-green-600" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <span className="text-gray-900">{conversation.customerName || conversation.customerHandle}</span>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {conversation.lastMessageTime.toLocaleDateString()}
            </span>
          </div>

          <p className="text-sm text-gray-600 truncate mb-2">
            {conversation.lastMessage}
          </p>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-xs border ${intentColors[conversation.intent] || intentColors.Other}`}>
              {conversation.intent}
            </span>
            {conversation.unreadCount && conversation.unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-gray-900 text-white">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
