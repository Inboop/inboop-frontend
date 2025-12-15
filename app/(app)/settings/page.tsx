'use client';

import { useState, useEffect } from 'react';
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
  Loader2
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from '@/stores/useToastStore';
import { cn } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type TabId = 'profile' | 'workspace' | 'notifications' | 'integrations' | 'billing';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  { id: 'workspace', label: 'Workspace', icon: <Building2 className="w-5 h-5" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
  { id: 'integrations', label: 'Integrations', icon: <Puzzle className="w-5 h-5" /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard className="w-5 h-5" /> },
];

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
  const [activeTab, setActiveTab] = useState<TabId>('integrations');
  const { instagramConnection, setInstagramConnection } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Profile state
  const [profileName, setProfileName] = useState('John Doe');
  const [profileEmail, setProfileEmail] = useState('john@example.com');
  const [profilePhone, setProfilePhone] = useState('+1 234 567 8900');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

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
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState('+1 555 123 4567');
  const [facebookConnected, setFacebookConnected] = useState(false);
  const [facebookPage, setFacebookPage] = useState('Inboop Official');

  // Handle OAuth callback
  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const token = searchParams.get('token');

    if (success === 'true' && token) {
      handleOAuthSuccess(token);
      router.replace('/settings', { scroll: false });
    } else if (error) {
      toast.error('Connection Failed', decodeURIComponent(error));
      router.replace('/settings', { scroll: false });
      setActiveTab('integrations');
    }
  }, [searchParams, router]);

  const handleOAuthSuccess = async (accessToken: string) => {
    setInstagramConnection({
      isConnected: true,
      username: 'your_business',
      lastSync: new Date(),
    });
    toast.success('Instagram Connected', 'Your Instagram Business account has been successfully connected.');
    setActiveTab('integrations');
    setIsConnectingInstagram(false);
  };

  const handleConnectInstagram = () => {
    setIsConnectingInstagram(true);
    const redirectPath = encodeURIComponent('/settings');
    window.location.href = `${API_URL}/api/v1/instagram/oauth/authorize?redirect=${redirectPath}`;
  };

  const handleDisconnectInstagram = () => {
    setInstagramConnection({ isConnected: false });
    toast.success('Disconnected', 'Instagram account has been disconnected.');
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
                <span style={{ fontSize: '24px', fontWeight: 600, color: 'white' }}>JD</span>
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
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '16px', fontWeight: 600, color: '#111' }}>Instagram</span>
                      {instagramConnection.isConnected && (
                        <span className="w-2 h-2 rounded-full bg-[#2F5D3E]" />
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                      {instagramConnection.isConnected
                        ? `Connected as @${instagramConnection.username}`
                        : 'Connect your Instagram Business account to receive DMs'
                      }
                    </div>
                  </div>
                </div>
                {instagramConnection.isConnected ? (
                  <button
                    onClick={handleDisconnectInstagram}
                    className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}
                  >
                    Disconnect
                  </button>
                ) : (
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
              </div>
              {instagramConnection.isConnected && instagramConnection.lastSync && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                    Connected on {new Date(instagramConnection.lastSync).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

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
                      {whatsappConnected && (
                        <span className="w-2 h-2 rounded-full bg-[#2F5D3E]" />
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                      {whatsappConnected
                        ? whatsappPhone
                        : 'Connect WhatsApp Business to manage conversations'
                      }
                    </div>
                  </div>
                </div>
                {whatsappConnected ? (
                  <button
                    onClick={() => setWhatsappConnected(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => setWhatsappConnected(true)}
                    className="px-4 py-2 bg-[#2F5D3E] rounded-xl hover:bg-[#264a32] transition-colors"
                    style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}
                  >
                    Connect
                  </button>
                )}
              </div>
              {whatsappConnected && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                    Connected on Dec 10, 2024
                  </div>
                </div>
              )}
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
                      {facebookConnected && (
                        <span className="w-2 h-2 rounded-full bg-[#2F5D3E]" />
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                      {facebookConnected
                        ? facebookPage
                        : 'Connect your Facebook Page to manage Messenger'
                      }
                    </div>
                  </div>
                </div>
                {facebookConnected ? (
                  <button
                    onClick={() => setFacebookConnected(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => setFacebookConnected(true)}
                    className="px-4 py-2 bg-[#2F5D3E] rounded-xl hover:bg-[#264a32] transition-colors"
                    style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}
                  >
                    Connect
                  </button>
                )}
              </div>
              {facebookConnected && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                    Connected on Dec 8, 2024
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-4">
            {/* Current Plan */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: '18px', fontWeight: 600, color: '#111' }}>Professional Plan</span>
                    <span className="px-2.5 py-1 bg-[#2F5D3E]/10 rounded-lg" style={{ fontSize: '12px', fontWeight: 500, color: '#2F5D3E' }}>Active</span>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#111', marginTop: '8px' }}>
                    $7.99<span style={{ fontSize: '14px', fontWeight: 400, color: '#6B7280' }}>/month</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#2F5D3E]" />
                  <span style={{ fontSize: '14px', color: '#374151' }}>Unlimited conversations</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#2F5D3E]" />
                  <span style={{ fontSize: '14px', color: '#374151' }}>Up to 5 team members</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#2F5D3E]" />
                  <span style={{ fontSize: '14px', color: '#374151' }}>Advanced analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#2F5D3E]" />
                  <span style={{ fontSize: '14px', color: '#374151' }}>Priority support</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button className="px-6 py-3 bg-[#2F5D3E] rounded-xl hover:bg-[#264a32] transition-colors" style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}>
                  Change Plan
                </button>
                <button className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                  Cancel Subscription
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#111' }}>Payment Method</div>
              <div className="mt-4 flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gray-900 rounded-md flex items-center justify-center">
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'white', letterSpacing: '1px' }}>VISA</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>•••• •••• •••• 4242</div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>Expires 12/26</div>
                  </div>
                </div>
                <button className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                  Update
                </button>
              </div>
            </div>
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
