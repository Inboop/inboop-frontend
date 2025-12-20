import { create } from 'zustand';
import { ExtendedOrder } from '@/lib/orders.mock';
import { OrderStatus } from '@/components/orders/OrderStatusBadge';

// Deep clone helper for orders
const cloneOrder = (order: ExtendedOrder): ExtendedOrder => ({
  ...order,
  customer: { ...order.customer },
  items: order.items.map((i) => ({ ...i })),
  totals: { ...order.totals },
  address: { ...order.address },
  timeline: order.timeline.map((t) => ({ ...t })),
});

interface OrderState {
  orders: ExtendedOrder[];
  isLoading: boolean;
  fetchOrders: (mockOrders: ExtendedOrder[]) => void;
  addOrder: (order: ExtendedOrder) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, statusLabel: string) => void;
  getOrdersByConversationId: (conversationId: string) => ExtendedOrder[];
  getOrderByNumber: (orderNumber: string) => ExtendedOrder | undefined;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: true,

  fetchOrders: (mockOrders) => {
    set({
      orders: mockOrders.map(cloneOrder),
      isLoading: false,
    });
  },

  addOrder: (order) => {
    set((state) => ({
      orders: [cloneOrder(order), ...state.orders],
    }));
  },

  updateOrderStatus: (orderId, newStatus, statusLabel) => {
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== orderId) return order;

        const now = new Date();
        const newTimelineEvent = {
          id: `t${Date.now()}`,
          status: newStatus,
          label: `Status changed to ${statusLabel}`,
          description: 'Updated by you',
          timestamp: now,
        };

        return {
          ...order,
          status: newStatus,
          updatedAt: now,
          timeline: [...order.timeline, newTimelineEvent],
        };
      }),
    }));
  },

  getOrdersByConversationId: (conversationId) => {
    return get().orders.filter((o) => o.conversationId === conversationId);
  },

  getOrderByNumber: (orderNumber) => {
    return get().orders.find((o) => o.orderNumber === orderNumber);
  },
}));