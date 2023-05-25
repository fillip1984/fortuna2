import { type WeighIn } from "@prisma/client";
import Link from "next/link";
import { BsCalendarEvent } from "react-icons/bs";
import { GiStairsGoal } from "react-icons/gi";
import { IoScaleOutline } from "react-icons/io5";
import { MdTrendingDown, MdTrendingFlat, MdTrendingUp } from "react-icons/md";

const determineWeighInTrend = (numberAsString: string) => {
  const number = parseInt(numberAsString);

  if (number === 0) {
    return <MdTrendingFlat />;
  } else if (number > 0) {
    return <MdTrendingUp />;
  } else if (number < 0) {
    return <MdTrendingDown />;
  } else {
    throw Error(
      "Unable to determine trend for number as a string: " + numberAsString
    );
  }
};

export default function WeighInCard({
  weighIn,
  goalWeight,
}: {
  weighIn: WeighIn;
  goalWeight: string | undefined;
}) {
  return (
    <Link
      href={`/weighIns/${weighIn.id}`}
      key={weighIn.id}
      className="my-2 flex flex-col rounded-lg border-2"
    >
      <div className="flex items-center justify-center gap-2 bg-gray-100 p-1">
        <BsCalendarEvent />
        {weighIn.date.toISOString().substring(0, 10)}
      </div>
      <div className="flex flex-1 justify-between bg-gray-100 p-4">
        <span className="flex flex-col items-center text-3xl">
          <span className="text-xs uppercase text-gray-500">Weight</span>
          {weighIn.weight.toString()}
          <span className="flex items-center gap-2 text-xs text-gray-500">
            <IoScaleOutline /> lbs
          </span>
        </span>
        <span className="flex flex-col items-center text-xl">
          <span className="text-xs uppercase text-gray-500">To Date</span>
          {weighIn.weightProgress.toString()}
          {determineWeighInTrend(weighIn.weightProgress.toString())}
        </span>
        <span className="flex flex-col items-center text-xl">
          <span className="text-xs uppercase text-gray-500">Total</span>
          {weighIn.weightTotalChange.toString()}
          {determineWeighInTrend(weighIn.weightTotalChange.toString())}
        </span>
        <span className="flex flex-col items-center text-3xl">
          <span className="text-xs uppercase text-gray-500">To Goal</span>
          {weighIn.weightToGoal.toString()}
          <span className="flex items-center gap-2 text-xs text-gray-500">
            <GiStairsGoal />
            {goalWeight} lbs
          </span>
        </span>
      </div>

      {/* TODO: add in additional stats? */}
      {/* <div className="flex justify-around border-t-2 border-t-gray-200 bg-gray-300 p-2">
              <span>
                23% bf <GiMuscleFat />
              </span>
              <span>28.4 BMI</span>
            </div> */}
    </Link>
  );
}
