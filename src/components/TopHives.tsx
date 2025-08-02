import { useGetTopHives } from "@/hooks/use-hive";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

const TopHives = () => {
  const { data: topHives, isLoading } = useGetTopHives();
  return (
    <>
      {!isLoading && (
        <div className="flex flex-col rounded-lg shadow-xl overflow-hidden shadow-black/20">
          <h1 className="bg-emerald-200 py-3 text-center font-semibold text-green-800 ">
            Top Hives
          </h1>
          <ul className="w-full flex flex-col gap-2 p-2">
            {topHives?.map((hive) => (
              <Link
                key={hive._id.toString()}
                href={`/h/${hive.name}`}
                className="w-full flex items-center justify-between px-4 py-1 rounded-xl bg-emerald-100 overflow-hidden group transition-all"
              >
                <span className="flex flex-col gap-2">
                  <h1 className="text-green-800 font-semibold">{hive.name}</h1>
                  <p className="text-gray-700 text-sm max-h-0 group-hover:max-h-[40px] transition-all duration-500">
                    {hive.description}
                  </p>
                </span>
                <span className="flex items-center gap-2">
                  <p className="text-green-700 text-sm">
                    Followers: {hive.subscriberCount}
                  </p>
                  <ChevronRightIcon className="text-green-500 translate-x-[100px] group-hover:translate-x-0 transition-all duration-300" />
                </span>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default TopHives;
