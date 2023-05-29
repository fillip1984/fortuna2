import {
  type BloodPressureReading,
  type Routine,
  type WeighIn,
} from "@prisma/client";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isFirstDayOfMonth,
  isLastDayOfMonth,
} from "date-fns";
import { createTRPCRouter, publicProcedure } from "../trpc";

type TimelineEntry = {
  type: "WeighIn" | "BloodPressureReading" | "Routine";
  event: WeighIn | BloodPressureReading | Routine;
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

    const routines = await ctx.prisma.routine.findMany({
      orderBy: {
        startDateTime: "desc",
      },
      include: {
        daysOfWeek: true,
      },
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

    if (routines) {
      routines.map((routine) => {
        eachDayOfInterval({
          start: routine.startDateTime,
          end: routine.endDateTime ?? endOfMonth(new Date()),
        }).forEach((date) => uniqueDatesAsNumbers.add(date.getTime()));
      });
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

      routines
        .filter((routine) => {
          if (routine.occurrenceType === "SPECIFIC_DAY") {
            return (
              timelineEntry.date.getTime() === routine.startDateTime.getTime()
            );
          } else if (routine.occurrenceType === "DAY_OF_MONTH") {
            return (
              (routine.dayOfMonth === "FIRST" &&
                isFirstDayOfMonth(timelineEntry.date)) ||
              (routine.dayOfMonth === "MIDDLE" &&
                timelineEntry.date.getDay() === 15) ||
              (routine.dayOfMonth === "LAST" &&
                isLastDayOfMonth(timelineEntry.date))
            );
          } else if (routine.occurrenceType === "DAY_OF_WEEK") {
            // return routine.daysOfWeek[getDay(timelineEntry.date)]?.selected;
            return routine.daysOfWeek.find(
              (dayOfWeek) =>
                dayOfWeek.label === format(timelineEntry.date, "EEEE")
            )?.selected;
          }
        })
        .forEach((routine) => {
          timelineEntry.entries.push({
            type: "Routine",
            event: routine,
          });
        });

      timeline.push(timelineEntry);
    });

    return timeline;
  }),
});
