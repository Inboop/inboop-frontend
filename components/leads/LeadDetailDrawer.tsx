'use client';

import { Lead, IntentType, LeadStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, MessageSquare, ShoppingCart, ExternalLink } from 'lucide-react';
import { getIntentColor, getLeadStatusColor, getInitials, formatMessageTime } from '@/lib/helpers';
import { useState } from 'react';

interface LeadDetailDrawerProps {
  lead: Lead | null;
  onClose: () => void;
}

export function LeadDetailDrawer({ lead, onClose }: LeadDetailDrawerProps) {
  const [status, setStatus] = useState<LeadStatus>(lead?.status || 'New');
  const [notes, setNotes] = useState(lead?.notes || '');

  if (!lead) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 border-l bg-background shadow-lg">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Lead Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={lead.profilePicture} />
                  <AvatarFallback>{getInitials(lead.instagramHandle)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{lead.instagramHandle}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Created {formatMessageTime(lead.createdAt)}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Intent & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Primary Intent</Label>
                <div className="mt-1">
                  <Badge className={getIntentColor(lead.intent)}>
                    {lead.intent}
                  </Badge>
                </div>
              </div>

              <div>
                <Label htmlFor="status" className="text-xs text-muted-foreground">
                  Lead Status
                </Label>
                <Select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LeadStatus)}
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
              <CardTitle className="text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 rounded-md bg-muted p-2">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">
                      {formatMessageTime(lead.lastMessageTime)}
                    </p>
                    <p className="mt-1">{lead.lastMessageSnippet}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {lead.linkedOrders && lead.linkedOrders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Linked Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lead.linkedOrders.map((orderId) => (
                    <div key={orderId} className="flex items-center justify-between text-sm">
                      <span className="font-mono">Order #{orderId}</span>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button className="w-full" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Open in Inbox
            </Button>
            <Button className="w-full">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </div>
        </div>

        <div className="border-t p-4">
          <Button className="w-full">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
