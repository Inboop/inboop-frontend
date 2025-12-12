'use client';

import { useState } from 'react';
import { Message, Conversation, ChannelType } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatMessageTime } from '@/lib/helpers';
import { Send, Loader2, Instagram, MessageCircle, Facebook } from 'lucide-react';

interface ChatViewProps {
  messages: Message[];
  conversation: Conversation | null;
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

const getLeadStatusStyle = (status: string) => {
  switch (status) {
    case 'Hot Lead':
      return 'text-orange-600 bg-orange-50';
    case 'Warm Lead':
      return 'text-amber-600 bg-amber-50';
    case 'Converted':
      return 'text-emerald-600 bg-emerald-50';
    case 'New Lead':
      return 'text-blue-600 bg-blue-50';
    case 'Cold Lead':
      return 'text-slate-600 bg-slate-50';
    default:
      return 'text-gray-600 bg-gray-50';
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

export function ChatView({ messages, conversation }: ChatViewProps) {
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

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
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>Select a conversation to view messages</p>
        </div>
      </div>
    );
  }

  // Mock lead data based on conversation (in real app, this would come from API)
  const mockLeadStatus = conversation.intent === 'Order' ? 'Hot Lead' :
                         conversation.intent === 'Inquiry' ? 'Warm Lead' : 'New Lead';
  const mockOrders = conversation.intent === 'Order' ? 2 : 0;

  return (
    <div className="flex h-full flex-col">
      {/* Enhanced Header */}
      <div className="border-b p-4 bg-white">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-[#1a1f2e] rounded-full flex items-center justify-center text-white font-medium">
            {getInitials(conversation.customerName)}
          </div>

          {/* Details */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {conversation.customerName || conversation.customerHandle}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1">
                {getChannelIcon(conversation.channel)}
                {getChannelName(conversation.channel)}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-green-600">Active now</span>
              <span className="text-gray-300">•</span>
              <span>{mockOrders} orders</span>
              <span className="text-gray-300">•</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLeadStatusStyle(mockLeadStatus)}`}>
                {mockLeadStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex flex-col',
              message.isFromCustomer ? 'items-start' : 'items-end'
            )}
          >
            <div
              className={cn(
                'max-w-[70%] rounded-lg px-4 py-2',
                message.isFromCustomer
                  ? 'bg-muted'
                  : 'bg-gray-900 text-white'
              )}
            >
              <p className="text-sm">{message.text}</p>
            </div>
            <p className="text-xs text-gray-400 mt-1 px-1">
              {formatMessageTime(message.timestamp)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isSending}
            className="focus:ring-gray-900 focus:border-gray-900 focus:ring-2"
          />
          <Button
            onClick={handleSend}
            disabled={isSending || !messageText.trim()}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
