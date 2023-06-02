import {
  type BloodPressureReading,
  type Routine,
  type RoutineOutcome,
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
  type: "WeighIn" | "BloodPressureReading" | "Routine" | "RoutineOutcome";
  event:
    | WeighIn
    | BloodPressureReading
    | Routine
    | (RoutineOutcome & {
        routine: Routine;
      });
};

type TimelinePoint = {
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

    const routineOutcomes = await ctx.prisma.routineOutcome.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        routine: true,
      },
    });

    // fold in the cheese
    const timeline: TimelinePoint[] = [];
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

    if (routineOutcomes) {
      routineOutcomes
        .map((outcome) => outcome.createdAt)
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
      const timelinePoint: TimelinePoint = {
        date: uniqueDate,
        entries: [],
      };

      weighIns
        .filter(
          (weighIn) => weighIn.date.getTime() === timelinePoint.date.getTime()
        )
        .forEach((weighIn) => {
          timelinePoint.entries.push({ type: "WeighIn", event: weighIn });
        });

      bloodPressureReadings
        .filter((bpr) => bpr.date.getTime() === timelinePoint.date.getTime())
        .forEach((bpr) => {
          timelinePoint.entries.push({
            type: "BloodPressureReading",
            event: bpr,
          });
        });

      routines
        .filter((routine) => {
          if (routine.occurrenceType === "SPECIFIC_DAY") {
            return (
              timelinePoint.date.getTime() === routine.startDateTime.getTime()
            );
          } else if (routine.occurrenceType === "DAY_OF_MONTH") {
            return (
              (routine.dayOfMonth === "FIRST" &&
                isFirstDayOfMonth(timelinePoint.date)) ||
              (routine.dayOfMonth === "MIDDLE" &&
                timelinePoint.date.getDay() === 15) ||
              (routine.dayOfMonth === "LAST" &&
                isLastDayOfMonth(timelinePoint.date))
            );
          } else if (routine.occurrenceType === "DAY_OF_WEEK") {
            // return routine.daysOfWeek[getDay(timelinePoint.date)]?.selected;
            return routine.daysOfWeek.find(
              (dayOfWeek) =>
                dayOfWeek.label === format(timelinePoint.date, "EEEE")
            )?.selected;
          }
        })
        .forEach((routine) => {
          timelinePoint.entries.push({
            type: "Routine",
            event: routine,
          });
        });

      routineOutcomes
        .filter(
          (outcome) =>
            outcome.createdAt.getTime() === timelinePoint.date.getTime()
        )
        .forEach((outcome) => {
          timelinePoint.entries.push({
            type: "RoutineOutcome",
            event: outcome,
          });
        });

      timeline.push(timelinePoint);
    });

    return timeline.filter((timelinePoint) => timelinePoint.entries.length > 0);
  }),
});
