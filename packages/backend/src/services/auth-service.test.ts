import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth-service.js';
import { UserRepository } from '../repositories/user-repository.js';
import type { User } from '../types/index.js';
import * as crypto from '../utils/crypto.js';

// Mock the user repository and crypto utils
vi.mock('../repositories/user-repository.js');
vi.mock('../utils/crypto.js');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepo: vi.Mocked<UserRepository>;

  const mockUser: User = {
    id: 'user-id',
    email: 'user@lab.com',
    passwordHash: 'salthex:hashhex',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockUserRepo = vi.mocked(new UserRepository());
    authService = new AuthService(mockUserRepo);
    vi.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate user with correct credentials', async () => {
      // Arrange
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      vi.mocked(crypto.comparePassword).mockResolvedValue(true);

      // Act
      const result = await authService.authenticate('user@lab.com', 'password123');

      // Assert
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role,
      });
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('user@lab.com');
      expect(crypto.comparePassword).toHaveBeenCalledWith('password123', mockUser.passwordHash);
    });

    it('should return null for non-existent user', async () => {
      // Arrange
      mockUserRepo.findByEmail.mockResolvedValue(null);

      // Act
      const result = await authService.authenticate('nonexistent@lab.com', 'password123');

      // Assert
      expect(result).toBeNull();
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('nonexistent@lab.com');
      expect(crypto.comparePassword).not.toHaveBeenCalled();
    });

    it('should return null for incorrect password', async () => {
      // Arrange
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      vi.mocked(crypto.comparePassword).mockResolvedValue(false);

      // Act
      const result = await authService.authenticate('user@lab.com', 'wrongpassword');

      // Assert
      expect(result).toBeNull();
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('user@lab.com');
      expect(crypto.comparePassword).toHaveBeenCalledWith('wrongpassword', mockUser.passwordHash);
    });

    it('should return null for inactive user', async () => {
      // Arrange
      const inactiveUser = { ...mockUser, isActive: false };
      mockUserRepo.findByEmail.mockResolvedValue(inactiveUser);

      // Act
      const result = await authService.authenticate('user@lab.com', 'password123');

      // Assert
      expect(result).toBeNull();
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('user@lab.com');
      expect(crypto.comparePassword).not.toHaveBeenCalled();
    });

    it('should return null for user with past departure date', async () => {
      // Arrange
      const departedUser = { 
        ...mockUser, 
        departureDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      };
      mockUserRepo.findByEmail.mockResolvedValue(departedUser);

      // Act
      const result = await authService.authenticate('user@lab.com', 'password123');

      // Assert
      expect(result).toBeNull();
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('user@lab.com');
      expect(crypto.comparePassword).not.toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return user for valid ID', async () => {
      // Arrange
      mockUserRepo.findById.mockResolvedValue(mockUser);

      // Act
      const result = await authService.getUserById('user-id');

      // Assert
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role,
      });
      expect(mockUserRepo.findById).toHaveBeenCalledWith('user-id');
    });

    it('should return null for non-existent user ID', async () => {
      // Arrange
      mockUserRepo.findById.mockResolvedValue(null);

      // Act
      const result = await authService.getUserById('nonexistent-id');

      // Assert
      expect(result).toBeNull();
      expect(mockUserRepo.findById).toHaveBeenCalledWith('nonexistent-id');
    });

    it('should return null for inactive user', async () => {
      // Arrange
      const inactiveUser = { ...mockUser, isActive: false };
      mockUserRepo.findById.mockResolvedValue(inactiveUser);

      // Act
      const result = await authService.getUserById('user-id');

      // Assert
      expect(result).toBeNull();
      expect(mockUserRepo.findById).toHaveBeenCalledWith('user-id');
    });
  });
});