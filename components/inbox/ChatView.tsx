'use client';

import { useState } from 'react';
import { Message, Conversation, ChannelType } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatMessageTime, isInboundMessage, isOutboundMessage } from '@/lib/helpers';
import { Send, Loader2, Instagram, MessageCircle, Facebook, Smile, Paperclip, MessageSquare, CheckCheck, Plus, Image, Video, FileText, Mic } from 'lucide-react';
import { useOrderStore } from '@/stores/useOrderStore';

interface ChatViewProps {
  messages: Message[];
  conversation: Conversation | null;
  onCreateOrder?: () => void;
}

// Instagram gradient icon
const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="ig-gradient-header" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFDC80" />
        <stop offset="25%" stopColor="#F77737" />
        <stop offset="50%" stopColor="#E1306C" />
        <stop offset="75%" stopColor="#C13584" />
        <stop offset="100%" stopColor="#833AB4" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-gradient-header)" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" stroke="url(#ig-gradient-header)" strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig-gradient-header)" />
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
      <linearGradient id="msg-gradient-header" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0099FF" />
        <stop offset="100%" stopColor="#A033FF" />
      </linearGradient>
    </defs>
    <path
      d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.13.26.35.27.57l.05 1.78c.02.63.67 1.04 1.24.79l1.99-.88c.17-.07.36-.09.54-.05.91.25 1.87.38 2.77.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2z"
      fill="url(#msg-gradient-header)"
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

const getChannelName = (channel: ChannelType) => {
  switch (channel) {
    case 'instagram':
      return 'Instagram';
    case 'whatsapp':
      return 'WhatsApp';
    case 'messenger':
      return 'Messenger';
  }
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'New':
      return 'text-blue-600 bg-blue-50';
    case 'Active':
      return 'text-[#2F5D3E] bg-green-50';
    case 'Converted':
      return 'text-emerald-600 bg-emerald-50';
    case 'Closed':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

// Consistent style for outgoing messages (from business)
const getOutgoingBubbleStyle = () => {
  return 'bg-gray-900 text-white';
};

// Platform-specific styles for incoming messages (from customer)
const getIncomingBubbleStyle = (channel: ChannelType) => {
  switch (channel) {
    case 'instagram':
      return 'bg-gray-100 text-gray-900';
    case 'whatsapp':
      return 'bg-white text-gray-900 border border-gray-200';
    case 'messenger':
      return 'bg-gray-100 text-gray-900';
    default:
      return 'bg-muted text-gray-900';
  }
};

// Background for chat area
const getChatAreaStyle = () => {
  return 'bg-gray-50';
};

// Consistent send button style
const getSendButtonStyle = () => {
  return 'bg-gray-900 hover:bg-gray-800 text-white';
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

// Helper to determine if message is from customer (uses direction if available, falls back to isFromCustomer)
const isMessageFromCustomer = (message: Message): boolean => {
  return isInboundMessage(message.direction, message.isFromCustomer);
};

// Helper to render attachment icon based on content type
const getContentTypeIcon = (contentType?: string) => {
  switch (contentType) {
    case 'IMAGE':
      return <Image className="w-4 h-4" />;
    case 'VIDEO':
      return <Video className="w-4 h-4" />;
    case 'AUDIO':
      return <Mic className="w-4 h-4" />;
    case 'FILE':
      return <FileText className="w-4 h-4" />;
    default:
      return null;
  }
};

export function ChatView({ messages, conversation, onCreateOrder }: ChatViewProps) {
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { getOrdersByConversationId } = useOrderStore();

  const handleSend = async () => {
    if (!messageText.trim() || !conversation) return;

    setIsSending(true);
    // TODO: Implement API call to send message
    setTimeout(() => {
      setMessageText('');
      setIsSending(false);
    }, 500);
  };

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
          <p className="text-sm text-gray-500 max-w-[250px]">
            Choose a conversation from the list to view messages and reply to customers.
          </p>
        </div>
      </div>
    );
  }

  // Get status from conversation
  const status = conversation.status ?? 'New';
  // Get actual orders count for this conversation
  const conversationOrders = getOrdersByConversationId(conversation.id);
  const ordersCount = conversationOrders.length;

  return (
    <div className="flex h-full flex-col">
      {/* Enhanced Header */}
      <div className="border-b p-3 bg-white">
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="w-8 h-8 bg-[#1a1f2e] rounded-full flex items-center justify-center text-white text-xs font-medium">
            {getInitials(conversation.customerName)}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm text-gray-900 truncate">
              {conversation.customerName || conversation.customerHandle}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
              <span className="flex items-center gap-1">
                {getChannelIcon(conversation.channel)}
                {getChannelName(conversation.channel)}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-green-600">Active</span>
              <span className="text-gray-300">•</span>
              <span>{ordersCount} orders</span>
              <span className="text-gray-300">•</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getStatusStyle(status)}`}>
                {status}
              </span>
            </div>
          </div>

          {/* Create Order Button */}
          {onCreateOrder && (
            <button
              onClick={onCreateOrder}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2F5D3E] text-white text-xs font-medium rounded-lg hover:bg-[#234430] transition-colors"
              title="Create order for this conversation"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Order
            </button>
          )}
        </div>
      </div>

      <div className={cn("flex-1 overflow-y-auto p-4 space-y-3", getChatAreaStyle())}>
        {messages.map((message) => {
          const fromCustomer = isMessageFromCustomer(message);
          const contentIcon = getContentTypeIcon(message.contentType);

          return (
            <div
              key={message.id}
              className={cn(
                'flex flex-col',
                fromCustomer ? 'items-start' : 'items-end'
              )}
            >
              <div
                className={cn(
                  'max-w-[70%] rounded-xl px-3 py-2',
                  fromCustomer
                    ? 'bg-white border border-gray-200 text-gray-900'
                    : 'bg-[#2F5D3E] text-white'
                )}
              >
                {/* Show attachment indicator if present */}
                {message.hasAttachment && message.attachmentUrl && (
                  <div className="mb-2">
                    {message.contentType === 'IMAGE' ? (
                      <img
                        src={message.attachmentUrl}
                        alt="Attachment"
                        className="max-w-full rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                        {contentIcon}
                        <span className="text-xs text-gray-600">
                          {message.contentType} attachment
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-sm">{message.text}</p>
                {/* Show translated text if available */}
                {message.translatedText && message.translatedText !== message.text && (
                  <p className="text-xs text-gray-400 mt-1 italic">
                    {message.translatedText}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5 px-1">
                <span className="text-[10px] text-gray-400">
                  {formatMessageTime(message.sentAt || message.timestamp)}
                </span>
                {!fromCustomer && (
                  <CheckCheck className={cn(
                    "w-3 h-3",
                    message.isRead ? "text-blue-400" : "text-gray-400"
                  )} />
                )}
                {/* Show sender type for system messages */}
                {message.senderType === 'SYSTEM' && (
                  <span className="text-[10px] text-gray-400 ml-1">• System</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t p-3 bg-white">
        <div className="flex items-center gap-2">
          {/* Message input */}
          <div className="flex-1 relative">
            <Input
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isSending}
              className="pr-16 py-2 text-sm rounded-lg border-gray-200 focus:ring-[#2F5D3E] focus:border-[#2F5D3E] focus:ring-2"
            />
            {/* Emoji and Attachment buttons inside input */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Add emoji"
              >
                <Smile className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Attach file"
              >
                <Paperclip className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={isSending || !messageText.trim()}
            className="bg-[#2F5D3E] hover:bg-[#234430] text-white px-3 py-2 rounded-lg gap-1.5 text-sm"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                Send
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
