'use client';

import { useState } from 'react';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { OrderDetailDrawer } from '@/components/orders/OrderDetailDrawer';
import { mockOrders } from '@/lib/mockData';

export default function OrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder = selectedOrderId
    ? mockOrders.find((o) => o.id === selectedOrderId) || null
    : null;

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto p-6">
          <OrdersTable
            orders={mockOrders}
            selectedId={selectedOrderId}
            onSelect={setSelectedOrderId}
          />
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </>
  );
}
