import { UserRepository } from '../repositories/user-repository.js';
import type { User, AuthenticatedUser } from '../types/index.js';
import { comparePassword } from '../utils/crypto.js';

export class AuthService {
  private userRepo = new UserRepository();

  constructor(userRepo?: UserRepository) {
    if (userRepo) this.userRepo = userRepo;
  }

  async authenticate(email: string, password: string): Promise<AuthenticatedUser | null> {
    const user = await this.userRepo.findByEmail(email);
    
    if (!user) {
      return null;
    }

    // Check if user is active
    if (!user.isActive) {
      return null;
    }

    // Check if user has departed
    if (user.departureDate && user.departureDate <= new Date()) {
      return null;
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    // Return user data without sensitive information
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  async getUserById(userId: string): Promise<AuthenticatedUser | null> {
    const user = await this.userRepo.findById(userId);
    
    if (!user || !user.isActive) {
      return null;
    }

    // Check if user has departed
    if (user.departureDate && user.departureDate <= new Date()) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }
}