import { InvitationRepository } from '../repositories/invitation-repository.js';
import { UserRepository } from '../repositories/user-repository.js';
import { EmailService } from './email-service.js';
import type { CreateInvitationData, Invitation } from '../types/index.js';
import { hashPassword } from '../utils/crypto.js';

export class InvitationService {
  private invitationRepo = new InvitationRepository();
  private userRepo = new UserRepository();
  private emailService = new EmailService();

  constructor(
    invitationRepo?: InvitationRepository,
    userRepo?: UserRepository,
    emailService?: EmailService
  ) {
    if (invitationRepo) this.invitationRepo = invitationRepo;
    if (userRepo) this.userRepo = userRepo;
    if (emailService) this.emailService = emailService;
  }

  async createInvitation(data: CreateInvitationData): Promise<Invitation> {
    // Check if user already exists
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Check if there's already a pending invitation
    const pendingInvitations = await this.invitationRepo.findByEmail(data.email);
    if (pendingInvitations.length > 0) {
      throw new Error('Invitation already sent to this email');
    }

    // Validate permissions - researchers can only invite users
    const inviter = await this.userRepo.findById(data.invitedBy);
    if (!inviter) {
      throw new Error('Inviter not found');
    }

    if (inviter.role === 'researcher' && data.invitedRole !== 'user') {
      throw new Error('Researchers can only invite users');
    }

    // Create the invitation
    const invitation = await this.invitationRepo.create(data);

    // Send invitation email
    await this.emailService.sendInvitationEmail(invitation, inviter);

    return invitation;
  }

  async validateInvitation(token: string): Promise<Invitation> {
    const invitation = await this.invitationRepo.findByToken(token);
    
    if (!invitation) {
      throw new Error('Invalid invitation token');
    }

    if (invitation.acceptedAt) {
      throw new Error('Invitation has already been accepted');
    }

    if (new Date() > invitation.expiresAt) {
      throw new Error('Invitation has expired');
    }

    return invitation;
  }

  async acceptInvitation(token: string, userData: {
    firstName: string;
    lastName: string;
    password: string;
  }): Promise<{ user: any; invitation: Invitation }> {
    const invitation = await this.validateInvitation(token);

    // Check if user already exists (double check)
    const existingUser = await this.userRepo.findByEmail(invitation.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    // Create the user
    const user = await this.userRepo.create({
      email: invitation.email,
      passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: invitation.invitedRole,
      departureDate: invitation.departureDate,
    });

    // Mark invitation as accepted
    await this.invitationRepo.markAsAccepted(token);

    // TODO: If invitation has projectId, add user to project

    return { user, invitation };
  }

  async getPendingInvitations(inviterId: string): Promise<Invitation[]> {
    return this.invitationRepo.findPendingByInviter(inviterId);
  }

  async cleanupExpiredInvitations(): Promise<void> {
    await this.invitationRepo.deleteExpired();
  }

  // Validate password strength
  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}