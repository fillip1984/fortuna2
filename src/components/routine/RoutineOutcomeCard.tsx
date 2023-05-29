import { type Routine, type RoutineOutcome } from "@prisma/client";
import Link from "next/link";

import { HiCalendarDays } from "react-icons/hi2";
export default function RoutineOutcomeCard({
  outcome,
  outcomeDate,
}: {
  outcome: RoutineOutcome & {
    routine: Routine;
  };
  outcomeDate: Date;
}) {
  return (
    <Link
      href={`/routines/${outcome.routine.id}/outcomes/${outcome.id}`}
      key={outcome.id}
      className="my-2 flex flex-col rounded-lg">
      <div className="flex items-center gap-2 rounded-t-lg bg-red-500 p-2 text-white">
        <HiCalendarDays />
        {outcomeDate.toISOString().substring(0, 10)}
      </div>
      <div className="flex flex-col rounded-b bg-gray-400">
        {outcome.routine.summary}
        <span className="text-sm">{outcome.routine.details}</span>
        <div className="mt-8 flex justify-around">
          {outcome.status === "COMPLETE" && (
            <button
              type="button"
              disabled
              className="h-full w-full rounded-bl bg-green-700 p-4">
              Completed
            </button>
          )}

          {outcome.status === "SKIPPED" && (
            <button
              type="button"
              disabled
              className="h-full w-full rounded-br bg-red-700 p-4">
              Skipped
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
