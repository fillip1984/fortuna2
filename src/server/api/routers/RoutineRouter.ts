import { OccurrenceType } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { startOfDay } from "~/utils/date";

export const RoutineRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        summary: z.string(),
        details: z.string(),
        occurrenceType: z.nativeEnum(OccurrenceType),
        startDateTime: z.date(),
        endDateTime: z.date().nullish(),
        daysOfWeek: z
          .array(
            z.object({
              label: z.string(),
              selected: z.boolean(),
            })
          )
          .nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.routine.create({
        data: {
          summary: input.summary,
          details: input.details,
          occurrenceType: input.occurrenceType,
          startDateTime: startOfDay(new Date()),
          endDateTime: input.endDateTime,
          daysOfWeek: {
            ...(input.daysOfWeek
              ? {
                  createMany: {
                    data: input.daysOfWeek?.map((dayOfWeek) => {
                      return {
                        label: dayOfWeek.label,
                        abbreviatedLabel: "xxx",
                        selected: dayOfWeek.selected,
                      };
                    }),
                  },
                }
              : {}),
          },
        },
      });
      return result;
    }),
  readAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.routine.findMany();
  }),
  readForToday: publicProcedure.query(({ ctx }) => {
    const today = startOfDay(new Date());
    // does the same thing: today.setHours(0, 0, 0, 0);

    return ctx.prisma.routine.findMany({
      where: {
        OR: [
          {
            startDateTime: {
              lte: today,
            },
            AND: {
              endDateTime: {
                gte: today,
              },
            },
          },
          {
            startDateTime: {
              lte: today,
            },
            AND: {
              endDateTime: {
                equals: today,
              },
            },
          },
        ],
      },
    });
  }),
});
