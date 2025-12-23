'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Mail, Shield, Eye, Edit3, Users, AlertCircle, ArrowUpRight } from 'lucide-react';
import { toast } from '@/stores/useToastStore';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';
import {
  getMyWorkspaces,
  getWorkspaceMembers,
  inviteUser,
  updateMemberRole,
  removeMember,
  canInvite,
  getErrorMessage,
  WorkspaceApiError,
  WorkspaceErrorCodes,
  type WorkspaceResponse,
  type WorkspaceMemberResponse,
  type WorkspaceRole,
  type CanInviteResponse,
} from '@/lib/workspaceApi';

// Map backend roles to display labels
const roleLabels: Record<WorkspaceRole, string> = {
  ADMIN: 'Admin',
  MEMBER: 'Member',
};

const roleIcons = {
  ADMIN: Shield,
  MEMBER: Edit3,
};

export default function TeamPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [workspace, setWorkspace] = useState<WorkspaceResponse | null>(null);
  const [members, setMembers] = useState<WorkspaceMemberResponse[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>('MEMBER');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [canInviteInfo, setCanInviteInfo] = useState<CanInviteResponse | null>(null);

  // Fetch workspace and members
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const workspaces = await getMyWorkspaces();

      if (workspaces.length > 0) {
        const ws = workspaces[0]; // Use first workspace for now
        setWorkspace(ws);

        const [membersData, canInviteData] = await Promise.all([
          getWorkspaceMembers(ws.id),
          canInvite(ws.id),
        ]);

        setMembers(membersData);
        setCanInviteInfo(canInviteData);
      }
    } catch (error) {
      console.error('Failed to fetch workspace data:', error);
      toast.error('Failed to Load', 'Could not load team data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInviteMember = async () => {
    if (!inviteEmail || !workspace) return;

    setIsInviting(true);
    try {
      await inviteUser(workspace.id, {
        email: inviteEmail,
        role: inviteRole,
      });

      toast.success('Invitation Sent', `${inviteEmail} has been added to the team.`);
      setInviteEmail('');
      setShowInviteForm(false);

      // Refresh data
      await fetchData();
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo.showUpgrade) {
        toast.warning(errorInfo.title, errorInfo.description);
      } else {
        toast.error(errorInfo.title, errorInfo.description);
      }
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (member: WorkspaceMemberResponse) => {
    if (!workspace) return;

    if (!confirm(`Are you sure you want to remove ${member.userName} from the team?`)) {
      return;
    }

    try {
      await removeMember(workspace.id, member.id);
      toast.success('Member Removed', `${member.userName} has been removed from the team.`);
      await fetchData();
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      toast.error(errorInfo.title, errorInfo.description);
    }
  };

  const handleRoleChange = async (member: WorkspaceMemberResponse, newRole: WorkspaceRole) => {
    if (!workspace || member.role === newRole) return;

    try {
      await updateMemberRole(workspace.id, member.id, { role: newRole });
      toast.success('Role Updated', `${member.userName} is now ${roleLabels[newRole]}.`);
      await fetchData();
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      toast.error(errorInfo.title, errorInfo.description);
    }
  };

  // Check if current user is admin
  const currentUserMember = members.find((m) => m.userEmail === user?.email);
  const isCurrentUserAdmin = currentUserMember?.role === 'ADMIN';

  // Calculate seats info
  const totalSeats = workspace?.maxUsers ?? 5;
  const usedSeats = members.length;
  const availableSeats = totalSeats - usedSeats;

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

          {/* Invite Button - Show different states based on permissions */}
          {isLoading ? (
            <Skeleton className="w-36 h-10 rounded-xl" />
          ) : !isCurrentUserAdmin ? (
            <button
              disabled
              className="px-4 py-2.5 bg-gray-200 rounded-xl flex items-center gap-2 cursor-not-allowed"
              style={{ fontSize: '14px', fontWeight: 500, color: '#9CA3AF' }}
              title="Only admins can invite members"
            >
              <Plus className="w-4 h-4" />
              Invite Member
            </button>
          ) : canInviteInfo && !canInviteInfo.hasCapacity ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-amber-600">Team limit reached</span>
              <button
                className="px-4 py-2.5 bg-amber-500 rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2"
                style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}
              >
                <ArrowUpRight className="w-4 h-4" />
                Upgrade Plan
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowInviteForm(true)}
              className="px-4 py-2.5 bg-[#2F5D3E] rounded-xl hover:bg-[#264a32] transition-colors flex items-center gap-2"
              style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}
            >
              <Plus className="w-4 h-4" />
              Invite Member
            </button>
          )}
        </div>

        {/* Plan Limit Banner - Show when at capacity */}
        {!isLoading && canInviteInfo && !canInviteInfo.hasCapacity && isCurrentUserAdmin && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#92400E' }}>
                Team limit reached
              </div>
              <p style={{ fontSize: '13px', color: '#B45309', marginTop: '4px' }}>
                Your Pro plan supports up to {totalSeats} team members. Upgrade to add more users and unlock additional features.
              </p>
            </div>
            <button
              className="px-4 py-2 bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-1.5"
              style={{ fontSize: '13px', fontWeight: 500, color: 'white' }}
            >
              <ArrowUpRight className="w-4 h-4" />
              Upgrade
            </button>
          </div>
        )}

        {/* Non-admin info banner */}
        {!isLoading && !isCurrentUserAdmin && members.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E40AF' }}>
                Member View
              </div>
              <p style={{ fontSize: '13px', color: '#3B82F6', marginTop: '4px' }}>
                Only admins can invite or remove team members. Contact an admin if you need to make changes.
              </p>
            </div>
          </div>
        )}

        {/* Invite Form */}
        {showInviteForm && isCurrentUserAdmin && (
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
                  disabled={isInviting}
                />
              </div>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as WorkspaceRole)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 appearance-none bg-white"
                style={{ fontSize: '14px', minWidth: '120px' }}
                disabled={isInviting}
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button
                onClick={handleInviteMember}
                disabled={!inviteEmail || isInviting}
                className="px-6 py-3 bg-[#2F5D3E] rounded-xl hover:bg-[#264a32] transition-colors disabled:opacity-50"
                style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}
              >
                {isInviting ? 'Sending...' : 'Send Invite'}
              </button>
              <button
                onClick={() => setShowInviteForm(false)}
                disabled={isInviting}
                className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}
              >
                Cancel
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              The user must have an Inboop account. If they don&apos;t, ask them to sign up first.
            </p>
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
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#111' }}>{usedSeats}</div>
                <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Total Members</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#111' }}>
                  {members.filter((m) => m.role === 'ADMIN').length}
                </div>
                <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Admins</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    color: availableSeats === 0 ? '#F59E0B' : '#111',
                  }}
                >
                  {availableSeats}
                </div>
                <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
                  Seats Available
                  <span className="text-xs text-gray-400 ml-1">({usedSeats}/{totalSeats})</span>
                </div>
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
          ) : members.length === 0 ? (
            <div className="py-16 text-center px-4">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#2F5D3E]/10 to-[#2F5D3E]/5 flex items-center justify-center">
                <Users className="w-10 h-10 text-[#2F5D3E]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members yet</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                Invite team members to collaborate on managing your inbox, leads, and orders.
              </p>
              {isCurrentUserAdmin && (
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
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {members.map((member) => {
                const RoleIcon = roleIcons[member.role];
                const isCurrentUser = member.userEmail === user?.email;
                const initials = member.userName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <div
                    key={member.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#2F5D3E] flex items-center justify-center">
                        <span style={{ fontSize: '16px', fontWeight: 500, color: 'white' }}>
                          {initials}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: '15px', fontWeight: 500, color: '#111' }}>
                            {member.userName}
                          </span>
                          {isCurrentUser && (
                            <span className="text-xs text-gray-400">(You)</span>
                          )}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6B7280' }}>{member.userEmail}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {member.joinedAt && (
                        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                          Joined{' '}
                          {new Date(member.joinedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      )}

                      {/* Role dropdown - only for admins and not for self */}
                      {isCurrentUserAdmin && !isCurrentUser ? (
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member, e.target.value as WorkspaceRole)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg border-0 appearance-none cursor-pointer',
                            member.role === 'ADMIN'
                              ? 'bg-[#2F5D3E]/10 text-[#2F5D3E]'
                              : 'bg-gray-100 text-gray-600'
                          )}
                          style={{ fontSize: '13px', fontWeight: 500 }}
                        >
                          <option value="MEMBER">Member</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      ) : (
                        <div
                          className={cn(
                            'px-3 py-1.5 rounded-lg flex items-center gap-1.5',
                            member.role === 'ADMIN'
                              ? 'bg-[#2F5D3E]/10 text-[#2F5D3E]'
                              : 'bg-gray-100 text-gray-600'
                          )}
                          style={{ fontSize: '13px', fontWeight: 500 }}
                        >
                          <RoleIcon className="w-3.5 h-3.5" />
                          {roleLabels[member.role]}
                        </div>
                      )}

                      {/* Remove button - only for admins and not for self */}
                      {isCurrentUserAdmin && !isCurrentUser ? (
                        <button
                          onClick={() => handleRemoveMember(member)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Remove member"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                      ) : (
                        <div className="w-8" /> // Spacer for alignment
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Roles Info */}
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#111', marginBottom: '16px' }}>
            Role Permissions
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-[#2F5D3E]" />
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>Admin</span>
              </div>
              <p style={{ fontSize: '13px', color: '#6B7280' }}>
                Full access to all features, settings, and team management. Can invite and remove
                members.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Edit3 className="w-4 h-4 text-gray-600" />
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#111' }}>Member</span>
              </div>
              <p style={{ fontSize: '13px', color: '#6B7280' }}>
                Can manage conversations, leads, and orders. Cannot modify team settings.
              </p>
            </div>
          </div>
        </div>

        {/* Plan Info */}
        {workspace && (
          <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#111' }}>
                  {workspace.plan} Plan
                </div>
                <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
                  {usedSeats} of {totalSeats} seats used
                </p>
              </div>
              <button
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}
              >
                <ArrowUpRight className="w-4 h-4" />
                Manage Plan
              </button>
            </div>
            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    usedSeats >= totalSeats ? 'bg-amber-500' : 'bg-[#2F5D3E]'
                  )}
                  style={{ width: `${Math.min((usedSeats / totalSeats) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
