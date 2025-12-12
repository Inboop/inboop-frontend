'use client';

import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="flex-1 flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 size={32} className="text-gray-500" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-500">Analytics dashboard coming soon</p>
      </div>
    </div>
  );
}
