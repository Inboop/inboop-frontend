'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MessageSquare, Instagram } from 'lucide-react';
import ConversationList from '@/components/inbox/ConversationList';
import { ChatView } from '@/components/inbox/ChatView';
import { LeadSnapshot } from '@/components/inbox/LeadSnapshot';
import { useUIStore } from '@/stores/useUIStore';
import { useConversationStore } from '@/stores/useConversationStore';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminUser } from '@/lib/isAdmin';
import { mockMessages } from '@/lib/mockData';
import { LeadStatus } from '@/types';
import { SkeletonConversation, SkeletonMessage, SkeletonDetailPanel, Skeleton } from '@/components/ui/skeleton';

export default function InboxPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { selectedConversationId, setSelectedConversationId } = useUIStore();
  const { conversations, setConversationVIP, isLoading, fetchConversations } = useConversationStore();

  const isAdmin = isAdminUser(user?.email);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations(isAdmin);
  }, [fetchConversations, isAdmin]);

  // Check for conversation from URL query params (when coming from leads page)
  useEffect(() => {
    const conversationFromUrl = searchParams.get('conversation');
    if (conversationFromUrl) {
      const conversationExists = conversations.some(c => c.id === conversationFromUrl);
      if (conversationExists) {
        setSelectedConversationId(conversationFromUrl);
      }
    }
  }, [searchParams, conversations, setSelectedConversationId]);

  const selectedConversation = selectedConversationId
    ? conversations.find((c) => c.id === selectedConversationId) || null
    : null;

  // Get messages for selected conversation (mock for admin, empty for others)
  const messages = isAdmin && selectedConversationId ? mockMessages[selectedConversationId] || [] : [];

  const handleVIPChange = (isVIP: boolean) => {
    if (selectedConversationId) {
      setConversationVIP(selectedConversationId, isVIP);
    }
  };

  const handleStatusChange = (status: LeadStatus) => {
    if (selectedConversationId) {
      // TODO: Update lead status via API
      console.log('Lead status changed:', selectedConversationId, status);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full overflow-hidden">
        {/* Conversation list skeleton */}
        <div className="w-[320px] flex-shrink-0 border-r bg-gray-50 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <Skeleton className="w-full h-10 rounded-xl" />
          </div>
          <div className="p-2 space-y-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonConversation key={i} />
            ))}
          </div>
        </div>

        {/* Chat area skeleton */}
        <div className="flex-1 min-w-0 bg-background flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div>
              <Skeleton className="w-24 h-4 mb-1" />
              <Skeleton className="w-16 h-3" />
            </div>
          </div>
          <div className="flex-1 p-4 space-y-4">
            <SkeletonMessage />
            <SkeletonMessage isOwn />
            <SkeletonMessage />
            <SkeletonMessage />
            <SkeletonMessage isOwn />
          </div>
          <div className="p-4 border-t border-gray-200">
            <Skeleton className="w-full h-12 rounded-xl" />
          </div>
        </div>

        {/* Lead snapshot skeleton */}
        <div className="w-[320px] flex-shrink-0 border-l bg-white overflow-hidden">
          <SkeletonDetailPanel />
        </div>
      </div>
    );
  }

  // Empty state when no conversations
  if (conversations.length === 0) {
    return (
      <div className="flex h-full overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-[#F8F9FA]">
          <div className="text-center px-4 max-w-md">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#2F5D3E]/10 to-[#2F5D3E]/5 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-[#2F5D3E]" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your inbox is empty</h2>
            <p className="text-sm text-gray-500 mb-6">
              Connect your Instagram account to start receiving and managing DMs from your customers.
            </p>
            <a
              href="/settings?tab=integrations"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-150 ease-out shadow-md hover:shadow-lg hover:brightness-110"
              style={{
                background: 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)',
              }}
            >
              <Instagram className="w-4 h-4" />
              Connect Instagram
            </a>
            <p className="text-xs text-gray-400 mt-4">
              Messages will appear here automatically once connected
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-[320px] flex-shrink-0 border-r bg-gray-50 overflow-hidden">
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

      <div className="w-[320px] flex-shrink-0 border-l bg-white overflow-hidden">
        <LeadSnapshot
          conversation={selectedConversation}
          onVIPChange={handleVIPChange}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}
