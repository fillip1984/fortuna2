import { type Routine } from "@prisma/client";
import { type MouseEvent } from "react";
import Link from "next/link";

import { HiCalendarDays } from "react-icons/hi2";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
export default function RoutineCard({
  routine,
  routineDate,
}: {
  routine: Routine;
  routineDate: Date;
}) {
  const router = useRouter();
  const utils = api.useContext();
  const completeRoutine = api.routineOutcomes.create.useMutation({
    onSuccess: async () => {
      await utils.routineOutcomes.invalidate();
      void router.push("/");
    },
  });
  const handleComplete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    completeRoutine.mutate({
      date: routineDate,
      routineId: routine.id,
      routineName: routine.summary,
      status: "COMPLETE",
    });
  };

  const handleSkip = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.preventDefault();
    e.stopPropagation();
    completeRoutine.mutate({
      date: routineDate,
      routineId: routine.id,
      routineName: routine.summary,
      status: "SKIPPED",
    });
  };

  return (
    <Link
      href={`/routines/${routine.id}`}
      key={routine.id}
      className="my-2 flex flex-col rounded-lg">
      <div className="flex items-center gap-2 rounded-t-lg bg-red-500 p-2 text-white">
        <HiCalendarDays />
      </div>
      <div className="flex flex-col rounded-b bg-gray-400">
        {routine.summary}
        <span className="text-sm">{routine.details}</span>
        <div className="mt-8 flex justify-around">
          <button
            type="button"
            onClick={handleComplete}
            className="h-full w-full rounded-bl bg-green-700 p-4">
            Complete
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="h-full w-full rounded-br bg-red-700 p-4">
            Skip
          </button>
        </div>
      </div>
    </Link>
  );
}
