import { OccurrenceType } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const RoutineRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        summary: z.string(),
        details: z.string(),
        occurrenceType: z.nativeEnum(OccurrenceType),
        startDateTime: z.date(),
        endDateTime: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.routine.create({
        data: {
          summary: input.summary,
          details: input.details,
          occurrenceType: input.occurrenceType,
          startDateTime: input.startDateTime,
          endDateTime: input.endDateTime,
        },
      });
      return result;
    }),
  readAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.routine.findMany();
  }),
});
