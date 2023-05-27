import {
  type BloodPressureCategory,
  type BloodPressureReading,
} from "@prisma/client";
import Link from "next/link";
import { type MouseEvent } from "react";
import {
  BsCalendarEvent,
  BsFillCircleFill,
  BsHeartPulseFill,
} from "react-icons/bs";
import { GiHearts, GiNestedHearts } from "react-icons/gi";

export default function BloodPressureReadingCard({
  bloodPressureReading,
}: {
  bloodPressureReading: BloodPressureReading;
}) {
  return (
    <Link
      href={`/bloodPressureReadings/${bloodPressureReading.id}`}
      key={bloodPressureReading.id}
      className="my-2 flex flex-col rounded-lg">
      <div className="flex items-center rounded-t-lg bg-red-500 p-2 text-white">
        <GiHearts />
        <div className="flex flex-1 items-center justify-center gap-2">
          <BsCalendarEvent />
          {bloodPressureReading.date.toISOString().substring(0, 10)}
        </div>
      </div>
      <div className="flex justify-between bg-gray-200 p-4 text-black">
        <span className="flex flex-col items-center text-3xl">
          <span className="text-xs uppercase text-gray-500">
            Systolic{" "}
            <span className="text-xs uppercase text-gray-400">(change)</span>
          </span>
          <span className="flex items-center gap-1">
            {bloodPressureReading.systolic}
            <span className="text-xl text-gray-400">
              ({bloodPressureReading.systolicChange})
            </span>
          </span>
          <span className="flex items-center gap-2 text-xs text-gray-500">
            <GiHearts /> mmHg
          </span>
        </span>
        <span className="flex flex-col items-center text-3xl">
          <span className="text-xs uppercase text-gray-500">
            Diastolic{" "}
            <span className="text-xs uppercase text-gray-400">(change)</span>
          </span>
          <span className="flex items-center gap-1">
            {bloodPressureReading.diastolic}
            <span className="text-xl text-gray-400">
              ({bloodPressureReading.diastolicChange})
            </span>
          </span>
          <span className="flex items-center gap-2 text-xs text-gray-500">
            <GiNestedHearts /> mmHg
          </span>
        </span>
        <span className="flex flex-col items-center text-3xl">
          <span className="text-xs uppercase text-gray-500">
            Pulse{" "}
            <span className="text-xs uppercase text-gray-400">(change)</span>
          </span>
          <span className="flex items-center gap-1">
            {bloodPressureReading.pulse ?? "N/A"}
            <span className="text-xl text-gray-400">
              ({bloodPressureReading.pulseChange ?? "N/A"})
            </span>
          </span>

          <span className="flex items-center gap-2 text-xs text-gray-500">
            <BsHeartPulseFill /> BPM
          </span>
        </span>
      </div>
      <div className="flex items-center justify-center gap-2 bg-gray-200 p-2 text-3xl">
        <BloodPressureCategoryButton
          bloodPressureCategory={bloodPressureReading.category}
        />
      </div>
    </Link>
  );
}

const BloodPressureCategoryButton = ({
  bloodPressureCategory,
}: {
  bloodPressureCategory: BloodPressureCategory;
}) => {
  const openNewWindow = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(
      "https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings",
      "_blank"
    );
  };

  const colorSelector = () => {
    switch (bloodPressureCategory) {
      case "LOW":
        return "text-sky-600";
      case "NORMAL":
        return "text-green-600";
      case "ELEVATED":
        return "text-yellow-300";
      case "HYPERTENSION_STAGE_1":
        return "text-orange-400";
      case "HYPERTENSION_STAGE_2":
        return "text-orange-600";
      case "HYPERTENSION_CRISIS":
        return "text-red-600";
    }
  };

  const translateCategory = () => {
    switch (bloodPressureCategory) {
      case "LOW":
        return "Low";
      case "NORMAL":
        return "Normal";
      case "ELEVATED":
        return "Elevated";
      case "HYPERTENSION_STAGE_1":
        return "Hypertension Stage 1";
      case "HYPERTENSION_STAGE_2":
        return "Hypertension Stage 2";
      case "HYPERTENSION_CRISIS":
        return "Hypertension Crisis";
    }
  };

  return (
    <button
      onClick={openNewWindow}
      className="flex items-center gap-2 rounded-lg border-2 border-gray-200 p-2 hover:border-gray-300">
      <BsFillCircleFill className={`${colorSelector()} text-sm`} />
      <span className={`${colorSelector()} text-xs`}>
        {translateCategory()}
      </span>
    </button>
  );
};
