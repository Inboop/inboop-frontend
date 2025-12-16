'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Mail, Shield, Eye, Edit3, Users } from 'lucide-react';
import { toast } from '@/stores/useToastStore';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminUser } from '@/lib/isAdmin';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  initials: string;
  joinedAt: Date;
}

const roleIcons = {
  Admin: Shield,
  Editor: Edit3,
  Viewer: Eye,
};

const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Admin', initials: 'SW', joinedAt: new Date('2024-10-15') },
  { id: '2', name: 'Mike Chen', email: 'mike@example.com', role: 'Editor', initials: 'MC', joinedAt: new Date('2024-11-02') },
  { id: '3', name: 'Emma Davis', email: 'emma@example.com', role: 'Viewer', initials: 'ED', joinedAt: new Date('2024-12-01') },
];

export default function TeamPage() {
  const { user } = useAuth();
  const isAdmin = isAdminUser(user?.email);
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Viewer');
  const [showInviteForm, setShowInviteForm] = useState(false);

  // Fetch team members on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setTeamMembers(isAdmin ? mockTeamMembers : []);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [isAdmin]);

  const handleInviteMember = () => {
    if (!inviteEmail) return;
    toast.success('Invitation Sent', `Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setShowInviteForm(false);
  };

  const handleRemoveMember = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the team?`)) {
      setTeamMembers(teamMembers.filter(m => m.id !== id));
      toast.success('Member Removed', `${name} has been removed from the team.`);
    }
  };

  const handleRoleChange = (id: string, newRole: 'Admin' | 'Editor' | 'Viewer') => {
    setTeamMembers(teamMembers.map(m =>
      m.id === id ? { ...m, role: newRole } : m
    ));
    toast.success('Role Updated', 'Team member role has been updated.');
  };

  return (
    <div className="h-full overflow-auto bg-[#F8F9FA]">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111' }}>Team</h1>
            <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
              Manage your team members and their permissions
            </p>
          </div>
          <button
            onClick={() => setShowInviteForm(true)}
            className="px-4 py-2.5 bg-[#2F5D3E] rounded-xl hover:bg-[#264a32] transition-colors flex items-center gap-2"
            style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}
          >
            <Plus className="w-4 h-4" />
            Invite Member
          </button>
        </div>

        {/* Invite Form */}
        {showInviteForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#111', marginBottom: '16px' }}>
              Invite a new team member
            </div>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                  style={{ fontSize: '14px' }}
                />
              </div>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'Admin' | 'Editor' | 'Viewer')}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 appearance-none bg-white"
                style={{ fontSize: '14px', minWidth: '120px' }}
              >
                <option value="Viewer">Viewer</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </select>
              <button
                onClick={handleInviteMember}
                disabled={!inviteEmail}
                className="px-6 py-3 bg-[#2F5D3E] rounded-xl hover:bg-[#264a32] transition-colors disabled:opacity-50"
                style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}
              >
                Send Invite
              </button>
              <button
                onClick={() => setShowInviteForm(false)}
                className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Team Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#111' }}>{teamMembers.length}</div>
                <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Total Members</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#111' }}>
                  {teamMembers.filter(m => m.role === 'Admin').length}
                </div>
                <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Admins</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#111' }}>5</div>
                <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Seats Available</div>
              </div>
            </>
          )}
        </div>

        {/* Team Members List */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#111' }}>Team Members</div>
          </div>
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="w-32 h-4 mb-2" />
                    <Skeleton className="w-48 h-3" />
                  </div>
                  <Skeleton className="w-20 h-8 rounded-lg" />
                </div>
              ))}
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="py-16 text-center px-4">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#2F5D3E]/10 to-[#2F5D3E]/5 flex items-center justify-center">
                <Users className="w-10 h-10 text-[#2F5D3E]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members yet</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                Invite team members to collaborate on managing your inbox, leads, and orders.
              </p>
              <button
                onClick={() => setShowInviteForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-150 ease-out shadow-md hover:shadow-lg hover:brightness-110"
                style={{
                  background: 'linear-gradient(180deg, #2F5D3E 0%, #285239 100%)',
                }}
              >
                <Plus className="w-4 h-4" />
                Invite Member
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {teamMembers.map((member) => {
                const RoleIcon = roleIcons[member.role];
                return (
                  <div key={member.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#2F5D3E] flex items-center justify-center">
                        <span style={{ fontSize: '16px', fontWeight: 500, color: 'white' }}>{member.initials}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 500, color: '#111' }}>{member.name}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280' }}>{member.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                        Joined {member.joinedAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </div>
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value as 'Admin' | 'Editor' | 'Viewer')}
                        className={cn(
                          'px-3 py-1.5 rounded-lg border-0 appearance-none cursor-pointer',
                          member.role === 'Admin' ? 'bg-[#2F5D3E]/10 text-[#2F5D3E]' : 'bg-gray-100 text-gray-600'
                        )}
                        style={{ fontSize: '13px', fontWeight: 500 }}
                      >
                        <option value="Viewer">Viewer</option>
                        <option value="Editor">Editor</option>
                        <option value="Admin">Admin</option>
                      </select>
                      <button
                        onClick={() => handleRemoveMember(member.id, member.name)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Roles Info */}
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#111', marginBottom: '16px' }}>Role Permissions</div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-[#2F5D3E]" />
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>Admin</span>
              </div>
              <p style={{ fontSize: '13px', color: '#6B7280' }}>
                Full access to all features, settings, and team management
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Edit3 className="w-4 h-4 text-gray-600" />
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>Editor</span>
              </div>
              <p style={{ fontSize: '13px', color: '#6B7280' }}>
                Can manage conversations, leads, and orders
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-gray-600" />
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>Viewer</span>
              </div>
              <p style={{ fontSize: '13px', color: '#6B7280' }}>
                View-only access to conversations and analytics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
