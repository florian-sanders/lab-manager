export type UserRole = 'user' | 'researcher' | 'admin';
export type ProjectRole = 'owner' | 'manager' | 'collaborator';
export type EntryValidationStatus = 'draft' | 'pending_validation' | 'validated' | 'rejected';
export type ProtocolStatus = 'pending_validation' | 'validated' | 'rejected' | 'archived';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  departureDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invitation {
  id: string;
  email: string;
  invitedRole: UserRole;
  invitedBy: string; // User ID
  projectId?: string; // Optional project ID
  departureDate?: Date;
  token: string;
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
}

export interface CreateInvitationData {
  email: string;
  invitedRole: UserRole;
  invitedBy: string;
  projectId?: string;
  departureDate?: Date;
}

export interface AcceptInvitationData {
  firstName: string;
  lastName: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'researcher' | 'admin';
}