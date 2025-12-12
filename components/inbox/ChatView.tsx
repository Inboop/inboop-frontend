'use client';

import { useState } from 'react';
import { Message } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatMessageTime } from '@/lib/helpers';
import { Send, Loader2 } from 'lucide-react';

interface ChatViewProps {
  messages: Message[];
  conversationId: string | null;
  instagramHandle?: string;
}

export function ChatView({ messages, conversationId, instagramHandle }: ChatViewProps) {
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!messageText.trim() || !conversationId) return;

    setIsSending(true);
    // TODO: Implement API call to send message
    setTimeout(() => {
      setMessageText('');
      setIsSending(false);
    }, 500);
  };

  if (!conversationId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>Select a conversation to view messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h3 className="font-semibold">{instagramHandle}</h3>
        <p className="text-xs text-muted-foreground">Instagram Direct Message</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex',
              message.isFromCustomer ? 'justify-start' : 'justify-end'
            )}
          >
            <div
              className={cn(
                'max-w-[70%] rounded-lg px-4 py-2',
                message.isFromCustomer
                  ? 'bg-muted'
                  : 'bg-primary text-primary-foreground'
              )}
            >
              <p className="text-sm">{message.text}</p>
              <p
                className={cn(
                  'mt-1 text-xs',
                  message.isFromCustomer ? 'text-muted-foreground' : 'opacity-70'
                )}
              >
                {formatMessageTime(message.timestamp)}
              </p>
            </div>
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
          />
          <Button onClick={handleSend} disabled={isSending || !messageText.trim()}>
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
