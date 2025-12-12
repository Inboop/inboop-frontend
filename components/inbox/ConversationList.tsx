'use client';

import { Conversation } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getIntentColor, formatMessageTime, getInitials } from '@/lib/helpers';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div className="text-muted-foreground">
          <p className="text-sm">No conversations yet</p>
          <p className="mt-1 text-xs">Connect your Instagram account to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h3 className="font-semibold">Conversations</h3>
        <p className="text-xs text-muted-foreground">{conversations.length} active</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={cn(
              'flex w-full items-start gap-3 border-b p-4 text-left transition-colors hover:bg-accent',
              selectedId === conversation.id && 'bg-accent'
            )}
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={conversation.profilePicture} />
              <AvatarFallback>{getInitials(conversation.instagramHandle)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate font-medium">{conversation.instagramHandle}</p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatMessageTime(conversation.lastMessageTime)}
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {conversation.lastMessage}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className={cn('text-xs', getIntentColor(conversation.intent))}>
                  {conversation.intent}
                </Badge>
                {conversation.unreadCount && conversation.unreadCount > 0 && (
                  <Badge className="h-5 min-w-[20px] rounded-full bg-primary px-1.5 text-xs">
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
