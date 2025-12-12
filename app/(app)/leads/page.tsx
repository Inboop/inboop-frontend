'use client';

import { useState } from 'react';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadDetailDrawer } from '@/components/leads/LeadDetailDrawer';
import { mockLeads } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { IntentType } from '@/types';
import { cn } from '@/lib/utils';

const intentFilters: IntentType[] = ['Inquiry', 'Order', 'Payment', 'Delivery', 'Issue', 'Other'];

export default function LeadsPage() {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<IntentType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeads = mockLeads.filter((lead) => {
    const matchesIntent = !selectedIntent || lead.intent === selectedIntent;
    const matchesSearch =
      !searchQuery ||
      lead.customerHandle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIntent && matchesSearch;
  });

  const selectedLead = selectedLeadId
    ? mockLeads.find((l) => l.id === selectedLeadId) || null
    : null;

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="border-b bg-card p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIntent(null)}
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium transition-colors',
                !selectedIntent
                  ? 'bg-gray-900 text-white'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              All
            </button>
            {intentFilters.map((intent) => (
              <button
                key={intent}
                onClick={() => setSelectedIntent(intent)}
                className={cn(
                  'rounded-full px-3 py-1 text-sm font-medium transition-colors',
                  selectedIntent === intent
                    ? 'bg-gray-900 text-white'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {intent}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <LeadsTable
            leads={filteredLeads}
            selectedId={selectedLeadId}
            onSelect={setSelectedLeadId}
          />
        </div>
      </div>

      {selectedLead && (
        <LeadDetailDrawer
          lead={selectedLead}
          onClose={() => setSelectedLeadId(null)}
        />
      )}
    </>
  );
}
