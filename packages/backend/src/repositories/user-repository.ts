import { query, queryOne } from '../utils/database.js';
import type { User, UserRole } from '../types/index.js';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return queryOne<User>(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    return queryOne<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
  }

  async create(userData: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    departureDate?: Date;
  }): Promise<User> {
    const result = await queryOne<User>(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, departure_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, password_hash as "passwordHash", first_name as "firstName", 
                 last_name as "lastName", role, is_active as "isActive", 
                 departure_date as "departureDate", created_at as "createdAt", 
                 updated_at as "updatedAt"`,
      [
        userData.email,
        userData.passwordHash,
        userData.firstName,
        userData.lastName,
        userData.role || 'user',
        userData.departureDate || null,
      ]
    );

    if (!result) {
      throw new Error('Failed to create user');
    }

    return result;
  }

  async updateRole(userId: string, role: UserRole): Promise<void> {
    await query(
      'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2',
      [role, userId]
    );
  }

  async deactivate(userId: string): Promise<void> {
    await query(
      'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1',
      [userId]
    );
  }

  async activate(userId: string): Promise<void> {
    await query(
      'UPDATE users SET is_active = true, updated_at = NOW() WHERE id = $1',
      [userId]
    );
  }

  async findUsersWithExpiredDepartureDates(): Promise<User[]> {
    return query<User>(
      `SELECT id, email, password_hash as "passwordHash", first_name as "firstName", 
              last_name as "lastName", role, is_active as "isActive", 
              departure_date as "departureDate", created_at as "createdAt", 
              updated_at as "updatedAt"
       FROM users 
       WHERE departure_date <= CURRENT_DATE AND is_active = true`
    );
  }
}