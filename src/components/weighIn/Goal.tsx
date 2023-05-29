import { type Goal } from "@prisma/client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { IoTrophySharp } from "react-icons/io5";
import { api } from "~/utils/api";

export default function Goal() {
  const { data: goal } = api.goals.getGoal.useQuery();
  const createOrUpdateWeightGoal = api.goals.createOrUpdateGoal.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Goal>();

  const goalOnSubmit: SubmitHandler<Goal> = (goalFormData) => {
    createOrUpdateWeightGoal.mutate({
      weight: Number(goalFormData.weight.toString()),
    });
  };

  return (
    <>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(goalOnSubmit)}
        className="my-12 rounded border-2 border-slate-400 px-4 py-2">
        <input type="hidden" {...register("id")} defaultValue={goal?.id} />
        <h4>Goal</h4>
        <p className="text-sm">Set a weight goal</p>
        <div className="">
          <label className="relative block text-gray-400 focus-within:text-gray-600">
            <IoTrophySharp className="form-input-icon" />
            <input
              type="number"
              inputMode="decimal"
              placeholder="175"
              step={0.01}
              className="form-icon-prefix"
              {...register("weight")}
              defaultValue={goal?.weight?.toString()}
            />
          </label>
          {errors.weight && (
            <span className="block text-red-300">{errors.weight.message}</span>
          )}
          <button type="submit" className="mt-2 bg-red-500 px-2 py-1">
            Update
          </button>
        </div>
      </form>
    </>
  );
}
