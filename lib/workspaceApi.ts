/**
 * Workspace API client for communicating with the backend.
 * Handles workspace management, team members, and plan constraints.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Types matching backend DTOs

export type WorkspaceRole = 'ADMIN' | 'MEMBER';
export type PlanType = 'PRO' | 'ENTERPRISE';

export interface WorkspaceResponse {
  id: number;
  name: string;
  plan: PlanType;
  maxUsers: number;
  memberCount: number;
  ownerId: number;
  ownerName: string;
  createdAt: string;
}

export interface WorkspaceMemberResponse {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  role: WorkspaceRole;
  invitedById: number | null;
  invitedByName: string | null;
  invitedAt: string | null;
  joinedAt: string | null;
}

export interface InviteUserRequest {
  email: string;
  role?: WorkspaceRole;
}

export interface UpdateMemberRoleRequest {
  role: WorkspaceRole;
}

export interface CanInviteResponse {
  canInvite: boolean;
  isAdmin: boolean;
  hasCapacity: boolean;
  reason?: string;
}

// Error response from backend
export interface WorkspaceErrorResponse {
  code: string;
  message: string;
}

// Custom error class for workspace-specific errors
export class WorkspaceApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = 'WorkspaceApiError';
    this.code = code;
    this.status = status;
  }

  // Check if this is a specific error type
  isPlanLimitReached(): boolean {
    return this.code === 'PLAN_USER_LIMIT_REACHED';
  }

  isAdminRequired(): boolean {
    return this.code === 'ADMIN_REQUIRED';
  }

  isMustHaveAdmin(): boolean {
    return this.code === 'MUST_HAVE_ADMIN';
  }

  isUserAlreadyMember(): boolean {
    return this.code === 'USER_ALREADY_MEMBER';
  }

  isUserNotFound(): boolean {
    return this.code === 'USER_NOT_FOUND';
  }
}

// Error code constants for easy reference
export const WorkspaceErrorCodes = {
  PLAN_USER_LIMIT_REACHED: 'PLAN_USER_LIMIT_REACHED',
  ADMIN_REQUIRED: 'ADMIN_REQUIRED',
  MUST_HAVE_ADMIN: 'MUST_HAVE_ADMIN',
  USER_ALREADY_MEMBER: 'USER_ALREADY_MEMBER',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  WORKSPACE_NOT_FOUND: 'WORKSPACE_NOT_FOUND',
  MEMBER_NOT_FOUND: 'MEMBER_NOT_FOUND',
} as const;

// Helper to get auth token
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

// Helper to build headers
function buildHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Helper to handle response with workspace-specific error handling
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Try to parse as WorkspaceErrorResponse
    try {
      const errorBody: WorkspaceErrorResponse = await response.json();
      if (errorBody.code && errorBody.message) {
        throw new WorkspaceApiError(errorBody.code, errorBody.message, response.status);
      }
    } catch (e) {
      if (e instanceof WorkspaceApiError) {
        throw e;
      }
      // Fall back to generic error
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
    throw new Error(`API Error ${response.status}`);
  }
  return response.json();
}

/**
 * Get all workspaces for the current user.
 */
export async function getMyWorkspaces(): Promise<WorkspaceResponse[]> {
  const response = await fetch(`${API_URL}/api/v1/workspaces`, {
    method: 'GET',
    headers: buildHeaders(),
  });
  return handleResponse<WorkspaceResponse[]>(response);
}

/**
 * Get a workspace by ID.
 */
export async function getWorkspace(workspaceId: number): Promise<WorkspaceResponse> {
  const response = await fetch(`${API_URL}/api/v1/workspaces/${workspaceId}`, {
    method: 'GET',
    headers: buildHeaders(),
  });
  return handleResponse<WorkspaceResponse>(response);
}

/**
 * Create a new workspace.
 */
export async function createWorkspace(name: string): Promise<WorkspaceResponse> {
  const response = await fetch(`${API_URL}/api/v1/workspaces`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ name }),
  });
  return handleResponse<WorkspaceResponse>(response);
}

/**
 * Get all members of a workspace.
 */
export async function getWorkspaceMembers(workspaceId: number): Promise<WorkspaceMemberResponse[]> {
  const response = await fetch(`${API_URL}/api/v1/workspaces/${workspaceId}/members`, {
    method: 'GET',
    headers: buildHeaders(),
  });
  return handleResponse<WorkspaceMemberResponse[]>(response);
}

/**
 * Invite a user to a workspace.
 *
 * Possible errors:
 * - PLAN_USER_LIMIT_REACHED (409): Pro plan supports up to 5 users
 * - ADMIN_REQUIRED (403): Only admins can invite users
 * - USER_ALREADY_MEMBER (409): User is already a member
 * - USER_NOT_FOUND (404): User email not found
 */
export async function inviteUser(
  workspaceId: number,
  request: InviteUserRequest
): Promise<WorkspaceMemberResponse> {
  const response = await fetch(`${API_URL}/api/v1/workspaces/${workspaceId}/members`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(request),
  });
  return handleResponse<WorkspaceMemberResponse>(response);
}

/**
 * Update a member's role.
 *
 * Possible errors:
 * - ADMIN_REQUIRED (403): Only admins can change roles
 * - MUST_HAVE_ADMIN (422): Cannot demote last admin
 */
export async function updateMemberRole(
  workspaceId: number,
  memberId: number,
  request: UpdateMemberRoleRequest
): Promise<WorkspaceMemberResponse> {
  const response = await fetch(
    `${API_URL}/api/v1/workspaces/${workspaceId}/members/${memberId}/role`,
    {
      method: 'PATCH',
      headers: buildHeaders(),
      body: JSON.stringify(request),
    }
  );
  return handleResponse<WorkspaceMemberResponse>(response);
}

/**
 * Remove a member from a workspace.
 *
 * Possible errors:
 * - ADMIN_REQUIRED (403): Only admins can remove others
 * - MUST_HAVE_ADMIN (422): Cannot remove last admin
 */
export async function removeMember(workspaceId: number, memberId: number): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/v1/workspaces/${workspaceId}/members/${memberId}`,
    {
      method: 'DELETE',
      headers: buildHeaders(),
    }
  );
  if (!response.ok) {
    // Handle errors same as other endpoints
    try {
      const errorBody: WorkspaceErrorResponse = await response.json();
      if (errorBody.code && errorBody.message) {
        throw new WorkspaceApiError(errorBody.code, errorBody.message, response.status);
      }
    } catch (e) {
      if (e instanceof WorkspaceApiError) {
        throw e;
      }
      throw new Error(`API Error ${response.status}`);
    }
    throw new Error(`API Error ${response.status}`);
  }
}

/**
 * Check if the current user can invite more members.
 * Returns info about admin status and capacity.
 */
export async function canInvite(workspaceId: number): Promise<CanInviteResponse> {
  const response = await fetch(`${API_URL}/api/v1/workspaces/${workspaceId}/can-invite`, {
    method: 'GET',
    headers: buildHeaders(),
  });
  return handleResponse<CanInviteResponse>(response);
}

/**
 * Get user-friendly error message for workspace errors.
 * Use this to display appropriate messages in the UI.
 */
export function getErrorMessage(error: unknown): { title: string; description: string; showUpgrade?: boolean } {
  if (error instanceof WorkspaceApiError) {
    switch (error.code) {
      case WorkspaceErrorCodes.PLAN_USER_LIMIT_REACHED:
        return {
          title: 'Team Limit Reached',
          description: 'Pro plan supports up to 5 users. Upgrade to add more team members.',
          showUpgrade: true,
        };
      case WorkspaceErrorCodes.ADMIN_REQUIRED:
        return {
          title: 'Admin Required',
          description: 'Only workspace admins can perform this action.',
        };
      case WorkspaceErrorCodes.MUST_HAVE_ADMIN:
        return {
          title: 'Cannot Remove Last Admin',
          description: 'Every workspace must have at least one admin.',
        };
      case WorkspaceErrorCodes.USER_ALREADY_MEMBER:
        return {
          title: 'Already a Member',
          description: 'This user is already a member of this workspace.',
        };
      case WorkspaceErrorCodes.USER_NOT_FOUND:
        return {
          title: 'User Not Found',
          description: 'No user found with this email address. They need to sign up first.',
        };
      default:
        return {
          title: 'Error',
          description: error.message,
        };
    }
  }

  return {
    title: 'Error',
    description: error instanceof Error ? error.message : 'An unexpected error occurred.',
  };
}
