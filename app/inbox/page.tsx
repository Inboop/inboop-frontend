'use client';

import ConversationList from '@/components/inbox/ConversationList';
import { ChatView } from '@/components/inbox/ChatView';
import { LeadSnapshot } from '@/components/inbox/LeadSnapshot';
import { mockMessages } from '@/lib/mockData';
import { useUIStore } from '@/stores/useUIStore';
import { useConversationStore } from '@/stores/useConversationStore';

export default function InboxPage() {
  const { selectedConversationId, setSelectedConversationId } = useUIStore();
  const { conversations, setConversationVIP } = useConversationStore();

  const selectedConversation = selectedConversationId
    ? conversations.find((c) => c.id === selectedConversationId) || null
    : null;

  const messages = selectedConversationId ? mockMessages[selectedConversationId] || [] : [];

  const handleVIPChange = (isVIP: boolean) => {
    if (selectedConversationId) {
      setConversationVIP(selectedConversationId, isVIP);
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-96 flex-shrink-0 border-r bg-gray-50 overflow-hidden">
        <ConversationList
          conversations={conversations}
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
        <LeadSnapshot
          conversation={selectedConversation}
          onVIPChange={handleVIPChange}
        />
      </div>
    </div>
  );
}
