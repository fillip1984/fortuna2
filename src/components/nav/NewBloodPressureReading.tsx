// import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { HiArrowLeft, HiPlus } from "react-icons/hi2";
import { type DrawerFormOptions } from "./BottomNav";
// import { eventKeys } from "../../services/EventService";
// import { createRoutine } from "../../services/RoutineService";
// import { Routine } from "../../services/Types";
// import { DrawerFormOptions } from "./Nav";

interface NewRoutineProps {
  setDrawerForm: React.Dispatch<React.SetStateAction<DrawerFormOptions>>;
  handleDrawerToggle: () => void;
}

/** renders new routine on drawer */
export default function NewBloodPressureReading({
  setDrawerForm,
  handleDrawerToggle,
}: NewRoutineProps) {
  // const queryClient = useQueryClient();
  // const { mutate: createRoutineMutator } = useMutation({
  //   mutationFn: createRoutine,
  //   onSuccess: () => {
  //     // clear query caches
  //     queryClient.invalidateQueries(eventKeys.lists());
  //     handleDrawerToggle();
  //   },
  // });

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   control,
  //   getValues,
  // } = useForm<Routine>({
  //   defaultValues: {
  //     summary: "",
  //     details: "",
  //     occurrenceType: undefined,
  //     daysOfWeek: [
  //       { label: "Sunday", abbreviatedLabel: "Sun", selected: false },
  //       { label: "Monday", abbreviatedLabel: "Mon", selected: false },
  //       { label: "Tuesday", abbreviatedLabel: "Tue", selected: false },
  //       { label: "Wednesday", abbreviatedLabel: "Wed", selected: false },
  //       { label: "Thursday", abbreviatedLabel: "Thurs", selected: false },
  //       { label: "Friday", abbreviatedLabel: "Fri", selected: false },
  //       { label: "Saturday", abbreviatedLabel: "Sat", selected: false },
  //     ],
  //   },
  // });

  // const eventType = useWatch({ control, name: "occurrenceType" });

  // const onSubmit: SubmitHandler<Routine> = (formData) => {
  //   // clean up artifacts, if a user first clicks one event type and made some selections those selections remain
  //   switch (formData.occurrenceType) {
  //     case "DAY_OF_WEEK":
  //       formData.dayOfMonth = undefined;
  //       break;
  //     case "DAY_OF_MONTH":
  //       formData.daysOfWeek?.forEach((day) => (day.selected = false));
  //       break;
  //     case "SPECIFIC_DAY":
  //       formData.daysOfWeek?.forEach((day) => (day.selected = false));
  //       formData.dayOfMonth = undefined;
  //       break;
  //   }

  //   // remove abbreviatedLabel
  //   formData;

  //   createRoutineMutator(formData);
  // };

  return (
    <div id="new-routine" className="px-4">
      <div className="flex justify-between">
        <button
          className="flex items-center gap-1 rounded border-2 border-black px-4 py-2 text-xl"
          onClick={() => setDrawerForm("Selector")}
        >
          <HiArrowLeft />
          Back
        </button>
        <button
          type="submit"
          form="new-routine-form"
          className="flex items-center gap-1 rounded bg-black px-4 py-2 text-2xl text-white"
        >
          Save
          <HiPlus />
        </button>
      </div>
    </div>
  );
}
