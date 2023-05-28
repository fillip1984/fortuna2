import {
  type BloodPressureCategory,
  type BloodPressureReading,
} from "@prisma/client";
import { differenceInCalendarDays } from "date-fns";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const BloodPressureReadingRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        date: z.date(),
        systolic: z.number(),
        diastolic: z.number(),
        pulse: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let category: BloodPressureCategory;
      if (input.systolic > 180 || input.diastolic > 120) {
        category = "HYPERTENSION_CRISIS";
      } else if (input.systolic >= 140 || input.diastolic >= 90) {
        category = "HYPERTENSION_STAGE_2";
      } else if (input.systolic >= 130) {
        category = "HYPERTENSION_STAGE_1";
      } else if (input.diastolic >= 80) {
        category = "HYPERTENSION_STAGE_1";
      } else if (input.systolic >= 120) {
        category = "ELEVATED";
      } else if (input.systolic >= 90) {
        category = "NORMAL";
      } else {
        category = "LOW";
      }

      //calculate trends
      let systolicChange: number;
      let diastolicChange: number;
      let pulseChange: number | null;
      const firstReading = await getFirstReading();
      const previousReading = await getPreviousReading(input.date);

      if (firstReading == null) {
        systolicChange = 0;
        diastolicChange = 0;
        pulseChange = 0;
      } else {
        if (previousReading === null) {
          throw Error(
            "Unable to find previous blood pressure reading so unable to record reading trends"
          );
        }

        systolicChange = input.systolic - previousReading.systolic;
        diastolicChange = input.diastolic - previousReading.diastolic;
        if (
          input.pulse === 0 ||
          input.pulse === null ||
          previousReading.pulse === 0 ||
          previousReading.pulse === null
        ) {
          pulseChange = null;
        } else {
          pulseChange = input.pulse
            ? input.pulse - previousReading.pulse
            : null;
        }
      }

      const result = await ctx.prisma.bloodPressureReading.create({
        data: {
          date: input.date,
          systolic: input.systolic,
          diastolic: input.diastolic,
          pulse: input.pulse,
          category,
          systolicChange,
          diastolicChange,
          pulseChange,
        },
      });
      return result;
    }),
  readAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.bloodPressureReading.findMany({
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        date: true,
        systolic: true,
        diastolic: true,
        pulse: true,
        category: true,
      },
    });
  }),
  readOne: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.bloodPressureReading.findUnique({
        where: { id: input.id },
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.bloodPressureReading.delete({
        where: {
          id: input.id,
        },
      });
    }),
});

const getFirstReading = async () => {
  return prisma.bloodPressureReading.findFirst({
    orderBy: {
      date: "asc",
    },
    take: 1,
  });
};

type DateDiffed = {
  daysBetween: number;
  event: BloodPressureReading;
};
const getPreviousReading = async (date: Date) => {
  const allReadings = await prisma.bloodPressureReading.findMany({
    orderBy: {
      date: "desc",
    },
  });

  const dateDiffed: DateDiffed[] = allReadings
    .map((previous) => {
      return {
        daysBetween: differenceInCalendarDays(date, previous.date),
        event: previous,
      };
    })
    .sort((a, b) => {
      return a.daysBetween - b.daysBetween;
    });

  const previousReadings = dateDiffed.filter(
    (dateDiff) => dateDiff.daysBetween > 0
  );

  if (previousReadings.length > 0 && previousReadings[0]) {
    return previousReadings[0].event;
  } else {
    return null;
  }
};
