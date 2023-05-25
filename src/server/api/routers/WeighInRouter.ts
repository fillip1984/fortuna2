import { type WeighIn } from "@prisma/client";
import { differenceInCalendarDays } from "date-fns";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

type WeighInDateDiffed = {
  daysBetween: number;
  weighIn: WeighIn;
};

export const WeighInRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        date: z.date(),
        weight: z.number(),
        bodyFatPercentage: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const goal = await getGoal();
      const goalWeight: number | undefined = goal?.weight.toNumber();
      if (goalWeight === undefined) {
        throw Error("Goal weight must be set before adding weigh ins");
      }

      // calculate trends
      const firstWeighIn = await getFirstWeighIn();
      const previousWeighIn = await getPreviousWeighIn(input.date);
      let weightProgress;
      let weightTotalChange;
      let weightToGoal;

      if (firstWeighIn == null) {
        weightProgress = 0;
        weightTotalChange = 0;
        weightToGoal = Math.round((input.weight - goalWeight) * 100) / 100;
      } else {
        if (previousWeighIn === null) {
          throw Error(
            "Unable to find previous weigh in so unable to record weight trends"
          );
        }

        weightProgress = (
          input.weight - previousWeighIn.weight.toNumber()
        ).toFixed(2);

        weightTotalChange = (
          input.weight - firstWeighIn.weight.toNumber()
        ).toFixed(2);

        weightToGoal = (input.weight - goalWeight).toFixed(2);
      }

      const result = await ctx.prisma.weighIn.create({
        data: {
          date: input.date,
          weight: input.weight,
          bodyFatPercentage: input.bodyFatPercentage,
          weightProgress,
          weightTotalChange,
          weightToGoal,
          previousWeighInId: previousWeighIn?.id,
        },
      });
      return result;
    }),
  readAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.weighIn.findMany({
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        date: true,
        weight: true,
        weightProgress: true,
        weightTotalChange: true,
        weightToGoal: true,
      },
    });
  }),
  readOne: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.weighIn.findUnique({ where: { id: input.id } });
    }),
  update: publicProcedure
    .input(z.object({ id: z.string().cuid(), weight: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.weighIn.update({
        data: {
          weight: input.weight,
        },
        where: {
          id: input.id,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.weighIn.delete({
        where: {
          id: input.id,
        },
      });
    }),
});

const getPreviousWeighIn = async (date: Date) => {
  const allWeighIns = await prisma.weighIn.findMany({
    orderBy: {
      date: "desc",
    },
  });

  const weighInDateDiffed: WeighInDateDiffed[] = allWeighIns
    .map((previous) => {
      return {
        daysBetween: differenceInCalendarDays(date, previous.date),
        weighIn: previous,
      };
    })
    .sort((a, b) => {
      return a.daysBetween - b.daysBetween;
    });

  const previousWeighIns = weighInDateDiffed.filter(
    (weighInDateDiff) => weighInDateDiff.daysBetween > 0
  );

  if (previousWeighIns.length > 0 && previousWeighIns[0]) {
    return previousWeighIns[0].weighIn;
  } else {
    return null;
  }
};

const getFirstWeighIn = async () => {
  return await prisma.weighIn.findFirst({
    orderBy: {
      date: "asc",
    },
    take: 1,
  });
};

const getGoal = async () => {
  // there should only ever be 1
  return await prisma.goal.findFirst();
};
