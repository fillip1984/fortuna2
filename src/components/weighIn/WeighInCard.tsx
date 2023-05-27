import { type WeighIn } from "@prisma/client";
import Link from "next/link";
import { BsCalendarEvent } from "react-icons/bs";
import { GiStairsGoal } from "react-icons/gi";
import { IoScaleOutline } from "react-icons/io5";
import { MdTrendingDown, MdTrendingFlat, MdTrendingUp } from "react-icons/md";

const determineWeighInTrend = (number: number) => {
  if (number === 0) {
    return <MdTrendingFlat />;
  } else if (number > 0) {
    return <MdTrendingUp />;
  } else if (number < 0) {
    return <MdTrendingDown />;
  } else {
    throw Error("Unable to determine trend for number: " + number.toString());
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
      className="my-2 flex flex-col rounded-lg">
      <div className="flex items-center gap-2 rounded-t-lg bg-red-500 p-2 text-white">
        <IoScaleOutline />
        <div className="flex flex-1 items-center justify-center gap-2">
          <BsCalendarEvent />
          {weighIn.date.toISOString().substring(0, 10)}
        </div>
      </div>
      <div className="flex justify-between bg-gray-200 p-4 text-black">
        <span className="flex flex-col items-center text-3xl">
          <span className="text-xs uppercase text-gray-500">Weight</span>
          {weighIn.weight.toNumber()}
          <span className="flex items-center gap-2 text-xs text-gray-500">
            <IoScaleOutline /> lbs
          </span>
        </span>
        <span className="flex flex-col items-center text-xl">
          <span className="text-xs uppercase text-gray-500">To Date</span>
          {weighIn.weightProgress.toNumber()}
          {determineWeighInTrend(weighIn.weightProgress.toNumber())}
        </span>
        <span className="flex flex-col items-center text-xl">
          <span className="text-xs uppercase text-gray-500">Total</span>
          {weighIn.weightTotalChange.toNumber()}
          {determineWeighInTrend(weighIn.weightTotalChange.toNumber())}
        </span>
        <span className="flex flex-col items-center text-3xl">
          <span className="text-xs uppercase text-gray-500">To Goal</span>
          {weighIn.weightToGoal.toNumber()}
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
