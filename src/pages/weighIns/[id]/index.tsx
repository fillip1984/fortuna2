import Link from "next/link";
import { useRouter } from "next/router";
import { GiBiceps } from "react-icons/gi";
import { HiArrowLeft, HiOutlineTrash, HiPlus } from "react-icons/hi2";
import { IoCalendarClearSharp, IoScaleSharp } from "react-icons/io5";
import { api } from "~/utils/api";

export default function WeighInPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data: weighIn } = api.weighIns.readOne.useQuery({ id: id as string });

  const utils = api.useContext();
  const deleteWeighIn = api.weighIns.delete.useMutation({
    onSuccess: async () => {
      await utils.weighIns.invalidate();
      void router.push("/");
    },
  });

  const handleDelete = () => {
    deleteWeighIn.mutate({ id: id as string });
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
              defaultValue={weighIn?.date.toISOString().substring(0, 10)}
              readOnly
            />
          </label>
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
              defaultValue={weighIn?.weight.toNumber()}
              readOnly
            />
          </label>
        </div>

        <div>
          <label className="relative block text-gray-400 focus-within:text-gray-600">
            <GiBiceps className="pointer-events-none absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 transform" />
            <input
              type="number"
              inputMode="decimal"
              placeholder="24.2"
              className="form-input block w-full appearance-none rounded border border-gray-900 bg-white px-4 py-3 pl-14 text-black placeholder-gray-400 focus:outline-none"
              defaultValue={weighIn?.bodyFatPercentage?.toNumber()}
              readOnly
            />
          </label>
          <span className="font-mono text-xs">Body Fat % (optional)</span>
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
