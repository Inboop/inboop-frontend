'use client';

import { Conversation } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Eye, ShoppingCart } from 'lucide-react';
import { getIntentColor, getLeadStatusColor } from '@/lib/helpers';
import { useState } from 'react';
import { LeadStatus } from '@/types';

interface LeadSnapshotProps {
  conversation: Conversation | null;
}

export function LeadSnapshot({ conversation }: LeadSnapshotProps) {
  const [leadStatus, setLeadStatus] = useState<LeadStatus>('New');
  const [notes, setNotes] = useState('');

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">
          Select a conversation to view lead details
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="border-b p-4">
        <h3 className="font-semibold">Lead Snapshot</h3>
      </div>

      <div className="flex-1 space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Instagram Handle</Label>
              <div className="flex items-center justify-between">
                <p className="font-medium">{conversation.instagramHandle}</p>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Intent & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Primary Intent</Label>
              <div className="mt-1">
                <Badge className={getIntentColor(conversation.intent)}>
                  {conversation.intent}
                </Badge>
              </div>
            </div>

            <div>
              <Label htmlFor="lead-status" className="text-xs text-muted-foreground">
                Lead Status
              </Label>
              <Select
                id="lead-status"
                value={leadStatus}
                onChange={(e) => setLeadStatus(e.target.value as LeadStatus)}
                className="mt-1"
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              View Lead
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Internal Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add notes about this lead..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
            <Button size="sm" className="mt-2 w-full">
              Save Notes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
