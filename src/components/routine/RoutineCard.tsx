import { type Routine } from "@prisma/client";
import Link from "next/link";

import { HiCalendarDays } from "react-icons/hi2";
export default function RoutineCard({ routine }: { routine: Routine }) {
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
          <button className="h-full w-full rounded-bl bg-green-700 p-4">
            Complete
          </button>
          <button className="h-full w-full rounded-br bg-red-700 p-4">
            Skip
          </button>
        </div>
      </div>
    </Link>
  );
}
