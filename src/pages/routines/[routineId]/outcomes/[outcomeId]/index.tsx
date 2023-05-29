/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Link from "next/link";
import { useRouter } from "next/router";
import { HiArrowLeft, HiOutlineTrash } from "react-icons/hi2";
import { api } from "~/utils/api";

export default function RoutineOutcomePage() {
  const router = useRouter();
  const { outcomeId } = router.query;
  const utils = api.useContext();

  const { data: outcome } = api.routineOutcomes.readOne.useQuery({
    id: outcomeId as string,
  });

  const deleteRoutine = api.routineOutcomes.delete.useMutation({
    onSuccess: async () => {
      await utils.routineOutcomes.invalidate();
      void router.push("/");
    },
  });

  const handleDelete = () => {
    deleteRoutine.mutate({ id: outcomeId as string });
  };

  return (
    <>
      <h3>Routine Outcome</h3>
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="text-2xl">Summary</label>
          <input
            type="text"
            defaultValue={outcome?.routine.summary as string}
            readOnly
          />
        </div>
        <div className="flex flex-col">
          <label className="text-2xl">Details</label>
          <textarea
            defaultValue={outcome?.routine.details as string}
            readOnly
          />
        </div>
        Status: {outcome?.status}
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
