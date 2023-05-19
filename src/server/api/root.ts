import { createTRPCRouter } from "~/server/api/trpc";
import { GoalRouter } from "./routers/GoalRouter";
import { WeighInRouter } from "./routers/WeighInRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  goals: GoalRouter,
  weighIns: WeighInRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
