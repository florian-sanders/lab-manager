import { z } from 'zod';
import { router, publicProcedure, protectedProcedure, researcherProcedure } from '../utils/trpc.js';
import { AuthService } from '../services/auth-service.js';
import { InvitationService } from '../services/invitation-service.js';

const authService = new AuthService();
const invitationService = new InvitationService();

export const authRouter = router({
  // Login endpoint
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      const user = await authService.authenticate(input.email, input.password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Store user ID in session
      (ctx.req.session as any).userId = user.id;
      
      return { user };
    }),

  // Logout endpoint
  logout: protectedProcedure
    .mutation(async ({ ctx }) => {
      ctx.req.session.destroy();
      return { success: true };
    }),

  // Get current user
  me: protectedProcedure
    .query(({ ctx }) => {
      return { user: ctx.user };
    }),

  // Send invitation (researchers and admins only)
  sendInvitation: researcherProcedure
    .input(z.object({
      email: z.string().email(),
      invitedRole: z.enum(['user', 'researcher']),
      projectId: z.string().uuid().optional(),
      departureDate: z.date().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Additional validation: researchers can only invite users
      if (ctx.user.role === 'researcher' && input.invitedRole !== 'user') {
        throw new Error('Researchers can only invite users');
      }

      const invitation = await invitationService.createInvitation({
        email: input.email,
        invitedRole: input.invitedRole,
        invitedBy: ctx.user.id,
        projectId: input.projectId,
        departureDate: input.departureDate,
      });

      return { invitation };
    }),

  // Validate invitation token
  validateInvitation: publicProcedure
    .input(z.object({
      token: z.string(),
    }))
    .query(async ({ input }) => {
      const invitation = await invitationService.validateInvitation(input.token);
      return { invitation };
    }),

  // Accept invitation and create account
  acceptInvitation: publicProcedure
    .input(z.object({
      token: z.string(),
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      password: z.string().min(8),
    }))
    .mutation(async ({ input }) => {
      // Validate password strength
      const passwordValidation = invitationService.validatePassword(input.password);
      if (!passwordValidation.valid) {
        throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
      }

      const result = await invitationService.acceptInvitation(input.token, {
        firstName: input.firstName,
        lastName: input.lastName,
        password: input.password,
      });

      return { user: result.user };
    }),

  // Get pending invitations (for the current user)
  getPendingInvitations: researcherProcedure
    .query(async ({ ctx }) => {
      const invitations = await invitationService.getPendingInvitations(ctx.user.id);
      return { invitations };
    }),
});