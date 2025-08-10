"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserPageSideBarSkeleton() {
  return (
    <div className="flex flex-col mt-7 rounded-lg shadow-md shadow-black/20 bg-white p-4">
      {/* Avatar + name */}
      <div className="flex flex-row w-full lg:flex-col items-center gap-3">
        <Skeleton className="size-12 lg:size-20 rounded-full" />
        <span className="flex flex-col gap-1">
          <Skeleton className="h-4 w-24" /> {/* Name */}
          <Skeleton className="h-3 w-20" /> {/* Username */}
        </span>
      </div>

      {/* Stats box */}
      <div className="w-full p-2 bg-green-100 mt-4 rounded-lg space-y-3">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="flex items-center justify-between">
            <Skeleton className="h-3 w-20" /> {/* Label */}
            <Skeleton className="h-3 w-10" /> {/* Value */}
          </span>
        ))}
      </div>
    </div>
  );
}
