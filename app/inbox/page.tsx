'use client';

import { Sidebar } from '@/components/Sidebar';
import ConversationList from '@/components/inbox/ConversationList';
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
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-96 flex-shrink-0 border-r bg-gray-50 overflow-hidden">
          <ConversationList
            conversations={mockConversations}
            selectedId={selectedConversationId}
            onSelect={setSelectedConversationId}
          />
        </div>

        <div className="flex-1 min-w-0 bg-background">
          <ChatView
            messages={messages}
            conversation={selectedConversation}
          />
        </div>

        <div className="w-96 flex-shrink-0 border-l bg-white overflow-hidden">
          <LeadSnapshot conversation={selectedConversation} />
        </div>
      </div>
    </div>
  );
}
