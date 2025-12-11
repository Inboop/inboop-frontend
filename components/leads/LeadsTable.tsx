'use client';

import { Lead } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getInitials, formatMessageTime, getIntentColor, getLeadStatusColor } from '@/lib/helpers';
import { cn } from '@/lib/utils';

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
          <TableHead>Intent</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Message</TableHead>
          <TableHead>Message Preview</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow
            key={lead.id}
            onClick={() => onSelect(lead.id)}
            className={cn(
              'cursor-pointer transition-all duration-200 hover:bg-purple-50 hover:shadow-sm',
              selectedId === lead.id && 'bg-purple-100'
            )}
          >
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={lead.profilePicture} />
                  <AvatarFallback>{getInitials(lead.instagramHandle)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{lead.instagramHandle}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={getIntentColor(lead.intent)}>
                {lead.intent}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className={getLeadStatusColor(lead.status)}>
                {lead.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatMessageTime(lead.lastMessageTime)}
            </TableCell>
            <TableCell className="max-w-md truncate text-sm text-muted-foreground">
              {lead.lastMessageSnippet}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
