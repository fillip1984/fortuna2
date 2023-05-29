import { createTRPCRouter } from "~/server/api/trpc";
import { BloodPressureReadingRouter } from "./routers/BloodPressureReadingRouter";
import { GoalRouter } from "./routers/GoalRouter";
import { RoutineOutcomeRouter } from "./routers/RoutineOutcomeRouter";
import { RoutineRouter } from "./routers/RoutineRouter";
import { TimelineRouter } from "./routers/TimelineRouter";
import { WeighInRouter } from "./routers/WeighInRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  bloodPressureReadings: BloodPressureReadingRouter,
  goals: GoalRouter,
  routines: RoutineRouter,
  routineOutcomes: RoutineOutcomeRouter,
  timeline: TimelineRouter,
  weighIns: WeighInRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
