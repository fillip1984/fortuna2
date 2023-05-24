import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const GoalRouter = createTRPCRouter({
  createOrUpdateGoal: publicProcedure
    .input(z.object({ weight: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.goal.upsert({
        where: {
          userid: "PHIL",
        },
        create: {
          weight: input.weight,
        },
        update: {
          weight: input.weight,
        },
      });
    }),
  read: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.goal.findFirst();
  }),
  getGoal: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.goal.findFirst();
  }),
});
