// import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type BloodPressureReading } from "@prisma/client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { BsHeartPulseFill } from "react-icons/bs";
import { GiHearts, GiNestedHearts } from "react-icons/gi";
import { HiArrowLeft, HiPlus } from "react-icons/hi2";
import { IoCalendarClearSharp } from "react-icons/io5";
import { api } from "~/utils/api";
import { type DrawerFormOptions } from "../nav/BottomNav";

interface NewRoutineProps {
  setDrawerForm: React.Dispatch<React.SetStateAction<DrawerFormOptions>>;
  handleDrawerToggle: () => void;
}

/** renders new routine on drawer */
export default function NewBloodPressureReading({
  setDrawerForm,
  handleDrawerToggle,
}: NewRoutineProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BloodPressureReading>();

  const utils = api.useContext();
  const createBloodPressureReading =
    api.bloodPressureReadings.create.useMutation({
      onSuccess: async () => {
        await utils.timeline.invalidate();
        handleDrawerToggle();
      },
    });

  const onSubmit: SubmitHandler<BloodPressureReading> = (formData) => {
    createBloodPressureReading.mutate({
      date: formData.date,
      systolic: formData.systolic,
      diastolic: formData.diastolic,
      pulse: formData.pulse ? formData.pulse : undefined,
    });
  };

  return (
    <div className="m-4 flex flex-col">
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate>
        <div>
          <label className="relative block text-gray-400 focus-within:text-gray-600">
            <IoCalendarClearSharp className="pointer-events-none absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 transform" />
            <input
              type="date"
              className="form-input block w-full appearance-none rounded border border-gray-900 bg-white px-4 py-3 pl-14 text-black placeholder-gray-400 focus:outline-none"
              {...register("date", {
                required: "Field is required",
                valueAsDate: true,
              })}
              defaultValue={new Date().toISOString().substring(0, 10)}
            />
          </label>
          {errors.date && (
            <span className="text-red-300">{errors.date.message}</span>
          )}
        </div>

        {/*  TODO: couldn't figure out how to require decimal only, you can type in letters and I can't stop it! */}
        <div>
          <label className="relative block text-gray-400 focus-within:text-gray-600">
            <GiHearts className="pointer-events-none absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 transform" />
            <input
              type="number"
              inputMode="numeric"
              placeholder="120 Systolic/upper number (mmHg)"
              className="form-input block w-full appearance-none rounded border border-gray-900 bg-white px-4 py-3 pl-14 text-black placeholder-gray-400 focus:outline-none"
              {...register("systolic", {
                required: "Field is required",
                valueAsNumber: true,
              })}
            />
          </label>
          {errors.systolic && (
            <span className="text-red-300">{errors.systolic.message}</span>
          )}
        </div>

        {/*  TODO: couldn't figure out how to require decimal only, you can type in letters and I can't stop it! */}
        <div>
          <label className="relative block text-gray-400 focus-within:text-gray-600">
            <GiNestedHearts className="pointer-events-none absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 transform" />
            <input
              type="number"
              inputMode="numeric"
              placeholder="80 Diastolic/lower number (mmHg)"
              className="form-input block w-full appearance-none rounded border border-gray-900 bg-white px-4 py-3 pl-14 text-black placeholder-gray-400 focus:outline-none"
              {...register("diastolic", {
                required: "Field is required",
                valueAsNumber: true,
              })}
            />
          </label>
          {errors.diastolic && (
            <span className="text-red-300">{errors.diastolic.message}</span>
          )}
        </div>

        <div>
          <label className="relative block text-gray-400 focus-within:text-gray-600">
            <BsHeartPulseFill className="pointer-events-none absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 transform" />
            <input
              type="number"
              inputMode="numeric"
              placeholder="70 Pulse (BPM)"
              className="form-input block w-full appearance-none rounded border border-gray-900 bg-white px-4 py-3 pl-14 text-black placeholder-gray-400 focus:outline-none"
              {...register("pulse", { valueAsNumber: true })}
            />
          </label>
          <span className="font-mono text-xs">Pulse (optional)</span>
          {errors.pulse && (
            <span className="block text-red-300">{errors.pulse.message}</span>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 flex justify-between p-4">
          <button
            className="flex items-center gap-1 rounded border-2 border-black px-4 py-2 text-xl"
            onClick={() => setDrawerForm("Selector")}>
            <HiArrowLeft />
            Back
          </button>
          <button
            type="submit"
            className="flex items-center gap-1 rounded bg-red-600 px-4 py-2 text-2xl text-white">
            Save
            <HiPlus />
          </button>
        </div>
      </form>
    </div>
  );
}
