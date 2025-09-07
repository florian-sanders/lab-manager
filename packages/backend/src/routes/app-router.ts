import { router } from '../utils/trpc.js';
import { authRouter } from './auth-router.js';

export const appRouter = router({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;