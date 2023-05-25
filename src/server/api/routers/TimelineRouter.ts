import { type WeighIn, type BloodPressureReading } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "../trpc";

type TimelineEntry = {
  type: "WeighIn" | "BloodPressureReading";
  event: WeighIn | BloodPressureReading;
};

type TimelineEvent = {
  date: Date;
  entries: TimelineEntry[];
};

export const TimelineRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const weighIns = await ctx.prisma.weighIn.findMany({
      orderBy: {
        date: "desc",
      },
      // select: {
      //   id: true,
      //   date: true,
      //   weight: true,
      //   weightProgress: true,
      //   weightTotalChange: true,
      //   weightToGoal: true,
      // },
    });

    const bloodPressureReadings =
      await ctx.prisma.bloodPressureReading.findMany({
        orderBy: {
          date: "desc",
        },
        // select: {
        //   id: true,
        //   date: true,
        //   systolic: true,
        //   diastolic: true,
        //   pulse: true,
        //   category: true,
        // },
      });

    // const goal = await ctx.prisma.goal.findFirst();
    // const goalWeight = goal?.weight.toNumber();

    // fold in the cheese
    const timeline: TimelineEvent[] = [];
    const uniqueDatesAsNumbers = new Set<number>();
    if (weighIns) {
      weighIns
        .map((weighIn) => weighIn.date)
        .forEach((date) => uniqueDatesAsNumbers.add(date.getTime()));
    }

    if (bloodPressureReadings) {
      bloodPressureReadings
        .map((bloodPressureReadings) => bloodPressureReadings.date)
        .forEach((date) => uniqueDatesAsNumbers.add(date.getTime()));
    }

    const uniqueDates: Date[] = [];
    uniqueDatesAsNumbers.forEach((value) => {
      uniqueDates.push(new Date(value));
    });

    const sortedUniqueDates = uniqueDates.sort(function (a: Date, b: Date) {
      return b.getTime() - a.getTime();
    });

    sortedUniqueDates.forEach((uniqueDate) => {
      const timelineEntry: TimelineEvent = {
        date: uniqueDate,
        entries: [],
      };

      weighIns
        .filter(
          (weighIn) => weighIn.date.getTime() === timelineEntry.date.getTime()
        )
        .forEach((weighIn) => {
          timelineEntry.entries.push({ type: "WeighIn", event: weighIn });
        });

      bloodPressureReadings
        .filter((bpr) => bpr.date.getTime() === timelineEntry.date.getTime())
        .forEach((bpr) => {
          timelineEntry.entries.push({
            type: "BloodPressureReading",
            event: bpr,
          });
        });

      timeline.push(timelineEntry);
    });

    return timeline;
  }),
});
