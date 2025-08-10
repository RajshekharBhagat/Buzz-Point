"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostSkeleton() {
  return (
    <div className="bg-white px-4 py-5 flex flex-col space-y-5 rounded-lg shadow-md mt-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-0.5 text-xs md:text-sm">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" /> {/* Hive name */}
          <Skeleton className="h-4 w-4 rounded-full" /> {/* Dot */}
          <Skeleton className="h-4 w-24" /> {/* Author */}
          <Skeleton className="h-4 w-20" /> {/* Time */}
        </div>
        <Skeleton className="h-4 w-6" /> {/* Options */}
      </div>

      {/* Title */}
      <Skeleton className="h-5 w-3/4" />

      {/* Content preview */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-[200px] w-5/6 mx-auto" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" /> {/* Comments */}
        <Skeleton className="h-8 w-16" /> {/* Vote buttons */}
      </div>
    </div>
  );
}