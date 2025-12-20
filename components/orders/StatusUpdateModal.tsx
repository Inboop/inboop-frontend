'use client';

import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  OrderStatus,
  OrderStatusBadge,
  getAllowedNextStatuses,
  getStatusLabel,
} from './OrderStatusBadge';

interface StatusUpdateModalProps {
  isOpen: boolean;
  currentStatus: OrderStatus;
  orderNumber: string;
  onClose: () => void;
  onConfirm: (newStatus: OrderStatus) => void;
}

export function StatusUpdateModal({
  isOpen,
  currentStatus,
  orderNumber,
  onClose,
  onConfirm,
}: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const allowedStatuses = getAllowedNextStatuses(currentStatus);
  const hasOptions = allowedStatuses.length > 0;

  const handleConfirm = async () => {
    if (!selectedStatus || isUpdating) return;

    setIsUpdating(true);
    // Simulate a brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300));
    onConfirm(selectedStatus);
    setIsUpdating(false);
    setSelectedStatus(null);
  };

  const handleClose = () => {
    if (isUpdating) return;
    setSelectedStatus(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mx-4">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Update Status</h3>
              <p className="text-sm text-gray-500">{orderNumber}</p>
            </div>
            <button
              onClick={handleClose}
              disabled={isUpdating}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            {/* Current Status */}
            <div className="mb-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Current Status
              </p>
              <OrderStatusBadge status={currentStatus} />
            </div>

            {hasOptions ? (
              <>
                {/* Arrow indicator */}
                <div className="flex justify-center mb-4">
                  <ArrowRight className="w-5 h-5 text-gray-300" />
                </div>

                {/* Available Options */}
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Update to
                  </p>
                  <div className="space-y-2">
                    {allowedStatuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        disabled={isUpdating}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all',
                          selectedStatus === status
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                          isUpdating && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <div
                          className={cn(
                            'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                            selectedStatus === status
                              ? 'border-gray-900'
                              : 'border-gray-300'
                          )}
                        >
                          {selectedStatus === status && (
                            <div className="w-2 h-2 rounded-full bg-gray-900" />
                          )}
                        </div>
                        <OrderStatusBadge status={status} />
                        <span className="text-sm text-gray-600 ml-auto">
                          {getStatusLabel(status)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  No further actions available for this status.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleClose}
              disabled={isUpdating}
              className="flex-1 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            {hasOptions && (
              <button
                onClick={handleConfirm}
                disabled={!selectedStatus || isUpdating}
                className={cn(
                  'flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition-all',
                  selectedStatus && !isUpdating
                    ? 'opacity-100 hover:brightness-110'
                    : 'opacity-50 cursor-not-allowed'
                )}
                style={{
                  background: 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)',
                }}
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
