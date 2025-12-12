'use client';

import { Order } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatMessageTime, getOrderStatusColor, formatCurrency } from '@/lib/helpers';
import { cn } from '@/lib/utils';

interface OrdersTableProps {
  orders: Order[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function OrdersTable({ orders, selectedId, onSelect }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>No orders yet</p>
          <p className="mt-1 text-sm">Orders will appear here when leads are converted</p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow
            key={order.id}
            onClick={() => onSelect(order.id)}
            className={cn(
              'cursor-pointer',
              selectedId === order.id && 'bg-muted'
            )}
          >
            <TableCell className="font-mono text-sm">#{order.id}</TableCell>
            <TableCell className="font-medium">{order.customerHandle}</TableCell>
            <TableCell className="font-semibold">{formatCurrency(order.amount)}</TableCell>
            <TableCell>
              <Badge variant="secondary" className={getOrderStatusColor(order.status)}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatMessageTime(order.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
