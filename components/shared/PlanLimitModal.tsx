'use client';

import { useState, useCallback } from 'react';
import { X, Users, Mail } from 'lucide-react';

interface PlanLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  currentPlan?: string;
  userLimit?: number;
}

/**
 * Modal displayed when a plan limit is reached.
 * Shows friendly upgrade messaging without implementing billing.
 * Only shown to admin users.
 */
export function PlanLimitModal({
  isOpen,
  onClose,
  title = 'User limit reached',
  description,
  currentPlan = 'Pro',
  userLimit = 5,
}: PlanLimitModalProps) {
  if (!isOpen) return null;

  const defaultDescription = `Your ${currentPlan} plan supports up to ${userLimit} users. To add more team members, upgrade to Enterprise.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {description || defaultDescription}
          </p>

          {/* Current Plan Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Current Plan</div>
                <div className="font-medium text-gray-900">{currentPlan}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">User Limit</div>
                <div className="font-medium text-gray-900">{userLimit} users</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <a
              href="mailto:sales@inboop.com?subject=Enterprise%20Plan%20Inquiry"
              className="w-full px-6 py-3 bg-[#2F5D3E] text-white font-medium rounded-xl hover:bg-[#264a32] transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Contact Sales
            </a>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors border border-gray-200"
            >
              Close
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Enterprise plans include unlimited users, priority support, and advanced features.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to manage plan limit modal state.
 */
export function usePlanLimitModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState<{
    title: string;
    description: string;
    currentPlan?: string;
    requiredPlan?: string;
    userLimit?: number;
  }>({
    title: 'User limit reached',
    description: '',
  });

  const showPlanLimitModal = useCallback(
    (props: {
      title?: string;
      description?: string;
      currentPlan?: string;
      requiredPlan?: string;
      userLimit?: number;
    }) => {
      setModalProps({
        title: props.title || 'User limit reached',
        description: props.description || '',
        currentPlan: props.currentPlan,
        requiredPlan: props.requiredPlan,
        userLimit: props.userLimit,
      });
      setIsOpen(true);
    },
    []
  );

  const hidePlanLimitModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    modalProps,
    showPlanLimitModal,
    hidePlanLimitModal,
  };
}
