import {
  type RoutineOutcome,
  type BloodPressureReading,
  type Routine,
  type WeighIn,
} from "@prisma/client";
import { api } from "~/utils/api";
import BloodPressureReadingCard from "./bloodPressure/BloodPressureReadingCard";
import RoutineCard from "./routine/RoutineCard";
import WeighInCard from "./weighIn/WeighInCard";
import RoutineOutcomeCard from "./routine/RoutineOutcomeCard";

const Timeline = () => {
  const { data: timeline } = api.timeline.get.useQuery();
  const { data: goal } = api.goals.getGoal.useQuery();

  return (
    <>
      <h3 className="my-2 text-center">fortis fortuna adiuvat</h3>
      <div className="flex flex-col">
        {timeline?.map((timelineEvent) => (
          <div
            className="my-4 text-center text-2xl"
            key={timelineEvent.date.getTime()}>
            <div className="sticky top-0 -mx-4 bg-zinc-700 p-4">
              <h3>{timelineEvent.date.toISOString().substring(0, 10)}</h3>
            </div>
            <div className="flex flex-col">
              {timelineEvent.entries.map((entry) => {
                if (entry.type === "WeighIn") {
                  return (
                    <WeighInCard
                      key={(entry.event as WeighIn).id}
                      weighIn={entry.event as WeighIn}
                      goalWeight={goal?.weight.toString()}
                    />
                  );
                } else if (entry.type === "BloodPressureReading") {
                  return (
                    <BloodPressureReadingCard
                      key={(entry.event as BloodPressureReading).id}
                      bloodPressureReading={entry.event as BloodPressureReading}
                    />
                  );
                } else if (entry.type === "Routine") {
                  return (
                    <RoutineCard
                      key={entry.event.id}
                      routine={entry.event as Routine}
                      routineDate={timelineEvent.date}
                    />
                  );
                } else if (entry.type === "RoutineOutcome") {
                  return (
                    <RoutineOutcomeCard
                      key={entry.event.id}
                      outcome={
                        entry.event as RoutineOutcome & {
                          routine: Routine;
                        }
                      }
                      outcomeDate={timelineEvent.date}
                    />
                  );
                } else {
                  throw Error(
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    `Unknown event, cannot render event of: ${entry.type}`
                  );
                }
              })}
            </div>
          </div>
        ))}
        {/* TODO */}
        {/* <div className="flex justify-center">
          <button
            type="button"
            onClick={() => window.scrollTo(0, 0)}
            className="mt-[800px] flex h-24 w-24 items-center justify-center rounded-full bg-slate-400 text-2xl text-white">
            Top
          </button>
        </div> */}
      </div>
    </>
  );
};

export default Timeline;
