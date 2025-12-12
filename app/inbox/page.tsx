'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { ConversationList } from '@/components/inbox/ConversationList';
import { ChatView } from '@/components/inbox/ChatView';
import { LeadSnapshot } from '@/components/inbox/LeadSnapshot';
import { mockConversations, mockMessages } from '@/lib/mockData';
import { useUIStore } from '@/stores/useUIStore';

export default function InboxPage() {
  const { selectedConversationId, setSelectedConversationId } = useUIStore();

  const selectedConversation = selectedConversationId
    ? mockConversations.find((c) => c.id === selectedConversationId) || null
    : null;

  const messages = selectedConversationId ? mockMessages[selectedConversationId] || [] : [];

  return (
    <AppLayout title="Inbox">
      <div className="flex h-full">
        <div className="w-80 border-r bg-card">
          <ConversationList
            conversations={mockConversations}
            selectedId={selectedConversationId}
            onSelect={setSelectedConversationId}
          />
        </div>

        <div className="flex-1 bg-background">
          <ChatView
            messages={messages}
            conversationId={selectedConversationId}
            instagramHandle={selectedConversation?.instagramHandle}
          />
        </div>

        <div className="w-80 border-l bg-card">
          <LeadSnapshot conversation={selectedConversation} />
        </div>
      </div>
    </AppLayout>
  );
}
