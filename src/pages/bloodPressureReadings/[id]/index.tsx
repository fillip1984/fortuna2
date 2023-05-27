import Link from "next/link";
import { useRouter } from "next/router";
import { BsHeartPulseFill } from "react-icons/bs";
import { GiHearts, GiNestedHearts } from "react-icons/gi";
import { HiArrowLeft, HiOutlineTrash, HiPlus } from "react-icons/hi2";
import { IoCalendarClearSharp } from "react-icons/io5";
import { api } from "~/utils/api";

export default function BloodPressureReadingPage() {
  const router = useRouter();
  const { id } = router.query;
  const utils = api.useContext();

  const { data: bloodPressureReading } =
    api.bloodPressureReadings.readOne.useQuery({ id: id as string });

  const deleteBloodPressureReading =
    api.bloodPressureReadings.delete.useMutation({
      onSuccess: async () => {
        await utils.bloodPressureReadings.invalidate();
        void router.push("/");
      },
    });

  const handleDelete = () => {
    deleteBloodPressureReading.mutate({ id: id as string });
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <label className="relative block text-gray-400 focus-within:text-gray-600">
            <IoCalendarClearSharp className="pointer-events-none absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 transform" />
            <input
              type="date"
              className="form-input block w-full appearance-none rounded border border-gray-900 bg-white px-4 py-3 pl-14 text-black placeholder-gray-400 focus:outline-none"
              defaultValue={bloodPressureReading?.date
                .toISOString()
                .substring(0, 10)}
              readOnly
            />
          </label>
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
              defaultValue={bloodPressureReading?.systolic}
              readOnly
            />
          </label>
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
              defaultValue={bloodPressureReading?.diastolic}
              readOnly
            />
          </label>
        </div>

        <div>
          <label className="relative block text-gray-400 focus-within:text-gray-600">
            <BsHeartPulseFill className="pointer-events-none absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 transform" />
            <input
              type="number"
              inputMode="numeric"
              placeholder="70 Pulse (BPM)"
              className="form-input block w-full appearance-none rounded border border-gray-900 bg-white px-4 py-3 pl-14 text-black placeholder-gray-400 focus:outline-none"
              defaultValue={bloodPressureReading?.pulse ?? undefined}
              readOnly
            />
          </label>
          <span className="font-mono text-xs">Pulse (optional)</span>
        </div>
      </div>
      <div className="fixed bottom-16 left-0 right-0 flex justify-between p-4">
        <Link
          href="/"
          className="flex items-center gap-1 rounded border-2 border-black px-4 py-2 text-xl">
          <HiArrowLeft />
          Back
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-1 rounded border-2 border-red-600 px-4 py-2 text-2xl text-red-600">
          Delete
          <HiOutlineTrash />
        </button>
        {/* <button
          type="submit"
          className="flex items-center gap-1 rounded bg-red-600 px-4 py-2 text-2xl text-white"
        >
          Save
          <HiPlus />
        </button> */}
      </div>
    </>
  );
}
