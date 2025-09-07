import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { AuthService } from '../services/auth-service.js';
import type { AuthenticatedUser } from '../types/index.js';

export interface Context {
  user?: AuthenticatedUser;
  sessionId: string;
  req: any;
  res: any;
}

const authService = new AuthService();

export async function createContext({ req, res }: CreateFastifyContextOptions): Promise<Context> {
  let user: AuthenticatedUser | undefined;

  // Get user ID from session
  const userId = (req.session as any).userId as string | undefined;
  
  if (userId) {
    // Validate that the user still exists and is active
    user = await authService.getUserById(userId) || undefined;
  }

  return {
    user,
    sessionId: req.session.sessionId,
    req,
    res,
  };
}