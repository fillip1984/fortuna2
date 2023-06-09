import { useForm, type SubmitHandler } from "react-hook-form";
import { GiBiceps } from "react-icons/gi";
import { HiArrowLeft, HiPlus } from "react-icons/hi2";
import { IoCalendarClearSharp, IoScaleSharp } from "react-icons/io5";

import { type WeighIn } from "@prisma/client";
import { startOfDay } from "date-fns";
import { api } from "~/utils/api";
import { type NewItemDrawerProps } from "../nav/BottomNav";
import Goal from "./Goal";

export default function NewWeighIn({
  setDrawerForm,
  handleDrawerToggle,
}: NewItemDrawerProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WeighIn>();

  const utils = api.useContext();
  const createWeighIn = api.weighIns.create.useMutation({
    onSuccess: async () => {
      await utils.timeline.invalidate();
      handleDrawerToggle();
    },
  });

  const onSubmit: SubmitHandler<WeighIn> = (formData) => {
    createWeighIn.mutate({
      date: startOfDay(formData.date),
      weight: Number(formData.weight.toString()),
      bodyFatPercentage: formData.bodyFatPercentage
        ? Number(formData.bodyFatPercentage?.toString())
        : undefined,
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
            <IoCalendarClearSharp className="form-input-icon" />
            <input
              type="date"
              className="form-icon-prefix"
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
            <IoScaleSharp className="form-input-icon" />
            <input
              type="number"
              inputMode="decimal"
              placeholder="192.2"
              className="form-icon-prefix"
              {...register("weight", {
                required: "Field is required",
                valueAsNumber: true,
              })}
            />
          </label>
          {errors.weight && (
            <span className="text-red-300">{errors.weight.message}</span>
          )}
        </div>

        <div>
          <label className="relative block text-gray-400 focus-within:text-gray-600">
            <GiBiceps className="form-input-icon" />
            <input
              type="number"
              inputMode="decimal"
              placeholder="24.2"
              className="form-icon-prefix"
              {...register("bodyFatPercentage", {
                setValueAs: (v: string) => (v === "" ? undefined : parseInt(v)),
              })}
            />
          </label>
          <span className="font-mono text-xs">Body Fat % (optional)</span>
          {errors.bodyFatPercentage && (
            <span className="block text-red-300">
              {errors.bodyFatPercentage.message}
            </span>
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

      <Goal />
    </div>
  );
}
