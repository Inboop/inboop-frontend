'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MessageSquare, Instagram } from 'lucide-react';
import ConversationList from '@/components/inbox/ConversationList';
import { ChatView } from '@/components/inbox/ChatView';
import { LeadSnapshot } from '@/components/inbox/LeadSnapshot';
import { CreateOrderDrawer, CreateOrderInitialValues } from '@/components/orders/CreateOrderDrawer';
import { useUIStore } from '@/stores/useUIStore';
import { useConversationStore } from '@/stores/useConversationStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminUser } from '@/lib/isAdmin';
import { mockMessages } from '@/lib/mockData';
import { mockExtendedOrders, ExtendedOrder } from '@/lib/orders.mock';
import { LeadStatus } from '@/types';
import { SkeletonConversation, SkeletonMessage, SkeletonDetailPanel, Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/stores/useToastStore';

// Deep clone mock orders for state management
const cloneMockOrders = (): ExtendedOrder[] => {
  return mockExtendedOrders.map((o) => ({
    ...o,
    customer: { ...o.customer },
    items: o.items.map((i) => ({ ...i })),
    totals: { ...o.totals },
    address: { ...o.address },
    timeline: o.timeline.map((t) => ({ ...t })),
  }));
};

export default function InboxPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { selectedConversationId, setSelectedConversationId } = useUIStore();
  const { conversations, setConversationVIP, isLoading, fetchConversations } = useConversationStore();
  const { orders, isLoading: ordersLoading, fetchOrders, addOrder } = useOrderStore();

  const isAdmin = isAdminUser(user?.email);

  // Create order drawer state
  const [isCreateOrderDrawerOpen, setIsCreateOrderDrawerOpen] = useState(false);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations(isAdmin);
  }, [fetchConversations, isAdmin]);

  // Initialize orders store if empty
  useEffect(() => {
    if (ordersLoading && isAdmin) {
      fetchOrders(cloneMockOrders());
    }
  }, [ordersLoading, isAdmin, fetchOrders]);

  // Check for conversation from URL query params (when coming from leads/orders page)
  useEffect(() => {
    // Only check once conversations are loaded
    if (isLoading) return;

    const conversationFromUrl = searchParams.get('conversation');
    if (conversationFromUrl) {
      const conversationExists = conversations.some(c => c.id === conversationFromUrl);
      if (conversationExists) {
        setSelectedConversationId(conversationFromUrl);
      }
    }
  }, [searchParams, conversations, setSelectedConversationId, isLoading]);

  const selectedConversation = selectedConversationId
    ? conversations.find((c) => c.id === selectedConversationId) || null
    : null;

  // Get messages for selected conversation (mock for admin, empty for others)
  const messages = isAdmin && selectedConversationId ? mockMessages[selectedConversationId] || [] : [];

  // Get existing order numbers for ID generation
  const existingOrderNumbers = useMemo(() => {
    return orders.map((o) => o.orderNumber);
  }, [orders]);

  // Initial values for create order drawer based on selected conversation
  const createOrderInitialValues = useMemo<CreateOrderInitialValues | undefined>(() => {
    if (!selectedConversation) return undefined;
    return {
      conversationId: selectedConversation.id,
      customer: {
        name: selectedConversation.customerName,
        handle: selectedConversation.customerHandle,
      },
      channel: selectedConversation.channel,
    };
  }, [selectedConversation]);

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

  // Handle create order from chat header
  const handleCreateOrder = useCallback(() => {
    setIsCreateOrderDrawerOpen(true);
  }, []);

  // Handle order creation
  const handleOrderCreated = useCallback((newOrder: ExtendedOrder) => {
    addOrder(newOrder);
    setIsCreateOrderDrawerOpen(false);
    toast.success('Order created');
    // Navigate to orders page with the new order selected
    window.location.href = `/orders?order=${newOrder.orderNumber}`;
  }, [addOrder]);

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
    <>
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
            onCreateOrder={selectedConversation ? handleCreateOrder : undefined}
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

      {/* Create Order Drawer */}
      <CreateOrderDrawer
        isOpen={isCreateOrderDrawerOpen}
        onClose={() => setIsCreateOrderDrawerOpen(false)}
        onCreate={handleOrderCreated}
        existingOrderNumbers={existingOrderNumbers}
        initialValues={createOrderInitialValues}
      />
    </>
  );
}
