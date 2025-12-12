'use client';

import { useState } from 'react';
import { Search, Inbox, SearchX, Star } from 'lucide-react';
import { Conversation, ChannelType } from '@/types';
import { formatRelativeTime } from '@/lib/helpers';

type FilterType = ChannelType | 'all' | 'vip';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const channelFilters: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'VIP', value: 'vip' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Facebook', value: 'messenger' },
];

// Instagram gradient icon
const InstagramIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFDC80" />
        <stop offset="25%" stopColor="#F77737" />
        <stop offset="50%" stopColor="#E1306C" />
        <stop offset="75%" stopColor="#C13584" />
        <stop offset="100%" stopColor="#833AB4" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#instagram-gradient)" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" stroke="url(#instagram-gradient)" strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="url(#instagram-gradient)" />
  </svg>
);

// WhatsApp icon
const WhatsAppIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
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
const MessengerIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="messenger-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0099FF" />
        <stop offset="100%" stopColor="#A033FF" />
      </linearGradient>
    </defs>
    <path
      d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.13.26.35.27.57l.05 1.78c.02.63.67 1.04 1.24.79l1.99-.88c.17-.07.36-.09.54-.05.91.25 1.87.38 2.77.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2z"
      fill="url(#messenger-gradient)"
    />
    <path
      d="M6.53 14.75l2.68-4.26c.43-.68 1.35-.85 1.98-.36l2.13 1.6c.2.15.47.15.67 0l2.87-2.18c.38-.29.88.14.63.54l-2.68 4.26c-.43.68-1.35.85-1.98.36l-2.13-1.6c-.2-.15-.47-.15-.67 0l-2.87 2.18c-.38.29-.88-.14-.63-.54z"
      fill="white"
    />
  </svg>
);

const getChannelIcon = (channel: ChannelType, size = 12) => {
  switch (channel) {
    case 'instagram':
      return <InstagramIcon size={size} />;
    case 'whatsapp':
      return <WhatsAppIcon size={size} />;
    case 'messenger':
      return <MessengerIcon size={size} />;
  }
};

const getFilterIcon = (filter: FilterType, isActive: boolean) => {
  const size = 16;
  switch (filter) {
    case 'instagram':
      return <InstagramIcon size={size} />;
    case 'whatsapp':
      return <WhatsAppIcon size={size} />;
    case 'messenger':
      return <MessengerIcon size={size} />;
    case 'vip':
      return <Star size={size} className={isActive ? 'fill-yellow-400 text-yellow-400' : 'text-yellow-500'} />;
    default:
      return null;
  }
};

const getIntentStyle = (intent: string) => {
  switch (intent) {
    case 'Order':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Inquiry':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Delivery':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Payment':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'Issue':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Other':
      return 'bg-gray-50 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

// Get platform accent color for left border
const getPlatformBorderColor = (channel: ChannelType) => {
  switch (channel) {
    case 'instagram':
      return 'border-l-pink-500';
    case 'whatsapp':
      return 'border-l-green-600';
    case 'messenger':
      return 'border-l-blue-600';
    default:
      return 'border-l-gray-900';
  }
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

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredConversations = conversations
    .filter((conv) => {
      const customerName = conv.customerName || conv.customerHandle;
      const matchesSearch = customerName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'vip' ? conv.isVIP === true : conv.channel === activeFilter);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Sort by most recent message (latest first)
      return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
    });

  // Show appropriate empty state
  const showEmptyState = () => {
    if (conversations.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
          <p className="text-sm text-gray-500 max-w-[250px]">
            Connect your social accounts to start receiving messages from customers.
          </p>
        </div>
      );
    }
    if (filteredConversations.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <SearchX className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
          <p className="text-sm text-gray-500 max-w-[250px]">
            {searchQuery
              ? `No conversations matching "${searchQuery}"`
              : `No conversations from ${activeFilter}`
            }
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
            className="mt-4 text-sm text-gray-900 font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-gray-900 font-semibold text-sm">Conversations</h2>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {filteredConversations.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D3E] focus:border-[#2F5D3E] transition-all"
          />
        </div>

        {/* Channel Filters */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {channelFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 flex-shrink-0 ${
                activeFilter === filter.value
                  ? 'bg-[#2F5D3E] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {getFilterIcon(filter.value, activeFilter === filter.value)}
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-2">
        {showEmptyState() || filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={`mb-2 p-3 rounded-lg cursor-pointer transition-all border-l-[3px] ${
              selectedId === conversation.id
                ? `bg-white shadow-sm ${getPlatformBorderColor(conversation.channel)}`
                : 'bg-transparent hover:bg-white/70 border-l-transparent'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 bg-[#1a1f2e] rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {getInitials(conversation.customerName)}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                  {getChannelIcon(conversation.channel, 10)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm truncate">
                      {conversation.customerName || conversation.customerHandle}
                    </h3>
                    {conversation.isVIP && (
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {formatRelativeTime(conversation.lastMessageTime)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate mt-0.5">
                  {conversation.lastMessage}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs border ${getIntentStyle(
                      conversation.intent
                    )}`}
                  >
                    {conversation.intent}
                  </span>
                  {(conversation.unreadCount ?? 0) > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-[#2F5D3E] text-white">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
