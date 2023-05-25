import Link from "next/link";
import { useRouter } from "next/router";
import { HiArrowLeft, HiOutlineTrash, HiPlus } from "react-icons/hi2";
import { api } from "~/utils/api";

export default function BloodPressureReadingPage() {
  const router = useRouter();
  const { id } = router.query;
  const utils = api.useContext();

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
    <div>
      page for bpr {id}
      <div className="fixed bottom-16 left-0 right-0 flex justify-between p-4">
        <Link
          href="/"
          className="flex items-center gap-1 rounded border-2 border-black px-4 py-2 text-xl"
        >
          <HiArrowLeft />
          Back
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-1 rounded border-2 border-red-600 px-4 py-2 text-2xl text-red-600"
        >
          Delete
          <HiOutlineTrash />
        </button>
        <button
          type="submit"
          className="flex items-center gap-1 rounded bg-red-600 px-4 py-2 text-2xl text-white"
        >
          Save
          <HiPlus />
        </button>
      </div>
    </div>
  );
}
