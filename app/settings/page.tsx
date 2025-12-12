'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useAuthStore } from '@/stores/useAuthStore';
import { Instagram, CheckCircle, XCircle } from 'lucide-react';

export default function SettingsPage() {
  const { instagramConnection } = useAuthStore();
  const [brandName, setBrandName] = useState('');
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  const handleConnectInstagram = () => {
    // TODO: Implement Instagram OAuth flow
    console.log('Connect Instagram');
  };

  const handleSaveWorkspace = () => {
    // TODO: Save workspace settings
    console.log('Save workspace', { brandName, timezone });
  };

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mx-auto max-w-3xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Instagram Connection</CardTitle>
              <CardDescription>
                Connect your Instagram Business account to receive and manage DMs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Instagram className="h-6 w-6" />
                  <div>
                    <p className="font-medium">Instagram Business Account</p>
                    {instagramConnection.isConnected ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">
                          Connected as @{instagramConnection.username}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-muted-foreground">Not connected</span>
                      </div>
                    )}
                  </div>
                </div>
                {instagramConnection.isConnected ? (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Reconnect
                    </Button>
                    <Button variant="destructive" size="sm">
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleConnectInstagram}>
                    <Instagram className="mr-2 h-4 w-4" />
                    Connect Instagram
                  </Button>
                )}
              </div>

              {instagramConnection.isConnected && instagramConnection.lastSync && (
                <div className="text-sm text-muted-foreground">
                  Last synced: {new Date(instagramConnection.lastSync).toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workspace Settings</CardTitle>
              <CardDescription>
                Customize your workspace preferences and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand-name">Brand Name</Label>
                <Input
                  id="brand-name"
                  placeholder="Enter your brand name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This will be displayed in your workspace
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="Asia/Kolkata">India (IST)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Asia/Dubai">Dubai (GST)</option>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Used for displaying timestamps and scheduling
                </p>
              </div>

              <Button onClick={handleSaveWorkspace}>
                Save Workspace Settings
              </Button>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
