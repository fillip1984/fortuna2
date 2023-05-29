import { RoutineOutcomeStatus } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const RoutineOutcomeRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        routineName: z.string(),
        routineId: z.string(),
        date: z.date(),
        status: z.nativeEnum(RoutineOutcomeStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.routineOutcome.create({
        data: {
          createdAt: input.date,
          status: input.status,
          routine: {
            connect: {
              id: input.routineId,
            },
          },
        },
      });
      return result;
    }),
  readOne: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.routineOutcome.findUnique({
        where: { id: input.id },
        include: {
          routine: true,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.routineOutcome.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
