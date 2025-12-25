'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RefreshCw, Trash2, ChevronDown, ChevronRight, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Super admin emails - must match backend configuration
const SUPER_ADMIN_EMAILS = ['nitheeshsudireddy@gmail.com'];

interface WebhookLog {
  id: number;
  objectType: string;
  entryId: string;
  senderId: string;
  recipientId: string;
  messageId: string;
  messageText: string;
  rawPayload: string;
  processed: boolean;
  errorMessage: string | null;
  receivedAt: string;
}

export default function WebhookLogsPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [clearing, setClearing] = useState(false);

  const isSuperAdmin = user?.email && SUPER_ADMIN_EMAILS.includes(user.email.toLowerCase());

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/v1/admin/webhook-logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 403) {
        setError('Access denied. Super admin required.');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch webhook logs');
      }

      const data = await response.json();
      setLogs(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = async () => {
    if (!confirm('Are you sure you want to clear all webhook logs?')) return;

    setClearing(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/v1/admin/webhook-logs`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setLogs([]);
      }
    } catch (err) {
      console.error('Failed to clear logs:', err);
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchLogs();
    }
  }, [isSuperAdmin]);

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible to super admins.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Webhook Logs</h1>
            <p className="text-gray-600">View incoming Instagram DM webhooks</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={clearLogs}
              disabled={clearing || logs.length === 0}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{logs.length}</div>
            <div className="text-sm text-gray-600">Total Webhooks</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {logs.filter(l => l.processed).length}
            </div>
            <div className="text-sm text-gray-600">Processed</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">
              {logs.filter(l => !l.processed).length}
            </div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No webhook logs yet. Send a DM to your connected Instagram account to test.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {logs.map((log) => (
                <div key={log.id} className="hover:bg-gray-50">
                  {/* Summary Row */}
                  <div
                    className="p-4 cursor-pointer flex items-center gap-4"
                    onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                  >
                    {expandedId === log.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}

                    {/* Status Icon */}
                    {log.processed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}

                    {/* Message Preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {log.messageText || '[No text - attachment?]'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-4">
                        <span>From: {log.senderId}</span>
                        <span>To: {log.recipientId}</span>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {new Date(log.receivedAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === log.id && (
                    <div className="px-4 pb-4 pl-14">
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Object Type:</span>{' '}
                            <span className="text-gray-900">{log.objectType}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Entry ID:</span>{' '}
                            <span className="text-gray-900">{log.entryId}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Message ID:</span>{' '}
                            <span className="text-gray-900 break-all">{log.messageId}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Processed:</span>{' '}
                            <span className={log.processed ? 'text-green-600' : 'text-red-600'}>
                              {log.processed ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>

                        {log.errorMessage && (
                          <div className="bg-red-50 border border-red-200 rounded p-3">
                            <span className="font-medium text-red-700">Error:</span>{' '}
                            <span className="text-red-600">{log.errorMessage}</span>
                          </div>
                        )}

                        <div>
                          <span className="font-medium text-gray-700 block mb-2">Raw Payload:</span>
                          <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto max-h-64">
                            {JSON.stringify(JSON.parse(log.rawPayload || '{}'), null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
