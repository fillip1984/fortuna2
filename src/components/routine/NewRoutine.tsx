import { type Routine } from "@prisma/client";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { HiArrowLeft, HiPlus } from "react-icons/hi2";
import { api } from "~/utils/api";
import { type DrawerFormOptions } from "../nav/BottomNav";

interface NewRoutineProps {
  setDrawerForm: React.Dispatch<React.SetStateAction<DrawerFormOptions>>;
  handleDrawerToggle: () => void;
}

/** renders new routine on drawer */
const NewRoutine = ({ setDrawerForm, handleDrawerToggle }: NewRoutineProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm<Routine>({
    defaultValues: {
      summary: "",
      details: "",
      occurrenceType: undefined,
      // daysOfWeek: [
      //   { label: "Sunday", abbreviatedLabel: "Sun", selected: false },
      //   { label: "Monday", abbreviatedLabel: "Mon", selected: false },
      //   { label: "Tuesday", abbreviatedLabel: "Tue", selected: false },
      //   { label: "Wednesday", abbreviatedLabel: "Wed", selected: false },
      //   { label: "Thursday", abbreviatedLabel: "Thurs", selected: false },
      //   { label: "Friday", abbreviatedLabel: "Fri", selected: false },
      //   { label: "Saturday", abbreviatedLabel: "Sat", selected: false },
      // ],
    },
  });

  const eventType = useWatch({ control, name: "occurrenceType" });

  const utils = api.useContext();
  const createRoutine = api.routines.create.useMutation({
    onSuccess: async () => {
      await utils.routines.invalidate();
      handleDrawerToggle();
    },
  });

  const onSubmit: SubmitHandler<Routine> = (formData) => {
    // clean up artifacts, if a user first clicks one event type and made some selections those selections remain
    switch (formData.occurrenceType) {
      case "DAY_OF_WEEK":
        formData.dayOfMonth = null;
        break;
      case "DAY_OF_MONTH":
        // formData.daysOfWeek?.forEach((day) => (day.selected = false));
        break;
      case "SPECIFIC_DAY":
        // formData.daysOfWeek?.forEach((day) => (day.selected = false));
        formData.dayOfMonth = null;
        break;
    }

    // remove abbreviatedLabel
    formData;

    createRoutine.mutate({
      summary: formData.summary,
      details: formData.details,
      occurrenceType: formData.occurrenceType,
      startDateTime: formData.startDateTime,
      endDateTime: formData.endDateTime ?? undefined,
    });
  };

  return (
    <div id="new-routine" className="px-4">
      <div className="flex justify-between">
        <button
          className="flex items-center gap-1 rounded border-2 border-black px-4 py-2 text-xl"
          onClick={() => setDrawerForm("Selector")}>
          <HiArrowLeft />
          Back
        </button>
        <button
          type="submit"
          form="new-routine-form"
          className="flex items-center gap-1 rounded bg-black px-4 py-2 text-2xl text-white">
          Save
          <HiPlus />
        </button>
      </div>

      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate>
        <div className="flex flex-col">
          <label className="text-2xl">Summary</label>
          <input
            type="text"
            {...register("summary", {
              required: "Field is required",
              minLength: {
                value: 2,
                message: "Field must be between 2 and 50 characrers",
              },
              maxLength: {
                value: 50,
                message: "Field must be between 2 and 50 characrers",
              },
            })}
            autoFocus
          />
          {errors.summary && (
            <span className="text-red-400">{errors.summary.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-2xl">Details</label>
          <textarea
            {...register("details", {
              required: "Field is required",
              minLength: {
                value: 5,
                message: "Field must be between 5 and 500 characrers",
              },
              maxLength: {
                value: 500,
                message: "Field must be between 5 and 500 characrers",
              },
            })}
          />
          {errors.details && (
            <span className="text-red-400">{errors.details.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-2xl">Occurrence type</label>
          <select
            {...register("occurrenceType", { required: "Field is required" })}>
            <option value="">Make selection</option>
            <option value="DAY_OF_WEEK">Occurs weekly by day(s)</option>
            <option value="DAY_OF_MONTH">Occurs monthly by day</option>
            <option value="SPECIFIC_DAY">
              Once, on specific day/date range
            </option>
          </select>
          {errors.occurrenceType && (
            <span className="text-red-400">
              {errors.occurrenceType.message}
            </span>
          )}
        </div>

        {/* TODO: minor bug occurs sometimes where the validation isn't retriggered on selection. It happens some of the time which leads me to believe it is a bug in react-hook-from 
        To recreate the bug submit the form and then select one of the items and see that validation isn't retriggered until the form is submitted again. But, if you toggle individual items after that the validation occurs as it should*/}
        {/* {eventType === "DAY_OF_WEEK" && (
          <div className="flex flex-col items-center">
            <div className="flex gap-2">
              {getValues("daysOfWeek")?.map((day, index) => (
                <div key={day.label}>
                  <input
                    type="checkbox"
                    className="peer hidden"
                    id={`daysOfWeek.${index}.selected`}
                    {...register(`daysOfWeek.${index}.selected`, {
                      validate: {
                        isAtLeastOneDaySelected: () => {
                          return (
                            eventType === "DAY_OF_WEEK" &&
                            getValues("daysOfWeek")?.some((day) => day.selected)
                          );
                        },
                      },
                    })}
                  />
                  <label
                    htmlFor={`daysOfWeek.${index}.selected`}
                    className="flex h-12 w-12 cursor-pointer select-none items-center justify-center rounded-full bg-white text-black peer-checked:bg-black peer-checked:text-white">
                    {day.abbreviatedLabel}
                  </label>
                </div>
                // this didn't work because react-hook-form focuses on the first button when there's a validation error. This caused the first item to be selected whenever you selected another item. You also had to rely on a useEffect/trigger combo to trigger revalidation on changes
                // <button
                //   key={day.label}
                //   type="button"
                //   {...register(`daysOfWeek.${index}.selected`, {
                //     validate: validateDayOfWeekSelection,
                //   })}
                //   onClick={() => {
                //     updateDaysOfWeek(index, {
                //       ...day,
                //       selected: !day.selected,
                //     });
                //   }}
                //   className={`flex h-12 w-12 flex-col items-center justify-center rounded-full p-2 transition-colors duration-200 ${
                //     day.selected ? "bg-black text-white" : "bg-white"
                //   }`}>
                //   <span>{day.label}</span>
                // </button>
              ))}
            </div>
            {errors.daysOfWeek && (
              <span className="text-red-400">
                Please select at least one day
              </span>
            )}
          </div>
        )} */}

        {eventType == "DAY_OF_MONTH" && (
          <div className="flex flex-col">
            <select
              {...register("dayOfMonth", {
                required: "Field is required",
              })}>
              <option value="">Make a selection</option>
              <option value="FIRST">First day of month</option>
              <option value="MIDDLE">Middle of month</option>
              <option value="LAST">Last day of month</option>
            </select>
            {errors.dayOfMonth && (
              <span className="text-red-400">Field is required</span>
            )}
          </div>
        )}

        <div className="flex justify-center gap-4">
          <div className="flex w-1/2 flex-col">
            <label className="text-2xl">Starting</label>
            <input
              type="date"
              {...register("startDateTime", {
                required: "Field is required",
                valueAsDate: true,
              })}
            />
            {errors.startDateTime && (
              <span className="text-red-400">
                {errors.startDateTime.message}
              </span>
            )}
          </div>

          <div className="flex w-1/2 flex-col">
            <label className="text-2xl">
              Ending <span className="font-thin">(optional)</span>
            </label>
            <input
              type="date"
              {...register("endDateTime", { valueAsDate: true })}
            />
            {errors.endDateTime && (
              <span className="text-red-400">{errors.endDateTime.message}</span>
            )}
          </div>
        </div>

        <div className="flex w-full justify-end">
          <button
            type="submit"
            className="flex items-center gap-1 rounded bg-black px-4 py-2 text-2xl text-white">
            Save
            <HiPlus />
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRoutine;
