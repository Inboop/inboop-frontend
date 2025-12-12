'use client';

import Sidebar from '@/components/Sidebar';
import { Users } from 'lucide-react';

export default function LeadsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-gray-500" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Leads</h1>
          <p className="text-gray-500">Lead management coming soon</p>
        </div>
      </div>
    </div>
  );
}
