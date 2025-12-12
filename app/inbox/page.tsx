'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ConversationList from '@/components/inbox/ConversationList';
import ChatView from '@/components/inbox/ChatView';
import LeadSnapshot from '@/components/inbox/LeadSnapshot';
import { mockConversations, mockLeads } from '@/lib/mockData';

export default function InboxPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    mockConversations[0]?.id || null
  );

  const selectedConversation = mockConversations.find(
    (c) => c.id === selectedConversationId
  ) || null;

  const selectedLead = selectedConversationId
    ? mockLeads[selectedConversationId] || null
    : null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 overflow-hidden">
        <ConversationList
          conversations={mockConversations}
          selectedId={selectedConversationId}
          onSelect={setSelectedConversationId}
        />
        <ChatView conversation={selectedConversation} lead={selectedLead} />
        <LeadSnapshot lead={selectedLead} />
      </div>
    </div>
  );
}
