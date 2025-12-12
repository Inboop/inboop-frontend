import { Search } from 'lucide-react';
import { Conversation } from '../App';
import { ConversationItem } from './ConversationItem';
import { useState } from 'react';
import { ChannelFilter } from './ChannelFilter';

interface ConversationsListProps {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ConversationsList({ conversations, selectedId, onSelect }: ConversationsListProps) {
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'instagram' | 'whatsapp' | 'facebook'>('all');

  const filteredConversations = selectedChannel === 'all'
    ? conversations
    : conversations.filter(c => c.user.platform === selectedChannel);

  return (
    <div className="w-96 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by username or message…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
          />
        </div>

        <ChannelFilter selected={selectedChannel} onSelect={setSelectedChannel} />
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {filteredConversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isSelected={selectedId === conversation.id}
            onClick={() => onSelect(conversation.id)}
          />
        ))}
      </div>
    </div>
  );
}