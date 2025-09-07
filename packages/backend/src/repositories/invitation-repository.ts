import { query, queryOne } from '../utils/database.js';
import type { Invitation, CreateInvitationData } from '../types/index.js';
import { randomBytes } from 'crypto';

export class InvitationRepository {
  async findByToken(token: string): Promise<Invitation | null> {
    return queryOne<Invitation>(
      `SELECT id, email, invited_role as "invitedRole", invited_by as "invitedBy",
              project_id as "projectId", departure_date as "departureDate", 
              token, expires_at as "expiresAt", accepted_at as "acceptedAt",
              created_at as "createdAt"
       FROM invitations 
       WHERE token = $1`,
      [token]
    );
  }

  async findByEmail(email: string): Promise<Invitation[]> {
    return query<Invitation>(
      `SELECT id, email, invited_role as "invitedRole", invited_by as "invitedBy",
              project_id as "projectId", departure_date as "departureDate", 
              token, expires_at as "expiresAt", accepted_at as "acceptedAt",
              created_at as "createdAt"
       FROM invitations 
       WHERE email = $1 AND accepted_at IS NULL`,
      [email]
    );
  }

  async create(data: CreateInvitationData): Promise<Invitation> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    const result = await queryOne<Invitation>(
      `INSERT INTO invitations (email, invited_role, invited_by, project_id, departure_date, token, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, invited_role as "invitedRole", invited_by as "invitedBy",
                 project_id as "projectId", departure_date as "departureDate", 
                 token, expires_at as "expiresAt", accepted_at as "acceptedAt",
                 created_at as "createdAt"`,
      [
        data.email,
        data.invitedRole,
        data.invitedBy,
        data.projectId || null,
        data.departureDate || null,
        token,
        expiresAt,
      ]
    );

    if (!result) {
      throw new Error('Failed to create invitation');
    }

    return result;
  }

  async markAsAccepted(token: string): Promise<void> {
    await query(
      'UPDATE invitations SET accepted_at = NOW() WHERE token = $1',
      [token]
    );
  }

  async deleteExpired(): Promise<void> {
    await query(
      'DELETE FROM invitations WHERE expires_at < NOW() AND accepted_at IS NULL'
    );
  }

  async findPendingByInviter(inviterId: string): Promise<Invitation[]> {
    return query<Invitation>(
      `SELECT id, email, invited_role as "invitedRole", invited_by as "invitedBy",
              project_id as "projectId", departure_date as "departureDate", 
              token, expires_at as "expiresAt", accepted_at as "acceptedAt",
              created_at as "createdAt"
       FROM invitations 
       WHERE invited_by = $1 AND accepted_at IS NULL AND expires_at > NOW()
       ORDER BY created_at DESC`,
      [inviterId]
    );
  }
}