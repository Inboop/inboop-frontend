'use client';

import { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, MessageSquare, User } from 'lucide-react';
import { getOrderStatusColor, formatMessageTime, formatCurrency } from '@/lib/helpers';
import { useState } from 'react';

interface OrderDetailDrawerProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailDrawer({ order, onClose }: OrderDetailDrawerProps) {
  const [status, setStatus] = useState<OrderStatus>(order?.status || 'Pending');

  if (!order) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 border-l bg-background shadow-lg">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Order Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-mono text-base">Order #{order.id}</CardTitle>
                <Badge variant="secondary" className={getOrderStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Created {formatMessageTime(order.createdAt)}
              </p>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{order.customerHandle}</span>
              </div>
              <Button variant="link" className="mt-2 h-auto p-0 text-sm">
                View Lead
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Items</Label>
                <p className="mt-1">{order.items || 'No items listed'}</p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Total Amount</Label>
                <p className="mt-1 text-2xl font-bold">{formatCurrency(order.amount)}</p>
              </div>

              {order.notes && (
                <div>
                  <Label className="text-xs text-muted-foreground">Notes</Label>
                  <p className="mt-1 text-sm">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="order-status" className="text-xs text-muted-foreground">
                Update Status
              </Label>
              <Select
                id="order-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="mt-1"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Shipped">Shipped</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
            </CardContent>
          </Card>

          <Button className="w-full" variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            View Conversation
          </Button>
        </div>

        <div className="border-t p-4">
          <Button className="w-full">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
