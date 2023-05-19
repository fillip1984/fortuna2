import { useForm, type SubmitHandler } from "react-hook-form";
import { GiBiceps } from "react-icons/gi";
import { HiArrowLeft, HiPlus } from "react-icons/hi2";
import {
  IoCalendarClearSharp,
  IoScaleSharp,
  IoTrophySharp,
} from "react-icons/io5";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/utils/api";
import { type NewItemDrawerProps } from "./BottomNav";

export default function NewWeighIn({
  setDrawerForm,
  handleDrawerToggle,
}: NewItemDrawerProps) {
  const weighInSchema = z.object({
    date: z.date(),
    weight: z.number(),
    bodyFatPercentage: z.number().optional(),
  });
  type WeighInSchemaType = z.infer<typeof weighInSchema>;

  const goalSchema = z.object({
    weight: z.number(),
  });
  type GoalSchemaType = z.infer<typeof goalSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WeighInSchemaType>({
    resolver: zodResolver(weighInSchema),
  });

  const createWeighIn = api.weighIns.create.useMutation({
    onSuccess: () => {
      handleDrawerToggle();
    },
  });

  const onSubmit: SubmitHandler<WeighInSchemaType> = (formData) => {
    createWeighIn.mutate(formData);
  };

  const { data: goal } = api.goals.read.useQuery();

  const {
    register: goalRegister,
    handleSubmit: goalHandleSubmit,
    formState: { errors: goalErrors },
  } = useForm<GoalSchemaType>({
    resolver: zodResolver(goalSchema),
  });

  const createGoal = api.goals.createOrUpdateGoal.useMutation({
    onSuccess: () => {
      console.log("worked");
    },
  });
  const goalOnSubmit: SubmitHandler<GoalSchemaType> = (goalFormData) => {
    createGoal.mutate(goalFormData);
  };

  return (
    <div className="m-4 flex flex-col">
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
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
            <IoScaleSharp className="pointer-events-none absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 transform" />
            <input
              type="number"
              inputMode="decimal"
              placeholder="192.2"
              className="form-input block w-full appearance-none rounded border border-gray-900 bg-white px-4 py-3 pl-14 text-black placeholder-gray-400 focus:outline-none"
              {...register("weight", {
                setValueAs: (v: string) => (v === "" ? undefined : parseInt(v)),
              })}
            />
          </label>
          {errors.weight && (
            <span className="text-red-300">{errors.weight.message}</span>
          )}
        </div>

        <div>
          <label className="relative block text-gray-400 focus-within:text-gray-600">
            <GiBiceps className="pointer-events-none absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 transform" />
            <input
              type="number"
              inputMode="decimal"
              placeholder="24.2"
              className="form-input block w-full appearance-none rounded border border-gray-900 bg-white px-4 py-3 pl-14 text-black placeholder-gray-400 focus:outline-none"
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
            onClick={() => setDrawerForm("Selector")}
          >
            <HiArrowLeft />
            Back
          </button>
          <button
            type="submit"
            className="flex items-center gap-1 rounded bg-red-600 px-4 py-2 text-2xl text-white"
          >
            Save
            <HiPlus />
          </button>
        </div>
      </form>

      {goal && (
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={goalHandleSubmit(goalOnSubmit)}
          className="my-12 rounded border-2 border-slate-400 px-4 py-2"
        >
          <h4>Goal</h4>
          <p className="text-sm">Set a weight goal</p>
          <div className="">
            <label className="relative block text-gray-400 focus-within:text-gray-600">
              <IoTrophySharp className="pointer-events-none absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 transform" />
              <input
                type="number"
                inputMode="decimal"
                placeholder="175"
                step={0.01}
                className="form-input block w-full appearance-none rounded border border-gray-900 bg-white px-4 py-3 pl-14 text-black placeholder-gray-400 focus:outline-none"
                {...goalRegister("weight", { valueAsNumber: true })}
                defaultValue={goal.weight.toString()}
              />
            </label>
            {goalErrors.weight && (
              <span className="block text-red-300">
                {goalErrors.weight.message}
              </span>
            )}
            <button type="submit" className="mt-2 bg-red-500 px-2 py-1">
              Update
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
