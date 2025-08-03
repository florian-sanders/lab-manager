import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InvitationService } from './invitation-service.js';
import { InvitationRepository } from '../repositories/invitation-repository.js';
import { UserRepository } from '../repositories/user-repository.js';
import { EmailService } from './email-service.js';
import type { User, Invitation, CreateInvitationData } from '../types/index.js';

// Mock the repositories and email service
vi.mock('../repositories/invitation-repository.js');
vi.mock('../repositories/user-repository.js');
vi.mock('./email-service.js');

describe('InvitationService', () => {
  let invitationService: InvitationService;
  let mockInvitationRepo: vi.Mocked<InvitationRepository>;
  let mockUserRepo: vi.Mocked<UserRepository>;
  let mockEmailService: vi.Mocked<EmailService>;

  const mockAdmin: User = {
    id: 'admin-id',
    email: 'admin@lab.com',
    passwordHash: 'hashed',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockResearcher: User = {
    id: 'researcher-id',
    email: 'researcher@lab.com',
    passwordHash: 'hashed',
    firstName: 'Research',
    lastName: 'User',
    role: 'researcher',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockInvitationRepo = vi.mocked(new InvitationRepository());
    mockUserRepo = vi.mocked(new UserRepository());
    mockEmailService = vi.mocked(new EmailService());
    
    invitationService = new InvitationService(
      mockInvitationRepo,
      mockUserRepo,
      mockEmailService
    );
  });

  describe('createInvitation', () => {
    const validInvitationData: CreateInvitationData = {
      email: 'newuser@lab.com',
      invitedRole: 'user',
      invitedBy: 'admin-id',
    };

    it('should create invitation when all conditions are met', async () => {
      // Arrange
      mockUserRepo.findByEmail.mockResolvedValue(null); // User doesn't exist
      mockInvitationRepo.findByEmail.mockResolvedValue([]); // No pending invitations
      mockUserRepo.findById.mockResolvedValue(mockAdmin);
      
      const mockInvitation: Invitation = {
        id: 'invitation-id',
        email: validInvitationData.email,
        invitedRole: validInvitationData.invitedRole,
        invitedBy: validInvitationData.invitedBy,
        token: 'mock-token',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      };
      
      mockInvitationRepo.create.mockResolvedValue(mockInvitation);
      mockEmailService.sendInvitationEmail.mockResolvedValue();

      // Act
      const result = await invitationService.createInvitation(validInvitationData);

      // Assert
      expect(result).toEqual(mockInvitation);
      expect(mockInvitationRepo.create).toHaveBeenCalledWith(validInvitationData);
      expect(mockEmailService.sendInvitationEmail).toHaveBeenCalledWith(mockInvitation, mockAdmin);
    });

    it('should throw error if user already exists', async () => {
      // Arrange
      mockUserRepo.findByEmail.mockResolvedValue(mockAdmin);

      // Act & Assert
      await expect(invitationService.createInvitation(validInvitationData))
        .rejects.toThrow('User with this email already exists');
    });

    it('should throw error if invitation already exists', async () => {
      // Arrange
      mockUserRepo.findByEmail.mockResolvedValue(null);
      const mockPendingInvitation: Invitation = {
        id: 'existing-invitation',
        email: validInvitationData.email,
        invitedRole: 'user',
        invitedBy: 'admin-id',
        token: 'existing-token',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      };
      mockInvitationRepo.findByEmail.mockResolvedValue([mockPendingInvitation]);

      // Act & Assert
      await expect(invitationService.createInvitation(validInvitationData))
        .rejects.toThrow('Invitation already sent to this email');
    });

    it('should throw error if inviter not found', async () => {
      // Arrange
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockInvitationRepo.findByEmail.mockResolvedValue([]);
      mockUserRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(invitationService.createInvitation(validInvitationData))
        .rejects.toThrow('Inviter not found');
    });

    it('should throw error if researcher tries to invite non-user role', async () => {
      // Arrange
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockInvitationRepo.findByEmail.mockResolvedValue([]);
      mockUserRepo.findById.mockResolvedValue(mockResearcher);

      const invalidData = {
        ...validInvitationData,
        invitedRole: 'researcher' as const,
        invitedBy: 'researcher-id',
      };

      // Act & Assert
      await expect(invitationService.createInvitation(invalidData))
        .rejects.toThrow('Researchers can only invite users');
    });
  });

  describe('validateInvitation', () => {
    it('should return invitation when token is valid', async () => {
      // Arrange
      const mockInvitation: Invitation = {
        id: 'invitation-id',
        email: 'user@lab.com',
        invitedRole: 'user',
        invitedBy: 'admin-id',
        token: 'valid-token',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      };
      mockInvitationRepo.findByToken.mockResolvedValue(mockInvitation);

      // Act
      const result = await invitationService.validateInvitation('valid-token');

      // Assert
      expect(result).toEqual(mockInvitation);
    });

    it('should throw error for invalid token', async () => {
      // Arrange
      mockInvitationRepo.findByToken.mockResolvedValue(null);

      // Act & Assert
      await expect(invitationService.validateInvitation('invalid-token'))
        .rejects.toThrow('Invalid invitation token');
    });

    it('should throw error for already accepted invitation', async () => {
      // Arrange
      const acceptedInvitation: Invitation = {
        id: 'invitation-id',
        email: 'user@lab.com',
        invitedRole: 'user',
        invitedBy: 'admin-id',
        token: 'accepted-token',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        acceptedAt: new Date(),
        createdAt: new Date(),
      };
      mockInvitationRepo.findByToken.mockResolvedValue(acceptedInvitation);

      // Act & Assert
      await expect(invitationService.validateInvitation('accepted-token'))
        .rejects.toThrow('Invitation has already been accepted');
    });

    it('should throw error for expired invitation', async () => {
      // Arrange
      const expiredInvitation: Invitation = {
        id: 'invitation-id',
        email: 'user@lab.com',
        invitedRole: 'user',
        invitedBy: 'admin-id',
        token: 'expired-token',
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Expired yesterday
        createdAt: new Date(),
      };
      mockInvitationRepo.findByToken.mockResolvedValue(expiredInvitation);

      // Act & Assert
      await expect(invitationService.validateInvitation('expired-token'))
        .rejects.toThrow('Invitation has expired');
    });
  });

  describe('validatePassword', () => {
    it('should accept strong password', () => {
      const result = invitationService.validatePassword('StrongPass123!');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password that is too short', () => {
      const result = invitationService.validatePassword('Short1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject password without uppercase letter', () => {
      const result = invitationService.validatePassword('lowercase123!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without lowercase letter', () => {
      const result = invitationService.validatePassword('UPPERCASE123!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without number', () => {
      const result = invitationService.validatePassword('NoNumbers!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject password without special character', () => {
      const result = invitationService.validatePassword('NoSpecialChars123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });
  });
});