import { useGetTopHives } from "@/hooks/use-hive";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import TopHivesSkeleton from "./TopHiveSkeleton";

const TopHives = () => {
  const { data: topHives, isLoading } = useGetTopHives();
  if (isLoading) {
    return <TopHivesSkeleton />;
  }
  return (
    <div className="flex flex-col rounded-lg shadow-xl overflow-hidden shadow-black/20">
      <h1 className="bg-emerald-200 py-3 text-center font-semibold text-green-800 ">
        Top Hives
      </h1>
      <ul className="w-full flex flex-col gap-2 p-2">
        {topHives?.map((hive) => (
          <Link
            key={hive._id.toString()}
            href={`/h/${hive.name}`}
            className="w-full flex flex-col items-center justify-between px-4 py-1 rounded-xl bg-green-100 hover:bg-green-200 overflow-hidden group transition-all"
          >
            <span className="flex w-full items-center justify-between gap-2">
              <h1 className="text-green-800 font-semibold text-xs md:text-sm">
                {hive.name}
              </h1>
              <span className="flex items-center gap-2">
                <p className="text-green-700 text-xs shrink-0">
                  Followers: {hive.subscriberCount}
                </p>
                <ChevronRightIcon className="text-green-500 max-w-0 group-hover:max-w-10 translate-x-[100px]  group-hover:translate-x-0 transition-all duration-300" />
              </span>
            </span>
            <p className="text-gray-500 opacity-0 group-hover:opacity-100 text-xs max-h-0 group-hover:max-h-32 w-full transition-all duration-300">
              {hive.description}
            </p>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default TopHives;
