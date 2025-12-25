'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  User,
  Building2,
  Bell,
  Puzzle,
  CreditCard,
  Mail,
  Phone,
  Globe,
  Instagram,
  MessageCircle,
  Facebook,
  Check,
  CheckCircle,
  Loader2,
  AlertTriangle,
  ExternalLink,
  X,
  Clock,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  HelpCircle,
  Settings,
  Link2,
  UserPlus,
  Key,
  Shield
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/stores/useToastStore';
import { cn } from '@/lib/utils';
import { getMyWorkspaces, getWorkspaceMembers, WorkspaceResponse, WorkspaceMemberResponse, PlanType } from '@/lib/workspaceApi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type TabId = 'profile' | 'workspace' | 'notifications' | 'integrations' | 'billing';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

// Instagram integration status types (matches backend enums)
type IntegrationStatus = 'NOT_CONNECTED' | 'CONNECTED_READY' | 'BLOCKED' | 'PENDING';
type IntegrationReason =
  | 'NO_PAGES_FOUND'
  | 'IG_NOT_LINKED_TO_PAGE'
  | 'IG_NOT_BUSINESS'
  | 'OWNERSHIP_MISMATCH'
  | 'ADMIN_COOLDOWN'
  | 'MISSING_PERMISSIONS'
  | 'TOKEN_EXPIRED'
  | 'API_ERROR';

interface IntegrationStatusResponse {
  status: IntegrationStatus;
  reason?: IntegrationReason;
  message: string;
  retryAt?: string;
  details?: {
    instagramUsername?: string;
    facebookPageId?: string;
    businessName?: string;
  };
  nextActions?: Array<{
    type: string;
    label: string;
    url?: string;
  }>;
  actions?: {
    reconnectUrl?: string;
    businessSettingsUrl?: string;
    businessSuiteUrl?: string;
    pageCreateUrl?: string;
  };
  apiError?: {
    code?: number;
    subcode?: number;
    type?: string;
    message?: string;
    fbtraceId?: string;
  };
}

// Map reason codes to user-friendly messages
const getReasonMessage = (reason: IntegrationReason): string => {
  switch (reason) {
    case 'NO_PAGES_FOUND':
      return 'No business pages found. Create a page to connect Instagram.';
    case 'IG_NOT_LINKED_TO_PAGE':
      return 'Connect your Instagram account to a business page first.';
    case 'IG_NOT_BUSINESS':
      return 'Switch to an Instagram Business or Creator account to continue.';
    case 'OWNERSHIP_MISMATCH':
      return 'Check your Business Settings to fix account permissions.';
    case 'ADMIN_COOLDOWN':
      return 'Please wait before connecting. New page admins have a waiting period.';
    case 'MISSING_PERMISSIONS':
      return 'Some permissions are missing. Try connecting again.';
    case 'TOKEN_EXPIRED':
      return 'Your connection has expired. Please reconnect.';
    case 'API_ERROR':
      return 'Something went wrong. Please try again later.';
    default:
      return 'Unable to connect. Please try again.';
  }
};

// Format retry date for display
const formatRetryDate = (retryAt: string): string => {
  const date = new Date(retryAt);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

// Wizard diagnose content based on reason
interface DiagnoseContent {
  title: string;
  description: string;
  checklist: Array<{ label: string; checked: boolean }>;
  primaryAction: {
    label: string;
    type: 'external' | 'reconnect' | 'wait';
    url?: string;
  };
  helpText: string;
}

interface ActionUrls {
  reconnectUrl?: string;
  businessSettingsUrl?: string;
  businessSuiteUrl?: string;
  pageCreateUrl?: string;
}

const getDiagnoseContent = (
  reason: IntegrationReason | undefined,
  retryAt?: string,
  actions?: ActionUrls
): DiagnoseContent => {
  // Fallback URLs in case API doesn't provide them
  const pageCreateUrl = actions?.pageCreateUrl || 'https://www.facebook.com/pages/create';
  const businessSettingsUrl = actions?.businessSettingsUrl || 'https://business.facebook.com/settings';
  const businessSuiteUrl = actions?.businessSuiteUrl || 'https://business.facebook.com/latest/home';

  switch (reason) {
    case 'NO_PAGES_FOUND':
      return {
        title: 'No Business Page Found',
        description: 'You need a Business Page to connect Instagram.',
        checklist: [
          { label: 'Create a Business Page on Meta', checked: false },
          { label: 'You are an admin of the page', checked: false },
          { label: 'Page is published (not in draft)', checked: false },
        ],
        primaryAction: { label: 'Create Business Page', type: 'external', url: pageCreateUrl },
        helpText: 'A Business Page is required to use Instagram messaging features. You can create one for free on Meta.',
      };
    case 'IG_NOT_LINKED_TO_PAGE':
      return {
        title: 'Instagram Not Linked',
        description: 'Your Instagram account needs to be linked to a Business Page.',
        checklist: [
          { label: 'Instagram account is Business or Creator type', checked: false },
          { label: 'Instagram is linked to your Business Page', checked: false },
          { label: 'You have admin access to the page', checked: false },
        ],
        primaryAction: { label: 'Open Business Suite', type: 'external', url: businessSuiteUrl },
        helpText: 'Go to Business Suite → Settings → Instagram account to connect your page.',
      };
    case 'IG_NOT_BUSINESS':
      return {
        title: 'Personal Account Detected',
        description: 'Switch to an Instagram Business or Creator account.',
        checklist: [
          { label: 'Open Instagram app', checked: false },
          { label: 'Go to Settings → Account', checked: false },
          { label: 'Select "Switch to Professional Account"', checked: false },
        ],
        primaryAction: { label: 'Learn How to Switch', type: 'external', url: 'https://help.instagram.com/502981923235522' },
        helpText: 'Professional accounts (Business or Creator) are free and unlock messaging features.',
      };
    case 'OWNERSHIP_MISMATCH':
      return {
        title: 'Permission Issue',
        description: 'Your account permissions need to be updated.',
        checklist: [
          { label: 'You are an admin of the Business Page', checked: false },
          { label: 'Instagram account is properly linked', checked: false },
          { label: 'Business Manager access is configured', checked: false },
        ],
        primaryAction: { label: 'Open Business Settings', type: 'external', url: businessSettingsUrl },
        helpText: 'Check your role in Business Settings. You need admin access to connect Instagram.',
      };
    case 'ADMIN_COOLDOWN':
      return {
        title: 'Waiting Period Active',
        description: 'New admins must wait before connecting. This is a security measure.',
        checklist: [
          { label: 'You were recently added as page admin', checked: true },
          { label: 'Wait for the cooldown period to end', checked: false },
          { label: 'Try reconnecting after the wait', checked: false },
        ],
        primaryAction: {
          label: retryAt ? `Available ${formatRetryDate(retryAt)}` : 'Waiting...',
          type: 'wait'
        },
        helpText: 'This is a security measure. The waiting period helps protect your account.',
      };
    case 'TOKEN_EXPIRED':
      return {
        title: 'Connection Expired',
        description: 'Your Instagram connection needs to be refreshed.',
        checklist: [
          { label: 'Previous connection has expired', checked: true },
          { label: 'Reconnect to refresh access', checked: false },
        ],
        primaryAction: { label: 'Reconnect Now', type: 'reconnect' },
        helpText: 'Connections expire periodically for security. Simply reconnect to continue.',
      };
    case 'MISSING_PERMISSIONS':
      return {
        title: 'Permissions Missing',
        description: 'Some required permissions were not granted.',
        checklist: [
          { label: 'Allow messaging permissions', checked: false },
          { label: 'Allow page access permissions', checked: false },
          { label: 'Complete the authorization flow', checked: false },
        ],
        primaryAction: { label: 'Grant Permissions', type: 'reconnect' },
        helpText: 'When reconnecting, make sure to accept all requested permissions.',
      };
    default:
      return {
        title: 'Connection Issue',
        description: 'There was a problem connecting your Instagram account.',
        checklist: [
          { label: 'Check your internet connection', checked: false },
          { label: 'Try again in a few minutes', checked: false },
        ],
        primaryAction: { label: 'Try Again', type: 'reconnect' },
        helpText: 'If the problem persists, try disconnecting and reconnecting your account.',
      };
  }
};

const tabs: Tab[] = [
  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  { id: 'workspace', label: 'Workspace', icon: <Building2 className="w-5 h-5" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
  { id: 'integrations', label: 'Integrations', icon: <Puzzle className="w-5 h-5" /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard className="w-5 h-5" /> },
];

// Plan descriptions and features
const planInfo: Record<PlanType, { name: string; description: string; features: string[] }> = {
  FREE: {
    name: 'Free',
    description: 'Basic features for getting started',
    features: ['Up to 2 team members', 'Basic inbox', 'Limited leads'],
  },
  PRO: {
    name: 'Pro',
    description: 'Everything you need to grow your business',
    features: ['Up to 5 team members', 'Unlimited conversations', 'Lead management', 'Basic analytics'],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    description: 'Advanced features for larger teams',
    features: ['Unlimited team members', 'Priority support', 'Advanced analytics', 'Custom integrations'],
  },
};

// Toggle Switch Component
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        enabled ? 'bg-[#2F5D3E]' : 'bg-gray-200'
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
          enabled ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get initial tab from URL or default to 'profile'
  const getInitialTab = (): TabId => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['profile', 'workspace', 'notifications', 'integrations', 'billing'].includes(tabParam)) {
      return tabParam as TabId;
    }
    return 'profile';
  };

  const [activeTab, setActiveTab] = useState<TabId>(getInitialTab);
  const { instagramConnection, setInstagramConnection } = useAuthStore();
  const { user } = useAuth();

  // Profile state
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Initialize profile from user data
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
    }
  }, [user]);

  // Workspace state
  const [brandName, setBrandName] = useState('');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [businessCategory, setBusinessCategory] = useState('');
  const [workspaceSaving, setWorkspaceSaving] = useState(false);
  const [workspaceSaved, setWorkspaceSaved] = useState(false);

  // Notifications state
  const [notifNewMessages, setNotifNewMessages] = useState(true);
  const [notifLeadUpdates, setNotifLeadUpdates] = useState(true);
  const [notifOrders, setNotifOrders] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);

  // Integrations state
  const [isConnectingInstagram, setIsConnectingInstagram] = useState(false);
  const [instagramStatus, setInstagramStatus] = useState<IntegrationStatusResponse | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [statusError, setStatusError] = useState(false);
  const [showFixWizard, setShowFixWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<'diagnose' | 'verify'>('diagnose');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [showHelpSection, setShowHelpSection] = useState(false);

  // Billing/Plan state
  const [workspace, setWorkspace] = useState<WorkspaceResponse | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);

  // Handle tab from URL param
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['profile', 'workspace', 'notifications', 'integrations', 'billing'].includes(tabParam)) {
      setActiveTab(tabParam as TabId);
    }
  }, [searchParams]);

  // Define fetchInstagramStatus first since handleOAuthSuccess depends on it
  const fetchInstagramStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    setStatusError(false);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/v1/integrations/instagram/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch status');
      }

      const data: IntegrationStatusResponse = await response.json();
      setInstagramStatus(data);

      if (data.status === 'CONNECTED_READY') {
        setInstagramConnection({
          isConnected: true,
          username: data.details?.instagramUsername || data.details?.businessName || 'your_business',
          lastSync: new Date(),
        });
      } else if (data.status === 'BLOCKED' || data.status === 'NOT_CONNECTED') {
        setInstagramConnection({ isConnected: false });
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch Instagram status:', error);
      setStatusError(true);
      return null;
    } finally {
      setIsLoadingStatus(false);
    }
  }, [setInstagramConnection]);

  const handleOAuthSuccess = useCallback(async () => {
    const data = await fetchInstagramStatus();

    if (data?.status === 'CONNECTED_READY') {
      toast.success('Instagram Connected', 'Your Instagram Business account has been successfully connected.');
    } else if (data?.status === 'BLOCKED' && data.reason) {
      toast.error('Connection Issue', getReasonMessage(data.reason));
    }

    setActiveTab('integrations');
    setIsConnectingInstagram(false);
  }, [fetchInstagramStatus]);

  // Handle OAuth callback
  useEffect(() => {
    const instagramConnected = searchParams.get('instagram_connected');
    const instagramError = searchParams.get('instagram_error');

    if (instagramConnected === 'true') {
      handleOAuthSuccess();
      router.replace('/settings?tab=integrations', { scroll: false });
    } else if (instagramError) {
      toast.error('Connection Failed', decodeURIComponent(instagramError));
      router.replace('/settings?tab=integrations', { scroll: false });
      setActiveTab('integrations');
      setIsConnectingInstagram(false);
    }
  }, [searchParams, router, handleOAuthSuccess]);

  // Fetch status on mount and when tab changes to integrations
  useEffect(() => {
    if (activeTab === 'integrations') {
      fetchInstagramStatus();
    }
  }, [activeTab, fetchInstagramStatus]);

  // Fetch workspace and plan data when billing tab is active
  useEffect(() => {
    const fetchWorkspaceData = async () => {
      if (activeTab !== 'billing' || workspace) return;

      setIsLoadingPlan(true);
      try {
        const workspaces = await getMyWorkspaces();
        if (workspaces.length > 0) {
          const ws = workspaces[0];
          setWorkspace(ws);

          // Check if current user is admin
          const members = await getWorkspaceMembers(ws.id);
          const currentMember = members.find(m => m.userEmail === user?.email);
          setIsAdmin(currentMember?.role === 'ADMIN');
        }
      } catch (error) {
        console.error('Failed to fetch workspace data:', error);
      } finally {
        setIsLoadingPlan(false);
      }
    };

    fetchWorkspaceData();
  }, [activeTab, workspace, user?.email]);

  const handleConnectInstagram = async () => {
    setIsConnectingInstagram(true);
    try {
      const token = localStorage.getItem('accessToken');

      // Step 1: Get connection token from backend
      const response = await fetch(`${API_URL}/api/v1/integrations/instagram/connect`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to initialize connection');
      }

      const data = await response.json();

      // Step 2: Redirect to OAuth start endpoint
      window.location.href = `${API_URL}${data.redirectUrl}`;
    } catch (error) {
      console.error('Failed to connect Instagram:', error);
      toast.error('Connection Failed', 'Failed to initialize Instagram connection.');
      setIsConnectingInstagram(false);
    }
  };

  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const handleDisconnectInstagram = async () => {
    setIsDisconnecting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/v1/integrations/instagram/disconnect`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect');
      }

      setInstagramConnection({ isConnected: false });
      setInstagramStatus(null);
      setShowDisconnectConfirm(false);
      toast.success('Disconnected', 'Instagram account has been disconnected. You can now connect a different account.');

      // Refresh status to show NOT_CONNECTED state
      await fetchInstagramStatus();
    } catch (error) {
      console.error('Failed to disconnect:', error);
      toast.error('Error', 'Failed to disconnect Instagram account.');
    } finally {
      setIsDisconnecting(false);
    }
  };

  // Wizard modal functions
  const openFixWizard = () => {
    setShowFixWizard(true);
    setWizardStep('diagnose');
    setVerifySuccess(false);
    setShowHelpSection(false);
  };

  const closeFixWizard = () => {
    setShowFixWizard(false);
    setWizardStep('diagnose');
    setVerifySuccess(false);
    setShowHelpSection(false);
    setIsVerifying(false);
  };

  const handleVerifyConnection = async () => {
    setIsVerifying(true);
    try {
      const data = await fetchInstagramStatus();
      if (data?.status === 'CONNECTED_READY') {
        setVerifySuccess(true);
        toast.success('Connected!', 'Your Instagram account is now connected.');
        // Auto-close after success
        setTimeout(() => {
          closeFixWizard();
        }, 2000);
      } else {
        toast.error('Not Ready Yet', 'Please complete the steps and try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleWizardPrimaryAction = (actionType: 'external' | 'reconnect' | 'wait', url?: string) => {
    if (actionType === 'external' && url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (actionType === 'reconnect') {
      closeFixWizard();
      // Use reconnectUrl from API response if available, otherwise use default connect flow
      const reconnectUrl = instagramStatus?.actions?.reconnectUrl;
      if (reconnectUrl) {
        window.location.href = reconnectUrl;
      } else {
        handleConnectInstagram();
      }
    }
    // 'wait' type does nothing - button is disabled
  };

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setProfileSaving(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleSaveWorkspace = async () => {
    setWorkspaceSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setWorkspaceSaving(false);
    setWorkspaceSaved(true);
    setTimeout(() => setWorkspaceSaved(false), 2000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#111' }}>Profile Information</div>
            <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Update your personal details</div>

            <div className="mt-6 flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#2F5D3E] flex items-center justify-center">
                <span style={{ fontSize: '24px', fontWeight: 600, color: 'white' }}>
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'}
                </span>
              </div>
              <div>
                <button className="px-4 py-2 bg-gray-100 rounded-xl" style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                  Change Photo
                </button>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>JPG, PNG. Max 2MB</div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '8px' }}>Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                  style={{ fontSize: '14px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '8px' }}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                    style={{ fontSize: '14px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '8px' }}>Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                    style={{ fontSize: '14px' }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={profileSaving}
                className="px-6 py-3 bg-[#2F5D3E] rounded-xl flex items-center gap-2 hover:bg-[#264a32] transition-colors disabled:opacity-50"
                style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}
              >
                {profileSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : profileSaved ? (
                  <Check className="w-4 h-4" />
                ) : null}
                {profileSaved ? 'Saved' : 'Save Changes'}
              </button>
              <button className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                Cancel
              </button>
            </div>
          </div>
        );

      case 'workspace':
        return (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#111' }}>Workspace Settings</div>
            <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Configure your workspace preferences</div>

            <div className="mt-6 space-y-4">
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '8px' }}>Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter your brand name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                  style={{ fontSize: '14px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '8px' }}>Timezone</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 appearance-none bg-white"
                    style={{ fontSize: '14px' }}
                  >
                    <option value="Asia/Kolkata">India (IST)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Asia/Dubai">Dubai (GST)</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '8px' }}>Business Category</label>
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 appearance-none bg-white"
                  style={{ fontSize: '14px' }}
                >
                  <option value="">Select a category</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="retail">Retail</option>
                  <option value="services">Services</option>
                  <option value="saas">SaaS</option>
                  <option value="agency">Agency</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleSaveWorkspace}
                disabled={workspaceSaving}
                className="px-6 py-3 bg-[#2F5D3E] rounded-xl flex items-center gap-2 hover:bg-[#264a32] transition-colors disabled:opacity-50"
                style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}
              >
                {workspaceSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : workspaceSaved ? (
                  <Check className="w-4 h-4" />
                ) : null}
                {workspaceSaved ? 'Saved' : 'Save Changes'}
              </button>
              <button className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                Cancel
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#111' }}>Notification Preferences</div>
            <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Manage how you receive notifications</div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>New Messages</div>
                  <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>Get notified when you receive new messages</div>
                </div>
                <Toggle enabled={notifNewMessages} onChange={setNotifNewMessages} />
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>Lead Updates</div>
                  <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>Notifications for lead status changes</div>
                </div>
                <Toggle enabled={notifLeadUpdates} onChange={setNotifLeadUpdates} />
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>Orders</div>
                  <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>Get notified about new orders and updates</div>
                </div>
                <Toggle enabled={notifOrders} onChange={setNotifOrders} />
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>Email Notifications</div>
                  <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>Receive daily summary via email</div>
                </div>
                <Toggle enabled={notifEmail} onChange={setNotifEmail} />
              </div>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#111' }}>Connected Platforms</div>
              <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Manage your social media integrations</div>
            </div>

            {/* Instagram Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              {/* Loading State */}
              {isLoadingStatus && (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Checking Instagram status...</span>
                </div>
              )}

              {/* Error State */}
              {statusError && !isLoadingStatus && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#111' }}>Instagram</div>
                      <div style={{ fontSize: '13px', color: '#EF4444', marginTop: '2px' }}>
                        Could not check Instagram status. Try again.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={fetchInstagramStatus}
                    className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Main Content - only show when not loading and no error */}
              {!isLoadingStatus && !statusError && (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                        <Instagram className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: '16px', fontWeight: 600, color: '#111' }}>Instagram</span>
                          {instagramStatus?.status === 'CONNECTED_READY' && (
                            <span className="px-2 py-0.5 bg-[#2F5D3E]/10 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2F5D3E]" />
                              <span style={{ fontSize: '11px', fontWeight: 500, color: '#2F5D3E' }}>Connected</span>
                            </span>
                          )}
                          {instagramStatus?.status === 'PENDING' && (
                            <span className="px-2 py-0.5 bg-amber-100 rounded-full flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                              <span style={{ fontSize: '11px', fontWeight: 500, color: '#D97706' }}>Connecting...</span>
                            </span>
                          )}
                          {instagramStatus?.status === 'BLOCKED' && (
                            <span className="px-2 py-0.5 bg-amber-100 rounded-full flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span style={{ fontSize: '11px', fontWeight: 500, color: '#D97706' }}>Action Required</span>
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                          {instagramStatus?.status === 'CONNECTED_READY' && instagramStatus.details?.instagramUsername
                            ? `@${instagramStatus.details.instagramUsername}`
                            : instagramStatus?.status === 'CONNECTED_READY' && instagramStatus.details?.businessName
                              ? instagramStatus.details.businessName
                              : instagramStatus?.status === 'NOT_CONNECTED'
                                ? 'Connect your Instagram Business account to receive DMs'
                                : instagramStatus?.status === 'BLOCKED' && instagramStatus.reason
                                  ? getReasonMessage(instagramStatus.reason)
                                  : instagramStatus?.status === 'PENDING'
                                    ? 'Setting up your connection...'
                                    : 'Connect your Instagram Business account to receive DMs'
                          }
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons based on status */}
                    <div className="flex items-center gap-2">
                      {/* NOT_CONNECTED: Show Connect button */}
                      {(!instagramStatus || instagramStatus.status === 'NOT_CONNECTED') && (
                        <button
                          onClick={handleConnectInstagram}
                          disabled={isConnectingInstagram}
                          className="px-4 py-2 bg-[#2F5D3E] rounded-xl hover:bg-[#264a32] transition-colors disabled:opacity-50 flex items-center gap-2"
                          style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}
                        >
                          {isConnectingInstagram && <Loader2 className="w-4 h-4 animate-spin" />}
                          Connect
                        </button>
                      )}

                      {/* CONNECTED_READY: Show Disconnect button */}
                      {instagramStatus?.status === 'CONNECTED_READY' && (
                        <button
                          onClick={() => setShowDisconnectConfirm(true)}
                          className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                          style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}
                        >
                          Disconnect
                        </button>
                      )}

                      {/* PENDING: Show disabled loading button */}
                      {instagramStatus?.status === 'PENDING' && (
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-100 rounded-xl flex items-center gap-2 cursor-not-allowed"
                          style={{ fontSize: '14px', fontWeight: 500, color: '#9CA3AF' }}
                        >
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Please wait...
                        </button>
                      )}

                      {/* BLOCKED with ADMIN_COOLDOWN: Show disabled button with retry time */}
                      {instagramStatus?.status === 'BLOCKED' && instagramStatus.reason === 'ADMIN_COOLDOWN' && (
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-100 rounded-xl flex items-center gap-2 cursor-not-allowed"
                          style={{ fontSize: '14px', fontWeight: 500, color: '#9CA3AF' }}
                        >
                          <Clock className="w-4 h-4" />
                          Wait Required
                        </button>
                      )}

                      {/* BLOCKED: Show buttons based on reason */}
                      {instagramStatus?.status === 'BLOCKED' && instagramStatus.reason !== 'ADMIN_COOLDOWN' && (
                        <div className="flex items-center gap-2">
                          {/* Reconnect button for OAuth-retry-eligible reasons */}
                          {['TOKEN_EXPIRED', 'MISSING_PERMISSIONS', 'API_ERROR', 'OWNERSHIP_MISMATCH'].includes(instagramStatus.reason || '') && (
                            <button
                              onClick={handleConnectInstagram}
                              disabled={isConnectingInstagram}
                              className="px-4 py-2 bg-[#2F5D3E] rounded-xl hover:bg-[#264a32] transition-colors flex items-center gap-2 disabled:opacity-50"
                              style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}
                            >
                              {isConnectingInstagram ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Connecting...
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="w-4 h-4" />
                                  Reconnect
                                </>
                              )}
                            </button>
                          )}
                          {/* Fix Connection button (wizard) for setup issues */}
                          {['NO_PAGES_FOUND', 'IG_NOT_LINKED_TO_PAGE', 'IG_NOT_BUSINESS'].includes(instagramStatus.reason || '') && (
                            <button
                              onClick={openFixWizard}
                              className="px-4 py-2 bg-[#2F5D3E] rounded-xl hover:bg-[#264a32] transition-colors flex items-center gap-2"
                              style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}
                            >
                              Fix Connection
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ADMIN_COOLDOWN: Show retry date */}
                  {instagramStatus?.status === 'BLOCKED' && instagramStatus.reason === 'ADMIN_COOLDOWN' && instagramStatus.retryAt && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-amber-600">
                        <Clock className="w-4 h-4" />
                        <span style={{ fontSize: '13px' }}>
                          You can reconnect on {formatRetryDate(instagramStatus.retryAt)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* API Error Details - Show when available for debugging */}
                  {instagramStatus?.status === 'BLOCKED' && instagramStatus.apiError && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <details className="text-xs">
                        <summary className="cursor-pointer text-gray-400 hover:text-gray-600">
                          Technical details
                        </summary>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg font-mono text-gray-600 space-y-1">
                          {instagramStatus.apiError.code && (
                            <div>Error code: {instagramStatus.apiError.code}{instagramStatus.apiError.subcode ? ` (subcode: ${instagramStatus.apiError.subcode})` : ''}</div>
                          )}
                          {instagramStatus.apiError.type && (
                            <div>Type: {instagramStatus.apiError.type}</div>
                          )}
                          {instagramStatus.apiError.message && (
                            <div className="break-words">Message: {instagramStatus.apiError.message}</div>
                          )}
                          {instagramStatus.apiError.fbtraceId && (
                            <div>Trace ID: {instagramStatus.apiError.fbtraceId}</div>
                          )}
                        </div>
                      </details>
                    </div>
                  )}

                  {/* CONNECTED_READY: Show connection date */}
                  {instagramStatus?.status === 'CONNECTED_READY' && instagramConnection.lastSync && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                        Connected on {new Date(instagramConnection.lastSync).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Fix Instagram Connection Wizard Modal */}
            {showFixWizard && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-xl">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                        <Instagram className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111' }}>Fix Instagram Connection</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full text-xs font-medium',
                              wizardStep === 'diagnose' ? 'bg-[#2F5D3E] text-white' : 'bg-gray-100 text-gray-500'
                            )}
                          >
                            1. Diagnose
                          </span>
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full text-xs font-medium',
                              wizardStep === 'verify' ? 'bg-[#2F5D3E] text-white' : 'bg-gray-100 text-gray-500'
                            )}
                          >
                            2. Verify
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={closeFixWizard}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Step Content */}
                  {wizardStep === 'diagnose' && (() => {
                    const content = getDiagnoseContent(instagramStatus?.reason, instagramStatus?.retryAt, instagramStatus?.actions);
                    return (
                      <div>
                        {/* Issue Title */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#111' }}>{content.title}</h4>
                          </div>
                          <p style={{ fontSize: '14px', color: '#6B7280' }}>{content.description}</p>
                        </div>

                        {/* Checklist */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <div style={{ fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '12px' }}>
                            Checklist
                          </div>
                          <div className="space-y-3">
                            {content.checklist.map((item, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <div className={cn(
                                  'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                                  item.checked ? 'bg-[#2F5D3E]' : 'bg-white border-2 border-gray-300'
                                )}>
                                  {item.checked && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span style={{ fontSize: '14px', color: item.checked ? '#6B7280' : '#111' }}>
                                  {item.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Primary Action - Single CTA per reason */}
                        <div className="mb-4">
                          {content.primaryAction.type === 'external' && (
                            <button
                              onClick={() => handleWizardPrimaryAction('external', content.primaryAction.url)}
                              className="w-full px-4 py-3 bg-[#2F5D3E] rounded-xl hover:bg-[#264a32] transition-colors flex items-center justify-center gap-2"
                              style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}
                            >
                              {content.primaryAction.label}
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                          {content.primaryAction.type === 'reconnect' && (
                            <button
                              onClick={() => handleWizardPrimaryAction('reconnect')}
                              disabled={isConnectingInstagram}
                              className="w-full px-4 py-3 bg-[#2F5D3E] rounded-xl hover:bg-[#264a32] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                              style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}
                            >
                              {isConnectingInstagram ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <RefreshCw className="w-4 h-4" />
                              )}
                              {content.primaryAction.label}
                            </button>
                          )}
                          {content.primaryAction.type === 'wait' && (
                            <button
                              disabled
                              className="w-full px-4 py-3 bg-gray-100 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                              style={{ fontSize: '14px', fontWeight: 500, color: '#9CA3AF' }}
                            >
                              <Clock className="w-4 h-4" />
                              {content.primaryAction.label}
                            </button>
                          )}
                        </div>

                        {/* Secondary action to verify */}
                        <div className="flex gap-3 mb-4">
                          <button
                            onClick={() => setWizardStep('verify')}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                            style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}
                          >
                            I completed the steps
                          </button>
                        </div>

                        {/* Need Help Section */}
                        <div className="border-t border-gray-100 pt-4">
                          <button
                            onClick={() => setShowHelpSection(!showHelpSection)}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                            style={{ fontSize: '13px' }}
                          >
                            <HelpCircle className="w-4 h-4" />
                            Need help?
                            {showHelpSection ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                          {showHelpSection && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p style={{ fontSize: '13px', color: '#1E40AF' }}>
                                {content.helpText}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {wizardStep === 'verify' && (
                    <div>
                      {verifySuccess ? (
                        /* Success State */
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-[#2F5D3E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-[#2F5D3E]" />
                          </div>
                          <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#111', marginBottom: '8px' }}>
                            Connected Successfully!
                          </h4>
                          <p style={{ fontSize: '14px', color: '#6B7280' }}>
                            Your Instagram account is now ready to use.
                          </p>
                        </div>
                      ) : (
                        /* Verify Step */
                        <div>
                          <div className="text-center py-6">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <RefreshCw className="w-8 h-8 text-gray-400" />
                            </div>
                            <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#111', marginBottom: '8px' }}>
                              Ready to verify?
                            </h4>
                            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>
                              After completing the steps above, click below to check your connection.
                            </p>
                            <button
                              onClick={handleVerifyConnection}
                              disabled={isVerifying}
                              className="px-6 py-3 bg-[#2F5D3E] rounded-xl hover:bg-[#264a32] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                              style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}
                            >
                              {isVerifying ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Checking...
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="w-4 h-4" />
                                  Re-check Connection
                                </>
                              )}
                            </button>
                          </div>

                          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                            <button
                              onClick={() => setWizardStep('diagnose')}
                              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                              style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}
                            >
                              Back
                            </button>
                            <button
                              onClick={closeFixWizard}
                              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                              style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Disconnect Confirmation Modal */}
            {showDisconnectConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111' }}>Disconnect Instagram?</h3>
                  </div>

                  <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>
                    This will disconnect your Instagram account from Inboop. You can reconnect with the same or a different account afterward.
                  </p>

                  {instagramStatus?.details?.instagramUsername && (
                    <div className="p-3 bg-gray-50 rounded-xl mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                        <Instagram className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>
                          @{instagramStatus.details.instagramUsername}
                        </div>
                        {instagramStatus.details.businessName && (
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>
                            {instagramStatus.details.businessName}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDisconnectConfirm(false)}
                      disabled={isDisconnecting}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                      style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDisconnectInstagram}
                      disabled={isDisconnecting}
                      className="flex-1 px-4 py-3 bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}
                    >
                      {isDisconnecting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Disconnecting...
                        </>
                      ) : (
                        'Disconnect'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '16px', fontWeight: 600, color: '#111' }}>WhatsApp</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                      Connect WhatsApp Business to manage conversations
                    </div>
                  </div>
                </div>
                <button
                  disabled
                  className="px-4 py-2 bg-gray-100 rounded-xl cursor-not-allowed"
                  style={{ fontSize: '14px', fontWeight: 500, color: '#9CA3AF' }}
                >
                  Coming Soon
                </button>
              </div>
            </div>

            {/* Facebook Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1877F2] flex items-center justify-center">
                    <Facebook className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '16px', fontWeight: 600, color: '#111' }}>Facebook</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                      Connect your Facebook Page to manage Messenger
                    </div>
                  </div>
                </div>
                <button
                  disabled
                  className="px-4 py-2 bg-gray-100 rounded-xl cursor-not-allowed"
                  style={{ fontSize: '14px', fontWeight: 500, color: '#9CA3AF' }}
                >
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        );

      case 'billing':
        const currentPlan = workspace?.plan || 'PRO';
        const currentPlanInfo = planInfo[currentPlan];

        return (
          <div className="space-y-4">
            {/* Loading State */}
            {isLoadingPlan && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Loading plan information...</span>
                </div>
              </div>
            )}

            {/* Current Plan Card */}
            {!isLoadingPlan && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: '18px', fontWeight: 600, color: '#111' }}>{currentPlanInfo.name} Plan</span>
                      <span className="px-2.5 py-1 bg-[#2F5D3E]/10 rounded-lg" style={{ fontSize: '12px', fontWeight: 500, color: '#2F5D3E' }}>Active</span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
                      {currentPlanInfo.description}
                    </div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ fontSize: '13px', color: '#6B7280' }}>Team members</div>
                      <div style={{ fontSize: '20px', fontWeight: 600, color: '#111', marginTop: '2px' }}>
                        {workspace?.memberCount || 1} / {workspace?.maxUsers || 5}
                      </div>
                    </div>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2F5D3E] rounded-full transition-all"
                        style={{ width: `${((workspace?.memberCount || 1) / (workspace?.maxUsers || 5)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Plan Features */}
                <div className="mt-6 space-y-3">
                  {currentPlanInfo.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#2F5D3E]" />
                      <span style={{ fontSize: '14px', color: '#374151' }}>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Admin-only CTA for non-Enterprise plans */}
                {isAdmin && currentPlan !== 'ENTERPRISE' && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>Need more features?</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                          Enterprise plans include unlimited users and priority support.
                        </div>
                      </div>
                      <a
                        href="mailto:sales@inboop.com?subject=Enterprise%20Plan%20Inquiry"
                        className="px-5 py-2.5 bg-[#2F5D3E] rounded-xl hover:bg-[#264a32] transition-colors flex items-center gap-2"
                        style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}
                      >
                        <Mail className="w-4 h-4" />
                        Contact Sales
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Billing managed info - placeholder for future Stripe integration */}
            {!isLoadingPlan && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#111' }}>Billing</div>
                <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px' }}>
                  Billing is managed separately. Contact our team for any billing inquiries.
                </div>
                <div className="mt-4">
                  <a
                    href="mailto:support@inboop.com?subject=Billing%20Inquiry"
                    className="text-[#2F5D3E] hover:underline"
                    style={{ fontSize: '14px', fontWeight: 500 }}
                  >
                    support@inboop.com
                  </a>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-auto bg-[#F8F9FA]">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111' }}>Settings</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Manage your account and preferences</p>
        </div>

        {/* Main Layout */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                    activeTab === tab.id
                      ? 'bg-[#2F5D3E]/5 text-[#2F5D3E]'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                  style={{ fontSize: '14px', fontWeight: activeTab === tab.id ? 500 : 400 }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 max-w-[1024px]">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
