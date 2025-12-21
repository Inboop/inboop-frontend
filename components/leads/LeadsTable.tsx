'use client';

import { Lead } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  getInitials,
  formatMessageTime,
  getIntentColor,
  getLeadStatusColor,
  getLeadSourceColor,
  getLeadSourceDisplayName,
  isTerminalLeadStatus,
} from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Sparkles, User, Lock } from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function LeadsTable({ leads, selectedId, onSelect }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>No leads yet</p>
          <p className="mt-1 text-sm">Leads will appear here from your conversations</p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contact</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Intent</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Message</TableHead>
          <TableHead>Message Preview</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => {
          const isTerminal = isTerminalLeadStatus(lead.status);

          return (
            <TableRow
              key={lead.id}
              onClick={() => onSelect(lead.id)}
              className={cn(
                'cursor-pointer transition-all duration-200 hover:bg-purple-50 hover:shadow-sm',
                selectedId === lead.id && 'bg-purple-100',
                isTerminal && 'opacity-75'
              )}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={lead.profilePicture} />
                    <AvatarFallback>{getInitials(lead.customerHandle)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{lead.customerName || lead.customerHandle}</span>
                    {lead.assignedTo && (
                      <span className="text-xs text-gray-400">Assigned to {lead.assignedTo}</span>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {lead.source ? (
                  <Badge className={cn("gap-1", getLeadSourceColor(lead.source))}>
                    {lead.source === 'AI' ? (
                      <Sparkles className="w-3 h-3" />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                    {getLeadSourceDisplayName(lead.source)}
                  </Badge>
                ) : (
                  <span className="text-xs text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                <Badge className={getIntentColor(lead.intent)}>
                  {lead.intent}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <Badge className={getLeadStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                  {isTerminal && (
                    <span title="Terminal state">
                      <Lock className="w-3 h-3 text-gray-400" />
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatMessageTime(lead.lastMessageTime)}
              </TableCell>
              <TableCell className="max-w-md truncate text-sm text-muted-foreground">
                {lead.lastMessageSnippet}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
