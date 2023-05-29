import Link from "next/link";
import { useRouter } from "next/router";
import { HiArrowLeft, HiOutlineTrash } from "react-icons/hi2";
import { api } from "~/utils/api";

export default function RoutinePage() {
  const router = useRouter();
  const { routineId } = router.query;
  const utils = api.useContext();

  const { data: routine } = api.routines.readOne.useQuery({
    id: routineId as string,
  });

  const deleteRoutine = api.routines.delete.useMutation({
    onSuccess: async () => {
      await utils.routines.invalidate();
      void router.push("/");
    },
  });

  const handleDelete = () => {
    deleteRoutine.mutate({ id: routineId as string });
  };

  return (
    <>
      <h2>Routine</h2>
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="text-2xl">Summary</label>
          <input type="text" defaultValue={routine?.summary} readOnly />
        </div>

        <div className="flex flex-col">
          <label className="text-2xl">Details</label>
          <textarea defaultValue={routine?.details} readOnly />
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
      </div>
    </>
  );
}
